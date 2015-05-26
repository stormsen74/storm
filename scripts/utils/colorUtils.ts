/**
 * Created by STORMSEN on 17.04.2015.
 */


class colorUtils {
    public static hexStringToNumber(string:string):number {
        return parseInt(string.substring(1), 16);
    }
}