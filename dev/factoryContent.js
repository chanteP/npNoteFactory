module.exports = function(){
    onmessage = function(e){
        var time = e.data.time;
        var len = e.data.len;
        var w = e.data.w;
        var soundEff = "{{soundEffect}}";
        var data = new Uint8Array(len);
        var t = 0;
        var niu = 30 / (2 * Math.PI);
        var em = {
            'v' : 70,
            'alpha' : 1,
            'weak' : "{{weak}}"
        }
        var singleSampL, singleSampR;
        while (t++ <= len) {
            singleSampL = Math.round(soundEff(w,t,em));
            // singleSampL = Math.max(0, singleSampL);
            singleSampR = singleSampL;
            data[t*2] = singleSampL
            data[t*2+1] = singleSampR;
            em.v *= em.weak;
        }
        postMessage({'data':data, 'len':len, 'note':e.data.note, 'key':e.data.key, 'time': time});
    }
}