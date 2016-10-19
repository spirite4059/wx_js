/**
 * Created by liu on 2016/6/20.

$(document).ready(function ()
{
    //用来获取url的参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

});
g
 */

// 更新：
// 05.27: 1、保证回调执行顺序：error > ready > load；2、回调函数this指向img本身
// 04-02: 1、增加图片完全加载后的回调 2、提高性能
/**
 * 图片头数据加载就绪事件 - 更快获取图片尺寸
 * 逻辑上---有效的是彻底加载完成，然后找图片尺寸； 如果有缓存的话，通过implete参数也能判断出来;但是是否有，是通过ready来判断的，所以load倒是可以忽略
 * @version   2011.05.27
 * @author    TangBin
 * @see       http://www.planeart.cn/?p=1121
 * @param    {String}       图片路径
 * @param    {Function}    尺寸就绪
 * @param    {Function}    加载完毕 (可选)
 * @param    {Function}    加载错误 (可选)
* @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
    //alert('size ready: width=' + this.width + '; height=' + this.height);
});
*/

var imgReady = function () {
    var list = [], intervalId = null,

        // 用来执行队列
        tick = function () {    //其实数组里面一直只有一个参数
            //console.log("有几个函数在数组里："+list.length);  //把数组输出来  这个里面一直只有一个函数在执行
            var i = 0;
            for (; i < list.length; i++)
            {
                if(list[i].end) {       //如果加载完成了，就把当前的元素退出去
                    list.splice(i--, 1);
                }else{
                    list[i]();          //调用onready
                }
            };
            !list.length && stop();
        },

        // 停止定时器，随时启动，随时关闭
        stop = function () {
                //console.log("计时器停止");      //把数组输出来
            clearInterval(intervalId);
            intervalId = null;
    };

    return function (url,image_index ,ready, load, error)
    {
        //console.log("图片序列："+image_index);     //地址，图片的序列号，准备好，加载完，和失败的
        var onready, width, height, newWidth, newHeight,
            img = new Image();

        //alert("返回的函数执行了么");  ---- IE上会有问题；因为complete有问题
        img.src = url;      //如果已经加载过了，那么这个是会从缓存直接加载图片的

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete)       //除了ie外，其他都是判断缓存中有没有内容
        {
            ready.call(img,image_index);            //把自己的参数传回去
            load && load.call(img,image_index);
            return;
        };

        //console.log("目前的宽高："+img.width+":::"+img.height);
        width  = img.width;
        height = img.height;

        //加载错误后的事件,这是个回调函数；
        img.onerror = function ()
        {
            //console.log("-- 图片加载不成功 --");
            error && error.call(img,image_index);
            onready.end = true;     //如果报错了，直接把数组都清空
            img = img.onload = img.onerror = null;
        };

        //图片尺寸就绪
        onready = function ()
        {
            //console.log("新的宽和高："+  img.width+"::::"+img.height);  //
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            )
            {
                ready.call(img,image_index);    //在ready里面调用,同时传递过去已经好的图片序
                onready.end = true;
            };
        };
        onready();

        //图片彻底被加载完成；
        img.onload = function ()
        {
            //图片加载完了,才可以读图片尺寸，这个尺寸是原始的图片尺寸
            !onready.end && onready();
            load && load.call(img,image_index);     //img的域下面处理
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
            //如果没读出尺寸的话，会一直等读出尺寸后，在定时器完成回调
        };

        // 加入队列中定期执行
        if (!onready.end) {
            //console.log("压入一次判断是否准备好");
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);        //这是一个全局性的检测函数；
        };
    };
}


//*****************************回调和使用的例子*********************************************
//***图片数组：m0_imgs.push( {img_index:1,  url:img1_url,   ready:false,  is_error:false,   error_count:0,   img:null} );
//***                         图片需要应该是从1开始，代码用该数值在取信息，不能随意放
//
// var succ_callback=function (imgs)
// {
//     //图片保存在该数组中
//     for(key in imgs)
//     {
//         console.log("图片"+imgs[key].img);
//         console.log("图片地址：" +imgs[key].url);    //
//     }
// }
//
// var error_callback=function (imgs)
// {
//     //图片保存在该数组中
//     for(key in imgs)
//     {
//         console.log("图片"+imgs[key].img);
//         console.log("图片地址：" +imgs[key].url);
//     }
// }
//
// download_fun(m0_imgs,succ_callback,error_callback);         //执行一下
//
//*************************传入的图片数组格式************************************************
//***图片数组：m0_imgs.push( {img_index:1,  url:img1_url,   ready:false,  is_error:false,   error_count:0,   img:null} );
//***                         图片需要应该是从1开始，代码用该数值在取信息，不能随意放

////这块是将图片放到数组中，并开始下载执行
//  var img1_url    =   "http://cnews.chinadaily.com.cn/img/attachement/jpg/site1/20160715/a41f726b051118f287c414.jpg";
//  var img2_url    =   "http://www.a.com/test.jpg"; //preview.quanjing.com/fod_liv002/fo-11171537.jpg
//  var img3_url    =   "http://www.b.com/1asdafasd.jpg";

//  var m0_imgs = new Array();
//  m0_imgs.push(
//        {img_index:1,url:img1_url,ready:false,is_error:false,error_count:0,img:null},
//        {img_index:2,url:img2_url,ready:false,is_error:false,error_count:0,img:null},
//        {img_index:3,url:img3_url,ready:false,is_error:false,error_count:0,img:null}
//  ); //图片压栈
//*******************************************************************************************


function download_fun(imgs,succ_callback,error_callback)
{
    var error_repeat=10;              //每张图片重新尝试10次
    var all_count=0;
    //var now_count=0;                //下载完成
    var m0 = imgReady();             //一个图片序列

    //判断一下当前数组是否为正确的
    if(imgs==null) {
        error_callback(null, 2);  //失败原因为数组图片有问题
        return;
    }

    //要对数组进行判断？？？ ---  暂时没做

    var check_all_down=function ()
    {
        //判断几次成功，几次失败；如果都尝试完成后，返回失败；    //都是成功，返回成功
        var is_all=false;
        var error_num=0;
        var ready_num=0;

        //判断一下是否全部下载完成
        for(key in imgs)         //判断所有图片
        {
            if(imgs[key].ready)
            {   ready_num++;
            }

            if(imgs[key].is_error)
            {   error_num++;
            }
        }
//            console.log("总数量是 allcount="+ all_count);       //不错
//            console.log("错误数量 error="+error_num);           //不错
//            console.log("下载数量 ready="+ready_num);           //不错

        if((error_num+ready_num)==all_count)
        {
            console.log("全部下载完成");
            if( ready_num == all_count ) {
                //console.log("成功情况下的回调");
                if (succ_callback != null)   succ_callback(imgs);
            }else
            {
                //console.log("失败情况下的回调");
                if(error_callback!=null)  error_callback(imgs,1);      //error_type是失败类型
            }

            //清理一下当前的变量
            m0=null; imgs=null;
        }
    }

    //已经成功加载
    var load_fun  =   function (num)
    {
        //console.log("onload完成，用onready就好了" );
    };

    //失败的话,调用的函数----？？？没有验证----在火狐浏览器下是有问题的，统计不到信息；其他正常
    var error_fun = function (num)
    {
        //console.log("num="+num+"下载失败");
        if(imgs[num-1].error_count>error_repeat)     //如果数量超过50，就退出整个系统
        {
            imgs[num-1].is_error=true;     //该图片下载失败了
            //console.log(num+"图片下载失败超过10了，不再下了");
            check_all_down();  //检查是否都尝试了
            return;
        }

        //如果失败就加入到驾到下载序列中，重新下载
        m0(     imgs[num-1].url,               //num是1,2,3，需要减少1
            imgs[num-1].img_index,
            ready_fun,load_fun,error_fun
        );

        imgs[num-1].error_count++;  //错误计数是增加1
    };

    //每下载一张图片，就判断一次是否全下载完了
    var ready_fun = function (num)
    {
        imgs[num-1].img=this;
        imgs[key].ready = true;
        console.log("第"+ num +"个图片现在完成");

//            for(key in m0_imgs)
//            {
//                if(m0_imgs[key].img_index==num)
//                {  //当前图片已经准备好
//                    m0_imgs[key].ready = true;
//                    console.log("第"+ num +"个图片现在完成");
//                }
//            }
        check_all_down();//检查一下是否全部下载完成了
    }


    for (key in m0_imgs)
    {   all_count++;  //下载一张，总数加一张
    }

    for (key in m0_imgs)
    {
        m0(     m0_imgs[key].url,
            m0_imgs[key].img_index,
            ready_fun,load_fun,error_fun);      //每一个图片都是如此
    }

} //调用


