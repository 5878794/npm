

//jq选择器，支持shadowRoot

let a = function(str){
	//获取主dom树中的元素
	let backDom = jQuery(str);

	//判断是否是字符串
	//判断是否包含<div></div>等
	if(
		!(
			jQuery.isString(str) &&
			str.indexOf('<') == -1
		)
	){
		return backDom;
	}

	//查找shadowRoot中的元素
	jQuery('b-page').each(function(){
		let body = this.shadowRoot;
		body = jQuery(body);

		let dom = body.find(str);
		//合并到返回的jquery对象中
		backDom = jQuery.merge(backDom,dom);
	});

	backDom = checkFn(backDom,str);

	return backDom;
};


//排除template下的元素
var checkFn = function(backDom,str){
	return backDom.not(backDom.parents('template').find(str))
};


//处理$对象下的方法复制过来
for(let [key,val] of Object.entries(jQuery)){
	a[key] = val;
}



module.exports = a;



