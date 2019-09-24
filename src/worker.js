// worker
const { PI, round } = Math;
importScripts("/src/wavBuilder.js");

onmessage = function (e) {
    let options = e.data;
    let waveBlob = wavBuilder(calc(options), options);

    postMessage({
        blob: waveBlob,
    });
}


function calc({ f, len = 3, sampleRate = 44100, bitsPerSample = 16, numChannels = 2, effect }) {
    const size = len * sampleRate * numChannels;
    const blockSize = bitsPerSample / 8;
    // 1s = sampleRate
    // T = 1s / f
    // w = 2PI/T
    let w = f * 2 * PI / sampleRate,
        t = 0;
    let spec = {
        vol: 100,
        f: f,
        T: f * sampleRate
    };
    let data = new Uint8Array(size * blockSize);
    let effectFunc = new Function('w', 't', 'spec', '{sin,cos,pow,abs,sqrt} = Math', parseFunctionBody(effect));
    while (t <= size) {
        let sampleData = effectFunc(w, t, spec) * spec.vol;
        parseSampleData(sampleData, blockSize, data, t * blockSize * numChannels);
        numChannels === 2 && copySampleData(data, t * blockSize * numChannels, blockSize);
        t++;
    }
    return data;
}

function parseSampleData(value, blockSize, data, baseIndex){
    while(--blockSize >= 0){
        data[baseIndex + blockSize] = value >> (blockSize * 8);
    }
}
function copySampleData(data, baseIndex, blockSize){
    let i = blockSize;
    while(i--){
        data[baseIndex + blockSize + i] = data[baseIndex + i];
    }
}

function parseFunctionBody(funcStr) {
    return /{([\w\W]*)}/.exec(funcStr)[1];
}

