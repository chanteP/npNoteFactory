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
		'RIFF_ID' 		: [0x52,0x49,0x46,0x46],
		'chunkSize' 	: 0,
		'WAVE_ID' 		: [0x57,0x41,0x56,0x45],
		'FMT_ID' 		: [0x66,0x6d,0x74,0x20],
		'filterByte'	: 0x10,
		'formatType'	: 1,
		'numChannels'	: 2,
		'sampleRate'	: 44100,
		'byteRate'		: 0,
		'blockAlign'	: 0,
		'bitsPerSample'	: 8,
		'fact_ID'		: [0x64,0x61,0x74,0x61],
		'size'			: 4
	};
	this.Make = function(data, callback){
		var bitType = this.header.bitsPerSample == 16 ? 4 : 3;
        this.header.blockAlign = (this.header.numChannels * this.header.bitsPerSample) >> bitType;
        this.header.byteRate = this.header.blockAlign * this.header.sampleRate;
        this.header.size = data.length * (this.header.bitsPerSample >> bitType);
        this.header.chunkSize = 36 + this.header.size;
        this.dataBit = 0;
        this.data = new Uint8Array(this.header.size * (bitType - 2) + 44);
        this.data.set(this.header.RIFF_ID, this.dataBit);					this.bitAdd(4);
        this.data.set(to8Array(4, this.header.chunkSize), this.dataBit);	this.bitAdd(4);
        this.data.set(this.header.WAVE_ID, this.dataBit);					this.bitAdd(4);
        this.data.set(this.header.FMT_ID, this.dataBit);					this.bitAdd(4);
        this.data.set(to8Array(4, this.header.filterByte), this.dataBit);	this.bitAdd(4);
        this.data.set(to8Array(2, this.header.formatType), this.dataBit);	this.bitAdd(2);
        this.data.set(to8Array(2, this.header.numChannels), this.dataBit);	this.bitAdd(2);
        this.data.set(to8Array(4, this.header.sampleRate), this.dataBit);	this.bitAdd(4);
        this.data.set(to8Array(4, this.header.byteRate), this.dataBit);		this.bitAdd(4);
        this.data.set(to8Array(2, this.header.blockAlign), this.dataBit);	this.bitAdd(2);
        this.data.set(to8Array(2, this.header.bitsPerSample), this.dataBit);this.bitAdd(2);
        this.data.set(this.header.fact_ID, this.dataBit);					this.bitAdd(4);
        this.data.set(to8Array(4, this.header.size), this.dataBit);			this.bitAdd(4);
        if(bitType == 4){
	        for(var i = 0, j = data.length; i<j; i++){
	        	this.data.set(to8Array(2, data[i]).reverse(), this.dataBit);this.bitAdd(2);
	        }
        }
        else{
	        this.data.set(data, this.dataBit);
        }
        var blob = new Blob([].concat(this.data), {'type': 'audio/wav'});
        if(this.mode){
	        var url = URL.createObjectURL(blob);
	        callback && callback(url);
        }
        else{
	        var fr = new FileReader();
	        fr.onload = function(){
	        callback && callback(this.result)

	        }
	        fr.readAsDataURL(blob)
        }
	}
}
//http://baike.baidu.com/link?url=ZDGhS9R8eBYqAY7p3N1oFJrqjBvB8Rqt9SNGaKbW54Z8WozKwV8KYdPwJ4YQky6L