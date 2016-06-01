/**
 * Created by Administrator on 2016/5/26.
 */
var React = require('react');
var $ = require('jquery');
var swal = require('sweetalert');
var Bandit = require('./bandit');
var request = require('superagent');

require('sweetalert/dist/sweetalert.css');
require('../css/lucky.css');
var randomArr = [];
var startButton = false;




var Result = React.createClass({
    getInitialState : function(){
        return {
            email : '',

        }
    },
    render : function(){
        var _prizeInfo = '';
        if(this.props.result.id != -1){
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

    },
    _change : function(e){
        this.setState({email : e.target.value});
    }
})

var Lucky = React.createClass({
    getInitialState : function(){
        return {
            list : [

            ],
            deviceId : '',
            page : 0,
            count : 0,
            result : {

            },
            flag : false,
            loginStatus : 0,
            user :{},
            huoDongId :''
        }
    },
    componentWillMount : function(){
        var $this = this;
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '248152615540242',
                cookie     : true,  // enable cookies to allow the server to access
                                    // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.2' // use version 2.2
            });

            FB.getLoginStatus(function(response){
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
                            $this.setState({loginStatus:0});
                        }
                    },{scope: 'email'})
                }
            })
        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    },
    componentDidMount : function(){


    },
    componentWillUnmount : function(){
        this.setState({
            list : [],
            deviceId : ''
        });
    },
    render : function(){
        var resultDiv = '';
        if(this.state.flag){//已经抽完奖
            resultDiv = <Result result={this.state.result} submit={this._submit} cancel={this._cancel}/>;
        }

        var code = <div className='code'>
            <div>
                <input type='text' id='code'  placeholder='Please enter device code on TV' value={this.state.deviceId} onChange={this._change}/><button className='btn btn-danger' style={{marginLeft:'10px'}} onClick={this._getPrize}>submit</button>
            </div>
        </div>;
        var list = this.state.list;
        var content;
        if(list == 0){
            content = <Bandit list={[]} randomArr={[]} result={this.state.result} start={this._start}/>;
        }else{
            var length = 0;
            if(list.length <= 8){
                length = 8;
            }
            content = <Bandit list={list} randomArr={getRandomData(length)} result={this.state.result} start={this._start}/>;
        }


        return <div className='main-body' style={{backgroundColor: '#580063'}}>
            {code}
            <div style={{width:'100%',textAlign:'right'}}>
                <div className="fb-login-button" data-max-rows="1" data-size="medium" data-show-faces="false" data-auto-logout-link="false" style={{right:'0',top:'0px',position:'absolute'}}></div>
            </div>
            <div className='prize-body'>{content}</div>
            <div className='prize-description'>
               <div className='row'><div className='col-xs-12 col-md-12'>Draw conditions</div></div>
               <div style={{textAlign:'left'}}>
                   <ul>
                       <li>1.	Every user can only enter the raffle in one restaurant for one time.</li>
                       <li>2.	You will have chance to get prize on your screen.</li>
                       <li>3.	If you are lucky to get one of the prizes, please leave your email address, we will contact you for address via email</li>
                       <li>4.	Reserved rights for final explanation.</li>
                   </ul>
               </div>
            </div>
            {resultDiv}
        </div>
    },
    _change : function(e){
        this.setState({deviceId:e.target.value});
    },
    _submit : function(email){
        request.get('/setMail?email='+email+'&luckyNo='+this.state.result.luckyNo+'&userId='+this.state.user.id).end(function(err, res){
            if(res.body.code == 0){
                window.close();
                swal('submit success,thank you for your timer','','success');
            }else{

            }
        })
    },
    _cancel : function(){
        if(this.state.result.id == -1){
            this.setState({flag:false});
            return true;
        }
        swal({
            title : 'Are you sure?',
            text : 'You are trying to give up this prize, click \"Yes, give up!\" to give up this prize',
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, give up!",
            closeOnConfirm: true
        },function(){
            this.setState({flag:false})
        }.bind(this))
    },
    _start : function(size,e){
        e.preventDefault();
        if(startButton){
            e.preventDefault();
            return false;
        }
        startButton = true;
        $("#start").attr('disabled',true);
        var j;
        var i = j = this.state.count;
        var count = 0;
        var speed = 100;
        var total = 3 * size - i;
        var req = request.get('/choujiang?huoDongId='+this.state.huoDongId+'&userName='+this.state.user.name+'&userId='+this.state.user.id+'&deviceId='+this.state.deviceId);
        //var req = request.get('/choujiang?huoDongId='+this.state.huoDongId+'&userName='+new Date().getTime()+'&userId='+this.state.user.id+'&deviceId='+this.state.deviceId);
        var message = '';
        req.end(function(err,res){
            if(res.body.code != 0){
                $("#start").attr('disabled',false);
                message = res.body.message;
                swal(message);
                return false;
            }
            var _rows = res.body.rows;
            if(_rows.length>0){
                _rows = _rows[0];
            }
            var id = (_rows.huoDongConfigId == null || _rows.huoDongConfigId == '') ? '-1' : _rows.huoDongConfigId;
            var _class;
            var result = {};
            result.id = id;
            result.luckyNo = _rows.luckyNo;
            if(id == '-1'){
                _class = $($('div[name="prize_-1"]')[0]).parent().parent();
            }else{
                _class = $("#prize_"+id).parent().parent();
            }
            result.name = _class.find('.prize-title-name').text();
            _class = _class.attr("class");

            var number = parseInt(_class.substring(11));
            total = total + number;
            var timer;
            timer = setTimeout(run,speed);
            var $this = this;
            function run(){

                $('.stop').css("opacity",0);
                $('.item-'+i).find('.stop').css("opacity",0.7);
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
                if(count > total){
                    clearTimeout(timer);
                    startButton = false;
                    $("#start").attr('disabled',false);
                    $this.setState({count:i,flag:true,result:result})
                }


            }
        }.bind(this))



    },
    _getPrize : function(){
        if(!this.state.user.id){
            swal('please login with facebook');
            return true;
        }
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
module.exports = Lucky;

function getRandomData(size){
    if(randomArr.length > 0 && randomArr.length == size){
        return randomArr;
    }
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
    randomArr = array;
    return array;
    // 生成随机数的方法
    function generateRandom(count){
        var rand = parseInt(Math.random()*count);
        for(var i = 0 ; i < array.length; i++){
            if(array[i] == rand){
                return false;
            }
        }
        array.push(rand);
    }
}
