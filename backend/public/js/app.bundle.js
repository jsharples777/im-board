/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"app": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/moment/locale sync recursive ^\\.\\/.*$":
/*!**************************************************!*\
  !*** ./node_modules/moment/locale sync ^\.\/.*$ ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "./node_modules/moment/locale/af.js",
	"./af.js": "./node_modules/moment/locale/af.js",
	"./ar": "./node_modules/moment/locale/ar.js",
	"./ar-dz": "./node_modules/moment/locale/ar-dz.js",
	"./ar-dz.js": "./node_modules/moment/locale/ar-dz.js",
	"./ar-kw": "./node_modules/moment/locale/ar-kw.js",
	"./ar-kw.js": "./node_modules/moment/locale/ar-kw.js",
	"./ar-ly": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ly.js": "./node_modules/moment/locale/ar-ly.js",
	"./ar-ma": "./node_modules/moment/locale/ar-ma.js",
	"./ar-ma.js": "./node_modules/moment/locale/ar-ma.js",
	"./ar-sa": "./node_modules/moment/locale/ar-sa.js",
	"./ar-sa.js": "./node_modules/moment/locale/ar-sa.js",
	"./ar-tn": "./node_modules/moment/locale/ar-tn.js",
	"./ar-tn.js": "./node_modules/moment/locale/ar-tn.js",
	"./ar.js": "./node_modules/moment/locale/ar.js",
	"./az": "./node_modules/moment/locale/az.js",
	"./az.js": "./node_modules/moment/locale/az.js",
	"./be": "./node_modules/moment/locale/be.js",
	"./be.js": "./node_modules/moment/locale/be.js",
	"./bg": "./node_modules/moment/locale/bg.js",
	"./bg.js": "./node_modules/moment/locale/bg.js",
	"./bm": "./node_modules/moment/locale/bm.js",
	"./bm.js": "./node_modules/moment/locale/bm.js",
	"./bn": "./node_modules/moment/locale/bn.js",
	"./bn-bd": "./node_modules/moment/locale/bn-bd.js",
	"./bn-bd.js": "./node_modules/moment/locale/bn-bd.js",
	"./bn.js": "./node_modules/moment/locale/bn.js",
	"./bo": "./node_modules/moment/locale/bo.js",
	"./bo.js": "./node_modules/moment/locale/bo.js",
	"./br": "./node_modules/moment/locale/br.js",
	"./br.js": "./node_modules/moment/locale/br.js",
	"./bs": "./node_modules/moment/locale/bs.js",
	"./bs.js": "./node_modules/moment/locale/bs.js",
	"./ca": "./node_modules/moment/locale/ca.js",
	"./ca.js": "./node_modules/moment/locale/ca.js",
	"./cs": "./node_modules/moment/locale/cs.js",
	"./cs.js": "./node_modules/moment/locale/cs.js",
	"./cv": "./node_modules/moment/locale/cv.js",
	"./cv.js": "./node_modules/moment/locale/cv.js",
	"./cy": "./node_modules/moment/locale/cy.js",
	"./cy.js": "./node_modules/moment/locale/cy.js",
	"./da": "./node_modules/moment/locale/da.js",
	"./da.js": "./node_modules/moment/locale/da.js",
	"./de": "./node_modules/moment/locale/de.js",
	"./de-at": "./node_modules/moment/locale/de-at.js",
	"./de-at.js": "./node_modules/moment/locale/de-at.js",
	"./de-ch": "./node_modules/moment/locale/de-ch.js",
	"./de-ch.js": "./node_modules/moment/locale/de-ch.js",
	"./de.js": "./node_modules/moment/locale/de.js",
	"./dv": "./node_modules/moment/locale/dv.js",
	"./dv.js": "./node_modules/moment/locale/dv.js",
	"./el": "./node_modules/moment/locale/el.js",
	"./el.js": "./node_modules/moment/locale/el.js",
	"./en-au": "./node_modules/moment/locale/en-au.js",
	"./en-au.js": "./node_modules/moment/locale/en-au.js",
	"./en-ca": "./node_modules/moment/locale/en-ca.js",
	"./en-ca.js": "./node_modules/moment/locale/en-ca.js",
	"./en-gb": "./node_modules/moment/locale/en-gb.js",
	"./en-gb.js": "./node_modules/moment/locale/en-gb.js",
	"./en-ie": "./node_modules/moment/locale/en-ie.js",
	"./en-ie.js": "./node_modules/moment/locale/en-ie.js",
	"./en-il": "./node_modules/moment/locale/en-il.js",
	"./en-il.js": "./node_modules/moment/locale/en-il.js",
	"./en-in": "./node_modules/moment/locale/en-in.js",
	"./en-in.js": "./node_modules/moment/locale/en-in.js",
	"./en-nz": "./node_modules/moment/locale/en-nz.js",
	"./en-nz.js": "./node_modules/moment/locale/en-nz.js",
	"./en-sg": "./node_modules/moment/locale/en-sg.js",
	"./en-sg.js": "./node_modules/moment/locale/en-sg.js",
	"./eo": "./node_modules/moment/locale/eo.js",
	"./eo.js": "./node_modules/moment/locale/eo.js",
	"./es": "./node_modules/moment/locale/es.js",
	"./es-do": "./node_modules/moment/locale/es-do.js",
	"./es-do.js": "./node_modules/moment/locale/es-do.js",
	"./es-mx": "./node_modules/moment/locale/es-mx.js",
	"./es-mx.js": "./node_modules/moment/locale/es-mx.js",
	"./es-us": "./node_modules/moment/locale/es-us.js",
	"./es-us.js": "./node_modules/moment/locale/es-us.js",
	"./es.js": "./node_modules/moment/locale/es.js",
	"./et": "./node_modules/moment/locale/et.js",
	"./et.js": "./node_modules/moment/locale/et.js",
	"./eu": "./node_modules/moment/locale/eu.js",
	"./eu.js": "./node_modules/moment/locale/eu.js",
	"./fa": "./node_modules/moment/locale/fa.js",
	"./fa.js": "./node_modules/moment/locale/fa.js",
	"./fi": "./node_modules/moment/locale/fi.js",
	"./fi.js": "./node_modules/moment/locale/fi.js",
	"./fil": "./node_modules/moment/locale/fil.js",
	"./fil.js": "./node_modules/moment/locale/fil.js",
	"./fo": "./node_modules/moment/locale/fo.js",
	"./fo.js": "./node_modules/moment/locale/fo.js",
	"./fr": "./node_modules/moment/locale/fr.js",
	"./fr-ca": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ca.js": "./node_modules/moment/locale/fr-ca.js",
	"./fr-ch": "./node_modules/moment/locale/fr-ch.js",
	"./fr-ch.js": "./node_modules/moment/locale/fr-ch.js",
	"./fr.js": "./node_modules/moment/locale/fr.js",
	"./fy": "./node_modules/moment/locale/fy.js",
	"./fy.js": "./node_modules/moment/locale/fy.js",
	"./ga": "./node_modules/moment/locale/ga.js",
	"./ga.js": "./node_modules/moment/locale/ga.js",
	"./gd": "./node_modules/moment/locale/gd.js",
	"./gd.js": "./node_modules/moment/locale/gd.js",
	"./gl": "./node_modules/moment/locale/gl.js",
	"./gl.js": "./node_modules/moment/locale/gl.js",
	"./gom-deva": "./node_modules/moment/locale/gom-deva.js",
	"./gom-deva.js": "./node_modules/moment/locale/gom-deva.js",
	"./gom-latn": "./node_modules/moment/locale/gom-latn.js",
	"./gom-latn.js": "./node_modules/moment/locale/gom-latn.js",
	"./gu": "./node_modules/moment/locale/gu.js",
	"./gu.js": "./node_modules/moment/locale/gu.js",
	"./he": "./node_modules/moment/locale/he.js",
	"./he.js": "./node_modules/moment/locale/he.js",
	"./hi": "./node_modules/moment/locale/hi.js",
	"./hi.js": "./node_modules/moment/locale/hi.js",
	"./hr": "./node_modules/moment/locale/hr.js",
	"./hr.js": "./node_modules/moment/locale/hr.js",
	"./hu": "./node_modules/moment/locale/hu.js",
	"./hu.js": "./node_modules/moment/locale/hu.js",
	"./hy-am": "./node_modules/moment/locale/hy-am.js",
	"./hy-am.js": "./node_modules/moment/locale/hy-am.js",
	"./id": "./node_modules/moment/locale/id.js",
	"./id.js": "./node_modules/moment/locale/id.js",
	"./is": "./node_modules/moment/locale/is.js",
	"./is.js": "./node_modules/moment/locale/is.js",
	"./it": "./node_modules/moment/locale/it.js",
	"./it-ch": "./node_modules/moment/locale/it-ch.js",
	"./it-ch.js": "./node_modules/moment/locale/it-ch.js",
	"./it.js": "./node_modules/moment/locale/it.js",
	"./ja": "./node_modules/moment/locale/ja.js",
	"./ja.js": "./node_modules/moment/locale/ja.js",
	"./jv": "./node_modules/moment/locale/jv.js",
	"./jv.js": "./node_modules/moment/locale/jv.js",
	"./ka": "./node_modules/moment/locale/ka.js",
	"./ka.js": "./node_modules/moment/locale/ka.js",
	"./kk": "./node_modules/moment/locale/kk.js",
	"./kk.js": "./node_modules/moment/locale/kk.js",
	"./km": "./node_modules/moment/locale/km.js",
	"./km.js": "./node_modules/moment/locale/km.js",
	"./kn": "./node_modules/moment/locale/kn.js",
	"./kn.js": "./node_modules/moment/locale/kn.js",
	"./ko": "./node_modules/moment/locale/ko.js",
	"./ko.js": "./node_modules/moment/locale/ko.js",
	"./ku": "./node_modules/moment/locale/ku.js",
	"./ku.js": "./node_modules/moment/locale/ku.js",
	"./ky": "./node_modules/moment/locale/ky.js",
	"./ky.js": "./node_modules/moment/locale/ky.js",
	"./lb": "./node_modules/moment/locale/lb.js",
	"./lb.js": "./node_modules/moment/locale/lb.js",
	"./lo": "./node_modules/moment/locale/lo.js",
	"./lo.js": "./node_modules/moment/locale/lo.js",
	"./lt": "./node_modules/moment/locale/lt.js",
	"./lt.js": "./node_modules/moment/locale/lt.js",
	"./lv": "./node_modules/moment/locale/lv.js",
	"./lv.js": "./node_modules/moment/locale/lv.js",
	"./me": "./node_modules/moment/locale/me.js",
	"./me.js": "./node_modules/moment/locale/me.js",
	"./mi": "./node_modules/moment/locale/mi.js",
	"./mi.js": "./node_modules/moment/locale/mi.js",
	"./mk": "./node_modules/moment/locale/mk.js",
	"./mk.js": "./node_modules/moment/locale/mk.js",
	"./ml": "./node_modules/moment/locale/ml.js",
	"./ml.js": "./node_modules/moment/locale/ml.js",
	"./mn": "./node_modules/moment/locale/mn.js",
	"./mn.js": "./node_modules/moment/locale/mn.js",
	"./mr": "./node_modules/moment/locale/mr.js",
	"./mr.js": "./node_modules/moment/locale/mr.js",
	"./ms": "./node_modules/moment/locale/ms.js",
	"./ms-my": "./node_modules/moment/locale/ms-my.js",
	"./ms-my.js": "./node_modules/moment/locale/ms-my.js",
	"./ms.js": "./node_modules/moment/locale/ms.js",
	"./mt": "./node_modules/moment/locale/mt.js",
	"./mt.js": "./node_modules/moment/locale/mt.js",
	"./my": "./node_modules/moment/locale/my.js",
	"./my.js": "./node_modules/moment/locale/my.js",
	"./nb": "./node_modules/moment/locale/nb.js",
	"./nb.js": "./node_modules/moment/locale/nb.js",
	"./ne": "./node_modules/moment/locale/ne.js",
	"./ne.js": "./node_modules/moment/locale/ne.js",
	"./nl": "./node_modules/moment/locale/nl.js",
	"./nl-be": "./node_modules/moment/locale/nl-be.js",
	"./nl-be.js": "./node_modules/moment/locale/nl-be.js",
	"./nl.js": "./node_modules/moment/locale/nl.js",
	"./nn": "./node_modules/moment/locale/nn.js",
	"./nn.js": "./node_modules/moment/locale/nn.js",
	"./oc-lnc": "./node_modules/moment/locale/oc-lnc.js",
	"./oc-lnc.js": "./node_modules/moment/locale/oc-lnc.js",
	"./pa-in": "./node_modules/moment/locale/pa-in.js",
	"./pa-in.js": "./node_modules/moment/locale/pa-in.js",
	"./pl": "./node_modules/moment/locale/pl.js",
	"./pl.js": "./node_modules/moment/locale/pl.js",
	"./pt": "./node_modules/moment/locale/pt.js",
	"./pt-br": "./node_modules/moment/locale/pt-br.js",
	"./pt-br.js": "./node_modules/moment/locale/pt-br.js",
	"./pt.js": "./node_modules/moment/locale/pt.js",
	"./ro": "./node_modules/moment/locale/ro.js",
	"./ro.js": "./node_modules/moment/locale/ro.js",
	"./ru": "./node_modules/moment/locale/ru.js",
	"./ru.js": "./node_modules/moment/locale/ru.js",
	"./sd": "./node_modules/moment/locale/sd.js",
	"./sd.js": "./node_modules/moment/locale/sd.js",
	"./se": "./node_modules/moment/locale/se.js",
	"./se.js": "./node_modules/moment/locale/se.js",
	"./si": "./node_modules/moment/locale/si.js",
	"./si.js": "./node_modules/moment/locale/si.js",
	"./sk": "./node_modules/moment/locale/sk.js",
	"./sk.js": "./node_modules/moment/locale/sk.js",
	"./sl": "./node_modules/moment/locale/sl.js",
	"./sl.js": "./node_modules/moment/locale/sl.js",
	"./sq": "./node_modules/moment/locale/sq.js",
	"./sq.js": "./node_modules/moment/locale/sq.js",
	"./sr": "./node_modules/moment/locale/sr.js",
	"./sr-cyrl": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "./node_modules/moment/locale/sr-cyrl.js",
	"./sr.js": "./node_modules/moment/locale/sr.js",
	"./ss": "./node_modules/moment/locale/ss.js",
	"./ss.js": "./node_modules/moment/locale/ss.js",
	"./sv": "./node_modules/moment/locale/sv.js",
	"./sv.js": "./node_modules/moment/locale/sv.js",
	"./sw": "./node_modules/moment/locale/sw.js",
	"./sw.js": "./node_modules/moment/locale/sw.js",
	"./ta": "./node_modules/moment/locale/ta.js",
	"./ta.js": "./node_modules/moment/locale/ta.js",
	"./te": "./node_modules/moment/locale/te.js",
	"./te.js": "./node_modules/moment/locale/te.js",
	"./tet": "./node_modules/moment/locale/tet.js",
	"./tet.js": "./node_modules/moment/locale/tet.js",
	"./tg": "./node_modules/moment/locale/tg.js",
	"./tg.js": "./node_modules/moment/locale/tg.js",
	"./th": "./node_modules/moment/locale/th.js",
	"./th.js": "./node_modules/moment/locale/th.js",
	"./tk": "./node_modules/moment/locale/tk.js",
	"./tk.js": "./node_modules/moment/locale/tk.js",
	"./tl-ph": "./node_modules/moment/locale/tl-ph.js",
	"./tl-ph.js": "./node_modules/moment/locale/tl-ph.js",
	"./tlh": "./node_modules/moment/locale/tlh.js",
	"./tlh.js": "./node_modules/moment/locale/tlh.js",
	"./tr": "./node_modules/moment/locale/tr.js",
	"./tr.js": "./node_modules/moment/locale/tr.js",
	"./tzl": "./node_modules/moment/locale/tzl.js",
	"./tzl.js": "./node_modules/moment/locale/tzl.js",
	"./tzm": "./node_modules/moment/locale/tzm.js",
	"./tzm-latn": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm-latn.js": "./node_modules/moment/locale/tzm-latn.js",
	"./tzm.js": "./node_modules/moment/locale/tzm.js",
	"./ug-cn": "./node_modules/moment/locale/ug-cn.js",
	"./ug-cn.js": "./node_modules/moment/locale/ug-cn.js",
	"./uk": "./node_modules/moment/locale/uk.js",
	"./uk.js": "./node_modules/moment/locale/uk.js",
	"./ur": "./node_modules/moment/locale/ur.js",
	"./ur.js": "./node_modules/moment/locale/ur.js",
	"./uz": "./node_modules/moment/locale/uz.js",
	"./uz-latn": "./node_modules/moment/locale/uz-latn.js",
	"./uz-latn.js": "./node_modules/moment/locale/uz-latn.js",
	"./uz.js": "./node_modules/moment/locale/uz.js",
	"./vi": "./node_modules/moment/locale/vi.js",
	"./vi.js": "./node_modules/moment/locale/vi.js",
	"./x-pseudo": "./node_modules/moment/locale/x-pseudo.js",
	"./x-pseudo.js": "./node_modules/moment/locale/x-pseudo.js",
	"./yo": "./node_modules/moment/locale/yo.js",
	"./yo.js": "./node_modules/moment/locale/yo.js",
	"./zh-cn": "./node_modules/moment/locale/zh-cn.js",
	"./zh-cn.js": "./node_modules/moment/locale/zh-cn.js",
	"./zh-hk": "./node_modules/moment/locale/zh-hk.js",
	"./zh-hk.js": "./node_modules/moment/locale/zh-hk.js",
	"./zh-mo": "./node_modules/moment/locale/zh-mo.js",
	"./zh-mo.js": "./node_modules/moment/locale/zh-mo.js",
	"./zh-tw": "./node_modules/moment/locale/zh-tw.js",
	"./zh-tw.js": "./node_modules/moment/locale/zh-tw.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/moment/locale sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/App.tsx":
/*!*********************!*\
  !*** ./src/App.tsx ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Controller */ "./src/Controller.ts");
/* harmony import */ var _component_CommentSidebarView__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./component/CommentSidebarView */ "./src/component/CommentSidebarView.ts");
/* harmony import */ var _component_BlogEntryView__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./component/BlogEntryView */ "./src/component/BlogEntryView.tsx");
/* harmony import */ var _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./util/EqualityFunctions */ "./src/util/EqualityFunctions.ts");
/* harmony import */ var _component_DetailsSidebarView__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./component/DetailsSidebarView */ "./src/component/DetailsSidebarView.ts");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/* eslint "react/react-in-jsx-scope":"off" */

/* eslint "react/jsx-no-undef":"off" */









var logger = debug__WEBPACK_IMPORTED_MODULE_2___default()('app');

var Root = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Root, _React$Component);

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  function Root() {
    var _this;

    // @ts-ignore
    _this = _React$Component.call(this) || this;
    _this.state = {
      isLoggedIn: false,
      loggedInUserId: -1,
      entries: [],
      selectedEntry: {},
      applyUserFilter: false,
      stateNames: {
        users: 'users',
        entries: 'entries',
        comments: 'comments',
        selectedEntry: 'selectedEntry'
      },
      apis: {
        users: '/users',
        entries: '/blog',
        entry: '/blog',
        comments: '/comment',
        login: '/login'
      },
      ui: {
        alert: {
          modalId: "alert",
          titleId: "alert-title",
          contentId: "alert-content",
          cancelButtonId: "alert-cancel",
          confirmButtonId: "alert-confirm",
          closeButtonId: "alert-close",
          hideClass: "d-none",
          showClass: "d-block"
        },
        navigation: {
          showMyEntriesId: 'navigationItemDashboard',
          addNewEntryId: 'navigationItemAddNewEntry',
          showAllEntriesId: 'navigationItemShowAll'
        },
        blogEntry: {},
        entryDetailsSideBar: {
          dom: {
            sideBarId: 'detailsSideBar',
            formId: 'details',
            titleId: 'title',
            contentId: 'content',
            changedOnId: 'changedOn',
            resultDataKeyId: 'id',
            isDraggable: false,
            isClickable: true
          }
        },
        commentSideBar: {
          dom: {
            sideBarId: 'commentSideBar',
            headerId: 'commentHeader',
            resultsId: 'comments',
            resultsElementType: 'button',
            resultsElementAttributes: [['type', 'button']],
            resultsClasses: 'list-group-item my-list-item truncate-comment list-group-item-action',
            resultDataKeyId: 'id',
            resultLegacyDataKeyId: 'id',
            modifierClassNormal: 'float-right list-group-item-primary text-right',
            modifierClassInactive: 'float-left list-group-item-dark text-left',
            modifierClassActive: 'list-group-item-primary',
            modifierClassWarning: 'list-group-item-warning',
            iconNormal: '<i class="fas fa-trash-alt"></i>',
            iconInactive: '',
            iconActive: '',
            iconWarning: '',
            isDraggable: false,
            isClickable: true,
            newFormId: "newComment",
            commentId: "comment",
            submitCommentId: "submitComment"
          }
        }
      },
      uiPrefs: {
        navigation: {},
        blogEntry: {},
        commentSideBar: {
          view: {
            location: 'right',
            expandedSize: '50%'
          }
        },
        entryDetailsSideBar: {
          view: {
            location: 'left',
            expandedSize: '35%'
          }
        }
      },
      controller: {
        events: {
          entry: {
            eventDataKeyId: 'entry-id'
          }
        },
        dataLimit: {}
      }
    }; // event handlers

    _this.cancelDelete = _this.cancelDelete.bind(_assertThisInitialized(_this));
    _this.confirmDelete = _this.confirmDelete.bind(_assertThisInitialized(_this));
    _this.handleShowMyEntries = _this.handleShowMyEntries.bind(_assertThisInitialized(_this));
    _this.handleSelectEntryComments = _this.handleSelectEntryComments.bind(_assertThisInitialized(_this));
    _this.handleShowEditEntry = _this.handleShowEditEntry.bind(_assertThisInitialized(_this));
    _this.handleUpdateEntry = _this.handleUpdateEntry.bind(_assertThisInitialized(_this));
    _this.handleAddEntry = _this.handleAddEntry.bind(_assertThisInitialized(_this));
    _this.handleAddComment = _this.handleAddComment.bind(_assertThisInitialized(_this));
    _this.handleDeleteEntry = _this.handleDeleteEntry.bind(_assertThisInitialized(_this));
    _this.handleDeleteComment = _this.handleDeleteComment.bind(_assertThisInitialized(_this));
    _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].connectToApplication(_assertThisInitialized(_this), window.localStorage);
    return _this;
  }

  var _proto = Root.prototype;

  _proto.getCurrentUser = function getCurrentUser() {
    return _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId();
  };

  _proto.alert = function alert(title, content) {
    this.titleEl.textContent = title;
    this.contentEl.textContent = content; // @ts-ignore

    this.modalEl.classList.remove(this.state.ui.alert.hideClass); // @ts-ignore

    this.modalEl.classList.add(this.state.ui.alert.showClass);
  };

  _proto.render = function render() {
    var _this2 = this;

    logger("Rendering App"); // @ts-ignore

    logger(this.state.entries); // @ts-ignore

    logger(this.state.applyUserFilter); // @ts-ignore

    var entriesToDisplay = this.state.entries; // @ts-ignore

    if (this.state.applyUserFilter && _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].isLoggedIn() && _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId() > 0) {
      entriesToDisplay = entriesToDisplay.filter(function (entry) {
        return entry.createdBy === _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId();
      });
    }

    var blog = entriesToDisplay.map(function (entry, index) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component_BlogEntryView__WEBPACK_IMPORTED_MODULE_6__["default"], {
        key: index,
        entry: entry,
        showCommentsHandler: _this2.handleSelectEntryComments,
        editEntryHandler: _this2.handleShowEditEntry,
        deleteEntryHandler: _this2.handleDeleteEntry,
        config: _this2.state
      });
    });
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "Root row ml-1"
    }, blog);
  };

  _proto.cancelDelete = function cancelDelete(event) {
    // @ts-ignore
    this.modalEl.classList.remove(this.state.ui.alert.showClass); // @ts-ignore

    this.modalEl.classList.add(this.state.ui.alert.hideClass);
    event.preventDefault();
  };

  _proto.confirmDelete = function confirmDelete(event) {
    // @ts-ignore
    this.modalEl.classList.remove(this.state.ui.alert.showClass); // @ts-ignore

    this.modalEl.classList.add(this.state.ui.alert.hideClass);
    event.preventDefault(); // @ts-ignore

    var entryId = this.modalEl.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Delete Entry " + entryId);

    if (entryId) {
      // find the entry from the state manager
      entryId = parseInt(entryId); // @ts-ignore

      var entry = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);

      if (entry) {
        // delete the entry using the controller and remove the state manager
        _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].deleteEntry(entry); // @ts-ignore

        _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().removeItemFromState(this.state.stateNames.entries, entry, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);
      }
    }
  };

  _proto.componentDidMount = /*#__PURE__*/function () {
    var _componentDidMount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              logger('component Did Mount'); // add the additional views and configure them

              this.commentView = new _component_CommentSidebarView__WEBPACK_IMPORTED_MODULE_5__["default"](this, document, _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager());
              this.commentView.onDocumentLoaded(); // reset the view state

              this.detailsView = new _component_DetailsSidebarView__WEBPACK_IMPORTED_MODULE_8__["default"](this, document, _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager());
              this.detailsView.onDocumentLoaded(); // navigation item handlers

              if (document) {
                // @ts-ignore
                document.getElementById(this.state.ui.navigation.addNewEntryId).addEventListener('click', this.handleAddEntry); // @ts-ignore

                document.getElementById(this.state.ui.navigation.showMyEntriesId).addEventListener('click', this.handleShowMyEntries);
              } // alert modal dialog setup
              // @ts-ignore


              this.modalEl = document.getElementById(this.state.ui.alert.modalId); // @ts-ignore

              this.titleEl = document.getElementById(this.state.ui.alert.titleId); // @ts-ignore

              this.contentEl = document.getElementById(this.state.ui.alert.contentId); // @ts-ignore

              this.cancelBtnEl = document.getElementById(this.state.ui.alert.cancelButtonId); // @ts-ignore

              this.confirmBtnEl = document.getElementById(this.state.ui.alert.confirmButtonId); // @ts-ignore

              this.closeBtnEl = document.getElementById(this.state.ui.alert.closeButtonId); // event listeners for the confirm delete of entry

              if (this.cancelBtnEl) this.cancelBtnEl.addEventListener('click', this.cancelDelete);
              if (this.confirmBtnEl) this.confirmBtnEl.addEventListener('click', this.confirmDelete);
              if (this.closeBtnEl) this.closeBtnEl.addEventListener('click', this.cancelDelete); // ok lets try get things done

              _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].initialise();

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function componentDidMount() {
      return _componentDidMount.apply(this, arguments);
    }

    return componentDidMount;
  }();

  _proto.hideAllSideBars = function hideAllSideBars() {
    this.commentView.eventHide(null);
    this.detailsView.eventHide(null);
  };

  _proto.handleShowMyEntries = function handleShowMyEntries(event) {
    logger('Handling Show My Entries');
    this.hideAllSideBars();

    if (!_Controller__WEBPACK_IMPORTED_MODULE_4__["default"].isLoggedIn()) {
      // @ts-ignore
      window.location.href = this.state.apis.login;
      return;
    }

    this.setState({
      applyUserFilter: true
    });
  };

  _proto.handleAllEntries = function handleAllEntries(event) {
    logger('Handling Show All Entries');
    this.setState({
      applyUserFilter: false
    });
    this.hideAllSideBars();
  };

  _proto.handleAddEntry = function handleAddEntry(event) {
    logger('Handling Add Entry');
    event.preventDefault();
    this.hideAllSideBars(); // prevent anything from happening if we are not logged in

    if (!_Controller__WEBPACK_IMPORTED_MODULE_4__["default"].isLoggedIn()) {
      // @ts-ignore
      window.location.href = this.state.apis.login;
      return;
    } // find the current user
    // @ts-ignore


    var creator = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(this.state.stateNames.users, {
      id: _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId()
    }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);
    logger(creator); // create an empty entry

    var entry = {
      title: '',
      content: '',
      createdBy: creator.id,
      changedOn: parseInt(moment__WEBPACK_IMPORTED_MODULE_3___default()().format('YYYYMMDDHHmmss')),
      Comments: [],
      User: {
        id: creator.id,
        username: creator.username
      }
    };
    logger(entry);
    this.setState({
      selectedEntry: entry
    }); // @ts-ignore

    _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().setStateByName(this.state.stateNames.selectedEntry, entry);
    this.detailsView.eventShow(event);
  };

  _proto.handleAddComment = function handleAddComment(event) {
    logger('Handling Add Comment');
    event.preventDefault(); // get the comment element
    // @ts-ignore

    var commentEl = document.getElementById(this.state.ui.commentSideBar.dom.commentId);
    if (commentEl && commentEl.value.trim().length === 0) return; // prevent anything from happening if we are not logged in

    if (!_Controller__WEBPACK_IMPORTED_MODULE_4__["default"].isLoggedIn()) {
      // @ts-ignore
      window.location.href = this.state.apis.login;
      return;
    } // find the current user
    // @ts-ignore


    var creator = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(this.state.stateNames.users, {
      id: _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId()
    }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);
    logger(creator); // find the selected entry
    // @ts-ignore

    var entry = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().getStateByName(this.state.stateNames.selectedEntry);

    if (entry && commentEl) {
      // create an empty comment
      // @ts-ignore
      var comment = {
        createdBy: creator.id,
        commentOn: entry.id,
        changedOn: parseInt(moment__WEBPACK_IMPORTED_MODULE_3___default()().format('YYYYMMDDHHmmss')),
        content: commentEl.value.trim()
      };
      commentEl.value = '';
      _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].addComment(comment);
      logger(comment);
    }
  };

  _proto.handleSelectEntryComments = function handleSelectEntryComments(event) {
    logger('Handling Select Entry Comments');
    event.preventDefault();
    this.hideAllSideBars(); // @ts-ignore

    var entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Show Edit Entry " + entryId);

    if (entryId) {
      // find the entry from the state manager
      entryId = parseInt(entryId); // @ts-ignore

      var entry = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);
      logger(entry);

      if (entry) {
        // select the entry and open the details sidebar
        this.setState({
          selectedEntry: entry
        }); // @ts-ignore

        _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().setStateByName(this.state.stateNames.selectedEntry, entry);
        this.commentView.eventShow(event);
      }
    }
  };

  _proto.handleShowEditEntry = function handleShowEditEntry(event) {
    event.preventDefault();
    this.hideAllSideBars(); // @ts-ignore

    var entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Show Edit Entry " + entryId);

    if (entryId) {
      // find the entry from the state manager
      entryId = parseInt(entryId); // @ts-ignore

      var entry = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);
      logger(entry);

      if (entry) {
        // select the entry and open the details sidebar
        this.setState({
          selectedEntry: entry
        }); // @ts-ignore

        _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().setStateByName(this.state.stateNames.selectedEntry, entry);
        this.detailsView.eventShow(event);
      }
    }
  };

  _proto.handleDeleteEntry = function handleDeleteEntry(event) {
    event.preventDefault();
    this.hideAllSideBars(); // @ts-ignore

    var entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
    logger("Handling Delete Entry " + entryId);

    if (entryId) {
      // @ts-ignore
      this.modalEl.setAttribute(this.state.controller.events.entry.eventDataKeyId, entryId); // find the entry from the state manager

      entryId = parseInt(entryId); // @ts-ignore

      var entry = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(this.state.stateNames.entries, {
        id: entryId
      }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_7__["isSame"]);
      this.alert(entry.title, "Are you sure you want to delete this blog entry?");
    }
  };

  _proto.handleDeleteComment = function handleDeleteComment(id) {
    _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].deleteComment(id);
  } // @ts-ignore
  ;

  _proto.handleUpdateEntry = function handleUpdateEntry(entry) {
    this.hideAllSideBars();
    _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].updateEntry(entry);
  };

  return Root;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component); //localStorage.debug = 'app view-ts controller-ts socket-ts api-ts local-storage-ts state-manager-ts view-ts:blogentry view-ts:comments view-ts:details';
//localStorage.debug = 'app controller-ts socket-ts api-ts local-storage-ts state-manager-ts indexeddb-ts state-manager-ms state-manager-api state-manager-aggregate state-manager-async';


localStorage.debug = 'controller-ts state-manager-ts state-manager-ms state-manager-aggregate state-manager-async';
debug__WEBPACK_IMPORTED_MODULE_2___default.a.log = console.info.bind(console); // @ts-ignore

var element = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Root, {
  className: "container-fluid justify-content-around"
});
react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(element, document.getElementById('root'));

/***/ }),

/***/ "./src/Controller.ts":
/*!***************************!*\
  !*** ./src/Controller.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _state_MemoryStateManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state/MemoryStateManager */ "./src/state/MemoryStateManager.ts");
/* harmony import */ var _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/EqualityFunctions */ "./src/util/EqualityFunctions.ts");
/* harmony import */ var _socket_SocketManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./socket/SocketManager */ "./src/socket/SocketManager.ts");
/* harmony import */ var _state_AggregateStateManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./state/AggregateStateManager */ "./src/state/AggregateStateManager.ts");
/* harmony import */ var _state_BrowserStorageStateManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state/BrowserStorageStateManager */ "./src/state/BrowserStorageStateManager.ts");
/* harmony import */ var _state_RESTApiStateManager__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./state/RESTApiStateManager */ "./src/state/RESTApiStateManager.ts");
/* harmony import */ var _state_AsyncStateManagerWrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./state/AsyncStateManagerWrapper */ "./src/state/AsyncStateManagerWrapper.ts");








var cLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('controller-ts');

var Controller = /*#__PURE__*/function () {
  function Controller() {
    this.stateManager = _state_AggregateStateManager__WEBPACK_IMPORTED_MODULE_4__["AggregateStateManager"].getInstance();
  }

  var _proto = Controller.prototype;

  _proto.connectToApplication = function connectToApplication(applicationView, clientSideStorage) {
    this.applicationView = applicationView;
    this.clientSideStorage = clientSideStorage;
    this.config = this.applicationView.state;
    var aggregateStateManager = _state_AggregateStateManager__WEBPACK_IMPORTED_MODULE_4__["AggregateStateManager"].getInstance(); // store information in local storage, indexeddb, and memory

    aggregateStateManager.addStateManager(_state_MemoryStateManager__WEBPACK_IMPORTED_MODULE_1__["default"].getInstance());
    aggregateStateManager.addStateManager(_state_BrowserStorageStateManager__WEBPACK_IMPORTED_MODULE_5__["default"].getInstance());
    var objectStores = [{
      name: this.config.stateNames.users,
      keyField: 'id'
    }, {
      name: this.config.stateNames.entries,
      keyField: 'id'
    }, {
      name: this.config.stateNames.comments,
      keyField: 'id'
    }]; // let indexedDBStateManager = IndexedDBStateManager.getInstance();
    // indexedDBStateManager.initialise(objectStores).then((result) => {
    //     cLogger('indexed DB setup');
    // });
    // aggregateStateManager.addStateManager(indexedDBStateManager,['selectedEntry']);

    var restAPIStateManager = _state_RESTApiStateManager__WEBPACK_IMPORTED_MODULE_6__["RESTApiStateManager"].getInstance();
    restAPIStateManager.initialise([{
      stateName: this.config.stateNames.users,
      serverURL: this.getServerAPIURL(),
      api: this.config.apis.users,
      isActive: true
    }, {
      stateName: this.config.stateNames.entries,
      serverURL: this.getServerAPIURL(),
      api: this.config.apis.entries,
      isActive: true
    }, {
      stateName: this.config.stateNames.comments,
      serverURL: this.getServerAPIURL(),
      api: this.config.apis.comments,
      isActive: true
    }]);
    var asyncSM = new _state_AsyncStateManagerWrapper__WEBPACK_IMPORTED_MODULE_7__["default"](aggregateStateManager, restAPIStateManager); // link the REST API calls to the Aggregate SM

    aggregateStateManager.addStateManager(asyncSM, ['selectedEntry']); // setup Async callbacks for the fetch requests
    // this.callbackForUsers = this.callbackForUsers.bind(this);
    // this.callbackForEntries = this.callbackForEntries.bind(this);
    // this.callbackForCreateEntry = this.callbackForCreateEntry.bind(this);
    // this.callbackForCreateComment = this.callbackForCreateComment.bind(this);
    // state listener

    this.stateChanged = this.stateChanged.bind(this);
    this.stateChangedItemAdded = this.stateChangedItemAdded.bind(this);
    this.stateChangedItemRemoved = this.stateChangedItemRemoved.bind(this);
    this.stateChangedItemUpdated = this.stateChangedItemUpdated.bind(this);
    this.getStateManager().addChangeListenerForName(this.config.stateNames.entries, this);
    this.getStateManager().addChangeListenerForName(this.config.stateNames.comments, this);
    return this;
  }
  /*
  Get the base data for the application (users, entries)
  */
  ;

  _proto.initialise = function initialise() {
    cLogger('Initialising data state'); // listen for socket events

    _socket_SocketManager__WEBPACK_IMPORTED_MODULE_3__["default"].setListener(this); // load the users

    this.getStateManager().getStateByName(this.config.stateNames.users); // load the entries

    this.getStateManager().getStateByName(this.config.stateNames.entries); // load the comments

    this.getStateManager().getStateByName(this.config.stateNames.comments);
  };

  _proto.getStateManager = function getStateManager() {
    return this.stateManager;
  }
  /*
  *
  * Call back functions for database operations
  *
   */
  // private callbackForUsers(data: any, status: number) {
  //     cLogger('callback for all users');
  //     let users:User[] = [];
  //     if (status >= 200 && status <= 299) { // do we have any data?
  //         cLogger(data);
  //         // covert the data to the AppType User
  //         data.forEach((cbUser:any) => {
  //             let user:User = {
  //                 id:cbUser.id,
  //                 username:cbUser.username
  //             }
  //             users.push(user);
  //         });
  //     }
  //     this.getStateManager().setStateByName(this.config.stateNames.users, users);
  // }
  // private static convertJSONCommentToComment(jsonComment:any):Comment {
  //     let comment:Comment = {
  //         id:jsonComment.id,
  //         content:jsonComment.content,
  //         createdBy:jsonComment.createdBy,
  //         changedOn:jsonComment.changedOn,
  //         commentOn:jsonComment.commentOn,
  //     };
  //     return comment;
  // }
  //
  // private static convertJSONUserToUser(jsonUser:any):User {
  //     let user:User = {
  //         id:jsonUser.id,
  //         username:jsonUser.username,
  //     }
  //     return user;
  // }
  //
  // private static convertJSONEntryToBlogEntry(jsonEntry:any):BlogEntry {
  //     let entry:BlogEntry = {
  //         id: jsonEntry.id,
  //         title:jsonEntry.title,
  //         content:jsonEntry.content,
  //         createdBy:jsonEntry.createdBy,
  //         changedOn:jsonEntry.changedOn,
  //         User:null,
  //         Comments:[],
  //     }
  //     const cbUser:User|null = jsonEntry.user;
  //     if (cbUser) {
  //         entry.User = Controller.convertJSONUserToUser(cbUser);
  //     }
  //     const cbComments:Comment[]|null = jsonEntry.comments;
  //     if (cbComments) {
  //         cbComments.forEach((cbComment:any) => {
  //             let comment = Controller.convertJSONCommentToComment(cbComment);
  //             entry.Comments.push(comment);
  //         });
  //     }
  //     return entry;
  // }
  //
  // private callbackForEntries(data: any, status: number, stateName:string) {
  //     cLogger('callback for all entries');
  //     let entries:BlogEntry[] = [];
  //     if (status >= 200 && status <= 299) { // do we have any data?
  //         cLogger(data);
  //         data.forEach((cbEntry:any) => {
  //             let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(cbEntry);
  //             entries.push(entry);
  //         });
  //     }
  //     this.getStateManager().setStateByName(this.config.stateNames.entries, entries);
  // }
  //
  // private callbackForCreateEntry(data: any, status: number, stateName:string) {
  //     cLogger('callback for create entry');
  //     if (status >= 200 && status <= 299) { // do we have any data?
  //         cLogger(data);
  //         let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(data);
  //         this.getStateManager().addNewItemToState(this.config.stateNames.entries, entry);
  //     }
  // }
  //
  // private callbackForCreateComment(data: any, status: number, stateName:string) {
  //     cLogger('callback for create comment');
  //     if (status >= 200 && status <= 299) { // do we have any data?
  //         let comment:Comment = Controller.convertJSONCommentToComment(data);
  //         cLogger(comment);
  //         // find the corresponding entry in state
  //         let entry = <BlogEntry|null>this.getStateManager().findItemInState(this.config.stateNames.entries, {id: comment.commentOn}, isSame);
  //         cLogger(entry);
  //         if (entry) {
  //             cLogger('callback for create comment - updating entry');
  //             // update the entry with the new comment
  //             entry.Comments.push(comment);
  //             // update the entry in the state manager
  //             this.getStateManager().updateItemInState(this.config.stateNames.entries, entry, isSame);
  //             // reselect the same entry
  //             this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, entry);
  //             cLogger(entry);
  //         }
  //     }
  //
  // }

  /*
  *
  *   API calls
  *
   */
  // private getAllUsers(): void {
  //     cLogger('Getting All Users');
  //     const jsonRequest: jsonRequest = {
  //         url: this.getServerAPIURL() + this.config.apis.users,
  //         type: RequestType.GET,
  //         params: {},
  //         callback: this.callbackForUsers,
  //         associatedStateName: this.config.apis.users
  //     };
  //     downloader.addApiRequest(jsonRequest, true);
  // }
  //
  // private getAllEntries(): void {
  //     cLogger('Getting All Entries');
  //     const jsonRequest: jsonRequest = {
  //         url: this.getServerAPIURL() + this.config.apis.entries,
  //         type: RequestType.GET,
  //         params: {},
  //         callback: this.callbackForEntries,
  //         associatedStateName: this.config.apis.entries
  //     };
  //     downloader.addApiRequest(jsonRequest, true);
  // }
  //
  // private apiDeleteComment(id: number):void {
  //     const deleteCommentCB = function (data: any, status: number, stateName:string) {
  //         cLogger('callback for delete comment');
  //         if (status >= 200 && status <= 299) { // do we have any data?
  //             cLogger(data);
  //         }
  //     }
  //
  //
  //     const jsonRequest: jsonRequest = {
  //         url: this.getServerAPIURL() + this.config.apis.comment,
  //         type: RequestType.DELETE,
  //         params: {
  //             id: id
  //         },
  //         callback: deleteCommentCB,
  //         associatedStateName: ''
  //     };
  //     downloader.addApiRequest(jsonRequest);
  //
  // }
  //
  // private apiDeleteEntry(entry: BlogEntry):void {
  //     const deleteCB = function (data: any, status: number, stateName:string) {
  //         cLogger('callback for delete entry');
  //         if (status >= 200 && status <= 299) { // do we have any data?
  //             cLogger(data);
  //         }
  //     }
  //
  //     if (entry) {
  //         const jsonRequest:jsonRequest = {
  //             url: this.getServerAPIURL() + this.config.apis.entries,
  //             type: RequestType.DELETE,
  //             params: {
  //                 id: entry.id
  //             },
  //             callback: deleteCB,
  //             associatedStateName: this.config.apis.entries
  //         };
  //         downloader.addApiRequest(jsonRequest);
  //     }
  // }
  //
  // private apiCreateEntry(entry:BlogEntry):void {
  //     if (entry) {
  //         const jsonRequest:jsonRequest = {
  //             url: this.getServerAPIURL() + this.config.apis.entries,
  //             type: RequestType.POST,
  //             params: entry,
  //             callback: this.callbackForCreateEntry,
  //             associatedStateName: this.config.apis.entries
  //         };
  //         downloader.addApiRequest(jsonRequest, true);
  //     }
  // }
  //
  // private apiCreateComment(comment:Comment):void {
  //     if (comment) {
  //         const jsonRequest:jsonRequest = {
  //             url: this.getServerAPIURL() + this.config.apis.comment,
  //             type: RequestType.POST,
  //             params: comment,
  //             callback: this.callbackForCreateComment,
  //             associatedStateName: ''
  //         };
  //         downloader.addApiRequest(jsonRequest, true);
  //     }
  // }
  //
  // private apiUpdateEntry(entry:BlogEntry):void {
  //     const updateCB = function (data: any, status: number, stateName:string) {
  //         cLogger('callback for update entry');
  //         if (status >= 200 && status <= 299) { // do we have any data?
  //             cLogger(data);
  //         }
  //     }
  //
  //     if (entry) {
  //         const jsonRequest:jsonRequest = {
  //             url: this.getServerAPIURL() + this.config.apis.entries,
  //             type: RequestType.PUT,
  //             params: entry,
  //             callback: updateCB,
  //             associatedStateName: this.config.apis.entries
  //         };
  //         downloader.addApiRequest(jsonRequest);
  //     }
  // }

  /*
  *
  * Simple Application state (URL, logged in user)
  *
   */
  ;

  _proto.getServerAPIURL = function getServerAPIURL() {
    var result = "/api"; // @ts-ignore

    if (window.ENV && window.ENV.serverURL) {
      // @ts-ignore
      result = window.ENV.serverURL;
    }

    return result;
  };

  _proto.isLoggedIn = function isLoggedIn() {
    var isLoggedIn = false;

    try {
      // @ts-ignore
      if (loggedInUserId) {
        isLoggedIn = true;
      }
    } catch (error) {}

    return isLoggedIn;
  };

  _proto.getLoggedInUserId = function getLoggedInUserId() {
    var result = -1;

    try {
      // @ts-ignore
      if (loggedInUserId) {
        // @ts-ignore
        result = loggedInUserId;
      }
    } catch (error) {}

    return result;
  } // Lets delete a comment
  ;

  _proto.deleteComment = function deleteComment(id) {
    var entry = this.getStateManager().getStateByName(this.config.stateNames.selectedEntry);

    if (entry) {
      cLogger("Handling delete comment for " + entry.id + " and comment " + id); // find the comment in the entry and remove it from the state

      var comments = this.getStateManager().getStateByName(this.config.stateNames.comments);
      var foundIndex = comments.findIndex(function (element) {
        return element.id === id;
      });

      if (foundIndex >= 0) {
        // remove comment from the array
        cLogger('Found comment in state - removing');
        this.getStateManager().removeItemFromState(this.config.stateNames.comments, {
          id: id
        }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_2__["isSame"]); // update the statement manager

        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, entry);
      }
    }
  };

  _proto.deleteEntry = function deleteEntry(entry) {
    if (entry) {
      cLogger("Handling delete entry for " + entry.id); // update the state manager

      this.getStateManager().removeItemFromState(this.config.stateNames.entries, entry, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_2__["isSame"]);
    }
  };

  _proto.updateEntry = function updateEntry(entry) {
    if (entry) {
      cLogger(entry);

      if (entry.id) {
        cLogger("Handling update for entry " + entry.id); // update the state manager

        this.getStateManager().updateItemInState(this.config.stateNames.entries, entry, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_2__["isSame"]);
      } else {
        cLogger("Handling create for entry");
        this.getStateManager().addNewItemToState(this.config.stateNames.entries, entry);
      }
    }
  };

  _proto.addComment = function addComment(comment) {
    if (comment) {
      cLogger(comment);
      cLogger("Handling create for comment");
      this.getStateManager().addNewItemToState(this.config.stateNames.comments, comment);
    }
  }
  /*
  *  sockets -
  *  Handling data changes by other users
  *
   */
  ;

  _proto.handleMessage = function handleMessage(message) {
    cLogger(message);
  };

  _proto.getCurrentUser = function getCurrentUser() {
    return this.getLoggedInUserId();
  };

  _proto.handleDataChangedByAnotherUser = function handleDataChangedByAnotherUser(message) {
    cLogger("Handling data change " + message.type + " on object type " + message.stateName + " made by user " + message.user);
    var changeUser = this.getStateManager().findItemInState(this.config.stateNames.users, {
      id: message.user
    }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_2__["isSame"]);
    var stateObj = message.data;
    cLogger(stateObj); // ok lets work out where this change belongs
    // try {
    //     switch (message.type) {
    //         case "create": {
    //             switch (message.objectType) {
    //                 case "Comment": {
    //                     // updating comments is more tricky as it is a sub object of the blog entry
    //                     // find the entry in question
    //                     const changedEntry = <BlogEntry|null>this.getStateManager().findItemInState(this.config.stateNames.entries, {id: stateObj.commentOn}, isSame);
    //                     if (changedEntry) {
    //                         let comment:Comment = Controller.convertJSONCommentToComment(stateObj);
    //                         // add the new comment
    //                         changedEntry.Comments.push(comment);
    //                         // update the state
    //                         this.getStateManager().updateItemInState(this.config.stateNames.entries, changedEntry, isSame);
    //                         // was this entry current open by the user?
    //                         const currentSelectedEntry = this.getStateManager().getStateByName(this.config.stateNames.selectedEntry);
    //                         if (currentSelectedEntry) {
    //                             if (currentSelectedEntry.id === changedEntry.id) {
    //                                 this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, changedEntry);
    //                             }
    //                         }
    //                         let username = "unknown";
    //                         if (changeUser) {
    //                             username = changeUser.username;
    //                         }
    //                         notifier.show(changedEntry.title, `${username} added comment ${stateObj.content}`);
    //                     }
    //                     break;
    //                 }
    //                 case "BlogEntry": {
    //                     let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(stateObj);
    //                     cLogger("Converting to BlogEntry type for Create");
    //                     cLogger(entry);
    //                     // add the new item to the state
    //                     this.getStateManager().addNewItemToState(this.config.stateNames.entries, entry);
    //                     let username = "unknown";
    //                     if (changeUser) {
    //                         username = changeUser.username;
    //                     }
    //
    //                     notifier.show(stateObj.title, `${username} added new entry`);
    //                     break;
    //                 }
    //                 case "User": {
    //                     let user:User = Controller.convertJSONUserToUser(stateObj);
    //                     // add the new item to the state
    //                     this.getStateManager().addNewItemToState(this.config.stateNames.users, user);
    //
    //                     notifier.show(stateObj.username, `${stateObj.username} has just registered.`, 'message');
    //                     break;
    //                 }
    //             }
    //             break;
    //         }
    //         case "update": {
    //             switch (message.objectType) {
    //                 case "BlogEntry": {
    //                     let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(stateObj);
    //                     cLogger("Converting to BlogEntry type for Update");
    //                     cLogger(entry);
    //                     // update the item in the state
    //                     this.getStateManager().updateItemInState(this.config.stateNames.entries, entry, isSame);
    //                     // the entry could be selected by this (different user) but that would only be for comments, which is not what changed, so we are done
    //                     break;
    //                 }
    //             }
    //             break;
    //         }
    //         case "delete": {
    //             switch (message.objectType) {
    //                 case "Comment": {
    //                     // removing comments is more tricky as it is a sub object of the blog entry
    //                     // find the entry in question
    //                     const changedEntry = <BlogEntry|null>this.getStateManager().findItemInState(this.config.stateNames.entries, {id: stateObj.commentOn}, isSame);
    //                     cLogger(changedEntry);
    //                     if (changedEntry) {
    //                         // remove the comment
    //                         let comments = changedEntry.Comments;
    //                         const foundIndex = comments.findIndex((element:any) => element.id === stateObj.id);
    //                         if (foundIndex >= 0) {
    //                             // remove comment from the array
    //                             cLogger('Found comment in entry - removing');
    //                             comments.splice(foundIndex, 1);
    //                             cLogger(changedEntry);
    //
    //                             // update the state
    //                             this.getStateManager().updateItemInState(this.config.stateNames.entries, changedEntry, isSame);
    //                             // was this entry current open by the user?
    //                             const currentSelectedEntry = this.getStateManager().getStateByName(this.config.stateNames.selectedEntry);
    //                             if (currentSelectedEntry) {
    //                                 if (currentSelectedEntry.id === changedEntry.id) {
    //                                     this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, changedEntry);
    //                                 }
    //                             }
    //                         }
    //
    //                     }
    //                     break;
    //                 }
    //                 case "BlogEntry": {
    //                     cLogger(`Deleting Blog Entry with id ${stateObj.id}`);
    //                     const deletedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries, stateObj, isSame);
    //                     cLogger(deletedEntry);
    //                     if (deletedEntry) {
    //                         cLogger(`Deleting Blog Entry with id ${deletedEntry.id}`);
    //                         this.getStateManager().removeItemFromState(this.config.stateNames.entries, deletedEntry, isSame);
    //                         // the current user could be accessing the comments in the entry that was just deleted
    //                         const currentSelectedEntry = this.getStateManager().getStateByName(this.config.stateNames.selectedEntry);
    //                         if (currentSelectedEntry) {
    //                             if (currentSelectedEntry.id === deletedEntry.id) {
    //                                 cLogger(`Deleted entry is selected by user, closing sidebars`);
    //                                 // ask the application to close any access to the comments
    //                                 this.applicationView.hideAllSideBars();
    //                             }
    //                         }
    //                         notifier.show(deletedEntry.title, `${deletedEntry.User.username} has deleted this entry.`, 'danger');
    //                     }
    //
    //                     break;
    //                 }
    //             }
    //             break;
    //         }
    //     }
    // } catch (err) {
    //     cLogger(err);
    // }
  } //  State Management listening
  ;

  _proto.stateChangedItemAdded = function stateChangedItemAdded(name, itemAdded) {
    cLogger("State changed " + name + " - item Added");
    cLogger(itemAdded);

    if (name === this.config.stateNames.entries) {
      this.applicationView.setState({
        isLoggedIn: this.isLoggedIn(),
        loggedInUserId: this.getLoggedInUserId(),
        selectedEntry: {},
        entries: this.getStateManager().getStateByName(name)
      });
    }
  };

  _proto.stateChangedItemRemoved = function stateChangedItemRemoved(name, itemRemoved) {
    cLogger("State changed " + name + " - item removed");
    cLogger(itemRemoved);

    if (name === this.config.stateNames.entries) {
      this.applicationView.setState({
        isLoggedIn: this.isLoggedIn(),
        loggedInUserId: this.getLoggedInUserId(),
        selectedEntry: {},
        entries: this.getStateManager().getStateByName(name)
      });
    }
  };

  _proto.stateChangedItemUpdated = function stateChangedItemUpdated(name, itemUpdated, itemNewValue) {
    cLogger("State changed " + name + " - item updated");
    cLogger(itemNewValue);

    if (name === this.config.stateNames.entries) {
      this.applicationView.setState({
        isLoggedIn: this.isLoggedIn(),
        loggedInUserId: this.getLoggedInUserId(),
        selectedEntry: {},
        entries: this.getStateManager().getStateByName(name)
      });
    }
  };

  _proto.stateChanged = function stateChanged(name, values) {
    cLogger("State changed " + name);
    cLogger(values); // entries or comments?

    if (name === this.config.stateNames.entries) {
      return; // waiting for comments to be done
    }

    if (name === this.config.stateNames.comments) {
      this.applicationView.setState({
        isLoggedIn: this.isLoggedIn(),
        loggedInUserId: this.getLoggedInUserId(),
        selectedEntry: {},
        entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
      });
    }
  };

  return Controller;
}();

var controller = new Controller();
/* harmony default export */ __webpack_exports__["default"] = (controller);

/***/ }),

/***/ "./src/component/AbstractView.ts":
/*!***************************************!*\
  !*** ./src/component/AbstractView.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AbstractView; });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/BrowserUtil */ "./src/util/BrowserUtil.ts");


var avLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('view-ts');

var AbstractView = /*#__PURE__*/function () {
  function AbstractView(applicationView, htmlDocument, uiConfig, uiPrefs, stateManager) {
    this.applicationView = applicationView;
    this.document = document;
    this.uiConfig = uiConfig;
    this.uiPrefs = uiPrefs;
    this.config = applicationView.state;
    this.stateManager = stateManager; // state change listening

    this.stateChanged = this.stateChanged.bind(this); // event handlers

    this.eventStartDrag = this.eventStartDrag.bind(this);
    this.eventClickItem = this.eventClickItem.bind(this);
  }

  var _proto = AbstractView.prototype;

  _proto.eventStartDrag = function eventStartDrag(event) {
    avLogger('Abstract View : drag start', 10);
    var data = JSON.stringify(this.getDragData(event));
    avLogger(data, 10); // @ts-ignore

    event.dataTransfer.setData(this.applicationView.state.ui.draggable.draggableDataKeyId, data);
  };

  _proto.createResultsForState = function createResultsForState(name, newState) {
    var _this = this;

    avLogger('Abstract View : creating Results', 10);
    avLogger(newState);
    var domConfig = this.uiConfig.dom; // remove the previous items from list

    var viewEl = document.getElementById(domConfig.resultsId);
    if (viewEl) _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].removeAllChildren(viewEl); // add the new children

    newState.map(function (item, index) {
      var childEl = _this.document.createElement(domConfig.resultsElementType);

      _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.resultsClasses); // add the key ids for selection

      childEl.setAttribute(domConfig.resultDataKeyId, _this.getIdForStateItem(name, item));
      childEl.setAttribute(domConfig.resultLegacyDataKeyId, _this.getLegacyIdForStateItem(name, item));
      childEl.setAttribute(domConfig.resultDataSourceId, domConfig.resultDataSourceValue);

      var displayText = _this.getDisplayValueForStateItem(name, item); // add modifiers for patient state


      var modifier = _this.getModifierForStateItem(name, item);

      var secondModifier = _this.getSecondaryModifierForStateItem(name, item);

      switch (modifier) {
        case 'normal':
          {
            avLogger('Abstract View: normal item', 10);
            _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassNormal);

            if (domConfig.iconNormal !== '') {
              childEl.innerHTML = displayText + domConfig.iconNormal;
            } else {
              childEl.innerText = displayText;
            }

            switch (secondModifier) {
              case 'warning':
                {
                  _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassNormal, false);
                  _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassWarning, true);

                  if (domConfig.iconWarning !== '') {
                    childEl.innerHTML += domConfig.iconWarning;
                  }

                  break;
                }

              case 'normal':
                {}
            }

            break;
          }

        case 'active':
          {
            avLogger('Abstract View: active item', 10);
            _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassActive);

            if (domConfig.iconActive !== '') {
              childEl.innerHTML = displayText + domConfig.iconActive;
            } else {
              childEl.innerText = displayText;
            }

            switch (secondModifier) {
              case 'warning':
                {
                  _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassNormal, false);
                  _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassWarning, true);

                  if (domConfig.iconWarning !== '') {
                    childEl.innerHTML += domConfig.iconWarning;
                  }

                  break;
                }

              case 'normal':
                {}
            }

            break;
          }

        case 'inactive':
          {
            avLogger('Abstract View: inactive item', 10);
            _util_BrowserUtil__WEBPACK_IMPORTED_MODULE_1__["default"].addRemoveClasses(childEl, domConfig.modifierClassInactive);

            if (domConfig.iconInactive !== '') {
              childEl.innerHTML = displayText + domConfig.iconInactive;
            } else {
              childEl.innerText = displayText;
            }

            switch (secondModifier) {
              case 'warning':
                {
                  if (domConfig.iconWarning !== '') {
                    childEl.innerHTML += domConfig.iconWarning;
                  }

                  break;
                }

              case 'normal':
                {}
            }

            break;
          }
      } // add draggable actions


      if (domConfig.isDraggable) {
        childEl.setAttribute('draggable', 'true');
        childEl.addEventListener('dragstart', _this.eventStartDrag);
      } // add selection actions


      if (domConfig.isClickable) {
        childEl.addEventListener('click', _this.eventClickItem);
      }

      avLogger("Abstract View: Adding child " + item.id);
      if (viewEl) viewEl.appendChild(childEl);
    });
  };

  _proto.stateChanged = function stateChanged(name, newValue) {
    this.updateView(name, newValue);
  };

  _proto.stateChangedItemAdded = function stateChangedItemAdded(name, itemAdded) {
    this.updateView(name, this.stateManager.getStateByName(name));
  };

  _proto.stateChangedItemRemoved = function stateChangedItemRemoved(name, itemRemoved) {
    this.updateView(name, this.stateManager.getStateByName(name));
  };

  _proto.stateChangedItemUpdated = function stateChangedItemUpdated(name, itemUpdated, itemNewValue) {
    this.updateView(name, this.stateManager.getStateByName(name));
  };

  return AbstractView;
}();



/***/ }),

/***/ "./src/component/BlogEntryView.tsx":
/*!*****************************************!*\
  !*** ./src/component/BlogEntryView.tsx ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BlogEntryView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Controller */ "./src/Controller.ts");
/* harmony import */ var _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../util/EqualityFunctions */ "./src/util/EqualityFunctions.ts");






var beLogger = debug__WEBPACK_IMPORTED_MODULE_3___default()('view-ts:blogentry'); // @ts-ignore

function BlogEntryView(_ref) {
  var entry = _ref.entry,
      showCommentsHandler = _ref.showCommentsHandler,
      editEntryHandler = _ref.editEntryHandler,
      deleteEntryHandler = _ref.deleteEntryHandler,
      config = _ref.config;

  if (entry) {
    beLogger("Entry " + entry.createdBy + " === " + _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId()); // find the user for the entry

    var user = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().findItemInState(config.stateNames.users, {
      id: entry.createdBy
    }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_5__["isSame"]);
    var allComments = _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getStateManager().getStateByName(config.stateNames.comments); // get the comments for the entry

    var comments = allComments.filter(function (comment) {
      return comment.commentOn === entry.id;
    });
    entry.user = user;
    entry.comments = comments;
    var editButton;
    var deleteButton;

    if (entry.user.id === _Controller__WEBPACK_IMPORTED_MODULE_4__["default"].getLoggedInUserId()) {
      editButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn-primary btn-sm rounded p-1 mr-2",
        "entry-id": entry.id,
        onClick: editEntryHandler
      }, "\xA0\xA0Edit \xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-edit"
      }), "\xA0\xA0");
      deleteButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn-warning btn-sm rounded p-1 mr-2",
        "entry-id": entry.id,
        onClick: deleteEntryHandler
      }, "\xA0\xA0Delete \xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash-alt"
      }), "\xA0\xA0");
    } else {
      editButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn-outline-secondary btn-sm rounded p-1 mr-2 ",
        disabled: true
      }, "\xA0\xA0Edit \xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-edit"
      }), "\xA0\xA0");
      deleteButton = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
        type: "button",
        className: "btn-outline-secondary btn-sm rounded p-1 mr-2",
        disabled: true
      }, "\xA0\xA0Delete \xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
        className: "fas fa-trash-alt"
      }), "\xA0\xA0");
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "col-sm-12 col-md-6 col-lg-4 col-xl-3 p-2"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "card",
      style: {
        width: "350px"
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "card-header"
    }, entry.title, "\xA0\xA0\xA0\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
      className: "text-decoration-none"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("i", {
      className: "fas fa-comments text-secondary",
      "entry-id": entry.id,
      onClick: showCommentsHandler
    }), "\xA0\xA0", /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", {
      className: "badge badge-pill badge-primary text-right",
      "entry-id": entry.id,
      onClick: showCommentsHandler
    }, "\xA0", entry.comments.length, "\xA0"))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
      className: "card-text"
    }, entry.content), editButton, deleteButton), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "card-footer text-right text-muted"
    }, entry.user.username, " on ", moment__WEBPACK_IMPORTED_MODULE_2___default()(entry.changedOn, 'YYYYMMDDHHmmss').format('DD/MM/YYYY'))));
  } else {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null);
  }
}
BlogEntryView.propTypes = {
  entry: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.any.isRequired,
  showCommentsHandler: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
  editEntryHandler: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
  deleteEntryHandler: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired
};

/***/ }),

/***/ "./src/component/CommentSidebarView.ts":
/*!*********************************************!*\
  !*** ./src/component/CommentSidebarView.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Controller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Controller */ "./src/Controller.ts");
/* harmony import */ var _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/EqualityFunctions */ "./src/util/EqualityFunctions.ts");
/* harmony import */ var _SidebarView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SidebarView */ "./src/component/SidebarView.ts");
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}






var viewLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('view-ts:comments');

var CommentSidebarView = /*#__PURE__*/function (_SidebarView) {
  _inheritsLoose(CommentSidebarView, _SidebarView);

  function CommentSidebarView(applicationView, htmlDocument, stateManager) {
    var _this;

    _this = _SidebarView.call(this, applicationView, htmlDocument, applicationView.state.ui.commentSideBar, applicationView.state.uiPrefs.commentSideBar, stateManager) || this; // handler binding

    _this.updateView = _this.updateView.bind(_assertThisInitialized(_this)); // elements

    _this.commentHeaderEl = htmlDocument.getElementById(_this.uiConfig.dom.headerId);
    _this.newCommentFormEl = htmlDocument.getElementById(_this.uiConfig.dom.newFormId);
    if (_this.newCommentFormEl) _this.newCommentFormEl.addEventListener('submit', _this.applicationView.handleAddComment);
    _this.newCommentTextEl = htmlDocument.getElementById(_this.uiConfig.dom.commentId);
    _this.newCommentSubmitEl = htmlDocument.getElementById(_this.uiConfig.dom.submitCommentId); // register state change listening

    _this.stateManager.addChangeListenerForName(_this.config.stateNames.selectedEntry, _assertThisInitialized(_this));

    return _this;
  }

  var _proto = CommentSidebarView.prototype;

  _proto.getIdForStateItem = function getIdForStateItem(name, item) {
    return item.id;
  };

  _proto.getLegacyIdForStateItem = function getLegacyIdForStateItem(name, item) {
    return item.id;
  };

  _proto.getDisplayValueForStateItem = function getDisplayValueForStateItem(name, item) {
    viewLogger("Getting display value for comment " + item.id + " with content " + item.content); // find the user for the item from the createdBy attribute

    var createdBy = this.stateManager.findItemInState(this.config.stateNames.users, {
      id: item.createdBy
    }, _util_EqualityFunctions__WEBPACK_IMPORTED_MODULE_3__["isSame"]);
    var createdOn = moment__WEBPACK_IMPORTED_MODULE_1___default()(item.changedOn, 'YYYYMMDDHHmmss').format('DD/MM/YYYY HH:mm');
    return item.content + " - " + createdBy.username + " on " + createdOn + "  ";
  };

  _proto.getModifierForStateItem = function getModifierForStateItem(name, item) {
    var result = 'inactive';

    if (item.createdBy === _Controller__WEBPACK_IMPORTED_MODULE_2__["default"].getLoggedInUserId()) {
      result = 'normal';
    }

    return result;
  };

  _proto.getSecondaryModifierForStateItem = function getSecondaryModifierForStateItem(name, item) {
    return 'normal';
  };

  _proto.eventClickItem = function eventClickItem(event) {
    event.preventDefault();
    var entry = this.stateManager.getStateByName(this.config.stateNames.selectedEntry);
    viewLogger(event.target); // @ts-ignore

    var id = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);

    if (!id) {
      //get the id from the containing element
      // @ts-ignore
      var parentEl = event.target.parentNode;
      id = parentEl.getAttribute(this.uiConfig.dom.resultDataKeyId);
    } // @ts-ignore


    viewLogger("Comment " + event.target.innerText + " with id " + id + " clicked", 20);

    if (id) {
      id = parseInt(id); // find the comment in the selected entry

      var comment = entry.Comments.find(function (comment) {
        return comment.id === id;
      });

      if (comment) {
        viewLogger("Comment created by " + comment.createdBy + " and current user is " + _Controller__WEBPACK_IMPORTED_MODULE_2__["default"].getLoggedInUserId()); // only able to delete if the comment was created by the current user

        if (comment.createdBy === _Controller__WEBPACK_IMPORTED_MODULE_2__["default"].getLoggedInUserId()) {
          this.applicationView.handleDeleteComment(parseInt(id));
        }
      }
    }
  };

  _proto.updateView = function updateView(name, newState) {
    viewLogger('Updating view');
    viewLogger(newState);

    if (_Controller__WEBPACK_IMPORTED_MODULE_2__["default"].isLoggedIn()) {
      if (this.newCommentTextEl) this.newCommentTextEl.removeAttribute("readonly");
      if (this.newCommentSubmitEl) this.newCommentSubmitEl.removeAttribute("disabled");
    } else {
      if (this.newCommentTextEl) this.newCommentTextEl.setAttribute("readonly", "true");
      if (this.newCommentSubmitEl) this.newCommentSubmitEl.setAttribute("disabled", "true");
    }

    if (newState && newState.comments) {
      if (this.commentHeaderEl) this.commentHeaderEl.innerHTML = newState.title;
      viewLogger(newState.comments);
      this.createResultsForState(name, newState.comments);
    }
  };

  _proto.getDragData = function getDragData(event) {};

  return CommentSidebarView;
}(_SidebarView__WEBPACK_IMPORTED_MODULE_4__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (CommentSidebarView);

/***/ }),

/***/ "./src/component/DetailsSidebarView.ts":
/*!*********************************************!*\
  !*** ./src/component/DetailsSidebarView.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _SidebarView__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SidebarView */ "./src/component/SidebarView.ts");
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}




var viewLogger = debug__WEBPACK_IMPORTED_MODULE_1___default()('view-ts:details');

var DetailsSidebarView = /*#__PURE__*/function (_SidebarView) {
  _inheritsLoose(DetailsSidebarView, _SidebarView);

  function DetailsSidebarView(applicationView, htmlDocument, stateManager) {
    var _this;

    _this = _SidebarView.call(this, applicationView, htmlDocument, applicationView.state.ui.entryDetailsSideBar, applicationView.state.uiPrefs.entryDetailsSideBar, stateManager) || this; // handler binding

    _this.updateView = _this.updateView.bind(_assertThisInitialized(_this));
    _this.eventClickItem = _this.eventClickItem.bind(_assertThisInitialized(_this)); // field and form elements

    _this.formEl = document.getElementById(_this.uiConfig.dom.formId);
    _this.titleEl = document.getElementById(_this.uiConfig.dom.titleId);
    _this.contentEl = document.getElementById(_this.uiConfig.dom.contentId);
    _this.changeOnEl = document.getElementById(_this.uiConfig.dom.changedOnId); // register state change listening

    stateManager.addChangeListenerForName(_this.config.stateNames.selectedEntry, _assertThisInitialized(_this)); // listen for form submissions

    if (_this.formEl) {
      // @ts-ignore
      _this.formEl.addEventListener('submit', _this.eventClickItem);
    }

    return _this;
  }

  var _proto = DetailsSidebarView.prototype;

  _proto.getIdForStateItem = function getIdForStateItem(name, item) {
    return item.id;
  };

  _proto.getLegacyIdForStateItem = function getLegacyIdForStateItem(name, item) {
    return item.id;
  };

  _proto.eventClickItem = function eventClickItem(event) {
    event.preventDefault();
    viewLogger('Handling submit Details Sidebar View');
    viewLogger(event.target);
    var entry = this.stateManager.getStateByName(this.config.stateNames.selectedEntry);
    viewLogger(entry);
    entry.title = this.titleEl ? this.titleEl.value.trim() : '';
    entry.content = this.contentEl ? this.contentEl.value.trim() : '';
    entry.changedOn = parseInt(moment__WEBPACK_IMPORTED_MODULE_0___default()().format('YYYYMMDDHHmmss'));
    viewLogger(entry);
    if (this.titleEl) this.titleEl.value = '';
    if (this.contentEl) this.contentEl.value = '';
    if (this.changeOnEl) this.changeOnEl.innerText = 'Last Changed On:';
    this.applicationView.handleUpdateEntry(entry);
  };

  _proto.updateView = function updateView(name, newState) {
    viewLogger('Handling update of Details Sidebar View');
    viewLogger(newState);
    var entry = newState;

    if (entry && entry.title) {
      if (this.titleEl) this.titleEl.value = entry.title;
      if (this.contentEl) this.contentEl.value = entry.content;
      if (this.changeOnEl) this.changeOnEl.innerText = "Last Changed On: " + moment__WEBPACK_IMPORTED_MODULE_0___default()(entry.changedOn, 'YYYYMMDDHHmmss').format('DD/MM/YYYY');
    } else {
      if (this.titleEl) this.titleEl.value = '';
      if (this.contentEl) this.contentEl.value = '';
      if (this.changeOnEl) this.changeOnEl.innerText = "Last Changed On: ";
    }
  };

  _proto.getDisplayValueForStateItem = function getDisplayValueForStateItem(name, item) {
    return "";
  };

  _proto.getDragData = function getDragData(event) {};

  _proto.getModifierForStateItem = function getModifierForStateItem(name, item) {
    return "";
  };

  _proto.getSecondaryModifierForStateItem = function getSecondaryModifierForStateItem(name, item) {
    return "";
  };

  return DetailsSidebarView;
}(_SidebarView__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (DetailsSidebarView);

/***/ }),

/***/ "./src/component/SidebarView.ts":
/*!**************************************!*\
  !*** ./src/component/SidebarView.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AbstractView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractView */ "./src/component/AbstractView.ts");
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var SidebarView = /*#__PURE__*/function (_AbstractView) {
  _inheritsLoose(SidebarView, _AbstractView);

  function SidebarView(applicationView, htmlDocument, uiConfig, uiPrefs, stateManager) {
    var _this;

    _this = _AbstractView.call(this, applicationView, htmlDocument, uiConfig, uiPrefs, stateManager) || this; // event handlers

    _this.eventHide = _this.eventHide.bind(_assertThisInitialized(_this));
    _this.eventShow = _this.eventShow.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = SidebarView.prototype;

  _proto.onDocumentLoaded = function onDocumentLoaded() {
    // this should be called once at startup
    // hide the side bar panel
    this.eventHide(null); // add the event listener for the close button

    var sidePanelEl = this.document.getElementById(this.uiConfig.dom.sideBarId);
    if (sidePanelEl === null) return;
    var closeButtonEl = sidePanelEl.querySelector('.close');

    if (closeButtonEl) {
      closeButtonEl.addEventListener('click', this.eventHide);
    }
  };

  _proto.showHide = function showHide(newStyleValue) {
    var sidePanelEl = this.document.getElementById(this.uiConfig.dom.sideBarId);
    if (sidePanelEl === null) return;

    switch (this.uiPrefs.view.location) {
      case 'left':
        {
          sidePanelEl.style.width = newStyleValue;
          break;
        }

      case 'right':
        {
          sidePanelEl.style.width = newStyleValue;
          break;
        }

      case 'bottom':
        {
          sidePanelEl.style.height = newStyleValue;
          break;
        }

      case 'top':
        {
          sidePanelEl.style.height = newStyleValue;
          break;
        }
    }
  };

  _proto.eventHide = function eventHide(event) {
    if (event) event.preventDefault();
    this.showHide('0%');
  };

  _proto.eventShow = function eventShow(event) {
    this.showHide(this.uiPrefs.view.expandedSize);
  };

  return SidebarView;
}(_AbstractView__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (SidebarView);

/***/ }),

/***/ "./src/network/ApiUtil.ts":
/*!********************************!*\
  !*** ./src/network/ApiUtil.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}


var apiLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('api-ts');

var ApiUtil = /*#__PURE__*/function () {
  function ApiUtil() {}

  var _proto = ApiUtil.prototype;

  _proto.fetchJSON = function fetchJSON(url, parameters, callback, queueType, requestId) {
    fetch(url, parameters).then(function (response) {
      apiLogger("Response code was " + response.status);

      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } // else {
      //     callback(null, response.status,queueId, requestId);
      //     throw new Error("no results");
      // }

    }).then(function (data) {
      apiLogger(data);
      callback(data, 200, queueType, requestId);
    }).catch(function (error) {
      apiLogger(error);
      callback(null, 500, queueType, requestId);
    });
  }
  /*
      Utility function for calling JSON POST requests
      Parameters:
      1.  URL to send the POST request too;
      2.  parameters object whose attribute (name/values) are the request parameters; and
      3.  A function to receive the results when the fetch has completed
          The callback function should have the following form
          callback (jsonDataReturned, httpStatusCode)
          a)  A successful fetch will return the JSON data in the first parameter and a status code of the server
          b)  Parameters that cannot be converted to JSON format will give a null data and code 404
          c)  A server error will give that code and no data
    */
  ;

  _proto.apiFetchJSONWithPost = function apiFetchJSONWithPost(request) {
    apiLogger("Executing fetch with URL " + request.originalRequest.url + " with body " + request.originalRequest.params);

    try {
      JSON.stringify(request.originalRequest.params);
    } catch (error) {
      apiLogger('Unable to convert parameters to JSON');
      apiLogger(request.originalRequest.params, 100);
      request.callback(null, 404, request.queueType, request.requestId);
    }

    var postParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_extends({}, request.originalRequest.params))
    };
    this.fetchJSON(request.originalRequest.url, postParameters, request.callback, request.queueType, request.requestId);
  };

  _proto.apiFetchJSONWithGet = function apiFetchJSONWithGet(request) {
    apiLogger("Executing GET fetch with URL " + request.originalRequest.url + " with id " + request.originalRequest.params.id);
    var getParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (request.originalRequest.params.id) request.originalRequest.url += "/" + request.originalRequest.params.id;
    this.fetchJSON(request.originalRequest.url, getParameters, request.callback, request.queueType, request.requestId);
  };

  _proto.apiFetchJSONWithDelete = function apiFetchJSONWithDelete(request) {
    apiLogger("Executing DELETE fetch with URL " + request.originalRequest.url + " with id " + request.originalRequest.params.id);
    var delParameters = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (request.originalRequest.params.id) request.originalRequest.url += "/" + request.originalRequest.params.id;
    this.fetchJSON(request.originalRequest.url, delParameters, request.callback, request.queueType, request.requestId);
  };

  _proto.apiFetchJSONWithPut = function apiFetchJSONWithPut(request) {
    apiLogger("Executing PUT fetch with URL " + request.originalRequest.url + " with id " + request.originalRequest.params.id);
    var putParameters = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_extends({}, request.originalRequest.params))
    };
    if (request.originalRequest.params.id) request.originalRequest.url += "/" + request.originalRequest.params.id;
    this.fetchJSON(request.originalRequest.url, putParameters, request.callback, request.queueType, request.requestId);
  };

  return ApiUtil;
}();

var apiUtil = new ApiUtil();
/* harmony default export */ __webpack_exports__["default"] = (apiUtil);

/***/ }),

/***/ "./src/network/DownloadManager.ts":
/*!****************************************!*\
  !*** ./src/network/DownloadManager.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ApiUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ApiUtil */ "./src/network/ApiUtil.ts");
/* harmony import */ var _util_UUID__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/UUID */ "./src/util/UUID.ts");
/* harmony import */ var _Types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Types */ "./src/network/Types.ts");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_3__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}





var dlLogger = debug__WEBPACK_IMPORTED_MODULE_3___default()('api-ts');

var DownloadManager = /*#__PURE__*/function () {
  function DownloadManager() {
    this.backgroundQueue = [];
    this.priorityQueue = [];
    this.inProgress = [];
    this.backgroundChangeListener = null;
    this.priorityChangeListener = null;
    this.callbackForQueueRequest = this.callbackForQueueRequest.bind(this);
  }

  var _proto = DownloadManager.prototype;

  _proto.setBackgroundChangeListener = function setBackgroundChangeListener(uiChangeListener) {
    this.backgroundChangeListener = uiChangeListener;
  };

  _proto.setPriorityChangeListener = function setPriorityChangeListener(uiChangeListener) {
    this.priorityChangeListener = uiChangeListener;
  };

  _proto.getPriorityQueueCount = function getPriorityQueueCount() {
    return this.priorityQueue.length;
  };

  _proto.getBackgroundQueueCount = function getBackgroundQueueCount() {
    return this.backgroundQueue.length;
  };

  _proto.addApiRequest = function addApiRequest(jsonRequest, isPriority) {
    if (isPriority === void 0) {
      isPriority = false;
    } // add a new requestId to the request for future tracking


    var requestId = _util_UUID__WEBPACK_IMPORTED_MODULE_1__["default"].getUniqueId();
    dlLogger("Download Manger: Adding Queue Request " + requestId);
    dlLogger(jsonRequest, 200);

    if (isPriority) {
      var _managerRequest = {
        originalRequest: jsonRequest,
        requestId: requestId,
        queueType: _Types__WEBPACK_IMPORTED_MODULE_2__["queueType"].PRIORITY,
        callback: this.callbackForQueueRequest
      };
      this.priorityQueue.push(_managerRequest);
      if (this.priorityChangeListener) this.priorityChangeListener.handleEventAddToQueue();
    } else {
      var _managerRequest2 = {
        originalRequest: jsonRequest,
        requestId: requestId,
        queueType: _Types__WEBPACK_IMPORTED_MODULE_2__["queueType"].BACKGROUND,
        callback: this.callbackForQueueRequest
      };
      this.backgroundQueue.push(_managerRequest2);
      if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventAddToQueue();
    }

    this.processQueues();
  };

  _proto.processPriorityQueue = /*#__PURE__*/function () {
    var _processPriorityQueue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var queueItem;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              queueItem = this.priorityQueue.shift();
              if (queueItem !== undefined) this.inProgress.push(queueItem);
              if (queueItem !== undefined) this.initiateFetchForQueueItem(queueItem);

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function processPriorityQueue() {
      return _processPriorityQueue.apply(this, arguments);
    }

    return processPriorityQueue;
  }();

  _proto.processBackgroundQueue = /*#__PURE__*/function () {
    var _processBackgroundQueue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var queueItem;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              queueItem = this.backgroundQueue.shift();
              if (queueItem !== undefined) this.inProgress.push(queueItem);
              if (queueItem !== undefined) this.initiateFetchForQueueItem(queueItem);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function processBackgroundQueue() {
      return _processBackgroundQueue.apply(this, arguments);
    }

    return processBackgroundQueue;
  }();

  _proto.processQueues = /*#__PURE__*/function () {
    var _processQueues = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var totalQueuedItems;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;

            case 1:
              if (!(totalQueuedItems > 0)) {
                _context3.next = 14;
                break;
              }

              dlLogger("Download Manager: processing queue, items remaining " + totalQueuedItems); // priority queue takes priority

              if (!(this.priorityQueue.length > 0)) {
                _context3.next = 8;
                break;
              }

              _context3.next = 6;
              return this.processPriorityQueue();

            case 6:
              _context3.next = 11;
              break;

            case 8:
              if (!(this.backgroundQueue.length > 0)) {
                _context3.next = 11;
                break;
              }

              _context3.next = 11;
              return this.processBackgroundQueue();

            case 11:
              totalQueuedItems = this.priorityQueue.length + this.backgroundQueue.length;
              _context3.next = 1;
              break;

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function processQueues() {
      return _processQueues.apply(this, arguments);
    }

    return processQueues;
  }();

  _proto.callbackForQueueRequest = function callbackForQueueRequest(jsonData, httpStatus, queueId, requestId) {
    // let the listeners know about the completion
    if (queueId === _Types__WEBPACK_IMPORTED_MODULE_2__["queueType"].PRIORITY) {
      // priority
      if (this.priorityChangeListener) this.priorityChangeListener.handleEventRemoveFromQueue();
    } else if (this.backgroundChangeListener) this.backgroundChangeListener.handleEventRemoveFromQueue();

    dlLogger("Download Manager: received callback for queue " + queueId + " request " + requestId + " with status " + httpStatus); // find the item in the in progress

    var foundIndex = this.inProgress.findIndex(function (element) {
      return element.requestId === requestId;
    });

    if (foundIndex >= 0) {
      // remove from in progress
      var queueItem = this.inProgress[foundIndex];
      this.inProgress.splice(foundIndex, 1);
      dlLogger(queueItem);
      dlLogger("Download Manager: finished for queue item " + queueItem.requestId); // let the callback function know

      queueItem.originalRequest.callback(jsonData, httpStatus, queueItem.originalRequest.associatedStateName);
    }
  };

  _proto.initiateFetchForQueueItem = function initiateFetchForQueueItem(item) {
    dlLogger("Download Manager: initiating fetch for queue item " + item.requestId);
    dlLogger(item);

    if (item.originalRequest.url !== null && item.originalRequest.params != null && item.originalRequest.callback != null) {
      switch (item.originalRequest.type) {
        case _Types__WEBPACK_IMPORTED_MODULE_2__["RequestType"].POST:
          {
            _ApiUtil__WEBPACK_IMPORTED_MODULE_0__["default"].apiFetchJSONWithPost(item);
            break;
          }

        case _Types__WEBPACK_IMPORTED_MODULE_2__["RequestType"].GET:
          {
            _ApiUtil__WEBPACK_IMPORTED_MODULE_0__["default"].apiFetchJSONWithGet(item);
            break;
          }

        case _Types__WEBPACK_IMPORTED_MODULE_2__["RequestType"].DELETE:
          {
            _ApiUtil__WEBPACK_IMPORTED_MODULE_0__["default"].apiFetchJSONWithDelete(item);
            break;
          }

        case _Types__WEBPACK_IMPORTED_MODULE_2__["RequestType"].PUT:
          {
            _ApiUtil__WEBPACK_IMPORTED_MODULE_0__["default"].apiFetchJSONWithPut(item);
            break;
          }
      }
    }
  };

  return DownloadManager;
}();

var downloader = new DownloadManager();
/* harmony default export */ __webpack_exports__["default"] = (downloader);

/***/ }),

/***/ "./src/network/Types.ts":
/*!******************************!*\
  !*** ./src/network/Types.ts ***!
  \******************************/
/*! exports provided: RequestType, queueType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RequestType", function() { return RequestType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queueType", function() { return queueType; });
var RequestType;

(function (RequestType) {
  RequestType[RequestType["POST"] = 0] = "POST";
  RequestType[RequestType["GET"] = 1] = "GET";
  RequestType[RequestType["PUT"] = 2] = "PUT";
  RequestType[RequestType["DELETE"] = 3] = "DELETE";
})(RequestType || (RequestType = {}));

;
var queueType;

(function (queueType) {
  queueType[queueType["PRIORITY"] = 0] = "PRIORITY";
  queueType[queueType["BACKGROUND"] = 1] = "BACKGROUND";
})(queueType || (queueType = {}));

/***/ }),

/***/ "./src/socket/SocketManager.ts":
/*!*************************************!*\
  !*** ./src/socket/SocketManager.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);

var sDebug = debug__WEBPACK_IMPORTED_MODULE_0___default()('socket-ts');

var SocketManager = /*#__PURE__*/function () {
  function SocketManager() {
    this.callbackForMessage = this.callbackForMessage.bind(this);
    this.callbackForData = this.callbackForData.bind(this);
    this.listener = null;
    this.socket = null;
  }

  var _proto = SocketManager.prototype;

  _proto.callbackForMessage = function callbackForMessage(message) {
    sDebug("Received message : " + message);
    if (this.listener) this.listener.handleMessage(message);
  }
  /*
  *
  *  expecting a JSON data object with the following attributes
  *  1.  type: "create"|"update"|"delete"
  *  2.  objectType: string name of the object type changed
  *  3.  data: the new representation of the object
  *  4.  user: application specific id for the user who made the change
  *        - the application view is required to implement getCurrentUser() to compare the user who made the change
  *
   */
  ;

  _proto.callbackForData = function callbackForData(message) {
    sDebug("Received data");

    try {
      var dataObj = JSON.parse(message);
      sDebug(dataObj);
      if (this.listener === null) return;

      if (dataObj.user === this.listener.getCurrentUser()) {
        sDebug("change made by this user, ignoring");
      } else {
        sDebug("change made by another user, passing off to the application");
        this.listener.handleDataChangedByAnotherUser(dataObj);
      }
    } catch (err) {
      sDebug('Not JSON data');
    }
  };

  _proto.setListener = function setListener(listener) {
    sDebug('Setting listener');
    this.listener = listener;
    sDebug('Creating socket connection'); // @ts-ignore

    this.socket = io();
    sDebug('Waiting for messages');
    this.socket.on('message', this.callbackForMessage);
    this.socket.on('data', this.callbackForData);
  };

  _proto.sendMessage = function sendMessage(message) {
    this.socket.emit('message', message);
  };

  return SocketManager;
}();

var socketManager = new SocketManager();
/* harmony default export */ __webpack_exports__["default"] = (socketManager);

/***/ }),

/***/ "./src/state/AbstractStateManager.ts":
/*!*******************************************!*\
  !*** ./src/state/AbstractStateManager.ts ***!
  \*******************************************/
/*! exports provided: stateEventType, AbstractStateManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stateEventType", function() { return stateEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbstractStateManager", function() { return AbstractStateManager; });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);

var smLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('state-manager-ts');
var stateEventType;

(function (stateEventType) {
  stateEventType[stateEventType["ItemAdded"] = 0] = "ItemAdded";
  stateEventType[stateEventType["ItemUpdated"] = 1] = "ItemUpdated";
  stateEventType[stateEventType["ItemDeleted"] = 2] = "ItemDeleted";
  stateEventType[stateEventType["StateChanged"] = 3] = "StateChanged";
})(stateEventType || (stateEventType = {}));

var AbstractStateManager = /*#__PURE__*/function () {
  function AbstractStateManager() {
    this.suppressEventEmits = false;
    this.forceSaves = true;
    this.stateChangeListeners = [];
    this.suppressEventEmits = false;
    this.forceSaves = true;
  }

  var _proto = AbstractStateManager.prototype;

  _proto.suppressEvents = function suppressEvents() {
    this.suppressEventEmits = true;
  };

  _proto.emitEvents = function emitEvents() {
    this.suppressEventEmits = false;
  };

  _proto.dontForceSavesOnAddRemoveUpdate = function dontForceSavesOnAddRemoveUpdate() {
    this.forceSaves = false;
  };

  _proto.forceSavesOnAddRemoveUpdate = function forceSavesOnAddRemoveUpdate() {
    this.forceSaves = true;
  };

  _proto.informChangeListenersForStateWithName = function informChangeListenersForStateWithName(name, stateObjValue, eventType, previousObjValue) {
    if (eventType === void 0) {
      eventType = stateEventType.StateChanged;
    }

    if (previousObjValue === void 0) {
      previousObjValue = null;
    }

    smLogger("State Manager: Informing state listeners of " + name);

    if (this.suppressEventEmits) {
      smLogger("State Manager: Events suppressed");
      return;
    }

    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      smLogger("State Manager: Found state listeners of " + name + " with event type " + eventType);
      /* let each state change listener know */

      var changeListenersForName = this.stateChangeListeners[foundIndex];

      for (var index = 0; index < changeListenersForName.listeners.length; index++) {
        smLogger("State Manager: Found state listener of " + name + " - informing");
        var listener = changeListenersForName.listeners[index];

        switch (eventType) {
          case stateEventType.StateChanged:
            {
              listener.stateChanged(name, stateObjValue);
              break;
            }

          case stateEventType.ItemAdded:
            {
              listener.stateChangedItemAdded(name, stateObjValue);
              break;
            }

          case stateEventType.ItemUpdated:
            {
              listener.stateChangedItemUpdated(name, previousObjValue, stateObjValue);
              break;
            }

          case stateEventType.ItemDeleted:
            {
              listener.stateChangedItemRemoved(name, stateObjValue);
              break;
            }
        }
      }
    }
  };

  _proto.ensureListenerSetupForName = function ensureListenerSetupForName(name) {
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex < 0) {
      var listenersNameArrayPair = {
        name: name,
        listeners: []
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  }
  /*
        Add a state listener for a given state name
        the listener should be a function with two parameters
        name - string - the name of the state variable that they want to be informed about
        stateObjValue - object - the new state value
       */
  ;

  _proto.addChangeListenerForName = function addChangeListenerForName(name, listener) {
    this.ensureListenerSetupForName(name);
    smLogger("State Manager: Adding state listener for " + name);
    var foundIndex = this.stateChangeListeners.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex >= 0) {
      var changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    }
  };

  _proto.addStateByName = function addStateByName(name, stateObjForName) {
    this._ensureStatePresent(name);
    /* create a new state attribute for the application state */


    var state = {
      name: name,
      value: stateObjForName
    };
    /* get the current state value and replace it */

    this._replaceNamedStateInStorage(state);

    this.informChangeListenersForStateWithName(name, stateObjForName, stateEventType.StateChanged);
    return stateObjForName;
  };

  _proto.getStateByName = function getStateByName(name) {
    this._ensureStatePresent(name);

    smLogger("State Manager: Getting state for " + name);
    var stateValueObj = {}; // get the current state

    var state = this._getState(name);

    stateValueObj = state.value;
    smLogger("State Manager: Found previous state for " + name);
    smLogger(stateValueObj);
    return stateValueObj;
  };

  _proto.setStateByName = function setStateByName(name, stateObjectForName, informListeners) {
    if (informListeners === void 0) {
      informListeners = true;
    }

    this._ensureStatePresent(name);

    smLogger("State Manager: Setting state for " + name);
    smLogger(stateObjectForName); // set the current state

    var state = this._getState(name);

    state.value = stateObjectForName;
    if (this.forceSaves) this._saveState(name, stateObjectForName);
    if (informListeners) this.informChangeListenersForStateWithName(name, stateObjectForName);
    return stateObjectForName;
  };

  _proto.addNewItemToState = function addNewItemToState(name, item, isPersisted) {
    if (isPersisted === void 0) {
      isPersisted = false;
    } // assumes state is an array


    this._ensureStatePresent(name);

    smLogger("State Manager: Adding item to state " + name);
    var state = this.getStateByName(name);
    state.push(item);
    smLogger(state);

    this._addItemToState(name, item, isPersisted);

    this.informChangeListenersForStateWithName(name, state, stateEventType.ItemAdded);
  };

  _proto.findItemInState = function findItemInState(name, item, testForEqualityFunction) {
    // assumes state is an array
    this._ensureStatePresent(name);

    var result = {};
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });
    smLogger("Finding item in state " + name + " - found index " + foundIndex);
    smLogger(item);

    if (foundIndex >= 0) {
      result = state[foundIndex];
    }

    return result;
  };

  _proto.isItemInState = function isItemInState(name, item, testForEqualityFunction) {
    // assumes state is an array
    this._ensureStatePresent(name);

    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true;
    }

    return result;
  };

  _proto.removeItemFromState = function removeItemFromState(name, item, testForEqualityFunction) {
    this._ensureStatePresent(name);

    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true; // remove the item from the state

      smLogger('State Manager: Found item - removing ');
      state.splice(foundIndex, 1);
      smLogger(state);

      this._removeItemFromState(name, item, testForEqualityFunction);

      this.setStateByName(name, state, false);
      this.informChangeListenersForStateWithName(name, item, stateEventType.ItemDeleted);
    }

    return result;
  };

  _proto.updateItemInState = function updateItemInState(name, item, testForEqualityFunction) {
    this._ensureStatePresent(name);

    var result = false;
    var state = this.getStateByName(name);
    var foundIndex = state.findIndex(function (element) {
      return testForEqualityFunction(element, item);
    });

    if (foundIndex >= 0) {
      result = true;
      var oldItem = state[foundIndex];
      smLogger('State Manager: Found item - replacing ');
      state.splice(foundIndex, 1, item);
      smLogger(state);

      this._updateItemInState(name, item, testForEqualityFunction);

      this.setStateByName(name, state, false);
      this.informChangeListenersForStateWithName(name, item, stateEventType.ItemUpdated, oldItem);
    } else {
      // add the item to the state
      this.addNewItemToState(name, item);
    }

    return result;
  };

  return AbstractStateManager;
}();

/***/ }),

/***/ "./src/state/AggregateStateManager.ts":
/*!********************************************!*\
  !*** ./src/state/AggregateStateManager.ts ***!
  \********************************************/
/*! exports provided: AggregateStateManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AggregateStateManager", function() { return AggregateStateManager; });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AbstractStateManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractStateManager */ "./src/state/AbstractStateManager.ts");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var aggLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('state-manager-aggregate');
var AggregateStateManager = /*#__PURE__*/function (_AbstractStateManager) {
  _inheritsLoose(AggregateStateManager, _AbstractStateManager);

  AggregateStateManager.getInstance = function getInstance() {
    if (!AggregateStateManager._instance) {
      AggregateStateManager._instance = new AggregateStateManager();
    }

    return AggregateStateManager._instance;
  };

  function AggregateStateManager() {
    var _this;

    _this = _AbstractStateManager.call(this) || this;
    _this.stateManagers = [];
    _this.suppressEventEmits = false;
    return _this;
  }

  var _proto = AggregateStateManager.prototype;

  _proto.addStateManager = function addStateManager(stateManager, filters) {
    if (filters === void 0) {
      filters = [];
    }

    var mWF = {
      manager: stateManager,
      filters: filters
    };
    this.stateManagers.push(mWF);
    stateManager.suppressEvents();
    aggLogger('adding state manager with/without filters');
  };

  _proto.stateNameInFilters = function stateNameInFilters(name, filters) {
    var foundIndex = filters.findIndex(function (filter) {
      return filter === name;
    });
    return foundIndex >= 0;
  };

  _proto._addNewNamedStateToStorage = function _addNewNamedStateToStorage(state) {
    var _this2 = this;

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this2.stateNameInFilters(state.name, managerWithFilters.filters)) {
        managerWithFilters.manager._addNewNamedStateToStorage(state);
      }
    });
  };

  _proto._getState = function _getState(name) {
    var _this3 = this;

    var state = {
      name: name,
      value: []
    };
    this.stateManagers.forEach(function (sm) {
      if (!_this3.stateNameInFilters(state.name, sm.filters)) {
        aggLogger("get state from state manager for state " + name);
        aggLogger(sm.manager);
        state = sm.manager._getState(name);
      }
    });
    return state;
  };

  _proto._ensureStatePresent = function _ensureStatePresent(name) {
    var _this4 = this;

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this4.stateNameInFilters(name, managerWithFilters.filters)) {
        managerWithFilters.manager._ensureStatePresent(name);
      }
    });
  };

  _proto._replaceNamedStateInStorage = function _replaceNamedStateInStorage(state) {
    var _this5 = this;

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this5.stateNameInFilters(state.name, managerWithFilters.filters)) {
        managerWithFilters.manager._replaceNamedStateInStorage(state);
      }
    });
  };

  _proto._saveState = function _saveState(name, stateObj) {
    var _this6 = this;

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this6.stateNameInFilters(name, managerWithFilters.filters)) {
        managerWithFilters.manager._saveState(name, stateObj);
      }
    });
  };

  _proto._addItemToState = function _addItemToState(name, stateObj, isPersisted) {
    var _this7 = this;

    if (isPersisted === void 0) {
      isPersisted = false;
    }

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this7.stateNameInFilters(name, managerWithFilters.filters)) {
        aggLogger("adding item to state in  state manager for state " + name + ", is persisted = " + isPersisted);
        aggLogger(managerWithFilters.manager);

        managerWithFilters.manager._addItemToState(name, stateObj, isPersisted);
      }
    });
  };

  _proto._removeItemFromState = function _removeItemFromState(name, stateObj, testForEqualityFunction) {
    var _this8 = this;

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this8.stateNameInFilters(name, managerWithFilters.filters)) {
        aggLogger("removing item from state in state manager for state " + name);
        aggLogger(managerWithFilters.manager);

        managerWithFilters.manager._removeItemFromState(name, stateObj, testForEqualityFunction);
      }
    });
  };

  _proto._updateItemInState = function _updateItemInState(name, stateObj, testForEqualityFunction) {
    var _this9 = this;

    this.stateManagers.forEach(function (managerWithFilters) {
      if (!_this9.stateNameInFilters(name, managerWithFilters.filters)) {
        aggLogger("updating item in state in  state manager for state " + name);
        aggLogger(managerWithFilters.manager);

        managerWithFilters.manager._updateItemInState(name, stateObj, testForEqualityFunction);
      }
    });
  };

  return AggregateStateManager;
}(_AbstractStateManager__WEBPACK_IMPORTED_MODULE_1__["AbstractStateManager"]);

/***/ }),

/***/ "./src/state/AsyncStateManagerWrapper.ts":
/*!***********************************************!*\
  !*** ./src/state/AsyncStateManagerWrapper.ts ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return AsyncStateManagerWrapper; });
/* harmony import */ var _AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractStateManager */ "./src/state/AbstractStateManager.ts");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_1__);
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var asyncLogger = debug__WEBPACK_IMPORTED_MODULE_1___default()('state-manager-async');

var AsyncStateManagerWrapper = /*#__PURE__*/function (_AbstractStateManager) {
  _inheritsLoose(AsyncStateManagerWrapper, _AbstractStateManager);

  function AsyncStateManagerWrapper(topLevelSM, wrappedSM) {
    var _this;

    _this = _AbstractStateManager.call(this) || this;
    _this.topLevelSM = topLevelSM;
    _this.wrappedSM = wrappedSM;
    _this.forceSaves = false;

    var stateNamesToMonitor = _this.wrappedSM.getConfiguredStateNames();

    _this.stateChanged = _this.stateChanged.bind(_assertThisInitialized(_this));
    _this.stateChangedItemAdded = _this.stateChangedItemAdded.bind(_assertThisInitialized(_this));
    _this.stateChangedItemRemoved = _this.stateChangedItemRemoved.bind(_assertThisInitialized(_this));
    _this.stateChangedItemUpdated = _this.stateChangedItemUpdated.bind(_assertThisInitialized(_this));
    stateNamesToMonitor.forEach(function (stateName) {
      _this.wrappedSM.addChangeListenerForName(stateName, _assertThisInitialized(_this));
    });
    return _this;
  }

  var _proto = AsyncStateManagerWrapper.prototype;

  _proto._addItemToState = function _addItemToState(name, stateObj, isPersisted) {
    if (isPersisted === void 0) {
      isPersisted = false;
    }

    asyncLogger("adding item to state " + name + " - is persisted " + isPersisted);

    this.wrappedSM._addItemToState(name, stateObj, isPersisted);
  };

  _proto._getState = function _getState(name) {
    // assume wrapped SM is asynchronous
    // make the call to get state but supply the caller with an empty state for now
    asyncLogger("getting state " + name);

    this.wrappedSM._getState(name);

    return {
      name: name,
      value: []
    };
  };

  _proto._removeItemFromState = function _removeItemFromState(name, stateObj, testForEqualityFunction) {
    asyncLogger("removing item from state " + name);

    this.wrappedSM._removeItemFromState(name, stateObj, testForEqualityFunction);
  };

  _proto._updateItemInState = function _updateItemInState(name, stateObj, testForEqualityFunction) {
    asyncLogger("updating item in state " + name);

    this.wrappedSM._updateItemInState(name, stateObj, testForEqualityFunction);
  };

  _proto._ensureStatePresent = function _ensureStatePresent(name) {
    this.wrappedSM._ensureStatePresent(name);
  };

  _proto._addNewNamedStateToStorage = function _addNewNamedStateToStorage(state) {} // assume already present
  ;

  _proto._replaceNamedStateInStorage = function _replaceNamedStateInStorage(state) {} // not implemented, not replacing state wholesale
  ;

  _proto._saveState = function _saveState(name, stateObj) {} // not implemented, not replacing state wholesale
  ;

  _proto.stateChangedItemRemoved = function stateChangedItemRemoved(name, itemRemoved) {} // not implemented, assumes called to wrapped SM worked
  ;

  _proto.stateChangedItemUpdated = function stateChangedItemUpdated(name, itemUpdated, itemNewValue) {} // not implemented, assumes called to wrapped SM worked
  ;

  _proto.stateChanged = function stateChanged(name, newValue) {
    // received new state from the wrapped SM
    // pass the received state to the top level SM
    asyncLogger("Wrapped SM has supplied new state " + name + " passing to top level SM");

    this.topLevelSM._saveState(name, newValue);

    this.topLevelSM.informChangeListenersForStateWithName(name, newValue, _AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__["stateEventType"].StateChanged);
  };

  _proto.stateChangedItemAdded = function stateChangedItemAdded(name, itemAdded) {
    asyncLogger("Wrapped SM has supplied new completed item for state " + name + " passing to top level SM");

    this.topLevelSM._addItemToState(name, itemAdded, true);
  };

  return AsyncStateManagerWrapper;
}(_AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__["AbstractStateManager"]);



/***/ }),

/***/ "./src/state/AsynchronousStateManager.ts":
/*!***********************************************!*\
  !*** ./src/state/AsynchronousStateManager.ts ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractStateManager */ "./src/state/AbstractStateManager.ts");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var AsynchronousStateManager = /*#__PURE__*/function (_AbstractStateManager) {
  _inheritsLoose(AsynchronousStateManager, _AbstractStateManager);

  function AsynchronousStateManager() {
    return _AbstractStateManager.apply(this, arguments) || this;
  }

  return AsynchronousStateManager;
}(_AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__["AbstractStateManager"]);

/* harmony default export */ __webpack_exports__["default"] = (AsynchronousStateManager);

/***/ }),

/***/ "./src/state/BrowserStorageStateManager.ts":
/*!*************************************************!*\
  !*** ./src/state/BrowserStorageStateManager.ts ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BrowserStorageStateManager; });
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AbstractStateManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractStateManager */ "./src/state/AbstractStateManager.ts");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var lsLogger = debug__WEBPACK_IMPORTED_MODULE_0___default()('local-storage');

var BrowserStorageStateManager = /*#__PURE__*/function (_AbstractStateManager) {
  _inheritsLoose(BrowserStorageStateManager, _AbstractStateManager);

  BrowserStorageStateManager.getInstance = function getInstance(useLocalStorage) {
    if (useLocalStorage === void 0) {
      useLocalStorage = false;
    }

    if (!BrowserStorageStateManager._instance) {
      BrowserStorageStateManager._instance = new BrowserStorageStateManager(useLocalStorage);
    }

    return BrowserStorageStateManager._instance;
  };

  function BrowserStorageStateManager(useLocalStorage) {
    var _this;

    if (useLocalStorage === void 0) {
      useLocalStorage = false;
    }

    _this = _AbstractStateManager.call(this) || this;
    _this.storage = window.sessionStorage;
    if (useLocalStorage) _this.storage = window.localStorage;
    _this.forceSaves = true;
    return _this;
  }

  var _proto = BrowserStorageStateManager.prototype;

  _proto._ensureStatePresent = function _ensureStatePresent(name) {
    if (this.storage.getItem(name) === null) {
      this._addNewNamedStateToStorage({
        name: name,
        value: []
      });
    }
  };

  _proto._addNewNamedStateToStorage = function _addNewNamedStateToStorage(state) {
    lsLogger("Local Storage: Saving with key " + state.name);
    lsLogger(state);
    var stringifiedSaveData = JSON.stringify(state.value);
    lsLogger(stringifiedSaveData);
    this.storage.setItem(state.name, stringifiedSaveData);
  };

  _proto._replaceNamedStateInStorage = function _replaceNamedStateInStorage(state) {
    this._addNewNamedStateToStorage(state);
  };

  _proto._getState = function _getState(name) {
    var savedResults = [];
    lsLogger("Local Storage: Loading with key " + name);
    var savedResultsJSON = this.storage.getItem(name);
    lsLogger(savedResultsJSON);

    if (savedResultsJSON !== null) {
      savedResults = JSON.parse(savedResultsJSON);
    }

    return savedResults;
  };

  _proto._saveState = function _saveState(name, newValue) {
    this._addNewNamedStateToStorage({
      name: name,
      value: newValue
    });
  };

  _proto._addItemToState = function _addItemToState(name, stateObj, isPersisted) {
    if (isPersisted === void 0) {
      isPersisted = false;
    }
  };

  _proto._removeItemFromState = function _removeItemFromState(name, stateObj, testForEqualityFunction) {};

  _proto._updateItemInState = function _updateItemInState(name, stateObj, testForEqualityFunction) {};

  return BrowserStorageStateManager;
}(_AbstractStateManager__WEBPACK_IMPORTED_MODULE_1__["AbstractStateManager"]);



/***/ }),

/***/ "./src/state/MemoryStateManager.ts":
/*!*****************************************!*\
  !*** ./src/state/MemoryStateManager.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AbstractStateManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AbstractStateManager */ "./src/state/AbstractStateManager.ts");
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}



var msManager = debug__WEBPACK_IMPORTED_MODULE_0___default()('state-manager-ms');
/** To Do - make state unchangeable outside of this class (i.e. deep copies) */

var MemoryStateManager = /*#__PURE__*/function (_AbstractStateManager) {
  _inheritsLoose(MemoryStateManager, _AbstractStateManager);

  MemoryStateManager.getInstance = function getInstance() {
    if (!MemoryStateManager._instance) {
      MemoryStateManager._instance = new MemoryStateManager();
    }

    return MemoryStateManager._instance;
  };

  function MemoryStateManager() {
    var _this;

    _this = _AbstractStateManager.call(this) || this;
    _this.applicationState = [];
    _this.forceSaves = true;
    return _this;
  }

  var _proto = MemoryStateManager.prototype;

  _proto._ensureStatePresent = function _ensureStatePresent(name) {
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex < 0) {
      var state = {
        name: name,
        value: []
      };
      this.applicationState.push(state);
    }
  };

  _proto._addNewNamedStateToStorage = function _addNewNamedStateToStorage(state) {
    this.applicationState.push(state);
  };

  _proto._replaceNamedStateInStorage = function _replaceNamedStateInStorage(state) {
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === state.name;
    });

    if (foundIndex > 0) {
      this.applicationState.splice(foundIndex, 1, state);
    }
  };

  _proto._getState = function _getState(name) {
    // @ts-ignore
    return this.applicationState.find(function (element) {
      return element.name === name;
    });
  };

  _proto._saveState = function _saveState(name, stateObject) {
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex > 0) {
      var state = this.applicationState[foundIndex];
      state.value = stateObject;
    }
  };

  _proto._addItemToState = function _addItemToState(name, stateObj, isPersisted) {
    if (isPersisted === void 0) {
      isPersisted = false;
    }

    if (!isPersisted) return; // dont add incomplete objects to the state

    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex > 0) {
      var state = this.applicationState[foundIndex];
      state.value.push(stateObj);
    }
  };

  _proto._removeItemFromState = function _removeItemFromState(name, stateObj, testForEqualityFunction) {
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex > 0) {
      var state = this.applicationState[foundIndex];
      var valueIndex = state.value.findIndex(function (element) {
        return testForEqualityFunction(element, stateObj);
      });

      if (valueIndex >= 0) {
        state.value.splice(valueIndex, 1);
      }
    }
  };

  _proto._updateItemInState = function _updateItemInState(name, stateObj, testForEqualityFunction) {
    var foundIndex = this.applicationState.findIndex(function (element) {
      return element.name === name;
    });

    if (foundIndex > 0) {
      var state = this.applicationState[foundIndex];
      var valueIndex = state.value.findIndex(function (element) {
        return testForEqualityFunction(element, stateObj);
      });

      if (valueIndex >= 0) {
        state.value.splice(valueIndex, 1, stateObj);
      }
    }
  };

  return MemoryStateManager;
}(_AbstractStateManager__WEBPACK_IMPORTED_MODULE_1__["AbstractStateManager"]);

/* harmony default export */ __webpack_exports__["default"] = (MemoryStateManager);

/***/ }),

/***/ "./src/state/RESTApiStateManager.ts":
/*!******************************************!*\
  !*** ./src/state/RESTApiStateManager.ts ***!
  \******************************************/
/*! exports provided: RESTApiStateManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RESTApiStateManager", function() { return RESTApiStateManager; });
/* harmony import */ var _AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractStateManager */ "./src/state/AbstractStateManager.ts");
/* harmony import */ var _network_Types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../network/Types */ "./src/network/Types.ts");
/* harmony import */ var _network_DownloadManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../network/DownloadManager */ "./src/network/DownloadManager.ts");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! debug */ "./node_modules/debug/src/browser.js");
/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _AsynchronousStateManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AsynchronousStateManager */ "./src/state/AsynchronousStateManager.ts");
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}






var apiSMLogger = debug__WEBPACK_IMPORTED_MODULE_3___default()('state-manager-api');
var RESTApiStateManager = /*#__PURE__*/function (_AsychronousStateMana) {
  _inheritsLoose(RESTApiStateManager, _AsychronousStateMana);

  RESTApiStateManager.getInstance = function getInstance() {
    if (!RESTApiStateManager._instance) {
      RESTApiStateManager._instance = new RESTApiStateManager();
    }

    return RESTApiStateManager._instance;
  };

  function RESTApiStateManager() {
    var _this;

    _this = _AsychronousStateMana.call(this) || this;
    _this.configuration = [];
    _this.forceSaves = false;
    _this.bHasCompletedRun = [];
    _this.callbackForAddItem = _this.callbackForAddItem.bind(_assertThisInitialized(_this));
    _this.callbackForRemoveItem = _this.callbackForRemoveItem.bind(_assertThisInitialized(_this));
    _this.callbackForUpdateItem = _this.callbackForUpdateItem.bind(_assertThisInitialized(_this));
    _this.callbackForGetItems = _this.callbackForGetItems.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = RESTApiStateManager.prototype;

  _proto.getConfiguredStateNames = function getConfiguredStateNames() {
    var results = [];
    this.configuration.forEach(function (config) {
      results.push(config.stateName);
    });
    return results;
  };

  _proto.hasCompletedRun = function hasCompletedRun(stateName) {
    var result = false;
    var foundIndex = this.configuration.findIndex(function (config) {
      return config.stateName === stateName;
    });

    if (foundIndex >= 0) {
      result = this.bHasCompletedRun[foundIndex];
    }

    return result;
  };

  _proto.setCompletedRun = function setCompletedRun(stateName) {
    var foundIndex = this.configuration.findIndex(function (config) {
      return config.stateName === stateName;
    });

    if (foundIndex >= 0) {
      this.bHasCompletedRun[foundIndex] = true;
    }
  };

  _proto.forceResetForGet = function forceResetForGet(stateName) {
    var foundIndex = this.configuration.findIndex(function (config) {
      return config.stateName === stateName;
    });

    if (foundIndex >= 0) {
      this.bHasCompletedRun[foundIndex] = false;
    }
  };

  _proto.initialise = function initialise(config) {
    this.configuration = config;
    var runsComplete = [];
    this.configuration.forEach(function (configItem) {
      runsComplete.push(false);
    });
    this.bHasCompletedRun = runsComplete;
  };

  _proto.getConfigurationForStateName = function getConfigurationForStateName(name) {
    var config = {
      stateName: name,
      serverURL: '',
      api: '',
      isActive: false
    };
    var foundIndex = this.configuration.findIndex(function (config) {
      return config.stateName === name;
    });

    if (foundIndex >= 0) {
      config = this.configuration[foundIndex];
    }

    return config;
  };

  _proto.callbackForRemoveItem = function callbackForRemoveItem(data, status, associatedStateName) {
    apiSMLogger('callback for remove item - assuming client state manager has already removed');

    if (status >= 200 && status <= 299) {
      // do we have any data?
      apiSMLogger(data);
    }
  };

  _proto.callbackForUpdateItem = function callbackForUpdateItem(data, status, associatedStateName) {
    apiSMLogger('callback for remove item - assuming client state manager has already updated');

    if (status >= 200 && status <= 299) {
      // do we have any data?
      apiSMLogger(data);
    }
  };

  _proto.callbackForGetItems = function callbackForGetItems(data, status, associatedStateName) {
    apiSMLogger('callback for add item');

    if (status >= 200 && status <= 299) {
      // do we have any data?
      apiSMLogger(data);
      this.setCompletedRun(associatedStateName);
      this.informChangeListenersForStateWithName(associatedStateName, data, _AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__["stateEventType"].StateChanged);
    }
  };

  _proto.callbackForAddItem = function callbackForAddItem(data, status, associatedStateName) {
    apiSMLogger('callback for add item');

    if (status >= 200 && status <= 299) {
      // do we have any data?
      apiSMLogger(data);
      var config = this.getConfigurationForStateName(associatedStateName);
      this.informChangeListenersForStateWithName(associatedStateName, data, _AbstractStateManager__WEBPACK_IMPORTED_MODULE_0__["stateEventType"].ItemAdded);
    }
  };

  _proto._addNewNamedStateToStorage = function _addNewNamedStateToStorage(state) {
    /* assume model on the other end exists */
  };

  _proto._getState = function _getState(name) {
    apiSMLogger("Getting All " + name);

    if (this.hasCompletedRun(name)) {
      apiSMLogger("Getting All " + name + " - not done - previously retrieved");
    } else {
      var config = this.getConfigurationForStateName(name);

      if (config.isActive) {
        var jsonRequest = {
          url: config.serverURL + config.api,
          type: _network_Types__WEBPACK_IMPORTED_MODULE_1__["RequestType"].GET,
          params: {},
          callback: this.callbackForGetItems,
          associatedStateName: name
        };
        _network_DownloadManager__WEBPACK_IMPORTED_MODULE_2__["default"].addApiRequest(jsonRequest, true);
      } else {
        apiSMLogger("No configuration for state " + name);
      }
    }

    var state = {
      name: name,
      value: []
    };
    return state;
  };

  _proto._ensureStatePresent = function _ensureStatePresent(name) {
    /* assume state exists */
  };

  _proto._replaceNamedStateInStorage = function _replaceNamedStateInStorage(state) {
    /* not going to replace all state */
  };

  _proto._saveState = function _saveState(name, stateObj) {
    /* not going to replace all state */
  };

  _proto._addItemToState = function _addItemToState(name, stateObj, isPersisted) {
    if (isPersisted === void 0) {
      isPersisted = false;
    }

    if (isPersisted) return; // dont add complete objects to the state - they are already processed

    apiSMLogger("Adding item to " + name);
    apiSMLogger(stateObj);
    var config = this.getConfigurationForStateName(name);

    if (config.isActive) {
      var jsonRequest = {
        url: config.serverURL + config.api,
        type: _network_Types__WEBPACK_IMPORTED_MODULE_1__["RequestType"].POST,
        params: stateObj,
        callback: this.callbackForAddItem,
        associatedStateName: name
      };
      _network_DownloadManager__WEBPACK_IMPORTED_MODULE_2__["default"].addApiRequest(jsonRequest, true);
    } else {
      apiSMLogger("No configuration for state " + name);
    }
  };

  _proto._removeItemFromState = function _removeItemFromState(name, stateObj, testForEqualityFunction) {
    apiSMLogger("Removing item to " + name);
    apiSMLogger(stateObj);
    var config = this.getConfigurationForStateName(name);

    if (config.isActive) {
      var jsonRequest = {
        url: config.serverURL + config.api,
        type: _network_Types__WEBPACK_IMPORTED_MODULE_1__["RequestType"].DELETE,
        params: {
          id: stateObj.id
        },
        callback: this.callbackForRemoveItem,
        associatedStateName: name
      };
      _network_DownloadManager__WEBPACK_IMPORTED_MODULE_2__["default"].addApiRequest(jsonRequest, true);
    } else {
      apiSMLogger("No configuration for state " + name);
    }
  };

  _proto._updateItemInState = function _updateItemInState(name, stateObj, testForEqualityFunction) {
    apiSMLogger("Updating item in " + name);
    apiSMLogger(stateObj);
    var config = this.getConfigurationForStateName(name);

    if (config.isActive) {
      var jsonRequest = {
        url: config.serverURL + config.api,
        type: _network_Types__WEBPACK_IMPORTED_MODULE_1__["RequestType"].PUT,
        params: stateObj,
        callback: this.callbackForUpdateItem,
        associatedStateName: name
      };
      _network_DownloadManager__WEBPACK_IMPORTED_MODULE_2__["default"].addApiRequest(jsonRequest, true);
    } else {
      apiSMLogger("No configuration for state " + name);
    }
  };

  return RESTApiStateManager;
}(_AsynchronousStateManager__WEBPACK_IMPORTED_MODULE_4__["default"]);

/***/ }),

/***/ "./src/util/BrowserUtil.ts":
/*!*********************************!*\
  !*** ./src/util/BrowserUtil.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var BrowserUtil = /*#__PURE__*/function () {
  function BrowserUtil() {}

  var _proto = BrowserUtil.prototype;

  _proto.scrollSmoothToId = function scrollSmoothToId(elementId) {
    var element = document.getElementById(elementId);

    if (element !== null) {
      element.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });
    }
  };

  _proto.scrollSmoothTo = function scrollSmoothTo(element) {
    element.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  };

  _proto.removeAllChildren = function removeAllChildren(element) {
    if (element && element.firstChild) {
      while (element.firstChild) {
        var lastChild = element.lastChild;
        if (lastChild) element.removeChild(lastChild);
      }
    }
  };

  _proto.addRemoveClasses = function addRemoveClasses(element, classesText, isAdding) {
    if (isAdding === void 0) {
      isAdding = true;
    }

    var classes = classesText.split(' ');
    classes.forEach(function (classValue) {
      if (classValue.trim().length > 0) {
        if (isAdding) {
          element.classList.add(classValue);
        } else {
          element.classList.remove(classValue);
        }
      }
    });
  };

  return BrowserUtil;
}();

var browserUtil = new BrowserUtil();
/* harmony default export */ __webpack_exports__["default"] = (browserUtil);

/***/ }),

/***/ "./src/util/EqualityFunctions.ts":
/*!***************************************!*\
  !*** ./src/util/EqualityFunctions.ts ***!
  \***************************************/
/*! exports provided: isSame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSame", function() { return isSame; });
function isSame(item1, item2) {
  return item1.id === item2.id;
}

/***/ }),

/***/ "./src/util/UUID.ts":
/*!**************************!*\
  !*** ./src/util/UUID.ts ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var UUID = /*#__PURE__*/function () {
  function UUID() {}

  var _proto = UUID.prototype;

  _proto.getUniqueId = function getUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  return UUID;
}();

var uuid = new UUID();
/* harmony default export */ __webpack_exports__["default"] = (uuid);

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/App.tsx ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/App.tsx */"./src/App.tsx");


/***/ })

/******/ });
//# sourceMappingURL=app.bundle.js.map