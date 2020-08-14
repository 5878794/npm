

//标题
// html:
// 	    b-title(
// 	        id='b_title'
// 	        name='测试'           //标题名称
// 	    )
//
//
// let title = $('#b_title').get(0);
// title.btnData = [
// 	{name:'按钮1',type:'btn1',style:{color:'red'}},           //直接点击类按钮
// 	{name:'添加',type:'btn5',children:[                       //鼠标悬浮出2级菜单按钮
// 			{name:'动产',type:'btn21'},
// 			{name:'不动产',type:'btn22'}
// 		]
// 	},
//                                                          //自身切换类型  showHide
//  {name:'添加',type:'btn7',style:{color:'#333'},showHide:{name:'删除',type:'btn8',style:{color:'red'}}}
// ];
// title.clickFn = function(type){                          //按钮点击事件
// 	console.log(type)                                       //返回点击的按钮type
// };





let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');


class bTitle1 extends HTMLElement{
	constructor() {
		super();

		this.body = null;

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

		this.createStyle();
		let style = addStyleText(this.cssText);
		this.shadow.appendChild(style);

		this.name = $(this).attr('name') || '';

		//创建dom
		this.createElement();
		this.userClickFn = function(){};

		this.shadow.appendChild(this.body.get(0));
	}

	createElement(){
		let body = $('<div class="body box_hcc"></div>'),
			titleName = $('<div class="titleName">'+this.name+'</div>'),
			btnBody = $('<div class="boxflex1 box_hrc"></div>'),
			btn = $('<div class="btn hover box_hcc"></div>'),
			openDiv = $('<div class="openDiv box_scc"></div>'),
			openDivList = $('<div class="openDivList box_hlc"></div>');

		body.append(titleName).append(btnBody);

		this.titleNameDiv = titleName;
		this.openDiv = openDiv;
		this.openList = openDivList;
		this.btnBody = btnBody;
		this.btn = btn;
		this.body = body;
	}
	createStyle(){
		let css = [
			// '.body{margin-top:20px;width:100%;height:40px;padding:0 20px;background:rgb(234,243,251);font-size:14px;color:#333;}',
			'.titleName{width:400px;font-weight:bold;}',
			'.btn{color:#3f68ef; font-size:14px; height:40px; padding:0 10px; position:relative;}',
			'.openDiv{position:absolute;z-index:1;left:0;top:35px;width:120%;background:#fff;box-shadow:0 0 2px #ccc;padding:5px 0;}',
			'.openDivList{height:20px; width:80%; cursor:pointer; margin:0 auto; padding-left:6px; line-height:20px; color:#333; font-size:12px; margin:2px 0;}',
			'.openDivList:hover{background:#3f68ef;color:#fff;}',
			'.body{margin:10px 0 0 0;width:100%;height:30px;padding:0 20px;font-size:14px;color:#333;}',
		];

		this.cssText = css.join('');
	}


	set btnData(data){
		data = data || [];

		let body = this.btnBody,
			item = this.btn,
			_this = this;

		data.map(rs=>{
			let _item = item.clone().text(rs.name).attr({type:rs.type});
			if(rs.style){
				_item.css(rs.style);
			}

			if(rs.children && rs.children.length !=0){
				_item.removeClass('hover');
				_this.addHoverEvent(_item,rs.children);
			}else{
				if(rs.showHide){
					_item.attr({state:'state1'});
					_item.data({state2:rs.showHide});
					_item.data({state1:rs});
				}
				_this.addClickEvent(_item);
			}

			body.append(_item);
		});
	}

	addHoverEvent(_item,data){
		//生成2级菜单
		let body = this.openDiv.clone().addClass('hidden'),
			list = this.openList;
		data.map(rs=>{
			let _list = list.clone().text(rs.name).attr({type:rs.type});
			this.addClickEvent(_list);
			body.append(_list);
		});

		_item.append(body);

		_item.hover(function(){
			body.removeClass('hidden');
		},function(){
			body.addClass('hidden');
		})

	}

	addClickEvent(_item){
		let _this = this;
		_item.click(function(){
			let type = $(this).attr('type'),
				state = $(this).attr('state'),
				state2 = $(this).data('state2'),
				state1 = $(this).data('state1');

			//是切换类型的按钮
			if(state){
				if(state == 'state1'){
					//切换到state2状态
					$(this).attr({type:state2.type,state:'state2'});
					$(this).text(state2.name).css(state2.style);
				}else{
					//切换到state1状态
					$(this).attr({type:state1.type,state:'state1'});
					$(this).text(state1.name).css(state1.style);
				}
			}

			_this.userClickFn(type);
		});
	}

	set clickFn(fn){
		fn = fn || function(){};
		this.userClickFn = fn;
	}

	set titleName(text){
		this.titleNameDiv.text(text);
	}

}



if(!customElements.get('b-title1')){
	customElements.define('b-title1', bTitle1 );
}










