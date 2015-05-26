/**
 * Created by michael.sturm on 05.05.2015.
 */

///<reference path="../Vec2.ts"/>

class Charge extends Vec2 {
    public charge:number = 0;

    constructor(_x:number = 0, _y:number = 0) {
        super();

        this.x = _x;
        this.y = _y;

    }
}