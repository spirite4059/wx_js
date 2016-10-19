/**
 * Created by liu on 2016/7/2.
 */
var React = require('react');
var $ = require('jquery');                          //?? 重复使用的话，需要处理一下
var swal = require('sweetalert');                  //弹出提示对话框
var test = require('../utils/bandit-run');
var request = require('superagent');               //ajax的封装
require('sweetalert/dist/sweetalert.css');        //css 直接加载
var sha1=require('sha1');    //加密模块

var First_test = React.createClass(
{
    //初始化信息
    getInitialState:function () {
        return{
            count:this.props.initialCount
        };
    },

    _increment:function () {
      this.setState({ count:this.state.count+1 });  //设置一个数值
    },

    render:function () {
        return <div onclick={this._increment} >
            { this.state.count } 有点信息
        </div>
    }
});

//输出的模块
module.exports =First_test;     //输出一个模块





