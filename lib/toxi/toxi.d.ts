declare module toxi.color {


    export interface TColor {



        //dirty:boolean;
        //padding:number;
        //uniforms:any;
        //fragmentSrc:string[];
        //
        //apply(frameBuffer:WebGLFramebuffer):void;
        //syncUniforms():void;

        newRGB(r:number, g:number, b:number):TColor;
        adjustRGB(r:number, g:number, b:number):TColor;
        adjustHSV(h:number, s:number, v:number):TColor;
        setHSV(h:number, s:number, v:number):TColor;
        lighten(step:number):TColor;
        setBrightness(brightness:number):TColor;

        toHex():number;
        toHexCSS():String;
        toInt():number;


    }


}

