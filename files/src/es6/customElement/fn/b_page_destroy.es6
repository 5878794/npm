//b-page加载的页面卸载时执行 destroy方法
//需要配合b-page标签使用


let getJsName = require('../lib/fn/getJsName');


module.exports = function(fn){
	let jsSrc = getJsName(),
		dom = document.body.getElementsByTagName('b-page'),
		backDom = null;


	for(let i=0,l=dom.length;i<l;i++){
		let thisDom = dom[i],
			thisShadowDom = thisDom.shadowRoot,
			scripts = thisShadowDom.querySelectorAll('script');

		for(let j=0,jl=scripts.length;j<jl;j++){
			if(scripts[j].src == jsSrc){
				backDom = thisDom;
				break;
			}
		}

		if(backDom){break;}
	}

	if(backDom){
		backDom.destroy = fn;
	}

};