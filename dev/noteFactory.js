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
            var niu = 30 / (2 * PI);
            return spec.vol * sin(w*t + niu) +
            spec.vol * .2 * (sin(w*2*t + niu) + sin(w/2*t + niu)) +
            spec.vol * .1 * (sin(w*4*t + niu) + sin(w/4*t + niu));
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
            base64 = e.data.base64;
        self.cache(noteFullName, duration, base64);
        self._pub(noteFullName, duration, base64);
    }
}
//A4, callback(base64), [duration]
nodeFactory.prototype.get = function(noteFullName, callback, duration){
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
    var noteExp = /([A-Z|#]{1, 2})([\d])/, match;
    match = noteExp.exec(noteFullName);
    if(!match){
        return;
    }
    var f = $.getFrequency(match[1], match[2]);
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
nodeFactory.prototype._pub = function(noteFullName, duration, base64){
    var id = getID(noteFullName, duration);
    var list = this._listener[id] || [];
    this._listener[id] = [];
    var arg = {
        noteFullName : noteFullName,
        duration : duration
    };
    list.forEach(function(func){
        func(base64, arg);
    });
}
module.exports = nodeFactory;