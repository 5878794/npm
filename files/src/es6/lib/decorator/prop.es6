'use strict'

//类的属性的装饰器
//注意：只有checkArg 支持属性，所有都支持函数。

//异步函数要注意。。。。没测试过
//有三个参数   target,name,descriptor
//           类      方法名   描述



//参数监听
// ，执行函数前预备处理
// 4，执行函数后清理功能


import {isTest} from './_fn.es6';
import checkParam from './_checkParam';


let prop = {
	//运行时间
	//@descriptor.runTime
	runTime(target, key, descriptor){
		if(!isTest()){return descriptor;}

		let fn = descriptor.value;

		descriptor.value = function(...arg){
			let s = new Date().getTime();
			fn.call(this,...arg);
			let e = new Date().getTime();
			console.log(`%c ${target.constructor.name}.${key} run time ${(s-e >= 0)? s-e : 0}ms`,'background:#ff6464;color:#fff');
		};

		return descriptor;
	},
	//日志
	//@descriptor.log
	log(target, key, descriptor){
		if(!isTest()){return descriptor;}
		let fn = descriptor.value;

		descriptor.value = function(...arg){
			console.log(`%c ${target.constructor.name}.${key} run ==============================`,'font-size:16px;color:#ff8a37');
			arg.map((rs,i)=>{
				console.log(`%c ------ param  ${i+1} ------`,'color:#ff6464;')
				console.log(rs)
			})
			fn.call(this,...arg);
		}
	},
	//类属性检查，函数参数检查
	//@descriptor.checkArg('number','string',...)

	//类型有： 如果未传入参数不检查类型
	// string   字符串
	// number   数字
	// bool     布尔
	// dom      原生dom对象
	// jqDom    jQuery的dom对象
	// array    数组
	// obj      json对象
	// function 函数
	//具体见 ./_fn.es6  checkParam函数
	checkArg(...arg){
		return function(target, key, descriptor){
			if(descriptor.value){
				//方法
				let fn = descriptor.value;
				descriptor.value = function(...param){
					let rs = checkParam([...param],[...arg]);
					if(rs.pass){
						fn.call(this,...param);
						return descriptor;
					}else{
						console.log(`%c -----${target.constructor.name}.${key} 参数传入错误 start-------`,'background:red;color:#fff;');
						rs.msgs.map(rs=>{
							console.log(`%c ${rs.msg}`,'background:red;color:#fff;');
							console.log(rs.value);
						})
						console.log(`%c ----- ${target.constructor.name}.${key} 参数传入错误 end -------`,'background:red;color:#fff;')
						throw '参数错误';
					}
				};

			}else{
				//属性
				let v = descriptor.initializer && descriptor.initializer.call(this),
					rule = arg[0];

				// 返回一个新的描述对象作为被修饰对象的descriptor，或者直接修改 descriptor 也可以
				return {
					enumerable: true,
					configurable: true,
					get() {
						return v;
					},
					set(c) {
						let rs1 = checkParam([c],[rule]);
						if(rs1.pass){
							v = c;
						}else{
							console.log(`%c -----${target.constructor.name}.${key} 参数传入错误 start-------`,'background:red;color:#fff;');
							rs1.msgs.map(rs=>{
								console.log(`%c ${rs.msg}`,'background:red;color:#fff;');
								console.log(rs.value);
							})
							console.log(`%c ----- ${target.constructor.name}.${key} 参数传入错误 end -------`,'background:red;color:#fff;')
							throw '参数错误';
						}
					},
				};
			}
		}
	},

	//缓存 运算结果
	//函数需要 return 结果；
	catchResult(){
		const cache = {};
		return (target, name, descriptor) => {
			const method = descriptor.value
			descriptor.value = function(...args) {
				const key = args.join('')
				if (cache[key]) {
					return cache[key]
				}
				const ret = method.apply(this, args)
				cache[key] = ret
				return ret
			}
			return descriptor
		}
	}
};



export default prop;