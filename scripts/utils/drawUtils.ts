/**
 * Created by michael.sturm on 07.05.2015.
 */


///<reference path="../../lib/pixi/pixi.d.ts"/>

class drawUtils {

    public static line(g:PIXI.Graphics, p1:Array<number>, p2:Array<number>):void {

        g.moveTo(p1[0], p1[1]);
        g.lineTo(p2[0], p2[1]);

    }
}