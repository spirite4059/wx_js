/**
 * Created by liu on 2016/6/15.
 */
//刚上来的微信登录页面

var React = require('react');
var $ = require('jquery');                          //?? 重复使用的话，需要处理一下
var swal = require('sweetalert');                  //弹出提示对话框
var test = require('../utils/bandit-run');
var request = require('superagent');               //ajax的封装
require('sweetalert/dist/sweetalert.css');        //css 直接加载
var sha1=require('sha1');    //加密模块


//接微信的初始化页面
var Wx_index =React.createClass(
    {
        //处理最初的
      getInitialState:function () {
            return{
            }
        },

        //当第一次的时候，直接接入微信
        componentWillMount:function ()
        {
            //准备进入的时候，先调用微信的接口
        },
        componentDidMount:function()
        {
            /*
            个人的公共号信息
            AppID(应用ID)
            wxd02d8c94cd422a75
            AppSecret(应用密钥)
            84259c8c679331e6a2368f8076a9fad2 隐藏 重置   */

            var url_str='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential'+
                        '&appid=wxd02d8c94cd422a75'+
                        '&secret=84259c8c679331e6a2368f8076a9fad2';

            request.get(url_str).end(function(err, res){
                        if (err || !res.ok) {
                            alert('Oh no! error');
                        } else {

                            var token=res.body.access_token;
                            var expries_in= res.body.expires_in; //获取的token
                            //alert('yay got ' + JSON.stringify(res.body));


                            //得到token后继续处理，获取更多的信息
                            var jsticket_url='https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+
                                                token+'&type=jsapi';
                            request.get(jsticket_url).end(function (err,res){
                                if (err || !res.ok) {
                                    alert('Oh no! error');
                                } else {    //成功获取ticket
                                    res.body.ticket; //获取到当前tiket

                                    /***生成签名数组
                                    var dic = new Array();
                                    dic["noncestr"]=;
                                    dic[]='';
                                    dic[]='';
                                    dic[]='';
                                    ***/

                                    
                                }
                            });
                        }
                });


            //申请地址返回token

        }
        ,
        render :function ()
        {
            test.test();    //输出一下
            return  <div> 我靠，尝试了一下 </div>
        }
    }
);

module.exports = Wx_index;         //输出一个模块