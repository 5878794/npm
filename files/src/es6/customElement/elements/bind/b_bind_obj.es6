
// b-bind-obj(class='box_hcc' id='a')
//  div(class='left' tt='${rs.a}' data-b='${rs.c}' data-cc='${rs.b}') ${rs.a}
//  div(class='boxflex1' adb='${rs.d}') ${rs.b}
//  div
//      a ${rs.ff}
//      p 123
//  b-input(type='text' class='a' value='${rs.a}')
//
//  b-bind-obj(class='box_hcc' id='b' data-data='${rs.c}')
//      div(class='left') ${rs.a}
//      div(class='boxflex1') ${rs.b}



//---------------------------------------------
//---------------------------------------------
//---------------------------------------------
//数据绑定组建
//---------------------------------------------
//---------------------------------------------
//---------------------------------------------


//如有闪烁问题 需要在全局css加  b-bind-obj{visibility: hidden;}

//解决数据绑定问题 rs写死不能改变 要改变需要设置 bind-name='data'指定
//${rs.a} 只能包含1层对象

//可以部分数据赋值，不需要一次传入所有数据
// dom.data = {a:1};

//可以嵌套使用， 子元素直接在  data-data上指定上层的数据对象，元素内会自动取其下面的数据


let addStyleFile = require('../../fn/addStyleFile');
require('../../../lib/jq/extend');

class bBindObj extends HTMLElement{
	connectedCallback(){
		//css中设置咯初始visible:hidden 避免初始的时候页面闪烁
		let _this = this;
		setTimeout(function(){
			_this.tempInit();

			//dom准备好咯
			_this.isReady = true;
			_this.domReady.ok = true;
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
		let data = $(this).data('data')??'';
		if($.isObject(data)){
			this.data = data;
		}else{
			this.clear();
		}

	}

	constructor(){
		super();

		this.isReady = false;
		this.ready();

		this.paramCatch = {};

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

	}

	//做dom准备好的监听事件
	ready(){
		return new Promise(success=>{
			if(this.isReady){
				success();
			}

			this.domReady = new Proxy({},{
				set(target, key,val, receiver){
					success();
					return Reflect.set(target, key, val, receiver);
				}
			});
		});

	}

	tempInit(){
		this.createDom();
		this.slotToTemplate();

		this.bindName = $(this).attr('bind-name') || 'rs';

		this.init();

		$(this).css({
			visibility:'visible'
		});
	}

	createDom(){
		let slot = $('<slot></slot>');
		this.shadow.appendChild(slot.get(0));

		this.body = $(this.shadow);
	}
	slotToTemplate(){

		let slotNode = this.shadow.querySelector('slot').assignedElements(),
			html = [];

		slotNode.map(rs=>{
			html.push(rs.outerHTML);
		});

		slotNode.map(rs=>{
			$(rs).remove();
		});

		html = html.join('');

		let template = document.createElement('template');
		template.innerHTML = html;

		this.template = template;
		this.body.append(template);
	}

	init(){
		//分析dom中的变量

		let cloneDom = this.template.innerHTML;
		cloneDom = $(cloneDom);
		$(this).append(cloneDom);
		this.checkTree(cloneDom);


	}

	checkTree(cloneDom){
		for(let i=0,l=cloneDom.length;i<l;i++){
			this.checkDom(cloneDom[i]);
		}
	}

	checkDom(rs){
		//解析dom中的属性
		this.getDomAttr(rs,rs.attributes);

		//不是 b-bind-obj 或 b-bind-array 处理子元素
		if(!(rs.nodeName=='B-BIND-OBJ' || rs.nodeName == 'B-BIND-ARRAY')){
			this.getChildren(rs);
		}
	}

	//处理属性的赋值
	getDomAttr(dom,attrs){
		let delAttr = [];
		for(let i=0,l=attrs.length;i<l;i++){
			let nodeValue = attrs[i].nodeValue,
				nodeName = attrs[i].nodeName,
				hasVar = this.getParamFromStr(nodeValue);

			if(hasVar.length != 0){
				if(nodeName.indexOf('data-') == 0){
					delAttr.push(nodeName);

					hasVar.map(param=>{
						let key = nodeName.substr(5),
							fun = new Function(this.bindName,'return '+param),
							saveFn = function(rs){
								let obj = {};
								obj[key] = fun(rs);
								$(dom).data(obj);
								let obj1= {};
								obj1[nodeName] = fun(rs);
								$(dom).attr(obj1);
							};

						this.saveParamForCatch(param,saveFn);
					})
				}else{
					hasVar.map(param=>{
						let fun = new Function(this.bindName,'return `'+nodeValue+'`'),
							saveFn = function(rs){
								let obj = {};
								obj[nodeName] = fun(rs);
								$(dom).attr(obj);
							};
						this.saveParamForCatch(param,saveFn);
					})
				}
			}

		}

		delAttr.map(rs=>{
			$(dom).removeAttr(rs);
		})
	}

	//处理子元素
	getChildren(dom){
		let childs = dom.childNodes,
			_this = this;

		for(let i=0,l=childs.length;i<l;i++){
			let child = childs[i],
				type = child.nodeType,
				value = child.nodeValue;

			if(type==3){
				//文本
				let hasVar = this.getParamFromStr(value);

				hasVar.map(param=>{
					let fun = new Function(this.bindName,'return `'+value+'`'),
						saveFn = function(rs){
							child.nodeValue = fun(rs);
						};
					this.saveParamForCatch(param,saveFn);
				})
			}else if(type==1){
				//dom
				this.checkDom(child);
			}
		}

	}

	//获取字符中的${}中的值
	getParamFromStr(str){
		let val = str.match(/\$\{(.+?)\}/g)??[],
			backData = [];
		val.map(rs=>{
			let text = rs.match(/\$\{(.+?)\}/)[1];
			backData.push(text);
		});

		return backData;
	}

	//缓存变量及方法
	saveParamForCatch(param,fn){
		// let reg = new RegExp('(?<='+this.bindName+'\.)\\w+','g'),
		// 	keys = param.match(reg);

		// let reg = new RegExp('(?<='+this.bindName+'\.)\\w+','g'),
		// 	keys = param.match(reg);

		let reg = new RegExp(this.bindName+'\\.(\\w+)','g'),
			keys = param.match(reg),
			newKeys = [];
		keys.map(rs=>{
			let t = rs.replace(this.bindName+'.','');
			newKeys.push(t);
		});


		newKeys.map(key=>{
			if(!this.paramCatch[key]){
				this.paramCatch[key] = [];
			}
			this.paramCatch[key].push(fn);

			let obj = {};
			obj[key] = '';
			fn(obj);
		});

	}


	clear(){
		for(let [key,val] of Object.entries(this.paramCatch)){
			let obj = {};
			obj[key] = '';
			val.map(fn=>{
				fn(obj);
			})
		}
	}

	set data(data){
		let catchFn = this.paramCatch;

		for(let [key,val] of Object.entries(data)){
			if(catchFn[key]){
				catchFn[key].map(fn=>{
					fn(data);
				})
			}
		}
	}

}



if(!customElements.get('b-bind-obj')){
	customElements.define('b-bind-obj', bBindObj);
}


module.exports = bBindObj;
