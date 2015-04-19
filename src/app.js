
var MainLayer = cc.Layer.extend({

    bgLayer : null,

    spritePlayerUp:null,

    spritePlayerDown : null,

    spriteSheet : null,

    isUp : null,

    line : null,

    eyeX : 0,

    buttonUpItem : null,
    buttonDownItem : null,

    runningActionUp : null,
    runningActionDown : null,

    hud : null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.init();

        return true;
    },

    init : function () {
        this._super();

        document.getElementById("shareImg").innerHTML= "";

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
            x: 140,
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
            x: winsize.width - 140,
            y: 40,
            anchorX: 0.5,
            anchorY: 0.5
        });


        var menu = new cc.Menu(this.buttonUpItem,this.buttonDownItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        //add line
        this.line = new cc.Sprite(res.line_png)
        this.line.attr({
            x : winsize.width/2,
            y : winsize.height/2,
            anchorX: 0.5,
            anchorY: 0.5
        })
        this.addChild(this.line)

        // create sprite sheet
        cc.spriteFrameCache.addSpriteFrames(res.player_plist);
        this.spriteSheet = cc.SpriteBatchNode.create(res.player_png);
        this.addChild(this.spriteSheet);

        //init running Action

        // 两个动作，一个是向上的动作
        var animFramesUp = [];
        for (var i = 0; i < 5; i++) {
            var str = "playerUp" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFramesUp.push(frame);
        }
        var animationUp = cc.Animation.create(animFramesUp, 0.1);
        this.runningActionUp = cc.Animate.create(animationUp).repeat(1);

        // 一个是向下的动作
        var animFramesDown = [];
        for (var i = 0; i < 5; i++){
            var str = "playerDown" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFramesDown.push(frame);
        }
        var animationDown = cc.Animation.create(animFramesDown,0.1);
        this.runningActionDown = cc.Animate.create(animationDown).repeat(1);

        //定义初始化的向上的player Sprite
        this.spritePlayerUp = cc.Sprite.create("#playerUp0.png") ;
        this.spritePlayerUp.attr({
            x : playerPos.x,
            y : playerPos.y,
            anchorX : 0.5,
            anchorY : 0
        });

        //向下的player sprite
        this.spritePlayerDown = cc.Sprite.create("#playerDown0.png");
        this.spritePlayerDown.attr({
            x : playerPos.x,
            y : playerPos.y,
            anchorX : 0.5,
            anchorY : 1
        })

        this.spriteSheet.addChild(this.spritePlayerUp);
        this.spriteSheet.addChild(this.spritePlayerDown);
        this.spritePlayerDown.setVisible(false);



        this.hud = new HUD();
        this.addChild(this.hud);


        // 设定每隔1秒执行一次updateTime
        this.schedule(this.updataTime,1,cc.REPEAT_FOREVER , 0);

    },

    // 每隔1秒需要更新time label
    updataTime : function () {

        this.hud.time--;

        this.hud.timeLabel.string = this.hud.time;

        if(this.hud.time <= 0){
            this.gameOver();
        }
    },

    // 比赛结束
    gameOver : function () {

        //var gv = new GameOverScene();
        //gv.points =
        cc.director.runScene(new GameOverScene());

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

        // player 朝向上为0   下为1
        var dir = this.isUp ? 0 : 1;

        //检测是否发生碰撞
        if(this.bgLayer.checkCollision(0,dir) || this.bgLayer.checkCollision(1,dir)){
            //console.log("发生碰撞了！");
            //console.log("");
            this.gameOver();
        }

        this.eyeX += moveStep ;

        this.bgLayer.checkAndReload(this.eyeX);
        this.bgLayer.setPosition(cc.p(-this.eyeX,0));



        //检测是否发生碰撞
        if(this.bgLayer.checkCollision(0,dir) || this.bgLayer.checkCollision(1,dir)){
            //console.log("发生碰撞了！");
            //console.log("");
            this.gameOver();
        }

        //console.log("over num : "+this.bgLayer.overNum);

        this.hud.label.string = points;



    },

    //按向上按钮时采取的行动
    clickUp : function(){

            // 人物不是正向，需要人物翻转

            this.spritePlayerDown.setVisible(false);
            this.spritePlayerUp.setVisible(true);

            this.spritePlayerUp.runAction(this.runningActionUp);

            this.isUp = true;
            //console.log(this.isUp);

           this.move();
    },

    //按向下按钮时采取的行动
    clickDown : function () {

            this.spritePlayerDown.setVisible(true);
            this.spritePlayerUp.setVisible(false);

            this.spritePlayerDown.runAction(this.runningActionDown);

            this.isUp = false;
            //console.log(this.isUp);

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

