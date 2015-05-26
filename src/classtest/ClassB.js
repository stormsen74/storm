/**
 * @author stormsen
 */

STORM.ClassB = function () {

    // inherit from classA
    STORM.ClassA.call(this);

    // overwrite property
    this.name = 'ClassB';
};


STORM.ClassB.prototype = Object.create(STORM.ClassA.prototype);


STORM.ClassB.prototype.funkB = function () {

    console.log('funkB called!')

};
