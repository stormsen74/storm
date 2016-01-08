/**
 * Created by STORMSEN on 23.04.2015.
 */


///<reference path="../../lib/pixi/pixi.d.ts"/>
///<reference path="../../scripts/Vec2.ts"/>
///<reference path="../../scripts/utils/mathUtils.ts"/>
///<reference path="../../lib/color/color.d.ts"/>
///<reference path="../../lib/perlin/perlin.d.ts"/>
///<reference path="../../lib/toxi/toxi.d.ts"/>

declare var toxi:any;

class FlowField {

    private width:number;
    private height:number;
    private cellWidth:number;
    private cellHeight:number;
    private mappedX:number;
    private mappedY:number;
    private vArray:Array<any>;
    private canvas:PIXI.Container;
    private graphics:PIXI.Graphics;

    //private color:net.brehaut.Color;
    private color:toxi.color.TColor = toxi.color.TColor.newRGB(1, 1, 1);

    private t_center:PIXI.Point = new PIXI.Point(0, 0);
    private range:number = 20;
    private t:number = 0;
    private deltaT:number = 0.0025;
    private vCell:Vec2 = new Vec2(0, 0);
    private fieldX:number;
    private fieldY:number;
    private FIELD_SEED:number = 0.3755982327274978;
    private FIELD_SCALE:number = 10;
    private PERLIN_THETA:number = 0;


    constructor(width:number, height:number, canvas:PIXI.Container = null) {

        if (canvas != null) {
            this.canvas = canvas;
            this.graphics = new PIXI.Graphics();
            this.canvas.addChild(this.graphics);
        }

        this.width = width;
        this.height = height;

        this.cellWidth = width / this.range;
        this.cellHeight = height / this.range;

        this.vArray = new Array(this.range);
        for (var i = 0; i < this.vArray.length; i++) {
            this.vArray[i] = new Array<Vec2>(this.range);
        }


        //this.initField();

        //this.FIELD_SEED = Math.random();
        //console.log(this.FIELD_SEED);
        //0.10276060947217047
        //0.8413604872766882
        //0.3755982327274978
        this.initPerlinField();

    }

    private initField() {

        var vCell:Vec2 = new Vec2();

        var a1 = -2.5;
        var b1 = 7;
        var a2 = -6.75;
        var b2 = -1.85;

        for (var i = 0; i < this.vArray.length; i++) {

            var fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                var fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ RULE ? */

                // |x^2-y^2,x+y|
                //vCell.set(Math.pow(fieldX, 2) - Math.pow(fieldY, 2), fieldX + fieldY);

                // |x^2,y^2|
                //vCell.set(Math.pow(fieldX, 2), Math.pow(fieldY, 2));

                // |y^2,x^2|
                //vCell.set(Math.pow(fieldY, 2), Math.pow(fieldX, 2));

                // |cos(x^2+y),x+y^2+1|
                //vCell.set(Math.cos(Math.pow(fieldX, 2) + fieldY), fieldX - Math.pow(fieldY, 2) + 1);

                /* ~ RULE ? */

                //http://demonstrations.wolfram.com/PhasePortraitAndFieldDirectionsOfTwoDimensionalLinearSystems/
                //vCell.set(a1 * fieldX + b1 * fieldY, a2 * fieldX + b2 * fieldY);


                var mag = vCell.length();
                mag = 1 / mag;
                vCell.normalize();
                vCell.multiply(mag);

                this.vArray[i][j] = vCell.clone();

                //console.log(i, j, this.vArray[i][j]);
            }
        }

    }

    private initPerlinField() {

        noise.seed(this.FIELD_SEED);

        var vCell:Vec2 = new Vec2();

        for (var i = 0; i < this.vArray.length; i++) {

            var fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0; j < this.vArray[1].length; j++) {

                var fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ perlin-noise ~*/
                var theta = mathUtils.convertToRange(noise.perlin2(fieldX / this.FIELD_SCALE, fieldY / this.FIELD_SCALE), [-1, 1], [0, mathUtils.TWO_PI]);

                vCell.set(Math.cos(theta), Math.sin(theta));

                //var mag = vCell.length();
                //mag = 1 / mag;


                vCell.normalize();
                var mag = Math.abs(noise.perlin2(fieldX / this.FIELD_SCALE, fieldY / this.FIELD_SCALE)) * 15;
                vCell.multiply(mag);

                this.vArray[i][j] = vCell.clone();

            }
        }

    }

    public perlinField() {

        this.t += this.deltaT;


        for (var i = 0, len = this.vArray.length; i < len; i++) {

            this.fieldX = mathUtils.convertToRange(i, [0, this.range - 1], [-this.range * .5, this.range * .5]);

            for (var j = 0, len2 = this.vArray[1].length; j < len2; j++) {

                this.fieldY = mathUtils.convertToRange(j, [0, this.range - 1], [-this.range * .5, this.range * .5]);

                /* ~ perlin-noise ~*/
                this.PERLIN_THETA = mathUtils.convertToRange(noise.perlin3(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE, this.t), [-1, 1], [0, mathUtils.TWO_PI]);

                this.vCell.set(Math.cos(this.PERLIN_THETA), Math.sin(this.PERLIN_THETA));

                //var mag = vCell.length();
                //mag = 1 / mag;


                this.vCell.normalize();
                var mag = Math.abs(noise.simplex2(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE)) * 15;
                //var mag = Math.abs(noise.perlin3(this.fieldX / this.FIELD_SCALE, this.fieldY / this.FIELD_SCALE, this.t)) * 15;
                this.vCell.multiply(mag);

                this.vArray[i][j] = this.vCell.clone();

            }
        }

    }

    public lookup(vLookup:Vec2) {

        // reference vector -> position
        var vMap:Vec2 = vLookup.clone();

        // limit this vector
        vMap.min(0, 0);
        vMap.max(this.width, this.height);

        // map range
        this.mappedX = ~~mathUtils.convertToRange(vMap.x, [0, this.width], [0, this.range - 1]);
        this.mappedY = ~~mathUtils.convertToRange(vMap.y, [0, this.height], [0, this.range - 1]);

        // console.log(vLookup.x, canvas.width);
        // console.log(vLookup.y, canvas.height);

        return this.vArray[this.mappedX][this.mappedY].clone();
    }

    public modify() {
        var vCell = new Vec2();

        for (var i = 0; i < this.vArray.length; i++) {
            for (var j = 0; j < this.vArray[1].length; j++) {
                vCell = this.vArray[i][j].clone();
                vCell.toPolar();
                vCell.y += this.deltaT;
                vCell.toCartesian();
                this.vArray[i][j] = vCell.clone();
            }
        }
    }

    public draw() {

        this.graphics.clear();

        var magVector:Vec2;
        var value:number;

        for (var i = 0; i < this.vArray.length; i++) {

            for (var j = 0; j < this.vArray[1].length; j++) {

                //this.graphics.lineStyle(1, 0x006699, .1);

                // draw cols
                //this.graphics.moveTo(i * this.cellWidth, 0);
                //this.graphics.lineTo(i * this.cellWidth, this.height);

                // draw rows
                //this.graphics.moveTo(0, j * this.cellHeight);
                //this.graphics.lineTo(this.canvas.width + this.cellWidth * .5, j * this.cellHeight);

                //draw center point
                //this.graphics.lineStyle(0, 0x000000, 0);
                //this.graphics.beginFill(0xcc0000);

                this.t_center.x = i * this.cellWidth + this.cellWidth * .5;
                this.t_center.y = j * this.cellHeight + this.cellHeight * .5;

                //this.graphics.arc(centerX, centerY, 2, 0, 2 * 3.14, false);

                // draw mag vector
                this.graphics.moveTo(this.t_center.x, this.t_center.y);

                magVector = this.vArray[i][j].clone();
                value = mathUtils.convertToRange(magVector.length(), [0, 18], [0, 1]);
                this.color.setHSV(.5 + value * .5, .5, 0.0);
                this.color.setBrightness(.5 + value);

                this.graphics.lineStyle(1, this.color.toInt(), 1);

                //magVector.normalize();
                magVector.multiply(5);

                //magVector.multiply(this.cellWidth * .5);

                // this.context.lineTo(centerX + this.vArray[[i], [j]].x * 10, centerY + this.vArray[[i], [j]].y * 10);
                this.graphics.lineTo(this.t_center.x + magVector.x, this.t_center.y + magVector.y);


            }
        }


    }


}