
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

//解决数据绑定问题 rs写死不能改变
//${rs.a} 只能包含1层对象，不能带运算等。。。 需要运算在数据运算好后在赋值

//可以部分数据赋值，不需要一次传入所有数据
// dom.data = {a:1};

//可以嵌套使用， 子元素直接在  data-data上指定上层的数据对象，元素内会自动取其下面的数据


let addStyleFile = require('./fn/addStyleFile');
require('../lib/jq/extend');

class bBindObj extends HTMLElement{
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
		console.log(this.tagName)
		console.log(this.innerHTML)

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

		this.createDom();
		this.slotToTemplate();


		this.init();

		//css中设置咯初始visible:hidden 避免初始的时候页面闪烁
		$(this).css({
			visibility:'visible'
		});

		// console.log(this.tagName)
		// console.log(this.template.innerHTML)

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
		// console.log(html)

		this.template = template;
		this.body.append(template);
	}

	init(){
		//分析dom中的变量
		this.paramCatch = {};

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

					let param = hasVar[0],
						key = nodeName.substr(5),
						fun = new Function('rs','return '+param),
						saveFn = function(rs){
							let obj = {};
							obj[key] = fun(rs);
							$(dom).data(obj);
							let obj1= {};
							obj1[nodeName] = fun(rs);
							$(dom).attr(obj1);
						};

					this.saveParamForCatch(param,saveFn);

				}else{
					let fun = new Function('rs','return `'+nodeValue+'`'),
						param = hasVar[0],
						saveFn = function(rs){
							let obj = {};
							obj[nodeName] = fun(rs);
							$(dom).attr(obj);
						};
					this.saveParamForCatch(param,saveFn);
				}
			}

		}

		delAttr.map(rs=>{
			$(dom).removeAttr(rs);
		})
	}

	//处理子元素
	getChildren(dom){
		let childs = dom.childNodes;

		for(let i=0,l=childs.length;i<l;i++){
			let child = childs[i],
				type = child.nodeType,
				value = child.nodeValue;

			// console.log(child)
			if(type==3){
				//文本
				let hasVar = this.getParamFromStr(value);
				if(hasVar.length != 0){
					let fun = new Function('rs','return `'+value+'`'),
						param = hasVar[0],
						saveFn = function(rs){
							child.nodeValue = fun(rs);
						};
					this.saveParamForCatch(param,saveFn);
				}
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
		param = param.split('.');
		param = param[1]??'not_fond';

		if(!this.paramCatch[param]){
			this.paramCatch[param] = [];
		}
		this.paramCatch[param].push(fn);

		let obj = {};
		obj[param] = '';
		fn(obj);
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
		// console.log('obj',data)
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
