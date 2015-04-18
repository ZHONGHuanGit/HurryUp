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

    // mushroom 的位置
    mushPos : [],

    // mushroom
    mushrooms : [],

    //标记当前mushroom是否越过
    isOver : [],

    overNum : 0,

    // 标记mushroom的朝向,0表示向上，1表示向下
    mushroomsTag : [],

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


        this.mushPos = [cc.p(120, 160), cc.p(240, 160), cc.p(340, 160), cc.p(440, 160),
            cc.p(80, 160), cc.p(180, 160), cc.p(320, 160), cc.p(460, 160) ];

        this.createMushrooms(0);
        this.createMushrooms(1);

    },


    // 给定map   增加mushroom
    createMushrooms : function (mapID) {

        var val = 0;
        if(mapID == 1){
            val = mushNum;
        }

        for (var i = 0 + val; i < mushNum+val; i++) {

            var id = Math.random() > 0.5 ? 1 : 0;

            this.mushroomsTag[i] = id;

            var sp = null;

            if(id == 1 ){
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

        console.log("dir:"+dir);

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
                this.overNum++;
            }
        }

        return false;

    },


    checkAndReload:function (eyeX) {
        var newMapIndex = parseInt(eyeX / this.mapWidth);

        if (this.mapIndex == newMapIndex) {
            return false;
        }

        if (0 == newMapIndex % 2) {
            // change mapSecond
            this.map01.setPositionX(this.mapWidth * (newMapIndex + 1));
            this.clearMushrooms(1);
            this.createMushrooms(1);

        } else {
            // change mapFirst
            this.map00.setPositionX(this.mapWidth * (newMapIndex + 1));
            this.clearMushrooms(0);
            this.createMushrooms(0);
        }

        this.mapIndex = newMapIndex;

        return true;
    }

});