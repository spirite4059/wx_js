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
            return <div className='full-td'  style={{background:'url("./images/bg/'+ index + '.png") no-repeat ',backgroundSize: 'cover'}}>
                <div className='prize' name={'prize_'+prize.id}>
                    <img style={{marginTop:'15%'}} src={prize.pic} />
                </div>
                <div className='prize-title-name'>{prize.name}</div>
                <div className='stop'></div>
            </div>;
        }
        return <div className='full-td' style={{background:'url("./images/bg/'+ index + '.png") no-repeat ',backgroundSize: 'cover'}}>
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
        if(this.props.autoFlag&& this.props.list.length > 0&& this.state.refresh){
            $('#start').click();
        }
        var _table = $('table')[0];
        var _width = _table.offsetWidth;
        _table.style.height = _width/1.2+'px';
    },
    componentDidUpdate : function(){

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
            var trs = [];
            var tds = [];

            if(length == 8){//九宫格
                for(var i = 0; i < 3;i++){//第一行
                    if(randomArr[i] >= _length) {
                        tds.push(<td className={'lucky item-'+i} key={'td-'+i}><Prize prize={thankImg} index={i}/></td>);
                    }else{
                        tds.push(<td className={'lucky item-'+i} key={'td-'+i}><Prize prize={list[randomArr[i]]} index={i} /></td>);
                    }
                }
                trs.push(<tr key={'tr'+1}>{tds}</tr>);
                tds = [];
                if(randomArr[3] >= _length) {
                    tds.push(<td className={'lucky item-'+7} key={'td-'+3}><Prize prize={thankImg} index={3} /></td>);
                }else{
                    tds.push(<td className={'lucky item-'+7} key={'td-'+3}><Prize prize={list[randomArr[3]]}  index={3}/></td>);
                }
                tds.push(<td className='mid-btn' colSpan={1}  key={'td-'+999}><div className='full-td' id='start' style={{background:'url("./images/btn.png") no-repeat ',backgroundSize: 'cover'}} onClick={this.props.start.bind(null,length)}></div></td>);
                if(randomArr[4] >= _length) {
                    tds.push(<td className={'lucky item-'+3}  key={'td-'+4}><Prize prize={thankImg}  index={4}/></td>);
                }else{
                    tds.push(<td className={'lucky item-'+3} key={'td-'+4}><Prize prize={list[randomArr[4]]}  index={4}/></td>);
                }
                trs.push(<tr key={'tr'+2}>{tds}</tr>);
                tds = [];
                for(var i = 5; i < 8;i++){//最后一行
                    if(randomArr[i] >= _length) {
                        tds.push(<td className={'lucky item-'+(11-i)} key={'td-'+i}><Prize prize={thankImg}  index={i}/></td>);
                    }else{
                        tds.push(<td className={'lucky item-'+(11-i)} key={'td-'+i}><Prize prize={list[randomArr[i]]}  index={i}/></td>);
                    }
                }
                trs.push(<tr key={'tr'+3}>{tds}</tr>);
            }
            content = <table><tbody>{trs}</tbody></table>;
        }
        return content;
    },

});
module.exports = Bandit;