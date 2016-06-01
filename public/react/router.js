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
var App = require('./components/App');
var Lucky = require('./components/lucky');
var Android = require('./components/android');

ReactDom.render(
    <Router history={browserHistory}>
        <Route  path="/" component={App} >
            <IndexRedirect to='lucky'/>
            <Route path="lucky" component={Lucky}></Route>
        </Route>
        <Route path="/android" component={Android}></Route>
        <Route path="/lucky" component={Lucky}></Route>
    </Router>,
    document.getElementById('wrapper')
)