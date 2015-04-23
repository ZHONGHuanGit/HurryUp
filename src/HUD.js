/**
 * Created by zhonghuan on 15/4/17.
 */

var HUD = cc.Layer.extend({

    egg : null,
    label : null,
    timeLabel : null,
    clock : null,

    ctor : function(){

        this._super();
        this.init();

    },

    init : function(){
        this._super();

        //add egg
        this.egg = new cc.Sprite(res.egg_png);
        var winsize = cc.director.getVisibleSize();
        this.egg.setPosition(cc.p(winsize.width-70,winsize.height-40));
        this.addChild(this.egg);

        //add points label
        this.label =  new cc.LabelTTF("0", "Courier-Bold", 20, cc.size(150, 30), cc.TEXT_ALIGNMENT_LEFT);//创建Label
        this.addChild(this.label);//添加到场景
        this.label.attr({ //属性设置
            x:winsize.width-50,
            y:winsize.height-43,
            color: cc.color(0,0,0),
            anchorX:0.1
        });


        //add egg
        this.clock = new cc.Sprite(res.clock_png);
        this.clock.setPosition(cc.p(40,winsize.height-25));
        this.addChild(this.clock);

        time = times;

        //add time label
        this.timeLabel = new cc.LabelTTF(""+time,"黑体",18,cc.size(30,30),cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.timeLabel);
        this.timeLabel.attr({
            x : 40,
            y:winsize.height - 35,
            color: cc.color(255,255,0)
        });

    }


});