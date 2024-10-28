"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchTurn = exports.Turn = void 0;
var Turn;
(function (Turn) {
    Turn[Turn["ONE"] = 0] = "ONE";
    Turn[Turn["TWO"] = 1] = "TWO";
})(Turn = exports.Turn || (exports.Turn = {}));
const switchTurn = (t) => t === Turn.ONE ? Turn.TWO : Turn.ONE;
exports.switchTurn = switchTurn;
