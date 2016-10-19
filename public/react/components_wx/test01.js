/**
 * Created by liu on 2016/7/27.
 */

/**
 * Created by liu on 2016/5/26.
 */
/*DOM写法
 window.onload = function ()
 {

 var fw = new Feuerwerk();
 fw.run();
 alert("first");
 };
 */

//* jQuery写法
$(document).ready(function ()
{
//var test_jq1= new test_jq();
    //var test1=new test();
    var fw = new Feuerwerk();
    fw.run();
    //alert("first");
});


var test_jq = function ()
{
    var $canvas = $('#fireCanvas');
    var context = $canvas[0].getContext('2d');

    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(250, 150);
    context.stroke();
}


//测试能不能拿到 canvas 信息
var test_normal = function()
{
    var canvas = document.getElementById('fireCanvas');
    context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(50, 50);
    context.lineTo(250, 150);
    context.stroke();

}

//烟火的函数
var Feuerwerk = function()
{
    var me = this;
    var $canvas = $('#fireCanvas');
    var can = $canvas[0].getContext('2d');

    alert("woqu");
    var width, height;

    var minParticle = 50;
    var maxParticle = 200;
    var gravity = .05;
    var explosionSpeed = 10;

    var key = 1;
    var fires = {};              //这是一个数组啊

    this.run = function()       //this是代表什么？？
    {
        init();
        render();
        build();
    }


    var init = function()
    {
        width = window.innerWidth;
        height = window.innerHeight;

        $canvas.attr({
            'width' : width,
            'height' : height
        });
    }

    var render = function()
    {
        clear();

        var key;
        for (key in fires)      //
        {
            if (!fires[key])
            {
                continue;
            }

            var fire = fires[key];
            fire.kill--;

            if (fire.kill == 0) {
                fires[key] = null;          //直接置空
                continue;
            }

            can.fillStyle = 'rgba('.concat(fire.color.r, ',', fire.color.g, ',', fire.color.b, ',', '0.5)');
//can.shadowColor = 'rgb('.concat(fire.color.r, ',', fire.color.g, ',', fire.color.b, ')');
            //can.shadowBlur = 10;

            if (fire.yInc > 5 && fire.y > 200)
            {
                fire.yInc -= gravity;
                fire.y -= fire.yInc;

                renderParticle(fire, false);
            } else {
                renderParticle(fire, true);
            }
        }

//can.shadowBlur = 0;
        //setTimeout(render, 35);
        requestAnimation()(render);
    }

    var requestAnimation = function() {
        return window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            function(cb) {
                return setTimeout(cb, 1000 / 40); //40帧每秒
            }
    }


    var renderParticle = function(fire, standAlone)
    {
        var particle;
        for (var i = 0; i < fire.particle.length; i++)
        {
            particle = fire.particle[i];

            if (standAlone) //
            {
                particle.subX += particle.dirX;
                particle.subY += particle.dirY;
                particle.dirY += gravity;
                particle.opa -= particle.opaDec;
            }

            can.fillStyle = 'rgba('.concat(fire.color.r, ',', fire.color.g, ',', fire.color.b, ',', particle.opa , ')');
            can.beginPath();
            can.arc(Math.floor(fire.x + particle.subX), Math.floor(fire.y + particle.subY), 3, 0, Math.PI * 2);
            can.fill();
            can.closePath();
        }
    }


    var build = function()
    {
        var fire = {
            particle : createParticles(), //里面有一群粒子在飞
            x : 200 + (Math.random() * (width - 400)),
            y : height + 5,
            yInc : Math.random() * 10 + 15,
            xInc : (Math.random() - .5) * 10,
            height : Math.random() * 300 + 100,
            color : {
                r : Math.floor(Math.random() * 100 + 155),
                g : Math.floor(Math.random() * 100 + 155),
                b : Math.floor(Math.random() * 100 + 155)
            },
            kill : 200
        }
        fires['fire_'.concat(++key)] = fire;

        //生成烟火的时间，3000秒钟随机
        setTimeout(build, Math.random() * 3000 + 1000);
    }


    //生成一群粒子，每个烟火中都有这么一群
    var createParticles = function()
    {
        var add = maxParticle - minParticle;
        var length = (Math.random() * add + minParticle) | 0;
        var res = new Array(length);            //创建一个数组
        var type = Math.random() - 0.9;

        for (var key = 0; key < length; key++)
        {
            var verti, hori;
            if (type < 0) {
                if (Math.random() < .7) {
                    vert = (Math.random() -.5) * 50;
                    hori = (Math.random() -.5) * 50;

                    var dist = Math.sqrt(Math.abs(vert) + Math.abs(hori));
                    vert /= dist;
                    hori /= dist;
                } else if (Math.random() < .5) {
                    vert = (Math.random() -.5) * 50;
                    hori = (Math.random() -.5) * 50;
                }
            } else {
                vert = (Math.random() -.5) * 10;
                hori = Math.sin(vert) * 10;
            }

            res[key] =
            {
                subX : (Math.random() - 0.5) * 7,
                subY : (Math.random() - 0.5) * 7,
                dirX : hori,
                dirY : vert,
                opa : 1,
                opaDec : Math.random() / 100
            }
        }
        return res;
    }

//清空北京的时候，直接就是透明
    var clear = function()
    {
//can.clearRect(0, 0, width, height);
        can.fillStyle = 'rgba(0, 0, 0, 0.2)'; //是每次绘制的时候，直接多图层绘制了
        //can.fillRect(0, 0, width, height);
        can.fillRect(0, 0, 300, 300);
    }
}
