

//处理对象中  null、undefined转换为空字符串



module.exports = function(obj){
	//判断传入的是不是对象或数组
	if(!($.isArray(obj) || $.isObject(obj))){
		return obj;
	}


	//对象增加代理规则
	let filterFn = function(obj){
		return new Proxy(obj,{
			get(target,key){
				if(target[key] || target[key] == 0){
					return target[key];
				}else{
					return '';
				}
			}
		});
	};


	//处理第一层数据
	obj = filterFn(obj);


	//遍历下一层数据
	let traversingFn = function(obj){
		for(let [key,val] of Object.entries(obj)){
			if($.isArray(val) || $.isObject(val)){
				//找到对象 增加代理规则
				obj[key] = filterFn(val);
				//查找下一层
				traversingFn(obj[key]);
			}
		}
	};

	//遍历开始
	traversingFn(obj);

	//返回增加代理规则的对象
	return obj;
};