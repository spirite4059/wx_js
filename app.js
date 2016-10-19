/**  Created by Administrator on 2016/4/13.   */

var express     = require('express');
var bodyParser  = require('body-parser');
var app = express();
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var needle = require('needle');
var Host = 'http://interact.gochinatv.com/hudong/api/v2/HHuoDong';  //
var sha1=require('sha1');               //加密模块
var React = require('react');           //加载react组件


app.use(session({secret:'keyboard cat'}));              //如何处理
app.use(express.static('public'));                       //ls请求公开资源
app.use(cookieParser());
app.use(bodyParser.json());                               // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));     // for parsing application/x-www-form-urlencoded
//app.use(multer({ dest: './uploads/'}));                   // for parsing multipart/form-data


//加载解析jsx页面；
//require('node-jsx').install({extension:'.jsx'});

//创建工厂；
//var someComponent=React.createFactory(require('./someComponent.jsx'));

//然后进行渲染    //
//var reactHtml = React.renderToString(someComponent(data));


app.get('/', function(req,res){
    res.sendFile(__dirname + '/public/html/test-simple.html');        // 本地跳转到的页面
});

app.get('/test01', function(req,res){
    res.sendFile(__dirname + '/public/html/test01-lunbo.html');        // 本地跳转到的页面
});

app.get('/test02', function(req,res){
    res.sendFile(__dirname + '/public/html/test02.html');        // 本地跳转到的页面
});

app.get('/test04', function(req,res){
    res.sendFile(__dirname + '/public/html/test04.html');        // 本地跳转到的页面
});

app.get('/test05', function(req,res){
    res.sendFile(__dirname + '/public/html/test05.html');        // 本地跳转到的页面
});

app.get('/test06', function(req,res){
    res.sendFile(__dirname + '/public/html/test06.html');        // 本地跳转到的页面
});

app.get('/lucky', function(req,res){
    res.sendFile(__dirname + '/public/html/index.html');
});

app.get('/android', function(req,res){
    res.sendFile(__dirname + '/android-html.html');
});


//返回json让前端使用；
app.get('/test_json',function (req,res) {
    res.json({"user":"李思","users":"东方"});
});


//返回json让前端使用；
app.get('/jpg_json',function (req,res) {
    res.jsonp([{"src":"img/1.jpg"},{"src":"img/2.jpg"},{"src":"img/3.jpg"},{"src":"img/8.jpg"},{"src":"img/5.jpg"},{"src":"img/6.jpg"},{"src":"img/9.jpg"}]  );
});


// //做授权之后，拿到code
// app.get('/test',function(req,res)
// {
//     //如果直接传递给前端页面
//     //跳转到微信的页面
//     //res.sendFile(__dirname+'/html/wx_index.html');
//
//     var jsonParser = bodyParser.json();
//
//     //app_id和secret_id
//     var app_id='wxd02d8c94cd422a75';
//     var secret_id='84259c8c679331e6a2368f8076a9fad2';
//
//     //用户授权后，微信回调的时候给的code
//     var _code = req.query.code;
//     console.log(_code);
//     //res.send("用户的code是：：："+_code );
//
//     //拿到code 取token
//     var access_url='https://api.weixin.qq.com/sns/oauth2/access_token?'+
//                    'appid='+app_id+
//                    '&secret='+secret_id+
//                    '&code='+_code+'&grant_type=authorization_code ';
//
//     //拿到了新的数据
//     needle.get(access_url,function(err, token_res)
//     {
//         if(token_res.statusCode)
//         {
//             var jsonStr = JSON.parse(token_res.body);  //需要得到解析成json之后取得数据
//             console.log("jsonstr==="+jsonStr+":::"+jsonStr.access_token);
//
//             //得到的反馈是个什么
//             //res.send(response.body);
//             console.log("获取的用户token==="+token_res.body);
//
//             //拿到token
//             var user_refresh_token,user_open_id;
//
//             if(token_res.body.refresh_token)   //如果有数据
//             {
//                   user_refresh_token = token_res.body.refresh_token;
//                   user_open_id = token_res.body.user_open_id;
//             }else {
//                 user_refresh_token = jsonStr.refresh_token;
//                 user_open_id = jsonStr.user_open_id;
//             }
//
//             //我靠，先刷新一下
//             var fresh_url= 'https://api.weixin.qq.com/sns/oauth2/refresh_token?'+
//                             'appid='+app_id+
//                             '&grant_type=refresh_token'+
//                             '&refresh_token='+user_refresh_token;
//
//             console.log("刷新的url::::"+fresh_url);
//             needle.get(fresh_url,function(err,response1){
//                 if(err)
//                 {
//                     //输出信息
//                     console.log("刷新用户信息有问题");
//                 }else
//                 {
//                     console.log("刷新得到的新token:::"+response1.body);
//                     var jsonStr1 = JSON.parse(response1.body);  //需要得到解析成json之后取得数据
//                     var new_token;
//
//                     if(token_res.body.access_token)   //如果有数据
//                     {
//                         new_token = token_res.body.access_token;
//                     }else {
//                         new_token = jsonStr1.access_token;
//                     }
//
//                     //获取用户信息
//                     var user_infor_url =  'https://api.weixin.qq.com/sns/userinfo?'+
//                         'access_token='+ new_token+
//                         '&openid='+user_open_id+
//                         '&lang=zh_CN' ; //需要新的请求
//
//                     //用户的信息
//                     needle.get(user_infor_url,function(err,user_res){
//                         if(err)
//                         {
//                             //输出信息
//                             console.log("获取用户信息有问题");
//                         }else
//                         {   //成功
//                             console.log("获取用户信息"+user_res.body);
//                             res.sendFile(__dirname + '/public/html/wx_index.html');        //跳转到微信的详细页面
//                         }
//                     }); //获取用户信息
//                 }
//             });  //更新token ; 每隔一段时间就过期，所以没事就得去取一下，我们这里每次都取得了
//         }else{
//             res.sendStatus(token_res.statusCode);       //没用
//         }
//     })
// });


// //动态请求
// app.get('/dongtai',function (req,res)
//     {
//         //返回的字符串是
//         var markup=React.renderComponentToString(
//             First_test({initialCount:7})
//         );
//
//         //输出的时候
//         res.render('',{markup:markup});
//
//     }
// );


// //微信请求的时候，返回微信需要的信息
// //绑定微信公众号的时候，返回一个回馈的字符串
// app.get('/wx_test',function (req,res) {
//
//     console.log(req.query.signature+'  '+req.query.timestamp+'  '+
//                  req.query.nonce+ '   '+req.query.echostr);
//
//     var arr_key=[];
//     arr_key.push("timestamp");
//     arr_key.push("nonce");
//     arr_key.push("echostr");
//
//     arr_key.sort(); //进行排序
//     console.log("排序的结果是：" + arr_key);   //输出字符串
//
//     //拿出每一个进行比较组装字符串
//
//     var arr = {};  //这是按照对象来处理
//     arr["timestamp"]    = "a";  //req.query.timestamp;
//     arr["nonce"]        =  "b"; //req.query.nonce;
//     arr["echostr"]      =  "c"; //req.query.echostr;
//
//     arr.sort(arr);  //直接进行了处理
//
//     var all_str;    //输出字符串
//     //循环处理
//     for(var tmp in arr)
//     {
//         //all_str+=tmp.name;
//         //all_str+='=';
//         //all_str+=tmp.;
//     }
//
//     console.log('数组：'+arr); //输出加密的结果
//
//     //用组件进行sha1的加密
//     all_str=sha1(all_str);      //加密完成
//
//     console.log(all_str); //输出加密的结果
//
//     //返回真还是假
//     res.send(req.query.echostr); //直接返回ture
// });


// //把wx的请求转到wx_index
// app.get('/wx', function(req,res){
//     res.sendFile(__dirname + '/public/html/wx_index.html');        //跳转到微信的详细页面
// });


/***    奖品     ***/
app.get('/getJianPinListByDeviceId',function(req,res){
    needle.get(Host+'/getJianPinListByDeviceId?deviceId=' +
        encodeURI(req.query.deviceId),function(err, response)
    {
        if(response.statusCode){
            res.send(response.body);
        }else{
            res.sendStatus(response.statusCode);
        }
    })
});


/**
 * 抽奖结果
 */
app.get('/choujiang',function(req,res){
        needle.get(Host+'/choujiang?huoDongId=' + req.query.huoDongId+'&userName='+encodeURI(req.query.userName)+'&userId='+req.query.userId+'&deviceId='+encodeURI(req.query.deviceId),function(err, response){
            if(response.statusCode){
                res.send(response.body);
            }else{
                res.sendStatus(response.statusCode);
            }
        })
});


// /**     保存联系方式      **/
// //申请到当前app的，转到其他服务器的url请求
// app.get('/setMail',function(req,res)
// {
//     needle.get(Host+'/setMail?luckyNo=' + req.query.luckyNo+'&email='+encodeURI(req.query.email)+'&userId='+req.query.userId,function(err, response){
//         if(response.statusCode){
//             res.send(response.body);
//         }else{
//             res.sendStatus(response.statusCode);
//         }
//     });
// });

//
// app.get('/getChouJiangLog',function(req,res){
//     needle.get(Host+'/getChouJiangLog?deviceId='+encodeURI(req.query.deviceId)+'&fetchsize='+8+'&start='+0,function(err, response){
//         var body = response.body;
//         if(response.statusCode){
//             res.send(body);
//         }else{
//             res.sendStatus(response.statusCode);
//         }
//         var list =body.rows;
//         var ids = '';
//         for(var i in list){
//             if(list[i].status == 0) {
//                 ids = ids + list[i].id + ',';
//             }
//         }
//         ids = ids.substring(0,ids.length-1);
//         needle.get(Host+'/updateLog?ids='+ids,function(err, response){
//         });
//     })
// });

//
// app.get('/getWebAdInfo',function(req,res){
//     needle.get('http://api.bm.gochinatv.com/ad_v1/getWebAdInfo?mac='+req.query.mac,function(err, response){
//         if(response.statusCode){
//             res.send(response.body);
//         }else{
//             res.sendStatus(response.statusCode);
//         }
//     })
// })


//----  node.js 的  express 的内容   -----
//替代了 http.createServer(function(req,res){})
var server = app.listen(8092,function()
    {
        console.log('server listening at http:%s:%s', server.address().address,server.address().port);
    }
);







