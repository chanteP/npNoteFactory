/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/effect.js":
/*!***********************!*\
  !*** ./src/effect.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//http://www.phy.ntnu.edu.tw/demolab/html.php?html=teacher/sound/sound6\n\nconst { sin, pow } = Math;\n\nmodule.exports = {\n    'test': function (w, t, spec) {\n        return sin(w * t);\n    },\n    '8bit': function (w, t, spec) {\n        return sin(w * t);\n    },\n    'tuningFork': function (w, t, spec) {\n        spec.vol *= .99999;\n        return (\n            sin(w * t)\n        );\n    },\n    // weak : .99985,\n    'piano': function (w, t, spec) {\n        spec.vol *= .99998;\n        return (\n            .6 * sin(w * t)\n            + .15 * sin(w * 2 * t)\n            + .15 * sin(w * 3 * t)\n            + .1 * sin(w * 4 * t)\n            + .03 * sin(w * 5 * t)\n            + .03 * sin(w * 6 * t)\n            + .03 * sin(w * 7 * t)\n        );\n    },\n    // TODO\n    'guitar': function (w, t, spec) {\n        spec.vol *= .99998;\n        return (\n            .6 * sin(w * t)\n            + .1 * sin(w * 2 * t)\n            + .1 * sin(w * 3 * t)\n            + .03 * sin(w * 4 * t)\n            + .03 * sin(w * 5 * t)\n            + .03 * sin(w * 6 * t)\n            + .03 * sin(w * 7 * t)\n        );\n    }\n}\n\n//# sourceURL=webpack:///./src/effect.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n/**\n    new Engine({ effect: 'piano', len: 5})\n        .play('C3', {len: 2})\n        .play('C3 G2 E3')\n        .play('G3')\n        .play('A3')\n */\nconst effect = __webpack_require__(/*! ./effect */ \"./src/effect.js\");\nconst { list, getFrequencyByName, sleep, Worker } = __webpack_require__(/*! ./kit */ \"./src/kit.js\");\nconst workerContent = __webpack_require__(/*! ./worker */ \"./src/worker.js\");\nconst { format, wavBuilder } = __webpack_require__(/*! ./wavBuilder */ \"./src/wavBuilder.js\");\n\nclass Engine {\n    constructor(options = {}) {\n        this.options = Object.assign({\n            len: 3,\n            effect: 'piano',\n            sampleRate: 44100,\n        }, options);\n        this.setEffect(this.options.effect);\n    }\n    setEffect(effectName) {\n        if (!effect[effectName] && typeof effectName !== 'function') {\n            throw `effect:${effectName} not found`;\n        }\n        this.options.effect = effect[effectName] || (typeof effectName === 'function' && effectName) || effect['piano'];\n        this.options.effect = this.options.effect.toString();\n    }\n    async buildBlob(options) {\n        return new Promise((res, rej) => {\n            // TODO 同一个worker的话性能跟不上\n            let wk = new Worker(workerContent, { format, wavBuilder });\n            wk.postMessage(options);\n            wk.onmessage = (e) => {\n                res(e.data.blob);\n                wk.terminate();\n            }\n            wk.onerror = (e) => {\n                rej(e);\n                wk.terminate();\n            };\n        });\n    }\n    async get(name, options) {\n        let f = getFrequencyByName(name);\n        return await this.buildBlob(Object.assign({ f, len: this.options.len }, this.options, options));\n    }\n    play(name, { delay = 0, options } = {}, callback) {\n        (async _ => {\n            await sleep(delay);\n            this.audio(name, options);\n            callback && callback(name, {delay, options});\n        })();\n        return this;\n    }\n    async audio(name, options) {\n        if (~name.indexOf(' ')) {\n            return Promise.all(name.split(' ').map(n => this.audio(n, options)));\n        }\n        return this.get(name, options).then(wav => {\n            return new Promise(res => {\n                let wavUrl = URL.createObjectURL(wav);\n                let audio = new Audio;\n                audio.src = wavUrl;\n                audio.play();\n                audio.onended = () => { res() };\n            });\n        });\n    }\n}\nEngine.list = list;\nEngine.effect = effect;\n\nmodule.exports = Engine;\ntypeof self !== 'undefined' && (self.Engine = Engine);\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/kit.js":
/*!********************!*\
  !*** ./src/kit.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//A4 = 440hz\nconst list = [\"C\", \"#C\", \"D\", \"#D\", \"E\", \"F\", \"#F\", \"G\", \"#G\", \"A\", \"#A\", \"B\"];\nconst q = Math.pow(2, 1 / 12) || 1.06;\nconst baseAHz = 440;\nconst baseAIndex = translate('A4');\n\nconst Worker = function (fn, env) {\n    let functionBodyRegx = /\\{([\\s\\S]*)\\}/m;\n    let contentType = { type: \"text/javascript; charset=utf-8\" };\n    let fnStr = fn.toString();\n    let code = fnStr.match(functionBodyRegx)[1];\n    let envList = [];\n    Object.keys(env).map(key => {\n        let content = '';\n        if(typeof env[key] === 'function'){\n            content = env[key].toString();\n        }\n        else{\n            content = JSON.stringify(env[key]);\n        }\n        envList.push(`const ${key} = ${content};`);\n    });\n    let URL = window.URL || window.webkitURL;\n    let url = URL.createObjectURL(new Blob([envList.join('\\n'), code], contentType));\n    return new self.Worker(url);\n}\n\nmodule.exports = {\n    list,\n    Worker,\n    getFrequency,\n    getFrequencyByName,\n    translate,\n    parseNote,\n    sleep,\n}\nasync function sleep(delay) {\n    return new Promise(res => {\n        setTimeout(_ => {\n            res();\n        }, delay)\n    })\n}\n\nfunction getFrequency(noteName, level) {\n    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);\n}\nfunction getFrequencyByName(note) {\n    const [noteName, level] = parseNote(note);\n    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);\n}\n\n//A4 => 57, 57 => A4\nfunction translate(input) {\n    let note, level;\n    if (typeof input === 'string') {\n        let match = parseNote(input);\n        note = match[0];\n        level = match[1];\n        let index = list.indexOf(note);\n        if (index < 0) {\n            throw 'translate note: ' + note + ' error';\n        }\n        return level * 12 + index + 12;\n    }\n    else if (typeof input === 'number') {\n        input = input - 12;\n        note = input % 12;\n        level = (input / 12) | 0;\n        return list[note] + level;\n    }\n    else {\n        throw 'translate note: ' + input + ' error';\n    }\n}\n\n//A4 => A, 4\nfunction parseNote(input) {\n    let noteExp = /(#?[A-Z])(-?[\\d])/, match;\n    match = noteExp.exec(input);\n    if (!match) {\n        throw 'input error : ' + input;\n    }\n    return [match[1], match[2]];\n}\n\n\n//# sourceURL=webpack:///./src/kit.js?");

/***/ }),

/***/ "./src/wavBuilder.js":
/*!***************************!*\
  !*** ./src/wavBuilder.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\r\n    wav https://www.cnblogs.com/ranson7zop/p/7657874.html\r\n*/\r\n\r\nconst format = {\r\n    /* RIFF chunk description\r\n    ---------------------------------------------------- */\r\n    'RIFF_ID': charCodeFormat('RIFF'),\r\n    // 从下一个字段首地址开始到文件末尾的总字节数。该字段的数值加 8 为当前文件的实际长度\r\n    'chunkSize': 0,\r\n    'WAVE_ID': charCodeFormat('WAVE'),\r\n    /* FMT sub-chunk, fommat of the sound infomation in the data sub-chunk\r\n    ---------------------------------------------------- */\r\n    'FMT_ID': charCodeFormat('fmt '),\r\n    // [ 16 | 18 | 20 | 40 | ... ]\r\n    'filterByte': 16, \r\n    // 常见的 WAV 文件使用 PCM 脉冲编码调制格式, 1\r\n    'formatType': 1, \r\n    // 声道，[ 1 | 2 ]\r\n    'numChannels': 2, \r\n    // 采样频率,  11025, 22050 和 44100 kHz\r\n    'sampleRate': 44100, \r\n    // 数据传输速率, 声道数numChannels×采样频率sampleRate×每样本的数据位数bitsPerSample/8, 利用此值可以估计缓冲区的大小\r\n    'byteRate': 0, \r\n    // 数据块对齐单位, 声道数numChannels×位数bitsPerSample/8\r\n    'blockAlign': 4, \r\n    // 采样位数\t存储每个采样值所用的二进制数位数。常见的位数有 4、8、12、16、24、32\r\n    'bitsPerSample': 16,\r\n    /* data sub-chunk\r\n    ---------------------------------------------------- */\r\n    'DATA_ID': charCodeFormat('data'),\r\n    'size': 4,\r\n    'data': 0,\r\n};\r\nfunction wavBuilder(source, customFormat = {}) {\r\n    const size = source.length;\r\n    let byteCount = 0;\r\n\r\n    let data = new Uint8Array(size + 44);\r\n    set(get('RIFF_ID'), 4);\r\n    set(size + 36, 4);\r\n    set(get('WAVE_ID'), 4);\r\n    set(get('FMT_ID'), 4);\r\n    set(get('filterByte'), 4);\r\n    set(get('formatType'), 2);\r\n    set(get('numChannels'), 2);\r\n    set(get('sampleRate'), 4);\r\n    set(get('numChannels') * get('sampleRate') * get('bitsPerSample') / 8, 4);\r\n    set(get('numChannels') * get('bitsPerSample') / 8, 2);\r\n    set(get('bitsPerSample'), 2);\r\n    set(get('DATA_ID'), 4);\r\n    set(size, 4);\r\n\r\n    set(source);\r\n    return new Blob([].concat(data), { 'type': 'audio/wav' });\r\n\r\n    function get(key) {\r\n        return Object.hasOwnProperty(customFormat, key) ? customFormat[key] : format[key];\r\n    }\r\n    function set(d, len = d.length) {\r\n        if (Array.isArray(d) || d.buffer) {\r\n            data.set(d, byteCount);\r\n            byteCount += len;\r\n            return;\r\n        }\r\n        let count = 0;\r\n        while (len--) {\r\n            data[byteCount] = (d >> count * 8) & 0xFF;\r\n            count++;\r\n            byteCount++;\r\n        }\r\n    }\r\n}\r\n\r\n\r\nfunction charCodeFormat(string){\r\n    return string.split('').map((char, i) => string.charCodeAt(i));\r\n}\r\n\r\nmodule.exports = {\r\n    wavBuilder,\r\n    format,\r\n}\r\n\n\n//# sourceURL=webpack:///./src/wavBuilder.js?");

/***/ }),

/***/ "./src/worker.js":
/*!***********************!*\
  !*** ./src/worker.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// worker\nmodule.exports = () => {\n    const { PI } = Math;\n    // importScripts(\"/src/wavBuilder.js\");\n\n    onmessage = function (e) {\n        let options = e.data;\n        let waveBlob = wavBuilder(calc(options), options);\n\n        postMessage({\n            id: e.data.id,\n            blob: waveBlob,\n        });\n    }\n\n    function calc({ f, len = 3, sampleRate = 44100, bitsPerSample = 8, numChannels = 2, effect }) {\n        const size = len * sampleRate * numChannels;\n        // TODO 16bit\n        const blockSize = bitsPerSample / 8;\n        // 1s = sampleRate\n        // T = 1s / f\n        // w = 2PI/T = 2PIf / sampleRate\n        let w = f * 2 * PI / sampleRate,\n            t = 0;\n        let spec = {\n            vol: 100,\n            f: f,\n            T: f * sampleRate\n        };\n        let data = new Uint8Array(size * blockSize);\n        let effectFunc = new Function('w', 't', 'spec', '{sin,cos,pow,abs,sqrt} = Math', parseFunctionBody(effect));\n        while (t <= size) {\n            let sampleData = effectFunc(w, t, spec) * spec.vol;\n            parseSampleData(sampleData, blockSize, data, t * blockSize * numChannels);\n            numChannels === 2 && copySampleData(data, t * blockSize * numChannels, blockSize);\n            t++;\n        }\n        return data;\n    }\n\n    function parseSampleData(value, blockSize, data, baseIndex){\n        while(--blockSize >= 0){\n            data[baseIndex + blockSize] = value >> (blockSize * 8);\n        }\n    }\n    function copySampleData(data, baseIndex, blockSize){\n        let i = blockSize;\n        while(i--){\n            data[baseIndex + blockSize + i] = data[baseIndex + i];\n        }\n    }\n\n    function parseFunctionBody(funcStr) {\n        return /{([\\w\\W]*)}/.exec(funcStr)[1];\n    }\n\n}\n\n\n//# sourceURL=webpack:///./src/worker.js?");

/***/ })

/******/ });