/**Created by liu on 2016/8/19.***/


var React = require('react');

var testFirst = React.createClass  //返回的应该是一个对象
({
    propTypes: {
    },
    getDefaultProps() {
        return {
        };
    },
    render(){
        const text = this.state.liked?'like':'haven\'t liked';
        return(
            <p onclick={this.handleClick.bind(this)}>
                you {text}this.Click to toggle.
            </p>
        );
    }
});

//console.log(testFirst);

module.export=testFirst;  //输出一个对象