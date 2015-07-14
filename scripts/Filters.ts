/**
 * Created by michael.sturm on 24.06.2015.
 */

///<reference path="../lib/gsap/greensock.d.ts"/>
///<reference path="../lib/dat/dat-gui.d.ts"/>
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/stats/stats.d.ts"/>


declare var Draggable:any;
declare var FileSaver:any;
var that:Filters;

class Filters {

    private pRenderer;
    private pStage:PIXI.Container;
    private width:number;
    private height:number;
    private container:PIXI.Container;
    private sprite:PIXI.Sprite;
    private pManager:PIXI.interaction.InteractionManager;

    private filter:PIXI.filters.TiltShiftFilter;

    private CONFIG:any;
    private GUI:dat.GUI;
    private _radius:any;
    private pStart:Array<number> = [0, 0];
    private pEnd:Array<number> = [0, 0];

    private SIZE:PIXI.Point = new PIXI.Point(1280, 720);

    constructor() {
        that = this;

        this.pRenderer = PIXI.autoDetectRenderer(this.SIZE.x, this.SIZE.y);
        this.pStage = new PIXI.Container();
        this.container = new PIXI.Container();
        this.pManager = new PIXI.interaction.InteractionManager(this.pRenderer);

        this.pStage.interactive = true;

        //this.pRenderer.view.style.width = window.innerWidth + "px";
        //this.pRenderer.view.style.height = window.innerHeight + "px";
        this.pRenderer.view.style.margin = "0 auto";
        this.pRenderer.view.style.paddingTop = "30px"
        this.pRenderer.view.style.width = this.SIZE.x + "px";
        this.pRenderer.view.style.height = this.SIZE.y + "px";
        this.pRenderer.view.style.display = "block";
        this.pRenderer.view.style.overflow = "hidden";
        this.pRenderer.view.id = "canvas";

        // add render view to DOM
        document.body.appendChild(this.pRenderer.view);


        this.sprite = PIXI.Sprite.fromImage('assets/mountain_1280x720.jpg');
        this.container.addChild(this.sprite);
        this.pStage.addChild(this.container);

        this.addFilter();


        TweenLite.delayedCall(1, function () {

            that.updateDragger();
            that.renderStage();

        });


        this.initDrag();

        this.addGUI();
        //this.animate();


    }

    private saveImage() {
        var c:any = document.getElementById("canvas");
        var dataString = c.toDataURL("image/png");
        window.open(dataString);

        //document.location.href = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
        //
        //var link:any = document.createElement('a');
        //link.download = "test.png";
        //link.href = c.toDataURL("image/png").replace("image/png", "image/octet-stream");;
        //link.click();

    }

    private initDrag() {

        var overlap = document.createElement('div');
        overlap.id = 'overlap';
        overlap.style.width = this.SIZE.x + "px";
        overlap.style.height = this.SIZE.y + "px";
        overlap.style.position = 'absolute';
        overlap.style.top = "0px";
        overlap.style.left = "0px";
        //overlap.style.backgroundColor = '#ff0000';
        //overlap.style.opacity = '.5';

        var start = document.createElement('div');
        start.setAttribute("class", "point");
        start.id = 'start';

        var end = document.createElement('div');
        end.setAttribute("class", "point");
        end.id = 'end';

        document.body.appendChild(overlap);
        document.getElementById('overlap').appendChild(start);
        document.getElementById('overlap').appendChild(end);

        var c_HEIGHT = window.innerHeight - that.SIZE.y;
        var c_WIDTH = window.innerWidth - that.SIZE.x;

        Draggable.create(start, {
            type: "x,y",
            bounds: overlap,
            onDrag: function () {
                that.pStart[0] = this.x + 5 + (this.x / that.SIZE.x * c_WIDTH);
                that.pStart[1] = this.y + 5 + (this.y / that.SIZE.y * c_HEIGHT);
                that.updateDragger();
            }
        });

        Draggable.create(end, {
            type: "x,y",
            bounds: overlap,
            onDrag: function () {
                that.pEnd[0] = this.x + 5 + (this.x / that.SIZE.x * c_WIDTH);
                that.pEnd[1] = this.y + 5 + (this.y / that.SIZE.y * c_HEIGHT);
                that.updateDragger();
            }
        });


        TweenLite.set(start, {x: 100, y: this.SIZE.y * .5})
        that.pStart[0] = 100 + 5 + (100 / that.SIZE.x * c_WIDTH);
        that.pStart[1] = this.SIZE.y * .5 + 5 + (this.SIZE.y * .5 / that.SIZE.y * c_HEIGHT);

        TweenMax.set(end, {x: this.SIZE.x - 100, y: this.SIZE.y * .5});
        that.pEnd[0] = this.SIZE.x - 100 + 5 + (this.SIZE.x - 100 / that.SIZE.x * c_WIDTH);
        that.pEnd[1] = this.SIZE.y * .5 + 5 + (this.SIZE.y * .5 / that.SIZE.y * c_HEIGHT);

        TweenMax.set(overlap, {left: (window.innerWidth - that.SIZE.x) * .5, top: 30});

        window.onresize = function (e) {
            TweenMax.set(overlap, {left: (window.innerWidth - that.SIZE.x) * .5, top: 30});
        };


    }

    private updateDragger() {

        that.filter.start = {
            x: that.pStart[0],
            y: that.pStart[1]
        };

        that.filter.end = {
            x: that.pEnd[0],
            y: that.pEnd[1]
        };

        that.renderStage();

    }

    private addFilter() {
        this.filter = new PIXI.filters.TiltShiftFilter();
        this.filter.blur = 20;
        //this.filter.gradientBlur = 5;
        this.container.filters = [this.filter];
    }


    // http://www.goodboydigital.com/pixijs/examples/15/indexAll.html
    // http://laplace2be.com/lab/webgl/tiltshiftfilter/

    private addGUI() {

        this.GUI = new dat.GUI({width: 300, closed: false});

        this.CONFIG = {};
        this.CONFIG.INFO = 'tilt_shift_filter';
        this.CONFIG.BLUR_TYPE = 'GAUSSIAN_BLUR';
        this.CONFIG.FILTER = this.filter;
        this.CONFIG.RADIUS = 25;
        this.CONFIG.SAVE_IMAGE = function() {
            that.renderStage();
            that.saveImage();
        };
        this.CONFIG.SAVE_CONFIG = function() {
            console.log('save_config')
        }

        var GUI_STAFF = {
            change_BLUR_TYPE: function () {},
            save_Image: function () {}
        };

        var BLUR_TYPES = {
            GAUSSIAN_BLUR: 'GAUSSIAN_BLUR',
            GRADIENT_BLUR: 'GRADIENT_BLUR'
        };

        GUI_STAFF.change_BLUR_TYPE = function () {

            that.container.filters = null;
            that.filter = null;
            that.filter = new PIXI.filters.TiltShiftFilter();

            switch (that.CONFIG.BLUR_TYPE) {
                case 'GAUSSIAN_BLUR':
                    that.CONFIG.RADIUS = 25;
                    that.GUI.__controllers[2].remove(that._radius);
                    that.GUI.add(that.CONFIG, 'RADIUS').min(0).max(300).step(1).setValue(25).onChange(that.update);
                    that.filter.blur = 20;
                    that.container.filters = [that.filter];
                    break;
                case 'GRADIENT_BLUR':
                    that.CONFIG.RADIUS = 15;
                    that.GUI.__controllers[2].remove(that._radius);
                    that.GUI.add(that.CONFIG, 'RADIUS').min(0).max(30).step(.5).setValue(15).onChange(that.update);
                    that.filter.gradientBlur = 5;
                    that.container.filters = [that.filter];
                    break;
            }

            that.updateDragger();
            that.update();

        };


        this.GUI.add(this.CONFIG, 'INFO');
        this.GUI.add(this.CONFIG, 'BLUR_TYPE').options(BLUR_TYPES).onChange(GUI_STAFF.change_BLUR_TYPE);
        this._radius = this.GUI.add(this.CONFIG, 'RADIUS').min(0).max(300).step(1).onChange(that.update);
        this.GUI.add(this.CONFIG, 'SAVE_CONFIG');
        this.GUI.add(this.CONFIG, 'SAVE_IMAGE');


    }

    public update() {

        if (that.CONFIG.BLUR_TYPE == "GAUSSIAN_BLUR") {
            that.filter.blur = that.CONFIG.RADIUS;
        } else if (that.CONFIG.BLUR_TYPE == "GRADIENT_BLUR") {
            that.filter.gradientBlur = that.CONFIG.RADIUS;
        }

        that.renderStage();
    }

    private renderStage() {
        this.pRenderer.render(this.pStage);
    }

    private animate() {

        this.renderStage();

        //this.stats.update();

        requestAnimationFrame(() => this.animate());

    }


}