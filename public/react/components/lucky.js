/** Created by Administrator on 2016/5/26.   **/

var React = require('react');
var $ = require('jquery');                       //  -?? 重复使用的话，需要处理一下----webpack不会出这种问题
var swal = require('sweetalert');               //弹出提示对话框
var Bandit = require('./bandit');
var request = require('superagent');            //ajax的封装
var banditRun = require('../utils/bandit-run');
var _ = require('underscore');                  //??声明了一个变量；是数组和循环的处理；  处理很多信息
require('sweetalert/dist/sweetalert.css');
require('../css/lucky.css');


var randomArr = [];                  //全局性的数组
var startButton = false;            //开始按钮？？是否开始---- 目前没用


//做个组件
var Result = React.createClass (  //创建类
{
    getInitialState : function()
    {
        return {
            email : '',             //组件放的是邮箱地址
        }
    },
    render : function(){
        var _prizeInfo = '';
        if(this.props.result.id != -1)      // 奖品id  ；
        {
            _prizeInfo = 'Congratulation,you got a '+this.props.result.name+'!!,please enter your email for further contact';
            return <div className='result' style={{height:document.body.scrollHeight}}>
                <div className='container'>
                    <div>
                        <img src='./images/win.png' style={{width: '60%'}}/>
                    </div>

                    <div className='row'>
                        {_prizeInfo}
                    </div>

                    <div className='row'>
                        <input type='text' value={this.state.email} onChange={this._change} placeholder='请输入邮箱'/>
                </div>

                    <div className='row'>
                        <div className='col-xs-4 col-md-4'></div>
                        <div className='col-xs-3 col-md-3'><button className='btn btn-warning' onClick={this.props.cancel}>close</button></div>
                        <div className='col-xs-3 col-md-3'><button className='btn btn-info' onClick={this.props.submit.bind(null,this.state.email)}>submit</button></div>
                    </div>
                </div>
            </div>
        }else{
            _prizeInfo = 'Thank you for your support'
            return <div className='result' style={{height:document.body.scrollHeight,textAlign:'center'}}>
                <div className='container' style={{marginTop:'30%'}}>
                    <div>
                        <img src='./images/lose.png' style={{width:'25%'}}/>
                    </div>
                    <div className='row'>
                        {_prizeInfo}
                    </div>
                    <div className='row'>
                        <button className='btn btn-warning' onClick={this.props.cancel}>close</button>
                    </div>
                </div>
            </div>
        }
    },      // 额外的改动之后的变化
    _change : function(e)
    {
        console.log("输入设备ID的时候，发生了改变");
        this.setState({email : e.target.value});
    }
})


//最大的输出组件，是个视图
var Lucky = React.createClass
({
    getInitialState : function(){
        return {
            list : [],
            deviceId : '',
            page : 0,
            count : 0,
            result : {},
            flag : false,       //目前能不能转
            loginStatus : 1,    //直接修改登录状态
            user :{},
            huoDongId :''
        }
    },
    componentWillMount : function(){            //组件还没显示之前，登录facebook，把用户名和id保存起来
        var $this = this;  //！！藏得好深
        window.fbAsyncInit = function()         //fbAsyncInint是从哪里调用出来的
        {
            FB.init({
                appId      : '248152615540242',
                cookie     : true,  // enable cookies to allow the server to access   前端准许了开cookie
                                    // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.2' // use version 2.2
            });

            FB.getLoginStatus(function(response)
            {
                if(response.status == 'connected')
                {
                    FB.api(
                        '/me',
                        function (response1) {      //
                            if (response1 && !response1.error)
                            {
                                console.log(response1);
                                $this.setState({                    //不是问题
                                    user : {
                                        name : response1.name,      //获得了FB的信息，用户名字和用户ID
                                        id : response1.id
                                    },
                                    loginStatus:1
                                })
                            }
                        }
                    );
                }else{
                    FB.login(function(response){
                        if(response.status == 'connected'){
                            FB.api(
                                '/me',
                                function (response1) {

                                    if (response1 && !response1.error) {
                                        console.log(response1);
                                        $this.setState({
                                            user : {
                                                name : response1.name,
                                                id : response1.id
                                            },
                                            loginStatus:1
                                        })
                                    }
                                }
                            );
                        }else{
                            $this.setState({loginStatus:0});  // 刷新个毛啊
                        }
                    },{scope: 'email'})  //这是啥意思呢
                }
            })
        };

        // Load the SDK asynchronously
        (function(d, s, id)   //？？这是个啥   方法块--直接被facebook调用；接口
            {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk')
        );
    },
    componentWillUnmount : function(){  //组件退出的时候，就是lucky推出的时候
        this.setState({
            list : [],
            deviceId : ''
        });
    },
    render : function()             //
    {
        var resultDiv = '';
        if(this.state.flag)        //轮盘转完了，要显示结果
        {    //已经抽完奖  另一个组件，扔进入三个参数
            resultDiv = <Result result={this.state.result} submit={this._submit} cancel={this._cancel}/>;
        }

        var code =                      //deviceId 在哪获取的？？  显示设备号
        <div className='code'>
            <div>
                <input type='text' id='code'  placeholder='Please enter device code on TV' value={this.state.deviceId}
                       onChange={this._change_did}/><button className='btn btn-danger' style={{marginLeft:'10px'}} onClick={this._getPrize}>submit</button>
            </div>
        </div>;

        var list = this.state.list;
        var content;
        // if(!list || list == 0){
        //     content = '';
        // }else
        {
            var length = 0;
            if(list.length <= 8){
                length = 8;
            }
            //alert('数组是：'+list);    //显示一下list
            content = <Bandit list={list} randomArr={getRandomData(length)} result={this.state.result} start={this._start}/>;
            content = <div className='prize-body'>{content}</div>
        }

        {content}
        return <div className='main-body' style={{backgroundColor: '#580063'}}>
            {code}
            <div style={{width:'100%',textAlign:'right'}}>
                <div className="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false"
                     data-auto-logout-link="false" style={{right:'0',top:'0px',position:'absolute'}}></div>
            </div>
            <div className='prize-description'>
               <div className='row'><div className='col-xs-1 col-md-1'></div><div className='col-xs-11 col-md-11'>Rules</div></div>
               <div className='prize-description-content'>
                   <div>1.	Search "ilovechinesefood" on Facebook, no space in between!</div>
                   <div>2.	Click on the link in the pinned post to enter the game</div>
                   <div>3.	Find the device ID at the upper right corner of this screen</div>
                   <div>4.	Put in the device ID(upper case) to start</div>
               </div>
            </div>
            {resultDiv}
        </div>
    },
    _change : function(e)
    {
        this.setState({deviceId:e.target.value});
    },
    _change_did:function (e)
    {
        this.setState({deviceId:e.target.value});           //反复刷新设备ID
        console.log("输入设备ID的时候，回调信息");
    },
    //下一个组件里面，放邮箱？？
    _submit : function(email)
    {
         //superagent  做系统的请求
         var url_str='/setMail?email='+email+'&luckyNo='+this.state.result.luckyNo+'&userId='+this.state.user.id;
                console.log("请求的url：" + url_str);  //
         request.get(url_str).end(function(err, res){
            if(res.body.code == 0)
            {
                window.close(); // 整个窗口关闭，就直接退出了
                swal('submit success,thank you for your timer','','success');   //提示
            }else{
            }
        })
    },
    _cancel : function(){
        if(this.state.result.id == -1)      //？？id是干啥的
        {
            this.setState({flag:false});    //抽奖结束，可以重新开始       //
            return true;
        }
        swal(
            {
                title : 'Are you sure?',
                text : 'You are trying to give up this prize, click \"Yes, give up!\" to give up this prize',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, give up!",
                closeOnConfirm: true
            },function()
            {
                this.setState({flag:false})     //
            }.bind(this)                         //???这个地方还是蛮奇怪的
        )
    },
    _start : function(size,e)       //??e是哪来的？？  点了开始按钮
    {
        e.preventDefault();         //停止提交等其他事件？？
        if(startButton)            //如果已经开始转动了
        {
            e.preventDefault();
            return false;
        }

        //开始转动
        var _runArr = banditRun(size);          //返回一个数组
        startButton = true;
        $("#start").attr('disabled',true);     //按钮不可用

        var j;
        var i = j = 0;
        var count = 0;
        var speed = 100;
        var total = 3 * size;

        //拿活动的一些信息回来？？？这个地方一直等待么？？？
        var req = request.get('/choujiang?huoDongId='+this.state.huoDongId+'&userName='+
            this.state.user.name+'&userId='+this.state.user.id+'&deviceId='+this.state.deviceId);
        //var req = request.get('/choujiang?huoDongId='+this.state.huoDongId+'&userName='+new Date().
        //getTime()+'&userId='+this.state.user.id+'&deviceId='+this.state.deviceId);

        var message = '';
        req.end(function(err,res)
        {
            if(res.body.code != 0)              //如果请求失败
            {
                startButton = false;            //重开可以运行
                $("#start").removeAttr('disabled');
                message = res.body.message;
                startButton = false;
                swal(message);      // 弹出对话框
                return false;
            }

            var _rows = res.body.rows;
            if(_rows.length>0)
            {
                _rows = _rows[0];
            }

            var id = (_rows.huoDongConfigId == null || _rows.huoDongConfigId == '') ?
                        '-1' : _rows.huoDongConfigId;
            var _class;
            var result = {};
            result.id = id;
            result.luckyNo = _rows.luckyNo;

            if(id == '-1')
            {   _class = $($('div[name="prize_-1"]')[0]).parent();  //??什么鬼
            }else{
                _class = $("#prize_"+id).parent();
            }

            result.name = _class.find('.prize-title-name').text();
            _class = _class.attr("class");  

            var number = parseInt(_class.substring(13));
            total = total + _.indexOf(_runArr, number);     //_?? 是个什么货

            var timer;
            timer = setTimeout(run,speed);       //一次执行
            var $this = this;                   //组件重新命名

            function run()
            {
                $('.stop').css("opacity",0);
                $('.item-'+_runArr[i]).find('.stop').css("opacity",0.7);
                j++;
                count++;
                if(j<size){
                    i = j
                }else{
                    i = j%size;
                }
                if(count > total-12){
                    speed = 300;
                }
                if(count > total-7){
                    speed = 500;
                }
                if(count > total-3){
                    speed = 1000;
                }

                timer = setTimeout(run,speed);
                if(count > total)
                {
                    clearTimeout(timer);
                    startButton = false;
                    $("#start").removeAttr('disabled');                 // 重新可以点开始

                    var timer2 = setTimeout(function()
                    {
                        $this.setState({flag:true,result:result})       // ？？刷新界面，这个刷新会导致什么
                        clearTimeout(timer2);
                    },1500);
                }
            }
        }.bind(this))           //绑定一个结果
    },
    _getPrize : function()      //从后台获取信息到前台，在前端准备展示轮盘
    {
        // if(!this.state.user.id)
        // {
        //     swal('please login with facebook');
        //     return true;
        // }
        var deviceId = this.state.deviceId;
        var req = request.get('/getJianPinListByDeviceId?deviceId='+deviceId);
        req.end(function(err,res){
            var _rows = res.body.rows;
            if(_rows.length>0){
                _rows = _rows[0];
            }
            this.setState({list:_rows.jiangPinList,huoDongId:_rows.id});
        }.bind(this))
    }
});
module.exports = Lucky;         //作为整体一个模块来处理


function getRandomData(size)
{
    if(randomArr.length > 0 && randomArr.length == size)
    {
        return randomArr;
    }

    //没有的话随机生成

    var array = new Array();
    // 循环N次生成随机数
    for(var i = 0 ; ; i++){
        // 只生成指定个数的随机数
        if(array.length<size){
            generateRandom(size);
        }else{
            break;
        }
    }

    randomArr = array;  //？？这是怎么个写法？？
    return array;
    // 生成随机数的方法
    function generateRandom(count)
    {
        var rand = parseInt(Math.random()*count);
        for(var i = 0 ; i < array.length; i++){
            if(array[i] == rand){
                return false;
            }
        }
        array.push(rand);
    }
}
