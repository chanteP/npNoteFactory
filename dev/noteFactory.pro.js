/*
	by chante @131231
	根据音符note和音高key制作单音音频
	需要riffwave支持
*/

	var list = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
	/*
		functions
	*/
	var worker = function(){
	    var functionBodyRegx, URL, contentType, code, url;
	    functionBodyRegx = /function[^(]*\([^)]*\)\s*\{([\s\S]*)\}/;
	    URL = window.URL || window.webkitURL;
	    contentType = { type: "text/javascript; charset=utf-8" };
	    return function( fn , spec){
	    	var fnStr = fn.toString();
	    	for(var param in spec){
	    		fnStr = fnStr.replace('"{{'+param+'}}"', spec[param]);
	    	}
	        code = fnStr.match( functionBodyRegx )[1];
	        url = window.opera ? 
	            "data:application/javascript," + encodeURIComponent( code ) :
	            URL.createObjectURL( new Blob( [ code ], contentType ) );
	        return new Worker( url );
	    }
	}();
	function parseParam(json1, json2){
	    if(typeof json2 ===  'undefined'){return json1;}
	    var json = {};
	    for(var key in json1){
	        if(json1.hasOwnProperty(key) && key != '__proto__' && key !== 'prototype'){
	            json[key] = json2[key] !== undefined ? json2[key] : json1[key];
	        }
	    }
	    json.__proto__ = json1.__proto__;
	    return json;
	}
	/*
		获取音高频率
	*/
	function getF(note, level){
		// var p = Math.pow(2, 1/12);
		var a = 220;
		var index = level >= 1 ? 
			list.indexOf(note) + 12 * level : 
			list.indexOf(note) - 12 + 12 * (level + 1);
		var dis = list.indexOf('A') - index;
		return a * Math.pow(2, -dis/12);
	}
	window.NoteWave = function(opts){
		opts = parseParam({
			'sampleRate' : 44100,
			'bitsPerSample' : 16,
			'blockAlign' : 2,
			'numChannels' : 2,
			'filterByte' : 16,
			'weak' : 0.99985,
			'callback' : function(base64, args){
				var audio = new Audio();
				// audio.volume = 3;
				audio.src = base64; // set audio source
				audio.play(); // we should hear two tones one on each speaker
				// console.log(base64);
			},
			'soundEffect' : function(w, t, em){
				var niu = 30 / (2 * Math.PI);
				return em.v * em.alpha * Math.sin(w*t + niu) +
				em.v * em.alpha * .2 * (Math.sin(w*2*t + niu) + Math.sin(w/2*t + niu)) +
				em.v * em.alpha * .1 * (Math.sin(w*4*t + niu) + Math.sin(w/4*t + niu))
			},
			'mode' : 1//本文件处理：1 worker : 0
		}, opts);
		var cache = {};
		var getCache = function(note, key, time){
			if(!arguments.length){return cache}
			return cache[note + '_' + key + '_' + time];
		}
		var buildSound = function(note, key, time, callback){
			if(getCache(note, key, time)){
				return;
			}
			var len = (time || 3) * opts.sampleRate;
			var f = getF(note, key);
			var w = f * 2 * Math.PI / opts.sampleRate;
			wk.postMessage({
				'len':len,
				'w':w, 
				'note':note, 
				'key':key, 
				'time':time,
				'soundEffect' : opts.soundEffect.toString(),
				'weak' : opts.weak,
				'callback' : callback
			});
		}
		var wk = opts.mode ? worker(function(){
			onmessage = function(e){
				var time = e.data.time;
				var len = e.data.len;
				var w = e.data.w;
				var soundEff = "{{soundEffect}}";
				var data = new Uint8Array(len);
				var t = 0;
				var niu = 30 / (2 * Math.PI);
				var em = {
					'v' : 70,
					'alpha' : 1,
					'weak' : "{{weak}}"
				}
				var singleSampL, singleSampR;
				while (t++ <= len) {
					singleSampL = Math.round(soundEff(w,t,em));
					// singleSampL = Math.max(0, singleSampL);
					singleSampR = singleSampL;
					data[t*2] = singleSampL
					data[t*2+1] = singleSampR;
					em.v *= em.weak;
				}
				postMessage({'data':data, 'len':len, 'note':e.data.note, 'key':e.data.key, 'time': time});
			}
		},{
			'soundEffect' : opts.soundEffect.toString(),
			'weak' : opts.weak
		}) : new Worker('worker.js');
		wk.onmessage = function(rs){
			var data = rs.data.data;
			var note = rs.data.note;
			var key = rs.data.key;
			var len = rs.data.len;
			var time = rs.data.time;
			var callback = rs.data.setCallback;
			var wave = new RIFFWAVE();
			wave.header.sampleRate = opts.sampleRate;
			wave.header.bitsPerSample = opts.bitsPerSample;
			wave.header.blockAlign = opts.blockAlign;
			wave.header.numChannels = opts.numChannels;
			wave.header.filterByte = opts.filterByte;
			wave.header.size = len;
			// console.log(data);
			wave.Make(data, function(blob){
				cache[note + '_' + key + '_' + time] = blob;
				opts.callback(blob, [note, key, time]);
			});
		}
		var func = function(note, key, time){
			cache[note + '_' + key + '_' + time] ?
				opts.callback(getCache(note, key, time)):
				buildSound(note, key, time, true);
		}
		func.getCache = getCache;
		func.buildSound = buildSound;
		return func;
	};
})(window);