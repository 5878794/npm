
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------
//数据绑定组建
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------


//设置数据会清空原有数据
// bBindArrayDom.data = [];

//添加数据 （滚动加载用）
// bBindArrayDom.add = [];

//删除数据
// bBindArrayDom.list(n).remove();

//修改数据
// bBindArrayDom.list(n).data = {name:111};




let bBindObj = require('./b_bind_obj');
require('../lib/jq/extend');



class bBIndArray extends bBindObj{
	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'data-data'
		];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		//data-data属性不能传入对象  所以通过jq的data属性传值
		let data = $(this).data('data')??'';
		if($.isArray(data)){
			this.data = data;
		}else if($.isString(data) && data !='') {

		}else{
			this.data = [];
		}
	}

	constructor(){
		super();

		this.createdDoms = [];

		// console.log(this.outerHTML)
	}

	init(){
		//分析dom中的变量
		this.paramCatchs = [];
	}


	getCloneDom(data){
		let dom = this.shadow.querySelector('slot').assignedElements(),
			fragment = document.createDocumentFragment();
		dom.map(rs=>{
			fragment.appendChild(rs.cloneNode(true));
		});

		this.paramCatch = {};

		let childDom = [];
		for(let i=0,l=fragment.childNodes.length;i<l;i++){
			childDom.push(fragment.childNodes[i])
			// console.log(fragment.childNodes[i].outerHTML)
		}
		this.checkTree(childDom);
		super.data = data;

		this.paramCatchs.push(this.paramCatch);
		return {fragment,childDom};
	}

	set data(data){
		// console.log('array',data,this.outerHTML)
		data = data??[];
		//清空列表
		this.clearAll();

		data.map(rs=>{
			//获取模版克隆
			let {fragment,childDom} = this.getCloneDom(rs);
			this.shadow.appendChild(fragment);
			this.createdDoms.push(childDom);
		});
	}

	clearAll(){
		this.createdDoms.map(rs=>{
			rs.map(dom=>{
				$(dom).remove();
			})
		})
		this.createdDoms = [];
		this.paramCatchs = [];
	}

	set add(data){
		data = data??[];
		data.map(rs=>{
			//获取模版克隆
			let {fragment,childDom} = this.getCloneDom(rs);
			this.shadow.appendChild(fragment);
			this.createdDoms.push(childDom);
		});
	}

	list(param){
		let _this = this;

		if(param==undefined || param==null){
			return this.createdDoms;
		}else{
			param = parseInt(param);
			let dom = this.createdDoms[param]??{};

			dom.remove = function(){
				_this.createdDoms.splice(param,1);
				_this.paramCatchs.splice(param,1);
				if($.isArray(dom)){
					dom.map(rs=>{
						$(rs).remove();
					})
				}
			}

			Object.defineProperty(dom,"data",{
				set : function (data) {
					let catchFn = _this.paramCatchs[param]??{};

					for(let [key,val] of Object.entries(data)){
						if(catchFn[key]){
							catchFn[key].map(fn=>{
								fn(data);
							})
						}
					}
				},
				configurable : true
			});

			return dom;
		}
	}

}



if(!customElements.get('b-bind-array')){
	customElements.define('b-bind-array', bBIndArray);
}
