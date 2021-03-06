//A4 = 440hz
const list = ["C", "#C", "D", "#D", "E", "F", "#F", "G", "#G", "A", "#A", "B"];
const q = Math.pow(2, 1 / 12) || 1.06;
const baseAHz = 440;
const baseAIndex = translate('A4');

const Worker = function (fn, env) {
    let functionBodyRegx = /\{([\s\S]*)\}/m;
    let contentType = { type: "text/javascript; charset=utf-8" };
    let fnStr = fn.toString();
    let code = fnStr.match(functionBodyRegx)[1];
    let envList = [];
    Object.keys(env).map(key => {
        let content = '';
        if(typeof env[key] === 'function'){
            content = env[key].toString();
        }
        else{
            content = JSON.stringify(env[key]);
        }
        envList.push(`const ${key} = ${content};`);
    });
    let URL = window.URL || window.webkitURL;
    let url = URL.createObjectURL(new Blob([envList.join('\n'), code], contentType));
    return new self.Worker(url);
}

module.exports = {
    list,
    Worker,
    getFrequency,
    getFrequencyByName,
    translate,
    parseNote,
    sleep,
}
async function sleep(delay) {
    return new Promise(res => {
        setTimeout(_ => {
            res();
        }, delay)
    })
}

function getFrequency(noteName, level) {
    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);
}
function getFrequencyByName(note) {
    const [noteName, level] = parseNote(note);
    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);
}

//A4 => 57, 57 => A4
function translate(input) {
    let note, level;
    if (typeof input === 'string') {
        let match = parseNote(input);
        note = match[0];
        level = match[1];
        let index = list.indexOf(note);
        if (index < 0) {
            throw 'translate note: ' + note + ' error';
        }
        return level * 12 + index + 12;
    }
    else if (typeof input === 'number') {
        input = input - 12;
        note = input % 12;
        level = (input / 12) | 0;
        return list[note] + level;
    }
    else {
        throw 'translate note: ' + input + ' error';
    }
}

//A4 => A, 4
function parseNote(input) {
    let noteExp = /(#?[A-Z])(-?[\d])/, match;
    match = noteExp.exec(input);
    if (!match) {
        throw 'input error : ' + input;
    }
    return [match[1], match[2]];
}
