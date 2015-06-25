/**
 * Created by michael.sturm on 24.06.2015.
 */

///<reference path="../lib/gsap/greensock.d.ts"/>
///<reference path="../lib/dat/dat-gui.d.ts"/>
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/stats/stats.d.ts"/>


declare var Draggable:any;
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

        // add render view to DOM
        document.body.appendChild(this.pRenderer.view);


        this.sprite = PIXI.Sprite.fromImage('assets/mountain_1280x720.jpg');
        this.container.addChild(this.sprite);
        this.pStage.addChild(this.container);

        this.addFilter();


        TweenLite.delayedCall(.5, function () {

            that.renderStage();
        });


        this.initDrag();

        this.addGUI();
        //this.animate();

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

        Draggable.create(start, {
            type: "x,y",
            bounds: overlap,
            onDrag: function () {
                var c_HEIGHT = window.innerHeight - that.SIZE.y;
                var c_WIDTH = window.innerWidth - that.SIZE.x;
                that.filter.start = {
                    x: this.x + 5 + (this.x / that.SIZE.x * c_WIDTH),
                    y: this.y + 5 + (this.y / that.SIZE.y * c_HEIGHT)
                };
                that.renderStage();
            }
        });

        Draggable.create(end, {
            type: "x,y",
            bounds: overlap,
            onDrag: function () {
                var c_HEIGHT = window.innerHeight - that.SIZE.y;
                var c_WIDTH = window.innerWidth - that.SIZE.x;
                that.filter.end = {
                    x: this.x + 5 + (this.x / that.SIZE.x * c_WIDTH),
                    y: this.y + 5 + (this.y / that.SIZE.y * c_HEIGHT)
                };
                that.renderStage();
            }
        });

        TweenMax.set(start, {x: -5, y: -5});
        TweenMax.set(end, {x: this.SIZE.x - 5, y: this.SIZE.y - 5});

        window.onresize = function (e) {
            TweenMax.set(overlap, {left: (window.innerWidth - that.SIZE.x) * .5, top: 30});
        };

        TweenMax.set(overlap, {left: (window.innerWidth - that.SIZE.x) * .5, top: 30});


    }

    private addFilter() {
        this.filter = new PIXI.filters.TiltShiftFilter();
        //console.log(this.filter)
        this.filter.blur = 20;
        //this.filter.gradientBlur = 5;
        this.container.filters = [this.filter];

    }


    // http://www.goodboydigital.com/pixijs/examples/15/indexAll.html
    // http://laplace2be.com/lab/webgl/tiltshiftfilter/

    private addGUI() {
        var gui = new dat.GUI({width: 300, closed: false});


        var fFolder = gui.addFolder('TiltShiftFilter');
        fFolder.open();
        var fController = fFolder.add(this.filter, 'blur', 0, 300);
        //var fController = fFolder.add(this.filter, 'gradientBlur', 0, 600);


        fController.onChange(function (value) {
            // Fires on every change, drag, keypress, etc.

            that.renderStage();
        });
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