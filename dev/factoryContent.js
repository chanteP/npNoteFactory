module.exports = function(){
    var PI = Math.PI, sin = Math.sin, cos = Math.cos, tan = Math.tan, cot = Math.cot, pow = Math.pow, sqrt = Math.sqrt, abs = Math.abs;

    var RIFFWAVE = "{{riffwave}}";

    var soundEff = "{{soundEffect}}",
        weak = "{{weak}}";

    var sampleRate = "{{sampleRate}}",
        bitsPerSample = "{{bitsPerSample}}",
        blockAlign = "{{blockAlign}}",
        numChannels = "{{numChannels}}",
        filterByte = "{{filterByte}}";

    var calc = function(f, size){
        var vol = 100,
            w = f * 2 * PI / sampleRate,
            t = 0;
        var spec = {
            vol : vol,
            f : f,
            T : f * sampleRate
        };
        var data = new Uint8Array(size);
        var singleSampL, singleSampR;
        while (t++ <= size) {
            singleSampL = Math.round(soundEff(w, t, spec));
            // singleSampL = Math.max(0, singleSampL);
            singleSampR = singleSampL;
            data[t*2] = singleSampL
            data[t*2+1] = singleSampR;
            spec.vol *= weak;
        }
        return data;
    }

    onmessage = function(e){
        var f = e.data.f,
            note = e.data.note,
            len = e.data.len;

        var size = (len || 3) * sampleRate;

        var data = calc(f, size);

        var wave = new RIFFWAVE();
        wave.header.sampleRate = sampleRate;
        wave.header.bitsPerSample = bitsPerSample;
        wave.header.blockAlign = blockAlign;
        wave.header.numChannels = numChannels;
        wave.header.filterByte = filterByte;
        wave.header.size = size;

        wave.Make(data, function(blob, url){
            postMessage({
                blob    : blob,
                url     : url,
                len     : len, 
                note    : note
            });
        });
    }
}