/**
 * Created by michael.sturm on 08.04.2015.
 */
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/gsap/greensock.d.ts"/>
var that;
var SpriteSheet_Test = (function () {
    function SpriteSheet_Test() {
        that = this;
        this.pRenderer = PIXI.autoDetectRenderer(1280, 720);
        this.pStage = new PIXI.Stage(0x235d72);
        this.pStage.interactive = true;
        // create an array of assets to load
        var assetsToLoader = ["assets/spriteTest.json"];
        // create a new loader
        this.loader = new PIXI.SpriteSheetLoader('assets/spriteTest.json');
        //loader.onComplete = this.onAssetsLoaded();
        this.loader.on('loaded', function () {
            TweenMax.delayedCall(0, that.onSpriteSheetLoaded);
        });
        this.loader.load();
        //this.pRenderer.view.style.width = window.innerWidth + "px";
        //this.pRenderer.view.style.height = window.innerHeight + "px";
        this.pRenderer.view.style.margin = "0 auto";
        this.pRenderer.view.style.width = 1280 + "px";
        this.pRenderer.view.style.height = 720 + "px";
        this.pRenderer.view.style.display = "block";
        // add render view to DOM
        document.body.appendChild(this.pRenderer.view);
    }
    SpriteSheet_Test.prototype.onSpriteSheetLoaded = function () {
        // create a texture from an image path
        var frames = [];
        for (var i = 0; i < 60; i++) {
            var val = (i < 10) ? "0" + String(i) : String(i);
            frames.push(PIXI.Texture.fromFrame("sheet00" + val));
        }
        that.movie = new PIXI.MovieClip(frames);
        that.movie.position.x = 640;
        that.movie.position.y = 360;
        that.movie.anchor.x = that.movie.anchor.y = 0.5;
        that.movie.play();
        that.movie.animationSpeed = .5;
        that.pStage.addChild(that.movie);
        //var f = new PIXI.RGBSplitFilter(null, null);
        //f.uniforms.red.value = new PIXI.Point(5, 5);
        //f.uniforms.green.value = new PIXI.Point(-5, 5);
        //f.uniforms.blue.value = new PIXI.Point(5, -5);
        //f.padding = 200;
        that.filter = new PIXI.NoiseFilter(null, null);
        console.log(that.filter.noise);
        that.movie.filters = [that.filter];
        that.render();
    };
    SpriteSheet_Test.prototype.render = function () {
        var _this = this;
        this.t += .01;
        requestAnimationFrame(function () { return _this.render(); });
        this.pRenderer.render(this.pStage);
    };
    return SpriteSheet_Test;
})();
//# sourceMappingURL=SpriteSheetTest.js.map