
var MainLayer = cc.Layer.extend({

    bgLayer : null,
    spritePlayer:null,

    spriteSheet : null,

    isUp : null,

    egg : null,

    eyeX : 0,

    buttonUpItem : null,
    buttonDownItem : null,


    runningAction : null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.init();

        return true;
    },

    init : function () {
        this._super();

        //添加BackgoundLayer
        this.bgLayer = new BackgroundLayer();
        this.addChild(this.bgLayer);

        //当前player正立
        this.isUp = true;

        var winsize = cc.director.getWinSize();


        //定义向上按钮
        this.buttonUpItem = new cc.MenuItemImage(
            res.buttonUp_png,
            res.buttonUp_png,
            this.clickUp,
            this);
        this.buttonUpItem.attr({
            x: 180,
            y: 40,
            anchorX: 0.5,
            anchorY: 0.5
        });

        //定义向下按钮
        this.buttonDownItem = new cc.MenuItemImage(
            res.buttonDown_png,
            res.buttonDown_png,
            this.clickDown,
            this);

        this.buttonDownItem.attr({
            x: winsize.width - 180,
            y: 40,
            anchorX: 0.5,
            anchorY: 0.5
        });


        var menu = new cc.Menu(this.buttonUpItem,this.buttonDownItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        // create sprite sheet
        cc.spriteFrameCache.addSpriteFrames(res.player_plist);
        this.spriteSheet = cc.SpriteBatchNode.create(res.player_png);
        this.addChild(this.spriteSheet);

        //init running Action
        var animFrames = [];
        for (var i = 1; i <= 4; i++) {
            var str = i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = cc.Animation.create(animFrames, 0.1);
        this.runningAction = cc.Animate.create(animation).repeat(1);
        this.spritePlayer = cc.Sprite.create("#1.png");
        this.spritePlayer.setPosition(playerPosUp);

        this.spriteSheet.addChild(this.spritePlayer);

        //add egg
        this.egg = new cc.Sprite(res.egg_png);
        this.egg.setPosition(cc.p(winsize.width-50,winsize.height-50));
        this.addChild(this.egg);

    },

    //每次前进的行动,其实这里不是player前进，而是背景图片的倒退，相对看上去，像是前进
    move : function(){
        //create the move action
        var winsize = cc.director.getWinSize();

        //this.spritePlayer.runAction(
        //    cc.sequence(
        //        cc.moveBy(moveTime, cc.p(moveStep,0))
        //    ));
        //

        this.eyeX += moveStep ;

        this.spritePlayer.runAction(this.runningAction);

        this.bgLayer.checkAndReload(this.eyeX);
        this.bgLayer.setPosition(cc.p(-this.eyeX,0));

        var dir = this.isUp? 0 : 1;

        if(this.bgLayer.checkCollision(0,dir) || this.bgLayer.checkCollision(1,dir)){
            console.log("发生碰撞了！");

        }else{
            console.log("no");
        }

    },

    //按向上按钮时采取的行动
    clickUp : function(){

        if(!this.isUp){
            // 人物不是正向，需要人物翻转

            this.spritePlayer.setPosition(playerPosUp);

            this.isUp = true;
            //console.log(this.isUp);
        }

        this.move();

    },

    //按向下按钮时采取的行动
    clickDown : function () {

        if(this.isUp){
            //人物正向，需要翻转

            this.spritePlayer.setPosition(playerPosDown);

            this.isUp = false;
            //console.log(this.isUp);
        }

        this.move();

    }

});

var MainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainLayer();
        this.addChild(layer);
    }
});

