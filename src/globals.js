/**
 * Created by zhonghuan on 15/3/28.
 */

var beginX = 80 ;

var playerPos =  cc.p(beginX,160);//player位置

var moveStep = 40;//每次移动的距离

var moveTime = 0.5; //每次移动经历的时长

var mushNum = 4;

var collisionAccuracy = 40;

var points = 0;   // 记录分数

var times = 20;  //每局游戏的时限

var time = 20;  //当前剩余时间