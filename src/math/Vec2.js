/**
 * @author stormsen
 */

STORM.Vec2 = function (x, y) {

    this.x = x || 0;
    this.y = y || 0;

};

STORM.Vec2.prototype = {

    constructor: STORM.Vec2,

    set: function (x, y) {

        this.x = x;
        this.y = y;

        return this;
    }
};

