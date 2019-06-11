// div内的loading
// 显示  obj.show(dom)    dom为要显示loading的div
// 关闭  obj.hide(dom)



let addCssText = require('../css/style'),
	class_name = 'loading'+new Date().getTime(),
	class_animate_name = class_name+'_1';


let createCss = function(){
	let cssText = '.'+class_name+'{width: 1rem;height: 0.15rem;margin: 0 auto;margin-top:1rem;}';
	cssText += '.'+class_name+' span{display: inline-block;width: 0.15rem;height: 0.15rem;margin-right: 0.05rem;border-radius: 50%;background: #5a6ff3; animation: '+class_animate_name+' 1.04s ease infinite;}';
	cssText += '.'+class_name+' span:last-child{margin-right: 0px;}';
	cssText += '@-webkit-keyframes '+class_animate_name+'{0%{opacity: 1;transform: scale(1.3);}100%{opacity: 0.2;transform: scale(.3);}}';
	cssText += '.'+class_name+' span:nth-child(1){animation-delay:0.13s;}';
	cssText += '.'+class_name+' span:nth-child(2){animation-delay:0.26s;}';
	cssText += '.'+class_name+' span:nth-child(3){animation-delay:0.39s;}';
	cssText += '.'+class_name+' span:nth-child(4){animation-delay:0.52s;}';
	cssText += '.'+class_name+' span:nth-child(5){animation-delay:0.65s;}';

	addCssText.add(cssText);
};
createCss();


let show = function(dom){
	let div = $('<div class="'+class_name+'"><span></span><span></span><span></span><span></span><span></span></div>');
	dom.append(div);
};

let hide = function(dom){
	dom.find('.'+class_name).remove();
};




module.exports = {
	show:show,
	hide:hide
};