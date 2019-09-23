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

eval("const {sin, pow} = Math;\n\nmodule.exports = {\n    'test' : function(w, t, spec){\n        return spec.vol * sin(w * t);\n    },\n    '8bit' : function(w, t, spec){\n        return sin(w * t) + 1;\n    },\n    'angle' : function(w, t, spec){\n        return spec.vol * sin(w * t);\n    },\n    'tuningFork' : function(w, t, spec){\n        return spec.vol / 1.2 * (\n                sin(w * t)\n                + .2 * sin(2 * w * t)\n            );\n    },\n    // weak : .99985,\n    'piano' : function(w, t, spec){\n        return (\n                sin(w * t)\n                + .5 * sin(2 * w * t)\n                + .4 * sin(3 * w * t)\n            );\n    },\n    // weak : .99985,\n    'guitar' : function(w, t, spec){\n        return spec.vol / 2.2 * (\n                  pow(sin(w*t)       , 3)\n                + .5 * pow(sin(w*2*t), 3)\n                + .4 * pow(sin(w*3*t), 3)\n                + .3 * pow(sin(w*4*t), 3)\n            );\n    }\n}\n//http://www.phy.ntnu.edu.tw/demolab/html.php?html=teacher/sound/sound6\n\n//# sourceURL=webpack:///./src/effect.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\n// const wavBuilder = require('./wavBuilder');\nconst effect = __webpack_require__(/*! ./effect */ \"./src/effect.js\");\nconst { list, getFrequencyByName } = __webpack_require__(/*! ./kit */ \"./src/kit.js\");\n\nclass Engine {\n    constructor(options = {}) {\n        this.options = Object.assign({\n            len: 3,\n            effect: 'piano',\n            sampleRate: 44100,\n        }, options);\n        this.playList = [];\n        this.setEffect(this.options.effect);\n    }\n    setEffect(effectName) {\n        if (typeof effectName === 'function') {\n            return this.options.effect = effectName;\n        }\n        if (!effect[effectName]) {\n            throw `effect:${effectName} not found`;\n        }\n        this.options.effect = effect[effectName];\n    }\n    async buildBlob(options) {\n        return new Promise((res, rej) => {\n            let wk = new Worker('/src/worker.js');\n            wk.postMessage(options);\n            wk.onmessage = (e) => {\n                res(e.data.blob);\n            }\n            wk.onerror = (e) => rej(e);\n        });\n    }\n    async get(name, options) {\n        let f = getFrequencyByName(name);\n        return await this.buildBlob(Object.assign({ f, len: this.options.len, effect: this.options.effect.toString() }, options));\n    }\n    play(name, options) {\n        let i = this.playList.length;\n        this.playList.push(new Promise(res => {\n            this.get(name, options).then(async wav => {\n                await Promise.resolve(this.playList[i - 1]);\n                let wavUrl = URL.createObjectURL(wav);\n                let audio = new Audio;\n                audio.src = wavUrl;\n                audio.play();\n                audio.onended = () => {console.log(1);res()};\n            });\n        }));\n        return this;\n    }\n}\nwindow.onclick = () => {\n    // wav播放尾音问题\n    // effect函数问题\n    new Engine({ effect: '8bit', len: 3 }).play('C4').play('G3');\n}\n\n\n// export default \n\n\n\nmodule.exports = Engine\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/kit.js":
/*!********************!*\
  !*** ./src/kit.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("//A4 = 440hz\nconst list = [\"C\", \"#C\", \"D\", \"#D\", \"E\", \"F\", \"#F\", \"G\", \"#G\", \"A\", \"#A\", \"B\"];\nconst q = Math.pow(2, 1 / 12) || 1.06;\nconst baseAHz = 440;\nconst baseAIndex = translate('A4');\n\n\nconst Worker = function (fn, env) {\n    let functionBodyRegx = /function[^(]*\\([^)]*\\)\\s*\\{([\\s\\S]*)\\}/;\n    let contentType = { type: \"text/javascript; charset=utf-8\" };\n    let fnStr = fn.toString();\n    let code = fnStr.match(functionBodyRegx)[1];\n    let envList = [];\n    Object.keys(env).map(key => {\n        envList.push(`const ${key} = ${env[key] ? env[key].toString() : env[key]};`);\n    });\n    let URL = window.URL || window.webkitURL;\n    let url = URL.createObjectURL(new Blob([envList.join('\\n'), code], contentType));\n    return new self.Worker(url);\n}\n\nmodule.exports = {\n    list,\n    Worker,\n    getFrequency,\n    getFrequencyByName,\n    translate,\n    parseNote,\n}\n\nfunction getFrequency(noteName, level) {\n    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);\n}\nfunction getFrequencyByName(note) {\n    const [noteName, level] = parseNote(note);\n    return baseAHz * Math.pow(q, translate(noteName + level) - baseAIndex);\n}\n\n//A4 => 57, 57 => A4\nfunction translate(input) {\n    let note, level;\n    if (typeof input === 'string') {\n        let match = parseNote(input);\n        note = match[0];\n        level = match[1];\n        let index = list.indexOf(note);\n        if (index < 0) {\n            throw 'translate note: ' + note + ' error';\n        }\n        return level * 12 + index + 12;\n    }\n    else if (typeof input === 'number') {\n        input = input - 12;\n        note = input % 12;\n        level = (input / 12) | 0;\n        return list[note] + level;\n    }\n    else {\n        throw 'translate note: ' + input + ' error';\n    }\n}\n\n//A4 => A, 4\nfunction parseNote(input) {\n    let noteExp = /(#?[A-Z])(-?[\\d])/, match;\n    match = noteExp.exec(input);\n    if (!match) {\n        throw 'input error : ' + input;\n    }\n    return [match[1], match[2]];\n}\n\n\n//# sourceURL=webpack:///./src/kit.js?");

/***/ })

/******/ });