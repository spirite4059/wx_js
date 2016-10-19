/**
 * Created by liu on 2016/8/18.
 */




//*****************************调用的例子*************************************************
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
//***************************************************************************************


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

} //调用函数