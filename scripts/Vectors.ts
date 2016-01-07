/**
 * Created by michael.sturm on 13.04.2015.
 */



///<reference path="../lib/gsap/greensock.d.ts"/>
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/stats/stats.d.ts"/>

///<reference path="../scripts/Particle.ts"/>
///<reference path="fields/FlowField.ts"/>
///<reference path="fields/ElectricField.ts"/>
///<reference path="../scripts/Vec2.ts"/>
///<reference path="../scripts/utils/mathUtils.ts"/>


var that:Vectors;

class Vectors {

    /* === todos ==
    ° add params (datgui)
    ° test suite
    ° complete classes (p || fp)
    ° stage resize
     */

    private stats:Stats;

    private pRenderer;
    private pStage:PIXI.Container;
    private pManager:PIXI.interaction.InteractionManager;
    private particles:Array<Particle> = [];
    private mousePosition:Vec2 = new Vec2();
    private particle:Particle;
    private particleContainer:PIXI.Container;
    private drawContainer:PIXI.Container;

    private renderTexture:PIXI.RenderTexture;
    private renderSprite:PIXI.Sprite;

    private path:Path;

    private SIZE:PIXI.Point = new PIXI.Point(1280, 720);

    private blurFilter;

    private MAX_PARTICLES:number = 4000; //50fps

    private flowField:FlowField;
    private electricField:ElectricField;


    constructor() {
        that = this;

        this.pRenderer = PIXI.autoDetectRenderer(this.SIZE.x, this.SIZE.y);
        //this.pStage = new PIXI.Stage(0x232323);
        this.pStage = new PIXI.Container();

        this.pStage.interactive = true;

        this.particleContainer = new PIXI.Container();
        //this.particleContainer = new PIXI.ParticleContainer(this.MAX_PARTICLES, {
        //    scale: true,
        //    position: true,
        //    rotation: true,
        //    uvs: true,
        //    alpha: true
        //});

        this.drawContainer = new PIXI.Container();

        this.pStage.addChild(this.drawContainer);
        this.pStage.addChild(this.particleContainer);

        this.pManager = new PIXI.interaction.InteractionManager(this.pRenderer);


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

        this.initStats();
        //this.initRenderTexture();
        this.initParticles();
        this.initFlowField();
        this.initElectricField();
        //this.initPath();
        //this.initListener();
        this.animate();

    }

    private initFlowField() {
        this.flowField = new FlowField(this.SIZE.x, this.SIZE.y, this.drawContainer);
        //this.flowField.draw();
        //this.pRenderer.render(this.pStage);
    }

    private initElectricField() {
        this.electricField = new ElectricField(this.SIZE.x, this.SIZE.y, this.drawContainer);
        //this.electricField.draw();
        //this.pRenderer.render(this.pStage);
    }

    private initPath() {
        this.path = new Path(this.drawContainer);
        this.path.pushPoint(new Vec2(400, 400));
        this.path.pushPoint(new Vec2(500, 200));
        //this.path.pushPoint(new Vec2(800, 200));
        //this.path.pushPoint(new Vec2(1100, 300));
        console.log(this.path.points.length)
    }

    private initStats() {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        document.body.appendChild(this.stats.domElement);
    }

    private initParticles() {

        for (var i = 0; i < this.MAX_PARTICLES; i++) {
            this.particle = new Particle();
            this.particles.push(this.particle);
            this.particleContainer.addChild(this.particle);
        }
    }

    private initRenderTexture() {
        this.renderTexture = new PIXI.RenderTexture(this.SIZE.x, this.SIZE.y);
        this.renderSprite = new PIXI.Sprite(this.renderTexture);

        //sprite.position.x = 800 / 2;
        //sprite.position.y = 600 / 2;
        //sprite.anchor.x = 0.5;
        //sprite.anchor.y = 0.5;

        //this.renderTexture.render(this.particleContainer);
        this.pStage.addChild(this.renderSprite);

        //this.blurFilter = new PIXI.BlurFilter();
        //this.blurFilter.dirty = true;
        //this.blurFilter.blur = 10;
        //this.renderSprite.filters = [this.blurFilter];
    }

    private initListener() {
        onmousemove = function (mouseData) {
            that.mousePosition.set(mouseData.pageX - that.pRenderer.view.offsetLeft, mouseData.pageY - 30);
        }
    }


    private animate() {

        for (var i = 0, len = this.particles.length; i < len; i++) {
            //this.particles[i].seek(this.mousePosition);

            this.particles[i].field(this.electricField);
            this.particles[i].respawn(this.electricField.getQPos());
            this.particles[i].field(this.flowField);

            //this.particles[i].followPath(this.path);
            this.particles[i].update();
        }

        this.flowField.perlinField();
        this.flowField.draw();

        this.electricField.update();
        //this.electricField.draw();
        //
        //this.path.draw();


        //this.renderTexture.render(this.particleContainer);
        this.pRenderer.render(this.pStage);

        this.stats.update();


        requestAnimationFrame(() => this.animate());

    }
}




