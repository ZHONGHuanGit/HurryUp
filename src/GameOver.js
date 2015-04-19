/**
 * Created by zhonghuan on 15/4/18.
 */

var GameOverLayer = cc.Layer.extend({

    spriteBg : null,

    ctor : function(){
        this._super();
        this.init();
    },

    init : function () {
        this._super();

        this.spriteBg = new  cc.Sprite(res.bg_png);
        this.addChild(this.spriteBg);
        this.spriteBg.attr({
            anchorX: 0,
            anchorY: 0
        });

        var winsize = cc.director.getVisibleSize();



        ////add points label
        this.label =  new cc.LabelTTF("Game is over\n得分:"+points, "黑体", 24, cc.size(200, 100), cc.TEXT_ALIGNMENT_CENTER);//创建Label
        this.label.attr({ //属性设置
            x:winsize.width /2 ,
            y:winsize.height / 2,
            strokeStyle: cc.color(0,0,0),
            lineWidth: 2,
            color: cc.color(255,150,100)
        });

        this.addChild(this.label);

        var buttonAgain = new cc.MenuItemImage(
            res.again_png,
            res.again_png,
            this.onceAgain,
            this);

        buttonAgain.attr({
            x: winsize.width/2,
            y: winsize.height/2 - 100,
            anchorX: 0.5,
            anchorY: 0.5
        });


        var menu = new cc.Menu(buttonAgain);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

        document.title = "我在Hurry Up游戏中赢得了"+points+"分，击败了全国xx%选手，加入来挑战吧！";
        document.getElementById("shareImg").innerHTML="<img src=\"http://zhonghuan.qiniudn.com/ZH_zhifubao.png\" />";

    },

    onceAgain : function(){

        points = 0;

        cc.director.runScene(new MainScene());
    }

});

var GameOverScene = cc.Scene.extend({
    points : 0,
    onEnter:function () {
        this._super();
        var layer = new GameOverLayer();
        this.addChild(layer);
    }
});