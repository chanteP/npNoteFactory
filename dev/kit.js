module.exports = {
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
    parseParam : function parseParam(obj1, obj2){
        if(typeof obj2 ===  'undefined'){return obj1;}
        var json = {};
        for(var key in obj1){
            if(obj1.hasOwnProperty(key) && key != '__proto__' && key !== 'prototype'){
                json[key] = obj2[key] !== undefined ? obj2[key] : obj1[key];
            }
        }
        json.__proto__ = obj1.__proto__;
        return json;
    },
    list : ["C","#C","D","#D","E","F","#F","G","#G","A","#A","B"],
    getFrequency = function(note, level){
        // var p = Math.pow(2, 1/12);
        var a = 220;
        var index = level >= 1 ? 
            list.indexOf(note) + 12 * level : 
            list.indexOf(note) - 12 + 12 * (level + 1);
        var dis = list.indexOf('A') - index;
        return a * Math.pow(2, -dis/12);
    }
};