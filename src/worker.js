// worker
const {PI,round} = Math;
importScripts("/src/wavBuilder.js");

onmessage = function(e){
    let options = e.data;
    let waveBlob = wavBuilder(calc(options));

    postMessage({
        blob: waveBlob,
    });
}


function calc({f, weak = .9997, len = 3, sampleRate = 44100, effect}){
    const size = len * sampleRate;
    let w = f * 2 * Math.PI / sampleRate,
        t = 0;
    let spec = {
        vol : 100,
        f : f,
        T : f * sampleRate
    };
    let data = new Uint8Array(size);
    let singleSampL, singleSampR;
    let effectFunc = new Function('w', 't', 'spec', '{sin,cos,pow,abs,sqrt} = Math', parseFunctionBody(effect));
    while (t++ <= size) {
        singleSampL = effectFunc(w, t, spec) * spec.vol;
        singleSampR = singleSampL;
        data[t*2] = singleSampL
        data[t*2+1] = singleSampR;
        spec.vol *= weak;
    }
    return data;
}

function parseFunctionBody(funcStr){
    return /{([\w\W]*)}/.exec(funcStr)[1];
}

