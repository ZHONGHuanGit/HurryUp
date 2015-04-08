/**
 * Created by zhonghuan on 15/4/7.
 */

var MapLayer = cc.Layer.extend({

    bgSprite: null,

    mushPos: [],

    mushrooms: [],

    mushroomsTag: [],

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {

        this._super();

        this.bgSprite = new cc.Sprite(res.bg_png);
        this.bgSprite.attr({
            anchosX:0,
            anchosY:0
        })
        this.addChild(this.bgSprite);



        this.mushPos = [cc.p(180, 160), cc.p(260, 160), cc.p(340, 160), cc.p(420, 160)];

        this.createMushrooms();

    },

    createMushrooms : function () {
        //for (var i = 0; i < mushNum; i++) {
        //    var id = Math.floor() > 0.5 ? 1 : 0;
        //
        //    this.mushroomsTag.push(i);
        //
        //    var sp = null;
        //
        //    if (id == 0) {
        //        sp = cc.Sprite(res.mushroomUp);
        //        sp.attr({
        //            anchorX: 0,
        //            anchorY: 0
        //        });
        //    } else {
        //        sp = cc.Sprite(res.mushroomDown);
        //        sp.attr({
        //            anchorX: 0,
        //            anchorY: 1
        //        });
        //    }
        //
        //    sp.setPosition(this.mushPos[i]);
        //
        //    this.mushrooms[i] = sp;
        //
        //    this.addChild(sp);
        //
        //}
    },

    clearMushrooms : function(){
        for (var i = 0; i < mushNum; i++) {
            this.mushrooms[i].removeFromParent();
            this.mushrooms[i] = null;
        }
    }

});
