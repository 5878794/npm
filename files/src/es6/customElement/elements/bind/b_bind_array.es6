
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------
//数据绑定组建
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------

//数组自带对象包裹  不能在包裹b-bind-obj

//TODO bug
//发现执行顺序问题，b-bind-obj始终优先b-bind-array解析。。。未找到原因

//设置数据会清空原有数据
// bBindArrayDom.data = [];

//b-bind-array 子元素会自动绑定数据对象到  data-bindData=''上

//添加数据 （滚动加载用）
// bBindArrayDom.add = [];

//删除数据
// bBindArrayDom.list(n).remove();

//修改数据
// bBindArrayDom.list(n).data = {name:111};


//参数
// @attr:notShowNoDataDom='yes'  数据为空时不显示暂无数据
// @attr:dataIsString    数组中为字符串时，  设置后自动添加属性  index,item


let bBindObj = require('./b_bind_obj');
require('../../../lib/jq/extend');



class bBIndArray extends bBindObj{
	connectedCallback(){
		let _this = this;
		setTimeout(function(){
			_this.tempInit();
		},0);
	}


	//注册要监听的属性
	static get observedAttributes() {
		//监听的属性需要全部小写
		return [
			'data-data'
		];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		//data-data属性不能传入对象  所以通过jq的data属性传值


		let _this = this;
		setTimeout(function(){
			let data = $(_this).data('data')??'';
			if($.isArray(data)){
				_this.data = data;
			}else if($.isString(data) && data !='') {

			}else{
				_this.data = [];
			}
		},0);


	}

	constructor(){
		super();
		// console.log(this.outerHTML)
	}

	tempInit(){
		super.tempInit();
		this.createdDoms = [];

		this.notShowNoDataDom = ($(this).attr('notShowNoData') == 'yes')? true : false;
		this.dataIsString = ($(this).attr('isString') == 'yes')? true : false;
	}

	init(){
		//分析dom中的变量
		this.paramCatchs = [];
	}


	getCloneDom(data){
		if(!this.template){
			return;
		}
		let cloneDom = this.template.innerHTML;
		cloneDom = $(cloneDom);

		//赋值
		this.paramCatch = {};
		this.checkTree(cloneDom);
		super.data = data;

		//缓存
		this.paramCatchs.push(this.paramCatch);

		cloneDom.each(function(){
			$(this).data({bindData:data});
		});

		return cloneDom;
	}

	set data(data){
		data = data??[];
		//清空列表
		this.clearAll();
		$(this).find('.__no_data__').remove();

		data.map(rs=>{
			//获取模版克隆
			let cloneDom = this.getCloneDom(rs);
			$(this).append(cloneDom);
			this.createdDoms.push(cloneDom);
		});

		if(data.length == 0 && !this.notShowNoDataDom){
			$(this).append('<div class="box_hcc __no_data__" style="width:100%;height:200px;">暂无数据</div>');
		}
	}

	clearAll(){
		if(!this.createdDoms){
			this.createdDoms = [];
		}

		this.createdDoms.map(rs=>{
			rs.remove();
		});
		this.createdDoms = [];
		this.paramCatchs = [];
	}

	set add(data){
		data = data??[];

		if(this.dataIsString){
			data.map((rs,i)=>{
				data.index = i;
				data.item = rs;
			})
		}

		data.map(rs=>{
			//获取模版克隆
			let cloneDom = this.getCloneDom(rs);
			$(this).append(cloneDom);
			this.createdDoms.push(cloneDom);
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
				if(dom.remove){
					dom.remove();
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
