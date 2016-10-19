

function getStyle(element,attr)
//获取行内样式（兼容） 获取element元素的css attr 属性的值
{
    if(element.currentStyle){
        return element.currentStyle[attr];
    }else{
        return getComputedStyle(element)[attr];
    }
}


// 判断是否发生轮播  //lem表示添加的长度，$aaa表示添加的样式，timer表示调用定时器的时间
function lunbo(len,$aaa,time)
{
    if(len>1)
    {
        var oUL;
        var oLI;
        var imgWidth;
        var currentIndex;

        oUL=$aaa[0];                                           //拿到的第一个对象
        oLI=oUL.children;
        //每个图片的宽度
        imgWidth=oLI[0].offsetWidth;
        //设置ul的宽度
        oUL.style.width=(oLI.length+1)*imgWidth+"px";       //整个的宽度
        //复制第一张图片
        var firstImg=oLI[0].cloneNode(true);        //用cloneNode复制一个节点，然后放到组件中
        //把复制的第一张图片追加到ul中
        oUL.appendChild(firstImg);                  //把第一张图片插入到图片中

        currentIndex=1;
        var timer=setInterval(move,time);
        function move() //移动
        {
            if(currentIndex==len+1)
            {
                oUL.style.left=0;   //左侧为0
                currentIndex=1;
            }
            startMove(oUL,{left:currentIndex*-imgWidth});
            currentIndex++;
        }
    }
}


//封装缓冲运动    //输入的两个参数：oUL,{left:currentIndex*-imgWidth}
function startMove( element,target,fn )
{
    //取消当前对象的计时器；
    clearInterval(element.timer);

    //重新设置定时器，还原
    element.timer=setInterval(function()
    {
        //遍历target（json对象）所有属性
        for(var attr in target)
        {
            //根据遍历到的属性名，获取对应在CSS样式中的属性值
            var currStyle=getStyle(element,attr);     //外围大的left对应的
            console.log(currStyle)

            //判断当前遍历到的css属性是否为opacity
            if(attr == "opacity"){
                currStyle=parseFloat(currStyle)*100;
            }

            //将currStyle值转换为整数
            currStyle=parseInt(currStyle);

            //计算运动的速度
            var speed=(target[attr]-currStyle)/10;      //每次移动10分之1
            speed=speed>0 ? Math.ceil(speed) : Math.floor(speed);

            //修改元素的CSS样式属性
            currStyle+=speed;

            //判断是否设置opacity值
            if(attr == "opacity")
            {
                element.style[attr]=currStyle/100;   
                //element.style.opacity=
            }else{
                element.style[attr]=currStyle+"px";
            }

            //console.log(element.style[attr])
            //取消计时器
            for(var attr in target)
            {
                //取消计时器
                //console.log(attr.length)
                if(attr == "opacity"){
                    currStyle = parseInt(parseFloat(getStyle(element,attr))*100);
                }else{
                    currStyle = parseInt(getStyle(element,attr));
                }

                //
                if(currStyle != target[attr])
                {
                    break;
                }else{
                    clearInterval(element.timer);   //
                    fn && fn();
                }
            }
//							if(currStyle==target[attr]){
//								clearInterval(element.timer);
//								fn && fn();
//							}
            //fn && fn();//调用后继函数
        }

    },30)
}







