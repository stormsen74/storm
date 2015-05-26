/**
 * Created by michael.sturm on 28.04.2015.
 */

///<reference path="../lib/toxi/toxi.d.ts"/>
///<reference path="utils/colorUtils.ts"/>

declare var toxi: any;




class Toxic {

    constructor() {

        var c1 = toxi.color.TColor.newRGB(1,1,1);
        console.log(c1.toHex());
    }
}