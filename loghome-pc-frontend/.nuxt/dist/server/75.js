exports.ids = [75];
exports.modules = {

/***/ 550:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textCorrectionDB", function() { return textCorrectionDB; });
/* harmony import */ var dexie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(142);
/* harmony import */ var dexie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dexie__WEBPACK_IMPORTED_MODULE_0__);

const textCorrectionDB = new dexie__WEBPACK_IMPORTED_MODULE_0___default.a("loghome-pc-text-correction");
textCorrectionDB.version(1).stores({
  standardCache: "id",
  standardIgnored: "id",
  smartCache: "id",
  smartIgnored: "id"
});

/***/ })

};;
//# sourceMappingURL=75.js.map