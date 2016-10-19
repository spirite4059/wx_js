/**
 * Created by Administrator on 2016/4/13.
 */
var React = require('react');
var ReactDom = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
var IndexRoute = require('react-router').IndexRoute;
var IndexRedirect = require('react-router').IndexRedirect;

var App = require('./components/App');                  //app的整体组件，和app.js不同
var Lucky = require('./components/lucky');              //轮盘组件
var Android = require('./components/android');          //android组件
var Wx_index    = require('./components_wx/Wx_index');    //引入微信的组件
var First_test  = require('./components_wx/First_test');  //加载First_one组件;

//代码入口；三个react   react-dom    browser
ReactDom.render
(
    <Router history={browserHistory}>
        <Route  path="/" component={App} >
            <IndexRedirect to='lucky'/>
            <Route path="lucky" component={Lucky}></Route>
        </Route>

        <Route path="/android"   component= {Android}></Route>
        <Route path="/lucky"     component= {Lucky}></Route>
        <Route path="/wx"        component ={Wx_index}></Route>
        <Route path="/dongtai"  component= {First_test } ></Route>

    </Router>,
    document.getElementById('wrapper')
)





















