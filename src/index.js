
/**
    new Engine({ effect: 'piano', len: 5})
        .play('C3', {len: 2})
        .play('C3 G2 E3')
        .play('G3')
        .play('A3')
 */
const effect = require('./effect');
const { list, getFrequencyByName, sleep, Worker } = require('./kit');
const workerContent = require('./worker');
const { format, wavBuilder } = require('./wavBuilder');

class Engine {
    constructor(options = {}) {
        this.options = Object.assign({
            len: 3,
            effect: 'piano',
            sampleRate: 44100,
        }, options);
        this.setEffect(this.options.effect);
    }
    setEffect(effectName) {
        if (!effect[effectName] && typeof effectName !== 'function') {
            throw `effect:${effectName} not found`;
        }
        this.options.effect = effect[effectName] || (typeof effectName === 'function' && effectName) || effect['piano'];
        this.options.effect = this.options.effect.toString();
    }
    async buildBlob(options) {
        return new Promise((res, rej) => {
            // TODO 同一个worker的话性能跟不上
            let wk = new Worker(workerContent, { format, wavBuilder });
            wk.postMessage(options);
            wk.onmessage = (e) => {
                res(e.data.blob);
                wk.terminate();
            }
            wk.onerror = (e) => {
                rej(e);
                wk.terminate();
            };
        });
    }
    async get(name, options) {
        let f = getFrequencyByName(name);
        return await this.buildBlob(Object.assign({ f, len: this.options.len }, this.options, options));
    }
    play(name, { delay = 0, options } = {}, callback) {
        (async _ => {
            await sleep(delay);
            this.audio(name, options);
            callback && callback(name, {delay, options});
        })();
        return this;
    }
    async audio(name, options) {
        if (~name.indexOf(' ')) {
            return Promise.all(name.split(' ').map(n => this.audio(n, options)));
        }
        return this.get(name, options).then(wav => {
            return new Promise(res => {
                let wavUrl = URL.createObjectURL(wav);
                let audio = new Audio;
                audio.src = wavUrl;
                audio.play();
                audio.onended = () => { res() };
            });
        });
    }
}
Engine.list = list;
Engine.effect = effect;

module.exports = Engine;
typeof self !== 'undefined' && (self.Engine = Engine);
