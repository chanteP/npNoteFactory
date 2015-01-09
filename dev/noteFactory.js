var kit = require('./kit');
var worker = kit.Worker,
    parseParam = kit.parseParam
    getFrequency = kit.getFrequency;
var Riffwave = require('./riffwave');
var factoryContent = require('./factoryContent');

var nodeFactory = function(note, level, duration, cfg){
    cfg = parseConfig(cfg);
    //parseConfig
    var frequency = getFrequency(note, level);
    //build
    var buildAudio([frequency], duration);
}

var parseConfig = function(cfg){

}
//return base64
var buildAudio = function(frequency, effect){

}