/**
 * Created by Administrator on 2016/4/13.
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var needle = require('needle');
var Host = 'http://114.215.142.23:7001/hudong/api/v2/HHuoDong';
app.use(session({secret:'keyboard cat'}))
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer({ dest: './uploads/'})); // for parsing multipart/form-data
app.get('/', function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/lucky', function(req,res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/android', function(req,res){
    res.sendFile(__dirname + '/android-html.html');
});


/**
 * 奖品
 */
app.get('/getJianPinListByDeviceId',function(req,res){
    needle.get(Host+'/getJianPinListByDeviceId?deviceId=' + req.query.deviceId,function(err, response){
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
        needle.get(Host+'/choujiang?huoDongId=' + req.query.huoDongId+'&userName='+req.query.userName+'&userId='+req.query.userId+'&deviceId='+req.query.deviceId,function(err, response){
            if(response.statusCode){
                res.send(response.body);
            }else{
                res.sendStatus(response.statusCode);
            }
        })
});
/**
 * 保存联系方式
 */
app.get('/setMail',function(req,res){
    needle.get(Host+'/setMail?luckyNo=' + req.query.luckyNo+'&email='+encodeURI(req.query.email)+'&userId='+req.query.userId,function(err, response){
        if(response.statusCode){
            res.send(response.body);
        }else{
            res.sendStatus(response.statusCode);
        }
    });
});
app.get('/getChouJiangLog',function(req,res){
    needle.get(Host+'/getChouJiangLog?deviceId='+req.query.deviceId+'&fetchsize='+8+'&start='+0,function(err, response){
        var body = response.body;
        if(response.statusCode){
            res.send(body);
        }else{
            res.sendStatus(response.statusCode);
        }
        var list =body.rows;
        var ids = '';
        for(var i in list){
            if(list[i].status == 0) {
                ids = ids + list[i].id + ',';
            }
        }
        ids = ids.substring(0,ids.length-1);
        needle.get(Host+'/updateLog?ids='+ids,function(err, response){
        });
    })
});
app.get('/getWebAdInfo',function(req,res){
    needle.get('http://api.bm.gochinatv.com/ad_v1/getWebAdInfo?mac='+req.query.mac,function(err, response){
        if(response.statusCode){
            res.send(response.body);
        }else{
            res.sendStatus(response.statusCode);
        }
    })
})
var server = app.listen(8083, function(){
    console.log('server listening at http:%s:%s', server.address().address,server.address().port);
});