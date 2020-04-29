'use strict'


//类的修饰器
//类的修饰器只有1个参数   target类本身



let decorator = {
	//混合多个class成为一个新的class
	//跳过constructor，属性值不行

	// class A { say() { return 1 } }
	// class B { hi() { return 2 } }
	//
	// @mixin(A, B)
	// class C { }
	//
	// let c = new C()
	// console.log(c.say(), c.hi()) // 1, 2
	mixin(...arg){
		return function(target) {
			for (let arg of args) {
				for (let key of Object.getOwnPropertyNames(arg.prototype)) {
					if (key === 'constructor') continue // 跳过构造函数
					Object.defineProperty(target.prototype, key, Object.getOwnPropertyDescriptor(arg.prototype, key))
				}
			}
		}
	}
};



export default decorator;