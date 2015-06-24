/**
 * Created by michael.sturm on 24.06.2015.
 */

///<reference path="../lib/gsap/greensock.d.ts"/>
///<reference path="../lib/dat/dat-gui.d.ts"/>
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/stats/stats.d.ts"/>

var that:Filters;

class Filters {

    private pRenderer;
    private pStage:PIXI.Container;
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

        this.addGUI();

        TweenLite.delayedCall(1, function () {
            that.renderStage()
        });

        //this.animate();

    }

    private addFilter() {
        this.filter = new PIXI.filters.TiltShiftFilter();
        //this.filter.blur = 20;
        this.filter.gradientBlur = 300;
        this.container.filters = [this.filter];

    }


    // http://www.goodboydigital.com/pixijs/examples/15/indexAll.html

    private addGUI() {
        var gui = new dat.GUI({width: 300, closed: false});


        var fFolder = gui.addFolder('TiltShiftFilter');
        fFolder.open();
        //var fController = fFolder.add(this.filter, 'blur', 0, 100);
        var fController = fFolder.add(this.filter, 'gradientBlur', 0, 600);


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