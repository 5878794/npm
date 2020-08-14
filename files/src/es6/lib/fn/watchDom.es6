
//dom树变化监听,包含子对象


let MutationObserver =  window.MutationObserver ||
						window.WebKitMutationObserver ||
						window.MozMutationObserver;


let watcher = function(dom,callback){
	// 该构造函数用来实例化一个新的 Mutation 观察者对象
	// Mutation 观察者对象能监听在某个范围内的 DOM 树变化
	// callback 返回 MutationRecord 对象
	let observer = new MutationObserver(callback);


	// 传入目标节点和观察选项
	// 如果 target 为 document 或者 document.documentElement
	// 则当前文档中所有的节点添加与删除操作都会被观察到
	observer.observe(dom, {
		subtree: true,
		childList: true
	});
};


module.exports = watcher;


