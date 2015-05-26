/**
 * Created by michael.sturm on 05.05.2015.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../Vec2.ts"/>
var Charge = (function (_super) {
    __extends(Charge, _super);
    function Charge(_x, _y) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        _super.call(this);
        this.charge = 0;
        this.x = _x;
        this.y = _y;
    }
    return Charge;
})(Vec2);
//# sourceMappingURL=Charge.js.map