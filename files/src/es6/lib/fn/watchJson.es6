
//json对象监听器   数组，对象都可以用

//对象会变成监听器，不要直接在对对象赋值，否则监听器会掉
//数组splice时，会触发一堆变动。。。。

//注意只能监听根，子元素内部改变不会触发回调
//不要用于function，function里面this指向会指向代理

//需要赋值原来的对象
//eg: obj = {};
// obj = watcher(obj,function(e){console.log(e)})


let watcher = function(obj,callback){
	let objIsArray =  (obj)? obj.constructor === Array : false;
	obj = new Proxy(obj,{
		set: function (target, propKey, value, receiver) {
			let type = (target.hasOwnProperty(propKey))? 'mdf' : 'add',
				oldValue = target[propKey];

			//过滤数组的length属性
			if(!(objIsArray && propKey == 'length')){
				callback({
					type:type,
					key:propKey,
					oldValue:oldValue,
					newValue:value
				});
			}

			return Reflect.set(target, propKey, value, receiver);
		},
		deleteProperty:function(target, propKey){
			if(target.hasOwnProperty(propKey)){
				callback({
					type:'del',
					key:propKey,
					oldValue:target[propKey]
				})
			}
			return Reflect.deleteProperty(target, propKey);
		}
	});
	return obj;
};


export default watcher;