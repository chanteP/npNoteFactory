
// const wavBuilder = require('./wavBuilder');
const effect = require('./effect');
const { list, getFrequencyByName } = require('./kit');

class Engine {
    constructor(options = {}) {
        this.options = Object.assign({
            len: 3,
            effect: 'piano',
            sampleRate: 44100,
        }, options);
        this.playList = [];
        this.setEffect(this.options.effect);
    }
    setEffect(effectName) {
        if (typeof effectName === 'function') {
            return this.options.effect = effectName;
        }
        if (!effect[effectName]) {
            throw `effect:${effectName} not found`;
        }
        this.options.effect = effect[effectName];
    }
    async buildBlob(options) {
        return new Promise((res, rej) => {
            let wk = new Worker('/src/worker.js');
            wk.postMessage(options);
            wk.onmessage = (e) => {
                res(e.data.blob);
            }
            wk.onerror = (e) => rej(e);
        });
    }
    async get(name, options) {
        let f = getFrequencyByName(name);
        return await this.buildBlob(Object.assign({ f, len: this.options.len, effect: this.options.effect.toString() }, options));
    }
    play(name, options) {
        let i = this.playList.length;
        this.playList.push(new Promise(res => {
            this.get(name, options).then(async wav => {
                await Promise.resolve(this.playList[i - 1]);
                let wavUrl = URL.createObjectURL(wav);
                let audio = new Audio;
                audio.src = wavUrl;
                audio.play();
                audio.onended = () => {console.log(1);res()};
            });
        }));
        return this;
    }
}
window.onclick = () => {
    // wav播放尾音问题
    // effect函数问题
    new Engine({ effect: '8bit', len: 3 }).play('C4').play('G3');
}


// export default 



module.exports = Engine
