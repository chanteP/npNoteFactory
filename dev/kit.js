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
var getIndex = function(noteName, level){
    var index = list.indexOf(noteName);
    if(index <= 0){
        throw 'note ' + noteName + 'error';
    }
    return level * 12 + index;
};
//A4 = 440hz
var q = Math.pow(2, 1 / 12), baseAHz = 440, baseAIndex = getIndex('A', 4);

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
            url = window.opera ? 
                "data:application/javascript," + encodeURIComponent( code ) :
                URL.createObjectURL( new Blob( [ code ], contentType ) );
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
        return baseAHz * Math.pow(q, getIndex(noteName, level) - baseAIndex);
    }
};
module.exports = api;