/**
 * Created by zhonghuan on 15/3/28.
 */

var BackgroundLayer = cc.Layer.extend({

    spriteBg : null,
    map00 : null,
    map01 : null,
    mapIndex : 0,
    mapWidth : 0,
    mapHeight : 0,
    tag00 : null,
    tag01 : null,

    // mushroom 的位置
    mushPos : [],

    // mushroom
    mushrooms : [],

    //标记当前mushroom是否越过
    isOver : [],

    // 标记mushroom的朝向,0表示向上，1表示向下
    mushroomsTag : [],

    _tips : ["横着玩会更爽哦！","角色一旦触碰白线，规则就生效咯！","注意每一关卡的提示哦！亲~"],
    _tip : null,
    tip : null,

    ctor : function(){

        this._super();

        this.init();

    },

    init : function(){
        this._super();

        this.map00 = new cc.Sprite(res.bg_png);
        this.addChild(this.map00);
        this.map00.attr({
            anchorX: 0,
            anchorY: 0
        });

        this.mapWidth = this.map00.getContentSize().width;
        this.mapHeight = this.map00.getContentSize().height;

        this.map01 = new cc.Sprite(res.bg_png);
        this.map01.attr({
            anchorX: 0,
            anchorY: 0
        });
        this.map01.setPosition(cc.p(this.mapWidth, 0));
        this.addChild(this.map01);


        this.mushPos = [cc.p(120, 160), cc.p(220, 160), cc.p(320, 160), cc.p(420, 160),
            cc.p(100, 160), cc.p(200, 160), cc.p(320, 160), cc.p(400, 160) ];

        this.createMushrooms(0,0);
        this.createMushrooms(1,0);

        this.getTip();

        this.tip = new cc.LabelTTF("友情提示:"+this._tip,"Arial" , 14 , cc.size(300,50),cc.TEXT_ALIGNMENT_LEFT);
        this.tip.attr({
            x : 100,
            y: 60,
            anchorX:0,
            anchorY:0,
            color : cc.color(0,0,0)
        });
        this.map00.addChild(this.tip);

        //add tag00 label
        this.tag00 = new cc.LabelTTF("故涌故涌~","MarkerFelt-Thin",20,cc.size(200,50),cc.TEXT_ALIGNMENT_LEFT);
        this.map00.addChild(this.tag00);
        this.tag00.attr({
            x : 0,
            y:this.mapHeight - 120,
            anchorX:0,
            anchorY:0,
            color : cc.color(255,255,255)
        });

        //add tag01 label
        this.tag01 = new cc.LabelTTF("颠倒看你怎么玩!","MarkerFelt-Thin",20,cc.size(200,50),cc.TEXT_ALIGNMENT_LEFT);
        this.map01.addChild(this.tag01);
        this.tag01.attr({
            x : 0,
            y:this.mapHeight - 120,
            anchorX:0,
            anchorY:0,
            color : cc.color(255,255,255)
        });




    },


    // 给定map   增加mushroom , to==0表示障碍物眼见为实，  to==1表示障碍物存在的和看到的不相同
    createMushrooms : function (mapID , to) {

        var val = 0;
        if(mapID == 1){
            val = mushNum;
        }

        for (var i = 0 + val; i < mushNum+val; i++) {

            var id = Math.random() > 0.5 ? 1 : 0;

            this.mushroomsTag[i] = id;

            var sp = null;

            if(id == to ){
                sp =  new cc.Sprite(res.sharpUp);

            }else{
                sp = new cc.Sprite(res.sharpDown);

            }

            sp.setPosition(this.mushPos[i]);
            sp.attr({
                anchorX : 0.5
            })

            this.mushrooms[i] = sp;

            if(mapID == 0){
                this.map00.addChild(sp);
            }else{
                this.map01.addChild(sp);
            }

            this.isOver[i] = 0;

        }
    },

    getTip : function(){
        var rd = Math.random();

        if(rd < 0.33){
            this._tip =  this._tips[0];
        }else if (rd < 0.66){
            this._tip =  this._tips[1];
        }else {
            this._tip =  this._tips[2];
        }

    },

    // 给定id   删除map中的mushroom
    clearMushrooms : function(mapID) {
        var val = 0;
        if(mapID == 1){
            val = mushNum;
        }

        for (var i = 0 + val; i < mushNum+val; i++) {
            this.mushrooms[i].removeFromParent();
            this.mushrooms[i] = null;
        }

    },

    //检查是否发生碰撞
    //两个参数，一个表示检测的地图，一个表示当前player的朝向,0表示向上，1表示向下
    //在检查过程中，同时计算走过的mushroom数
    checkCollision : function(mapID, dir){

        var val = 0;
        if(mapID == 1){
            val = mushNum;
        }

        //屏幕所在map的最右边位置。
        var posX = this.getPosition().x + (mapID==0? this.map00.getPosition().x:this.map01.getPosition().x);

        for(var i = 0+val;i < mushNum+val; i++){

            //当前蘑菇的位置
            var tempX = this.mushPos[i].x;

            //console.log("mushroom pos: "+(tempX+posX));
            //
            //console.log("abs:"+Math.abs(tempX+posX - beginX));

            if(dir == this.mushroomsTag[i]   &&  Math.abs(tempX+posX - beginX) < collisionAccuracy )
            {
                //console.log("i: "+ i+"    mushroom tag:"+this.mushroomsTag[i]+"  tempX:"+tempX +"    posX:"+posX);
                return true;//  假设绝对值小于20  相当于发生碰撞
            }

            if(tempX + posX < beginX && this.isOver[i]==0){
                this.isOver[i] = 1;
                points++;
            }
        }

        return false;

    },


    checkAndReload:function (eyeX,up_down) {
        var newMapIndex = parseInt(eyeX / this.mapWidth);

        if (this.mapIndex == newMapIndex) {
            return false;
        }

        //
        if (2 == newMapIndex) {
            // change mapSecond
            this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
            this.clearMushrooms(1);
            this.createMushrooms(1,1);

            //add tag label
            this.tag01.string = "综合测试题(ˇˍˇ） ";

        } else if(newMapIndex == 1) {
            // change mapFirst
            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
            this.clearMushrooms(0);
            this.createMushrooms(0,1);

            this.tag00.string = "你以为看到的是真的吗!";

            this.tip.string = "";

        }else if(newMapIndex == 3){
            this.clearMushrooms();

            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));

            this.tag00.string = "胜利!"
        }

        this.mapIndex = newMapIndex;
        //up_down(newMapIndex);

        return true;
    }




});