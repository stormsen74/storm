/**
 * @author stormsen
 */

STORM.ClassA = function () {
    this.value = 100;
    this.name = 'ClassA';
};

STORM.ClassA.prototype = {

    constructor: STORM.ClassA,

    func: function () {

        console.log(this.name, this.value);

    }
};
