/**
 * Created by Administrator on 2016/5/28.
 */
var React = require('react');
var $ = require('jquery');
var thankImg = {
    id:'-1',
    name:'Thank you',
    pic:'./images/thank.png'
};
var Prize = React.createClass({
    render : function(){
        var prize = this.props.prize;
        var index = this.props.index;
        index++;
        if(prize.id == -1){
            return <div className={'full-td item-'+index}  style={{background:'url("./images/bg/'+ index + '.png") no-repeat ',backgroundSize: 'cover',order:index}}>
                <div className='prize' name={'prize_'+prize.id}>
                    <img style={{marginTop:'15%'}} src={prize.pic} />
                </div>
                <div className='prize-title-name'>{prize.name}</div>
                <div className='stop'></div>
            </div>;
        }
        return <div className={'full-td item-'+index} style={{background:'url("./images/bg/'+ index + '.png") no-repeat ',backgroundSize: 'cover',order:index}}>
            <div className='prize' id={'prize_'+prize.id}>
                <img style={{marginTop:'15%'}} src={prize.pic} />
            </div>
            <div className='prize-title-name'>{prize.name}</div>
            <div className='stop'></div>
        </div>;
    }
});
var Bandit = React.createClass({
    getInitialState:function(){
        return {
            count : 0,
            flag : false,
            refresh:true
        }
    },
    componentDidMount : function(){
        if($('.prize-body').length > 0){
            var _table = $('.prize-body')[0];
            var _width = _table.offsetWidth;
            _table.style.minHeight = _width/1.2+'px';
            $('.main-body').height($('body')[0].scrollHeight);
        }
        if(this.props.autoFlag && this.props.list.length > 0 && this.state.refresh){
            $('#start').click();
        }
    },
    componentDidUpdate : function(){

        if($('.prize-body').length > 0) {
            var _table = $('.prize-body')[0];
            var _width = _table.offsetWidth;
            _table.style.minHeight = _width / 1.2 + 'px';
            $('.main-body').height($('body')[0].scrollHeight);
        }
        if(this.props.autoFlag && this.props.list.length > 0 && this.state.refresh){
            $('#start').click();
        }
    },
    componentWillReceiveProps: function(nextProps){
        if(this.props.result.id == nextProps.result.id){
            this.setState({refresh:false});
        }else{
            this.setState({refresh:true});
        }
    },
    componentWillUnmount : function(){
        this.setState({
            count : 0,
            flag : false
        })
    },
    render : function(){
        var list = this.props.list;
        var randomArr = this.props.randomArr;
        var content = <table><tbody></tbody></table>;
        if(list.length > 0){
            var _length = list.length;//实际长度
            var length = _length;//虚拟长度
            if(_length < 8){
                length = 8;
            }else{
                var _remainder = _length % 2;
                if(_remainder > 0){//补全到合数
                    length = _length + _remainder;
                }
            }
            var tds = [];

            if(length == 8){//九宫格
                for(var i = 0;i < length;i++){
                    if(randomArr[i] >= _length) {
                        tds.push(<Prize prize={thankImg} index={i} key={i}/>);
                    }else{
                        tds.push(<Prize prize={list[randomArr[i]]} index={i} key={i}/>);
                    }
                }
                tds.push(<div className='full-td' id='start' style={{background:'url("./images/btn.png") no-repeat ',backgroundSize: '100% 100%',order:4}} onClick={this.props.start.bind(null,length)} key={'btn-1'}></div>)
            }
            content = <div className='bandit-body'>{tds}</div>;
        }
        return content;
    },

});
module.exports = Bandit;