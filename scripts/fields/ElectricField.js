/**
 * Created by michael.sturm on 05.05.2015.
 */
///<reference path="../../lib/pixi/pixi.d.ts"/>
///<reference path="../../scripts/Vec2.ts"/>
///<reference path="Charge.ts"/>
///<reference path="../../scripts/utils/mathUtils.ts"/>
///<reference path="../../lib/gsap/greensock.d.ts"/>
///<reference path="../../lib/color/color.d.ts"/>
///<reference path="../../lib/stats/stats.d.ts"/>
///<reference path="../../scripts/Particle.ts"/>
var eF;
var ElectricField = (function () {
    function ElectricField(width, height, canvas) {
        if (canvas === void 0) { canvas = null; }
        this.range = 20;
        eF = this;
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
            this.vArray[i] = new Array(this.range);
        }
        this.Q1 = new Charge(Math.random() * this.width, Math.random() * this.height);
        this.Q1.charge = 1;
        this.Q2 = new Charge(Math.random() * this.width, Math.random() * this.height);
        this.Q2.charge = -1.2;
        this.color = toxi.color.TColor.newRGB(1, 1, 1);
        this.initDrag();
        this.initField();
    }
    ElectricField.prototype.initDrag = function () {
        var overlap = document.createElement('div');
        overlap.id = 'overlap';
        overlap.style.width = this.width + "px";
        overlap.style.height = this.height + "px";
        overlap.style.position = 'absolute';
        //overlap.style.backgroundColor = '#223344';
        //overlap.style.opacity = '.5';
        var qPos = document.createElement('div');
        qPos.setAttribute("class", "knob_p");
        qPos.id = 'qPos';
        var qNeg = document.createElement('div');
        qNeg.setAttribute("class", "knob_n");
        qNeg.id = 'qNeg';
        document.body.appendChild(overlap);
        document.getElementById('overlap').appendChild(qPos);
        document.getElementById('overlap').appendChild(qNeg);
        Draggable.create(qPos, {
            type: "x,y",
            //bounds: {minX: 0, maxX: this.width - 50, minY: 0, maxY: this.height - 50},
            bounds: overlap,
            onDrag: function () {
                eF.Q1.set(this.x + 25, this.y + 25);
            }
        });
        Draggable.create(qNeg, {
            type: "x,y",
            bounds: overlap,
            onDrag: function () {
                eF.Q2.set(this.x + 25, this.y + 25);
            }
        });
        TweenMax.set(qPos, { x: this.Q1.x - 25, y: this.Q1.y - 25 });
        TweenMax.set(qNeg, { x: this.Q2.x - 25, y: this.Q2.y - 25 });
        window.onresize = function (e) {
            TweenMax.set(overlap, { left: (window.innerWidth - eF.width) * .5, top: 30 });
        };
        TweenMax.set(overlap, { left: (window.innerWidth - eF.width) * .5, top: 30 });
    };
    ElectricField.prototype.initField = function () {
        var centerX;
        var centerY;
        for (var i = 0; i < this.vArray.length; i++) {
            for (var j = 0; j < this.vArray[1].length; j++) {
                centerX = i * this.cellWidth + this.cellWidth * .5;
                centerY = j * this.cellHeight + this.cellHeight * .5;
                var vecLocation = new Vec2(centerX, centerY);
                var magVector = this.getForce(vecLocation);
                this.vArray[i][j] = magVector.clone();
            }
        }
    };
    ElectricField.prototype.getForce = function (vecLocation) {
        var rVec1;
        var rVec2;
        var eVec1;
        var eVec2;
        var eVecRes;
        /*--------------------------------------------
         ~ component Vector 1
         --------------------------------------------*/
        rVec1 = Vec2.subtract(vecLocation, this.Q1);
        eVec1 = rVec1.clone();
        // Q/4*PI*e0*eR -> Q = charge (-/+)
        eVec1.multiply(this.Q1.charge / (4 * Math.PI));
        // rVec/r^3 || rVec/r^2
        eVec1.multiply(1 / Math.pow(rVec1.length(), 2));
        eVec1.multiply(20000);
        /*--------------------------------------------
         ~ component Vector 2
         --------------------------------------------*/
        rVec2 = Vec2.subtract(vecLocation, this.Q2);
        eVec2 = rVec2.clone();
        // Q/4*PI*e0*eR -> Q = charge (-/+)
        eVec2.multiply(this.Q2.charge / (4 * Math.PI));
        // rVec/r^3 || rVec/r^2
        eVec2.multiply(1 / Math.pow(rVec2.length(), 2));
        eVec2.multiply(20000);
        /*--------------------------------------------
         ~ resulting Vector
         --------------------------------------------*/
        eVecRes = Vec2.add(eVec1, eVec2);
        return eVecRes;
    };
    ElectricField.prototype.getQPos = function () {
        return [this.Q2, this.Q1];
    };
    ElectricField.prototype.update = function () {
        var centerX;
        var centerY;
        var vecLocation = new Vec2();
        var magVector;
        for (var i = 0; i < this.vArray.length; i++) {
            for (var j = 0; j < this.vArray[1].length; j++) {
                centerX = i * this.cellWidth + this.cellWidth * .5;
                centerY = j * this.cellHeight + this.cellHeight * .5;
                vecLocation.set(centerX, centerY);
                magVector = this.getForce(vecLocation);
                //magVector.normalize();
                //magVector.multiply(30);
                this.vArray[i][j] = magVector.clone();
            }
        }
    };
    ElectricField.prototype.lookup = function (vLookup) {
        // reference vector -> position
        var vMap = vLookup.clone();
        // limit this vector
        vMap.min(0, 0);
        vMap.max(this.width, this.height);
        // map range
        var mappedX = ~~mathUtils.convertToRange(vMap.x, [0, this.width], [0, this.range - 1]);
        var mappedY = ~~mathUtils.convertToRange(vMap.y, [0, this.height], [0, this.range - 1]);
        // console.log(vLookup.x, canvas.width);
        // console.log(vLookup.y, canvas.height);
        return this.vArray[mappedX][mappedY].clone();
    };
    ElectricField.prototype.draw = function () {
        var centerX;
        var centerY;
        var colorValue;
        var magVector;
        this.graphics.clear();
        for (var i = 0; i < this.vArray.length; i++) {
            for (var j = 0; j < this.vArray[1].length; j++) {
                centerX = i * this.cellWidth + this.cellWidth * .5;
                centerY = j * this.cellHeight + this.cellHeight * .5;
                magVector = this.vArray[i][j].clone();
                colorValue = mathUtils.convertToRange(magVector.length(), [0, 125], [0, 1]);
                this.color.setHSV(.5 + colorValue * .5, 1.0, 1.0);
                //var magVector = this.getForce(vecLocation);
                magVector.normalize();
                magVector.multiply(20);
                // draw mag vector
                this.graphics.lineStyle(1, this.color.toInt(), 1);
                this.graphics.moveTo(centerX, centerY);
                // this.context.lineTo(centerX + this.vArray[[i], [j]].x * 10, centerY + this.vArray[[i], [j]].y * 10);
                this.graphics.lineTo(centerX + magVector.x, centerY + magVector.y);
            }
        }
    };
    return ElectricField;
})();
//# sourceMappingURL=ElectricField.js.map