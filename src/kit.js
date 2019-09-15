//A4 = 440hz
const q = Math.pow(2, 1 / 12) || 1.06, 
    baseAHz = 440, 
    baseAIndex = translate('A4');

export const list = ["C","#C","D","#D","E","F","#F","G","#G","A","#A","B"];
export const Worker = (function (){
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
})();

export function getFrequency(noteName, level){
    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);
}
export function getFrequencyByName(note){
    const [noteName, level] = parseNote(note);
    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);
}

//A4 => 57, 57 => A4
export function translate(input){
    var note, level;
    if(typeof input === 'string'){
        var match = parseNote(input);
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
}

//A4 => A, 4
export function parseNote(input){
    var noteExp = /(#?[A-Z])(-?[\d])/, match;
    match = noteExp.exec(input);
    if(!match){
        throw 'input error : ' + input;
    }
    return [match[1], match[2]];
}