(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.Note = require('./dev/noteFactory');
},{"./dev/noteFactory":5}],2:[function(require,module,exports){
module.exports = {
    'test' : function(w, t, spec){
        return spec.vol * sin(w * t);
    },
    '8bit' : function(w, t, spec){
        return 100 * sin(w * t);
    },
    'angle' : function(w, t, spec){
        return spec.vol * sin(w * t);
    },
    'tuningFork' : function(w, t, spec){
        return spec.vol / 1.2 * (
                sin(w * t)
                + .2 * sin(2 * w * t)
            );
    },
    // weak : .99985,
    'piano' : function(w, t, spec){
        return spec.vol / 1.5 * (
                sin(w * t)
                + .3 * sin(2 * w * t)
                + .2 * sin(3 * w * t)
            );
    },
    // weak : .99985,
    'guitar' : function(w, t, spec){
        return spec.vol / 2.2 * (
                  pow(sin(w*t)       , 3)
                + .5 * pow(sin(w*2*t), 3)
                + .4 * pow(sin(w*3*t), 3)
                + .3 * pow(sin(w*4*t), 3)
            );
    }
}
//http://www.phy.ntnu.edu.tw/demolab/html.php?html=teacher/sound/sound6
},{}],3:[function(require,module,exports){
module.exports = function(){
    var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, cot = Math.cot, pow = Math.pow, sqrt = Math.sqrt, abs = Math.abs;

    var RIFFWAVE = "{{riffwave}}";

    var soundEff = "{{soundEffect}}",
        weak = "{{weak}}";

    var sampleRate = "{{sampleRate}}",
        bitsPerSample = "{{bitsPerSample}}",
        blockAlign = "{{blockAlign}}",
        numChannels = "{{numChannels}}",
        filterByte = "{{filterByte}}";

    var calc = function(f, size){
        var vol = 100,
            w = f * 2 * PI / sampleRate,
            t = 0;
        var spec = {
            vol : vol,
            f : f,
            T : f * sampleRate
        };
        var data = new Uint8Array(size);
        var singleSampL, singleSampR;
        while (t++ <= size) {
            singleSampL = Math.round(soundEff(w, t, spec));
            // singleSampL = Math.max(0, singleSampL);
            singleSampR = singleSampL;
            data[t*2] = singleSampL
            data[t*2+1] = singleSampR;
            spec.vol *= weak;
        }
        return data;
    }

    onmessage = function(e){
        var f = e.data.f,
            note = e.data.note,
            len = e.data.len;

        var size = (len || 3) * sampleRate;

        var data = calc(f, size);

        var wave = new RIFFWAVE();
        wave.header.sampleRate = sampleRate;
        wave.header.bitsPerSample = bitsPerSample;
        wave.header.blockAlign = blockAlign;
        wave.header.numChannels = numChannels;
        wave.header.filterByte = filterByte;
        wave.header.size = size;

        wave.Make(data, function(blob, url){
            postMessage({
                blob    : blob,
                url     : url,
                len     : len, 
                note    : note
            });
        });
    }
}
},{}],4:[function(require,module,exports){
var list = ["C","#C","D","#D","E","F","#F","G","#G","A","#A","B"];
var relCache = {};
var objMerger = function(type, args){
    var hold = false, rsObj, curObj;
    if(args[args.length-1] === true){
        hold = true;
    }
    rsObj = hold ? args[0] : {};
    for(var i = +hold, j = args.length - hold; i<j; i++) {
        curObj = args[i];
        if(typeof curObj !== 'object'){continue;}
        for(var key in (type ? curObj : args[0])){
            if(!args[i].hasOwnProperty(key)){continue;}
            rsObj[key] = curObj[key];
        }
    };
    return rsObj;
};
//A4 = 440hz
var api = {
    Worker : function(){
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
            url = URL.createObjectURL( new Blob( [ code ], contentType ) );
            return new Worker( url );
        }
    }(),
    parse : function(){
        return objMerger(0, arguments);
    },
    merge : function(){
        return objMerger(1, arguments);
    },
    list : list,
    getFrequency : function(noteName, level){
        return baseAHz * Math.pow(q, api.translate(noteName + level) - baseAIndex);
    },
    //A4 => 57, 57 => A4
    translate : function(input){
        var note, level;
        if(typeof input === 'string'){
            var match = api.parseNote(input);
            note = match[0];
            level = match[1];
            var index = list.indexOf(note);
            if(index < 0){
                throw 'translate note: ' + note + ' error';
            }
            return level * 12 + index + 12;
        }
        else if(typeof input === 'number'){
            input = input - 12;
            note = input % 12;
            level = (input / 12) | 0;
            return list[note] + level;
        }
        else{
            throw 'translate note: ' + input + ' error';
        }
    },
    //A4 => A, 4
    parseNote : function(input){
        var noteExp = /(#?[A-Z])(-?[\d])/, match;
        match = noteExp.exec(input);
        if(!match){
            throw 'input error : ' + input;
        }
        return [match[1], match[2]];
    }
};
var q = Math.pow(2, 1 / 12) || 1.06, baseAHz = 440, baseAIndex = api.translate('A4');
module.exports = api;
},{}],5:[function(require,module,exports){
var $ = require('./kit');
var factoryContent = require('./factoryContent');
var riffwave = require('./riffwave');

var getID = function(noteFullName, duration){
    return noteFullName + '_' + duration;
}

var nodeFactory = function(cfg){
    var self = this;
    this.config = $.parse({
        soundEffect : function(w, t, spec){
            return spec.vol * Math.sin(w * t);
        },
        duration : 3,
        weak : .99985,

        sampleRate : 44100,
        bitsPerSample : 16,
        blockAlign : 2,
        numChannels : 2,
        filterByte : 16
    }, cfg);

    this._cache = {};
    this._listener = {};

    this.worker = $.Worker(factoryContent, {
        soundEffect : this.config.soundEffect.toString(),
        weak : this.config.weak,

        riffwave : riffwave.toString(),

        sampleRate : this.config.sampleRate,
        bitsPerSample : this.config.bitsPerSample,
        blockAlign : this.config.blockAlign,
        numChannels : this.config.numChannels,
        filterByte : this.config.filterByte
    });
    this.worker.onmessage = function(e){
        var noteFullName = e.data.note,
            duration = e.data.len,
            url = e.data.url;
        self.cache(noteFullName, duration, url);
        self._pub(noteFullName, duration, url);
    }
}
//A4, callback(url), [duration]
nodeFactory.prototype.get = function(noteFullName, callback, duration){
    if(typeof noteFullName === 'number'){
        noteFullName = $.translate(noteFullName);
    }
    duration = duration || this.config.duration;
    var data = this.cache[noteFullName], 
        self = this, 
        arg = {
            noteFullName : noteFullName,
            duration : duration
        };
    if(data){
        callback(data);
        return;
    }
    else{
        this.build(noteFullName, duration);
        this._sub(noteFullName, duration, callback);
    }
}
nodeFactory.prototype.cache = function(noteFullName, duration, data){
    var id = getID(noteFullName, duration);
    if(!data){
        return this._cache[id];
    }
    else{
        return this._cache[id] = data;
    }
}
nodeFactory.prototype.build = function(noteFullName, duration){
    var match = $.parseNote(noteFullName);
    var f = $.getFrequency(match[0], match[1]);
    this.worker.postMessage({
        f : f,
        note : noteFullName,
        len : duration
    });
}
nodeFactory.prototype._sub = function(noteFullName, duration, callback){
    var id = getID(noteFullName, duration);
    if(!this._listener[id]){
        this._listener[id] = [];
    }
    this._listener[id].push(callback);
}
nodeFactory.prototype._pub = function(noteFullName, duration, url){
    var id = getID(noteFullName, duration);
    var list = this._listener[id] || [];
    this._listener[id] = [];
    var arg = {
        noteFullName : noteFullName,
        duration : duration
    };
    list.forEach(function(func){
        func(url, arg);
    });
}
nodeFactory.getFrequency = $.getFrequency;
nodeFactory.translate = $.translate;
nodeFactory.effect = require('./effect');
nodeFactory.noteList = $.list;
module.exports = nodeFactory;

},{"./effect":2,"./factoryContent":3,"./kit":4,"./riffwave":6}],6:[function(require,module,exports){
/*
    制作音频
    改良版@131231 by chante
*/
function RIFFWAVE(base64){
    this.mode = !!base64;
    function to8Array(b, i){
        var offset = 0, rs = [];
        while(b--){
            rs.push((i>>offset++*8)&0xFF);
        }
        return rs;
    }
    this.bitAdd = function(num){
        this.dataBit += num;
        return num;
    }
    this.header = {
        'RIFF_ID'       : [0x52,0x49,0x46,0x46],
        'chunkSize'     : 0,
        'WAVE_ID'       : [0x57,0x41,0x56,0x45],
        'FMT_ID'        : [0x66,0x6d,0x74,0x20],
        'filterByte'    : 0x10,
        'formatType'    : 1,
        'numChannels'   : 2,
        'sampleRate'    : 44100,
        'byteRate'      : 0,
        'blockAlign'    : 0,
        'bitsPerSample' : 8,
        'fact_ID'       : [0x64,0x61,0x74,0x61],
        'size'          : 4
    };
    this.Make = function(data, callback){
        var bitType = this.header.bitsPerSample == 16 ? 4 : 3;
        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> bitType;
        this.header.byteRate = this.header.blockAlign * this.header.sampleRate;
        this.header.size = data.length * (this.header.bitsPerSample >> bitType);
        this.header.chunkSize = 36 + this.header.size;
        this.dataBit = 0;
        this.data = new Uint8Array(this.header.size * (bitType - 2) + 44);
        this.data.set(this.header.RIFF_ID, this.dataBit);                   this.bitAdd(4);
        this.data.set(to8Array(4, this.header.chunkSize), this.dataBit);    this.bitAdd(4);
        this.data.set(this.header.WAVE_ID, this.dataBit);                   this.bitAdd(4);
        this.data.set(this.header.FMT_ID, this.dataBit);                    this.bitAdd(4);
        this.data.set(to8Array(4, this.header.filterByte), this.dataBit);   this.bitAdd(4);
        this.data.set(to8Array(2, this.header.formatType), this.dataBit);   this.bitAdd(2);
        this.data.set(to8Array(2, this.header.numChannels), this.dataBit);  this.bitAdd(2);
        this.data.set(to8Array(4, this.header.sampleRate), this.dataBit);   this.bitAdd(4);
        this.data.set(to8Array(4, this.header.byteRate), this.dataBit);     this.bitAdd(4);
        this.data.set(to8Array(2, this.header.blockAlign), this.dataBit);   this.bitAdd(2);
        this.data.set(to8Array(2, this.header.bitsPerSample), this.dataBit);this.bitAdd(2);
        this.data.set(this.header.fact_ID, this.dataBit);                   this.bitAdd(4);
        this.data.set(to8Array(4, this.header.size), this.dataBit);         this.bitAdd(4);
        if(bitType == 4){
            for(var i = 0, j = data.length; i<j; i++){
                this.data.set(to8Array(2, data[i]).reverse(), this.dataBit);this.bitAdd(2);
            }
        }
        else{
            this.data.set(data, this.dataBit);
        }
        var blob = new Blob([].concat(this.data), {'type': 'audio/wav'});
        var url = URL.createObjectURL(blob);
        callback && callback(blob, url);
    }
}
window && (window.RIFFWAVE = RIFFWAVE);
module.exports = RIFFWAVE;
//http://baike.baidu.com/link?url=ZDGhS9R8eBYqAY7p3N1oFJrqjBvB8Rqt9SNGaKbW54Z8WozKwV8KYdPwJ4YQky6L
},{}]},{},[1]);
