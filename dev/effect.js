module.exports = {
    '8bit' : function(w, t, spec){
        spec.vol = 100;
        return Math.sin(w * t);
    },
    'piano' : function(w, t, spec){
        return spec.vol / 1.5 * (
                sin(w * t)
                + .3 * sin(2 * w * t)
                + .2 * sin(3 * w * t)
            );
    }
}