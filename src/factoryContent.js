// worker
export default function(){
    const {PI,round} = Math;

    const RIFFWAVE = "{{riffwave}}";
    const soundEff = "{{soundEff}}";

    onmessage = function(e){
        const data = calc(e.data);
        const waveBlob = new RIFFWAVE(data, e.data);

        postMessage({
            blob: waveBlob,
            data: e.data, 
        });
    }

    function calc({f, weak = 0, sampleRate = 44100}){
        const size = (len || 3) * sampleRate;
        let w = f * 2 * PI / sampleRate,
            t = 0;
        let spec = {
            vol : 100,
            f : f,
            T : f * sampleRate
        };
        let data = new Uint8Array(size);
        let singleSampL, singleSampR;
        while (t++ <= size) {
            singleSampL = round(soundEff(w, t, spec));
            // singleSampL = Math.max(0, singleSampL);
            singleSampR = singleSampL;
            data[t*2] = singleSampL
            data[t*2+1] = singleSampR;
            spec.vol *= weak;
        }
        return data;
    }
}