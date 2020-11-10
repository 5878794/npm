
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------
//数据绑定组建
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------

// b-bind-array 下面第一层必须是  b-bind-obj

//设置数据会清空原有数据
// bBindArrayDom.data = [];

//添加数据 （滚动加载用）
// bBindArrayDom.add = [];

//删除数据
// bBindArrayDom.list(n).remove();

//修改数据
// bBindArrayDom.list(n).data = {};



let addStyleFile = require('./fn/addStyleFile');

require('./b_bind_obj');



class bBIndArray extends HTMLElement{
	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'data-data'
		];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		//data-data属性不能传入对象  所以通过jq的data属性传值
		this.data = $(this).data('data');
	}

	constructor(){
		super();

		//创建shadow容器
		this.body = this.attachShadow({mode: 'open'});
		let all = addStyleFile('../res/css/all.css');
		this.body.appendChild(all);

		this.createDom();

		//分析dom中的变量
		this.html = null;
		this.createdDoms = [];
		this.checkTree();


		//css中设置咯初始visible:hidden 避免初始的时候页面闪烁
		$(this).css({
			visibility:'visible'
		});


	}

	createDom() {
		let slot = $('<slot></slot>'),
			template = $('<template></template>');
		template.append(slot);
		this.body.appendChild(template.get(0));
	}

	checkTree(){
		let cloneDom = this.body.querySelector('slot').assignedElements();
		cloneDom = cloneDom[0];

		this.html = cloneDom.html;
	}

	set data(data){
		data = data??[];
		this.clearAll();
		data.map(rs=>{
			let dom = $(this.html).get(0);
			this.body.appendChild(dom);
			this.createdDoms.push(dom);
			dom.data = rs;
		});
	}

	clearAll(){
		this.createdDoms.map(rs=>{
			$(rs).remove();
		})
		this.createdDoms = [];
	}

	set add(data){
		data = data??[];
		data.map(rs=>{
			let dom = $(this.html).get(0);
			this.body.appendChild(dom);
			this.createdDoms.push(dom);
			dom.data = rs;
		})
	}

	list(param){
		let _this = this;

		if(param==undefined || param==null){
			return this.createdDoms;
		}else{
			param = parseInt(param);
			let dom = this.createdDoms[param]??{};
			return {
				remove(){
					_this.createdDoms.splice(param,1);
					$(dom).remove();
				},
				set data(data){
					dom.data = data;
				}
			}
		}
	}

}



if(!customElements.get('b-bind-array')){
	customElements.define('b-bind-array', bBIndArray);
}
