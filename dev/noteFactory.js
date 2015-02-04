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
nodeFactory.translate = $.translate;
nodeFactory.effect = require('./effect');
nodeFactory.noteList = $.list;
module.exports = nodeFactory;
