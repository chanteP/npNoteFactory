//http://www.phy.ntnu.edu.tw/demolab/html.php?html=teacher/sound/sound6

const { sin, pow } = Math;

module.exports = {
    'test': function (w, t, spec) {
        return sin(w * t);
    },
    '8bit': function (w, t, spec) {
        return sin(w * t);
    },
    'tuningFork': function (w, t, spec) {
        spec.vol *= .99999;
        return (
            sin(w * t)
        );
    },
    // weak : .99985,
    'piano': function (w, t, spec) {
        spec.vol *= .99998;
        return (
            .6 * sin(w * t)
            + .15 * sin(w * 2 * t)
            + .15 * sin(w * 3 * t)
            + .1 * sin(w * 4 * t)
            + .03 * sin(w * 5 * t)
            + .03 * sin(w * 6 * t)
            + .03 * sin(w * 7 * t)
        );
    },
    // TODO
    'guitar': function (w, t, spec) {
        spec.vol *= .99998;
        return (
            .6 * sin(w * t)
            + .1 * sin(w * 2 * t)
            + .1 * sin(w * 3 * t)
            + .03 * sin(w * 4 * t)
            + .03 * sin(w * 5 * t)
            + .03 * sin(w * 6 * t)
            + .03 * sin(w * 7 * t)
        );
    }
}