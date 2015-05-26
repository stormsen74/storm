/**
 * Created by michael.sturm on 07.04.2015.
 */
///<reference path="../lib/pixi/pixi.d.ts"/>
///<reference path="../lib/gsap/greensock.d.ts"/>
var that;
var DOF_Dudes = (function () {
    function DOF_Dudes() {
        this.t = 0;
        that = this;
        this.pRenderer = PIXI.autoDetectRecommendedRenderer(1280, 720);
        this.pStage = new PIXI.Stage(0x235d72);
        this.pStage.interactive = true;
        //this.pStage.addChild(PIXI.Sprite.fromImage('assets/background_1280x720.jpg'));
        this.pManager = new PIXI.InteractionManager(this.pStage);
        this.dude = PIXI.Sprite.fromImage('assets/coin.png');
        this.dude.scale = new PIXI.Point(.7, .7);
        this.dude.position.x = 1280 * .5 - 128 * .7;
        this.dude.position.y = 720 * .5 - 128 * .7;
        this.pStage.addChild(this.dude);
        this.blurFilter = new PIXI.BlurFilter();
        this.blurFilter.dirty = true;
        this.dude.filters = [this.blurFilter];
        //this.pRenderer.view.style.width = window.innerWidth + "px";
        //this.pRenderer.view.style.height = window.innerHeight + "px";
        this.pRenderer.view.style.margin = "0 auto";
        this.pRenderer.view.style.width = 1280 + "px";
        this.pRenderer.view.style.height = 720 + "px";
        this.pRenderer.view.style.display = "block";
        // add render view to DOM
        document.body.appendChild(this.pRenderer.view);
        this.initListener();
        this.render();
    }
    DOF_Dudes.prototype.initListener = function () {
        this.pManager.stage.mousemove = function (mouseData) {
            var dX = (that.dude.position.x + that.dude.width * .5) - mouseData.global.x;
            var dY = (that.dude.position.y + that.dude.height * .5) - mouseData.global.y;
            var dist = Math.sqrt(dX * dX + dY * dY);
            var multiplier = Math.min(500, dist) / 500;
            that.blurFilter.blur = 20 * (multiplier);
            //console.log(mouseData.global);
        };
    };
    DOF_Dudes.prototype.render = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.render(); });
        this.pRenderer.render(this.pStage);
    };
    return DOF_Dudes;
})();
//# sourceMappingURL=DOF_Dudes.js.map