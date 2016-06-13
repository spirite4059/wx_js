/**
 * Created by Administrator on 2016/5/26.
 */
var React = require('react');
var request = require('superagent');
var $ = require('jquery');
var _ = require('underscore');
var Bandit = require('./bandit');
var TimerMixin = require('react-timer-mixin');
var banditRun = require('../utils/bandit-run');
require('../css/android.css');
var randomArr = [];
var timer;
var prizeLength = 0;

var Results = React.createClass({
    componentDidMount : function(){
        $('.result-title').css('line-height',$('.result-title').height()+'px');
    },
    componentDidUpdate : function(){
        $('.result-title').css('line-height',$('.result-title').height()+'px');
    },
    render : function(){
        var list = this.props.prizeList;
        var divs = [];
        for(var i in list){
            var obj = list[i];
            if(obj.huoDongConfigId && obj.huoDongConfigId != null && obj.huoDongConfigId != ''){
                divs.push(<div className={'result-lucky-'+parseInt(i)%2} key={i}>
                    <img style={{borderRadius:'99em',height:'80%',width:'auto'}} src={'http://graph.facebook.com/' + obj.userId + '/picture?type=small'} />
                    <span className='result-span'><div>{obj.userName}</div> <div>draw a {obj.huoDongConfigName}</div></span>
                </div>);
            }else{
                divs.push(<div className={'result-lucky-'+parseInt(i)%2} key={i}>
                        <img style={{borderRadius:'99em',height:'80%',width:'auto'}} src={'http://graph.facebook.com/' + obj.userId + '/picture?type=small'} />
                        <span className='result-span'><div>{obj.userName}</div>  <div>draw a {'thank you'}</div></span>
                </div>)
            }
        }
        return <div className='result-body'>
            <div className='result-title'>Lottery Results</div>
            <div className='result-main'>{divs}</div>
        </div>
    }
});



var Android = React.createClass({
    mixins: [TimerMixin],
    getInitialState : function(){
        return {
            layout: [],
            cmd: {},
            count : 0,
            list:[],
            prizeList : [
            ],
            flag : false,
            deviceId : '',
            prizeNew : [],
            imgList:[],
            pageCount:0
        }
    },
    componentDidUpdate : function(){
    },
    componentWillUnmount : function(){
        clearTimeout(timer);
    },
    componentDidMount : function(){

        var $this = this;
        var speed = 0;
        var pageCount = $this.state.pageCount;
        var imgList = $this.state.imgList;
        timer = setTimeout(run,500);
        function run(){
            pageCount = $this.state.pageCount;
            imgList = $this.state.imgList;
            if(imgList.length == 0){//未从后台读取数据等待。。。
                timer = setTimeout(run,speed);
                return true;
            }
            pageCount++;
            if(pageCount > imgList.length){
                pageCount = 0;
            }
            if($this.state.prizeList == 0 && pageCount == imgList.length){
                pageCount = 0;
            }
            if(imgList.length > pageCount){
                speed = imgList[pageCount].adImageInterval;
            }else{
                speed = 15000;
            }
            $this.setState({pageCount:pageCount});
            timer = setTimeout(run,speed);
        }


        var _length = this.state.layout.length;
        function connectWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) {
                if(_length == 0){
                    WebViewJavascriptBridge.callHandler('submitFromWeb',{'param':'getLayout'},function(responseData){
                        $this._layout(responseData);
                    });
                }
                callback(WebViewJavascriptBridge)
            } else {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady'
                    , function() {
                        if(_length == 0){
                            WebViewJavascriptBridge.callHandler('submitFromWeb',{'param':'getLayout'},function(responseData){
                                $this._layout(responseData);
                            });
                        }
                        callback(WebViewJavascriptBridge)
                    },
                    false
                );
            }
        }

        connectWebViewJavascriptBridge(function(bridge) {
            if(!bridge)return false;
            bridge.init(function(message, responseCallback) {
                var data = {
                    'Javascript Responds': '测试中文!'
                };
                if(responseCallback)
                responseCallback(data);
            });
            //bridge.registerHandler("layoutInJs", function (data, responseCallback) {
            //    $this._layout(data);
            //    var responseData = "Javascript Says Right back aka!";
            //    responseCallback(responseData);
            //});
            bridge.registerHandler("functionInJs", function (data, responseCallback) {
                $this._show(data);
                var responseData = "Javascript Says Right back aka!";
                responseCallback(responseData);
            })
        }.bind(this));
    },
    render : function(){
        var body = '';
        var layout = this.state.layout;
        var content = '';

        if(layout.length > 0){
            var divs = [];
            var imgs = this.state.imgList;

            for(var i in layout){
                var bandit = '';
                content = '';
                var ad = layout[i];
                if(ad.adType > 4){
                    continue;
                }
                var style = {
                    width : ad.adWidth *100+'%',
                    height : ad.adHeight *100 + '%',
                    top : ad.adTop*100+'%',
                    left : ad.adLeft*100+'%',
                    //backgroundColor:'#'+i+i+i,
                    position:'absolute'
                };

                if(ad.adType == 2){

                    if(this.state.prizeList.length > 0 && imgs.length < this.state.pageCount+1){
                        content =  <Results prizeList={this.state.prizeList} prizeNew={this.state.prizeNew}/>
                    }else{
                        content = <img style={{height:'100%',with :'100%'}} src={imgs[this.state.pageCount].adImageUrl} />;
                    }



                }
                if(ad.adType == 1){
                    if(this.state.prizeNew.length > 0){
                        var length = 0;
                        if(this.state.list.length <= 8){
                            length = 8;
                        }
                        style.backgroundColor = 'rgba(88, 0, 99, 0.5)';
                        var _prizeNew = this.state.prizeNew[0];
                        content = <div style={{textAlign:'center',height:'100%'}} className='ad1'>
                            <div style={{height:'50px',lineHeight:'50px',color:'white'}}><img style={{borderRadius:'99em',width:'auto'}} src={'http://graph.facebook.com/' + _prizeNew.userId + '/picture?type=small'} />{_prizeNew.userName}</div>
                            <div style={{width:'60%',height:'80%',margin:'auto',display:'flex'}}><Bandit list={this.state.list} randomArr={getRandomData(length)} start={this._start} autoFlag={true} result={_prizeNew}/></div>
                        </div>
                    }

                }


                divs.push(<div style={style} key={i} id={'ad'+ad.adType}  >
                    {content}

                </div>);
            }
            body = divs;
        }
        return <div className='main-body'>{body}</div>;
    },
    _layout : function(data){//初始化界面只调用一次
        var obj = JSON.parse(data);

        var _prizeNew = [];
        var $this = this;
        request.get("/getChouJiangLog?deviceId="+obj.deviceId).end(function(err,res){
            var list = res.body.rows;
            for(var i in list){
                var _obj = list[i];
                if(_obj.status == 0){//未读
                    _prizeNew.push(_obj);
                }
            }
            request.get("/getJianPinListByDeviceId?deviceId="+obj.deviceId).end(function(err, res1){
                var _jiangpinList = [];
                if(res1.body.rows.length > 0){
                    _jiangpinList = res1.body.rows[0].jiangPinList;
                }
                request.get("/getWebAdInfo?mac="+obj.mac).end(function(err,res2){
                    var imgList = res2.body.data;
                    if(imgList.length == 0){
                        imgList.push({adImageUrl:"./images/pre-2.jpg",adImageInterval:5000});
                    }
                    $this.setState({
                        imgList : imgList,
                        pageSize : imgList.length,
                        list:_jiangpinList,
                        prizeList : list,
                        mac:obj.mac,
                        prizeNew : _prizeNew,layout:obj.layout,deviceId:obj.deviceId
                    })
                })

            })

        });
    },
    _show : function(data){
        var cmd = JSON.parse(data);
        var list = [];
        var _prizeNew = this.state.prizeNew;
        var $this = this;
        if(cmd){
            if(cmd.isJsCommand == 1){
                var cmdList = cmd.cmd;
                for(var i in cmdList){
                    var _cmd = cmdList[i];
                    if(_cmd.cmdInfo == 'fresh'){
                        var deviceId = this.state.deviceId;
                        request.get("/getChouJiangLog?deviceId="+deviceId).end(function(err,res){
                            list = res.body.rows;
                            for(var i in list){
                                var obj = list[i];
                                if(obj.status == 0){//未读
                                    _prizeNew.push(obj);
                                }
                            }
                            $this.setState({
                                prizeList : list,
                                prizeNew : _prizeNew,
                                cmd:cmd
                            })
                        });
                    }
                }
            }
        }
    },
    _change : function(){
        this.setState({count:this.state.count+1})
    },
    _start : function(size,e){
            var prizeNew = this.state.prizeNew[0];

            var _banditArr = banditRun(size);
            var j;
            var i = j = 0;
            var count = 0;
            var speed = 100;
            var total = 3 * size;
            var _class;
            var id = prizeNew.huoDongConfigId;
            if(id == '' || id == null){
                _class = $($('div[name="prize_-1"]')[0]).parent();
            }else{
                _class = $("#prize_"+id).parent();
            }
            _class = _class.attr("class");
            var number = parseInt(_class.substring(13));
            total = total + _.indexOf(_banditArr, number);
            var timer;
            timer = setTimeout(run,speed);
            var $this = this;
            function run(){

                $('.stop').css("opacity",0);
                $('.item-'+_banditArr[i]).find('.stop').css("opacity",0.7);
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
                    timer = setTimeout(function(){
                        var prizeNewList = $this.state.prizeNew;
                        prizeNewList.splice(0,1);
                        $this.setState({count:i,flag:true,prizeNew:prizeNewList});
                        clearTimeout(timer);
                    },3000);

                }


        }
    }
});

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
module.exports = Android;

