
var MainLayer = cc.Layer.extend({

    bgLayer : null,

    spritePlayerUp:null,

    spritePlayerDown : null,
    spritePlayerOver : null,

    spriteSheet : null,

    spriteSheetOver : null,

    isUp : null,

    line : null,

    eyeX : 0,

    buttonUpItem : null,
    buttonDownItem : null,

    runningActionUp : null,
    runningActionDown : null,
    runningActionOver : null,


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

        time--;

        this.hud.timeLabel.string = time;

        if(time <= 5){
            this.hud.timeLabel.attr({
                color: cc.color(255,0,0)
            });
        }

        if(time <= 0){
            this.gameOver(0);
        }
    },

    // 比赛结束, mode = 0 ，表示碰到障碍物或者时间到了结束；   mode = 1，表示胜利地结束
    gameOver : function (mode) {

        this.unscheduleAllCallbacks();

        this.spritePlayerDown.setVisible(false);
        this.spritePlayerUp.setVisible(false);

        this.buttonUpItem.setVisible(false);
        this.buttonDownItem.setVisible(false);


        if(mode == 0){
            // create sprite sheet
            cc.spriteFrameCache.addSpriteFrames(res.over_plist);
            this.spriteSheetOver = cc.SpriteBatchNode.create(res.over_png);
            this.addChild(this.spriteSheetOver);
            var overFrames = [];
            for (var i = 0; i < 4; i++) {
                var str = "over" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                overFrames.push(frame);
            }
            var animationOver = cc.Animation.create(overFrames, 0.1);
            this.runningActionOver = cc.Animate.create(animationOver).repeatForever();

            this.spritePlayerOver = cc.Sprite.create("#over0.png");
            this.spritePlayerOver.attr({
                x : playerPos.x,
                y : playerPos.y,
                anchorX : 0.5,
                anchorY : 0
            });

            this.spriteSheetOver.addChild(this.spritePlayerOver);
            this.spritePlayerOver.runAction(this.runningActionOver);

            var action = cc.MoveBy.create(2,cc.p(0,-300));

            var se =  cc.sequence( action, cc.callFunc(this.ToOverScene, this));

            cc.audioEngine.playEffect(res.death_wav,true);

            this.spritePlayerOver.runAction(se);


        }else {

            cc.spriteFrameCache.addSpriteFrames(res.win_plist);

            var spriteSheetWin = cc.SpriteBatchNode.create(res.win_png);

            this.addChild(spriteSheetWin);


            var winFrames = [];
            for (var i = 0; i < 2; i++) {
                var str = "win" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                winFrames.push(frame);
            }
            var animationWin = cc.Animation.create(winFrames, 0.1);
            var runningActionWin = cc.Animate.create(animationWin).repeatForever();

            var spritePlayerWin = cc.Sprite.create("#win0.png");
            spritePlayerWin.attr({
                x : playerPos.x,
                y : playerPos.y,
                anchorX : 0.5,
                anchorY : 0
            });

            spriteSheetWin.addChild(spritePlayerWin);
            spritePlayerWin.runAction(runningActionWin);

            var action = cc.MoveBy.create(2,cc.p(400,0));

            var se =  cc.sequence( action, cc.callFunc(this.ToOverScene, this));

            cc.audioEngine.playEffect(res.win_wav);

            spritePlayerWin.runAction(se);
        }



    },

    ToOverScene : function () {
        cc.director.runScene(new GameOverScene());
    },
    

    //每次前进的行动,其实这里不是player前进，而是背景图片的倒退，相对看上去，像是前进
    move : function(){
        //create the move action
        var winsize = cc.director.getWinSize();


        // player 朝向上为0   下为1
        var dir = this.isUp ? 0 : 1;

        //检测是否发生碰撞
        if(this.bgLayer.checkCollision(0,dir) || this.bgLayer.checkCollision(1,dir)){
            console.log("发生碰撞了！");
            //console.log("");
            this.gameOver(0);
        }

        cc.audioEngine.playEffect(res.climb_wav);

        this.eyeX += moveStep ;

        this.bgLayer.checkAndReload(this.eyeX,this.up_down);
        this.bgLayer.setPosition(cc.p(-this.eyeX,0));

        //检测是否发生碰撞
        if(this.bgLayer.checkCollision(0,dir) || this.bgLayer.checkCollision(1,dir)){
            console.log("发生碰撞了！");
            //console.log("");
            this.gameOver(0);
        }

        if(this.eyeX+beginX > 4*cc.director.getVisibleSize().width + 50){
            this.gameOver(1);
        }

        //console.log("over num : "+this.bgLayer.overNum);

        this.hud.label.string = points;

        this.up_down((this.eyeX + beginX) / winsize.width);

    },

    //上下颠倒控制
    up_down : function(id){
        if(id == 1 || id == 3){
            this.buttonUpItem.setCallback(this.clickDown,this);
            this.buttonDownItem.setCallback(this.clickUp,this);
        }else if(id == 2){
            this.buttonUpItem.setCallback(this.clickUp,this);
            this.buttonDownItem.setCallback(this.clickDown,this);
        }
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

