

//参数类型检查器   如果未传入参数不检查类型
//类型有：
// string   字符串
// number   数字
// bool     布尔
// dom      原生dom对象
// jqDom    jQuery的dom对象
// array    数组
// obj      json对象
// function 函数


let check= {
	//检查是否是字符串
	stringFn(param,i,err){
		if(typeof param != 'string'){
			err.push({
				msg:`第${i+1}个参数不是 string`,
				value:param
			});
		}
	},
	//检查是否是数字
	numberFn(param,i,err){
		if(typeof param != 'number'){
			err.push({
				msg:`第${i+1}个参数不是 number`,
				value:param
			});
		}
	},
	//检查是否是布尔值
	boolFn(param,i,err){
		if(typeof param != 'boolean'){
			err.push({
				msg:`第${i+1}个参数不是 boolean`,
				value:param
			});
		}
	},
	//检查是否是原生dom对象
	domFn(param,i,err){
		let isDOM = ( typeof HTMLElement === 'object' ) ?
			function(obj){
				return obj instanceof HTMLElement;
			} :
			function(obj){
				return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
			}

		if(!isDOM(param)){
			err.push({
				msg:`第${i+1}个参数不是 dom`,
				value:param
			});
		}
	},
	//检查是否是jqDom对象
	jqDomFn(param,i,err){
		if(!(window.jQuery && param instanceof window.jQuery)){
			err.push({
				msg:`第${i+1}个参数不是 jqDom`,
				value:param
			});
		}
	},
	//检查是否是数组
	arrayFn(param,i,err){
		let rs = (param)? param.constructor === Array : false;
		if(!rs){
			err.push({
				msg:`第${i+1}个参数不是 array`,
				value:param
			});
		}
	},
	//检查是否是obj
	objFn(param,i,err){
		let rs = (typeof(param) == "object" && Object.prototype.toString.call(param).toLowerCase() == "[object object]" && !param.length);
		if(!rs){
			err.push({
				msg:`第${i+1}个参数不是 obj`,
				value:param
			});
		}
	},
	//检查是否是函数
	functionFn(param,i,err){
		if(!(typeof param === 'function')){
			err.push({
				msg:`第${i+1}个参数不是 function`,
				value:param
			});
		}
	}




};

let checkParam = function(params,ruleList){
	let err = [];
	ruleList.map((rule,i)=>{
		let val = params[i]?? undefined;
		if(typeof val === 'undefined'){

		}else{
			let fnName = `${rule}Fn`;
			if(check[fnName]){
				check[fnName](params[i],i,err);
			}else{
				console.log(`%c 注意：装饰器 decorator.checkArg 没有 ${rule} 的检查方法`,'color:#fff;background:#fd8a8a;');
			}
		}
	})

	return {
		pass:(err.length <= 0),
		msgs: err
	}
};



export default checkParam;