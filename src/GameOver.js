/**
 * Created by zhonghuan on 15/4/18.
 */

var GameOverLayer = cc.Layer.extend({

    spriteBg : null,

    p : [0,0,1,2,3,4,9, 14, 19, 24, 31, 38, 45, 52,64, 76, 88],
    step : [0,1,1,1,1,5,5,5,5,7,7,7,7,12,12,12,12],

    label : null,

    ctor : function(){
        this._super();
        this.init();
    },

    init : function () {
        this._super();

        document.title = "我在“故涌故涌～”中,"+(times - time)+"秒赢得了"+points+"分,击败了全国"+this.getPercent()+"%选手,不服来战!";
        document.getElementById("shareImg").innerHTML="<img src=\"res/shouyetu.jpg\" height=\"42\" width=\"42\" />";

        cc.audioEngine.stopAllEffects();

        this.spriteBg = new  cc.Sprite(res.bg_png);
        this.addChild(this.spriteBg);
        this.spriteBg.attr({
            anchorX: 0,
            anchorY: 0
        });

        var winsize = cc.director.getVisibleSize();

        var ls = "";

        ////add points label
        this.label =  new cc.LabelTTF(this.getLabelString(), "MarkerFelt-Thin", 18, cc.size(250, 100), cc.TEXT_ALIGNMENT_LEFT);//创建Label
        this.label.attr({ //属性设置
            x:winsize.width /2 ,
            y:winsize.height / 2 + 50,
            color: cc.color(0,0,0)
        });

        this.addChild(this.label);

        var buttonAgain = new cc.MenuItemImage(
            res.again_png,
            res.again_png,
            this.onceAgain,
            this);

        buttonAgain.attr({
            x: winsize.width/2,
            y: winsize.height/2 - 50,
            anchorX: 0.5,
            anchorY: 0.5
        });

        ////add points label
        var shareLabel =  new cc.LabelTTF("友情提示: 戳右上角,可以将战果分享哦!", "MarkerFelt-Thin", 18, cc.size(400, 100), cc.TEXT_ALIGNMENT_CENTER);//创建Label
        shareLabel.attr({ //属性设置
            x:winsize.width /2 ,
            y:winsize.height / 2 - 150,
            color: cc.color(0,0,0),
            anchorX: 0.5,
            anchorY: 0.5
        });

        this.addChild(shareLabel);

        var menu = new cc.Menu(buttonAgain);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu);

    },

    onceAgain : function(){

        points = 0;

        cc.director.runScene(new MainScene());
    },


    //计算赢得百分比
    getPercent : function(){
        return this.p[points]+(time/times)*this.step[points];
    },

    getCall : function () {
        var p = this.getPercent();

        if(p<3){
            return "获得“继续努力”称号"
        }else if(p<24){
            return "获得“小有成就”称号"
        }else if(p < 52){
            return "获得“颠倒奈我何”称号"
        }else if(p<88){
            return "获得“黑夜的眼睛”称号"
        }else {
            return "获得“乾坤大挪移”称号"
        }


    },

    //返回称谓
    getLabelString : function(){
        var p = this.getPercent();

        if(time<=0){
            return "        XX,时间没了!\n        在"+(times - time)+"秒赢得了"+points+"分，击败了全国"+p+"%选手.\n        "+this.getCall()+"!";
        }

        if(p<3){
            return "        鱼唇的人类.....\n        在"+(times - time)+"秒赢得了"+points+"分，击败了全国"+p+"%选手.\n        "+this.getCall()+"!";
        }
        else if (p<19){
            return "        上下颠倒，看你怎么玩！\n        在"+(times - time)+"秒赢得了"+points+"分，击败了全国"+p+"%选手.\n        "+this.getCall()+"!";
        }else if(p < 45){
            return "        你这么相信自己的眼睛吗！\n        在"+(times - time)+"秒赢得了"+points+"分，击败了全国"+p+"%选手.\n        "+this.getCall()+"!";
        }else if(p < 88){
            return "        综合素质能力测评~\n        在"+(times - time)+"秒赢得了"+points+"分，击败了全国"+p+"%选手.\n        "+this.getCall()+"!";
        }else {
            return "        Oh,my God!为你点赞~~你就是我想要的答案!\n        在"+(times - time)+"秒赢得了"+points+"分，击败了全国"+p+"%选手.\n        "+this.getCall()+"!";
        }
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