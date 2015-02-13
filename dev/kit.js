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