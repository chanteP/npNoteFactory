module.exports = {
    'test' : function(w, t, spec){
        return spec.vol * sin(w * t);
    },
    '8bit' : function(w, t, spec){
        return 100 * sin(w * t);
    },
    'angle' : function(w, t, spec){
        return spec.vol * sin(w * t);
    },
    'tuningFork' : function(w, t, spec){
        return spec.vol / 1.2 * (
                sin(w * t)
                + .2 * sin(2 * w * t)
            );
    },
    // weak : .99985,
    'piano' : function(w, t, spec){
        return spec.vol / 1.5 * (
                sin(w * t)
                + .3 * sin(2 * w * t)
                + .2 * sin(3 * w * t)
            );
    },
    // weak : .99985,
    'guitar' : function(w, t, spec){
        return spec.vol / 2.2 * (
                  pow(sin(w*t)       , 3)
                + .5 * pow(sin(w*2*t), 3)
                + .4 * pow(sin(w*3*t), 3)
                + .3 * pow(sin(w*4*t), 3)
            );
    }
}
//http://www.phy.ntnu.edu.tw/demolab/html.php?html=teacher/sound/sound6