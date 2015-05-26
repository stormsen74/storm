/**
 * Created by STORMSEN on 17.04.2015.
 */


class mathUtils {

    public static PI:number = 3.14159265359;
    public static TWO_PI:number = 6.28318530718;
    public static HALF_PI:number = 1.57079632679;


    public static degToRad(deg:number):number {
        return deg * 0.0174532925;
    }

    public static radToDeg(rad:number):number {
        return rad * 57.2957795;
    }

    public static getRandomBetween(min:number, max:number) {
        return min + Math.random() * (max - min);
    }

    public static convertToRange(value:number, srcRange:Array<number>, dstRange:Array<number>):number {
        // value is outside source range return
        if (value < srcRange[0] || value > srcRange[1]) {
            return NaN;
        }

        var srcMax = srcRange[1] - srcRange[0], dstMax = dstRange[1] - dstRange[0], adjValue = value - srcRange[0];

        return (adjValue * dstMax / srcMax) + dstRange[0];

    }
}