/**
 * Created by zhonghuan on 15/4/17.
 */

var HUD = cc.Layer.extend({

    egg : null,
    label : null,
    timeLabel : null,
    time : 60,

    ctor : function(){

        this._super();

        this.init();

    },

    init : function(){
        this._super();

        //add egg
        this.egg = new cc.Sprite(res.egg_png);
        var winsize = cc.director.getVisibleSize();
        this.egg.setPosition(cc.p(winsize.width-50,winsize.height-50));
        this.addChild(this.egg);

        //add points label
        this.label =  new cc.LabelTTF("0", "黑体", 24, cc.size(150, 30), cc.TEXT_ALIGNMENT_LEFT);//创建Label
        this.addChild(this.label);//添加到场景
        this.label.attr({ //属性设置
            x:30,
            y:winsize.height - 25,
            strokeStyle: cc.color(0,0,0),
            lineWidth: 2,
            color: cc.color(255,150,100),
            anchorX:0.1
        });

        //add time label
        this.timeLabel = new cc.LabelTTF("60","黑体",24,cc.size(150,30),cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.timeLabel);
        this.timeLabel.attr({
            x : 120,
            y:winsize.height - 25,
            strokeStyle : cc.color(0,0,0),
            lineWidth: 2,
            color : cc.color(255,150,100)
        });

    }


});