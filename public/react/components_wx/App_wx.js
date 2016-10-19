/**
 * Created by liu on 2016/6/15.
 */

//初始的微信的账号系统

/**
 * Created by Administrator on 2016/4/20.
 */
var React = require('react');
var App = React.createClass
(
    {
        render : function()
        {
            return <div className='app' style={{height:'100%'}}>{this.props.children || <p>微信的登录登录界面</p>}</div>
        }
    }
);
module.exports = App;