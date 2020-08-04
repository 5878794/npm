
//权限、角色配置



//html:
// 	b-role-authority(id='role' name='业务员权限')


//js:
// 	let role = $('#role').get(0);
// 	role.data = [
// 		{
// 			name:'aaa',
// 			children:[
// 				{
// 					name:'aaa1',
// 					children:[
// 						{
// 							name:'aaa11',
// 							type:'公司权限',
// 							checked:false
// 						},
// 						{
// 							name:'aaa12',
// 							type:'集团权限',
// 							checked:true
// 						}
// 					]
// 				},
// 				{
// 					name:'aaa2',
// 					children:[
// 						{
// 							name:'aaa21',
// 							type:'公司权限',
// 							checked:false
// 						},
// 						{
// 							name:'aaa22',
// 							type:'集团权限',
// 							checked:true
// 						}
// 					]
// 				}
// 			]
// 		},
// 		{
// 			name:'bbb',
// 			children:[
// 				{
// 					name:'bbb1',
// 					children:[
// 						{
// 							name:'bbb11',
// 							type:'公司权限',
// 							checked:false
// 						},
// 						{
// 							name:'bbb12',
// 							type:'集团权限',
// 							checked:true
// 						}
// 					]
// 				},
// 				{
// 					name:'bbb2',
// 					children:[
// 						{
// 							name:'bbb21',
// 							type:'公司权限',
// 							checked:false
// 						},
// 						{
// 							name:'bbb22',
// 							type:'集团权限',
// 							checked:true
// 						}
// 					]
// 				}
// 			]
// 		}
// 	];
// 	role.submit = function(data){
// 		console.log(data);          //返回传入的数组格式
// 	};



require('../customElement/pc/input_search');
require('../customElement/phone/b_switch');



let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');



class bRoleAuthority extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {

	}

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

		this.cacheData = {};
		this.name = $(this).attr('name') || '';
		this.userClick = function(){};
		//创建dom
		this.createElement();


		this.shadow.appendChild(this.body.get(0));

		this.bindEvent();
	}

	createElement(){
		let body = $('<div class="body box_sct"></div>'),
			border = $('<div class="border box_sct"></div>'),
			titleBody = $('<div class="box_hlc titleBody"></div>'),
			title = $('<div class="boxflex1 title">'+this.name+'</div>'),
			submit = $('<div class="submit box_hcc gray">提交</div>'),
			listBody = $('<div class="box_hlt listBody"></div>'),
			cel1 = $('<div class="box_slt cel1"></div>'),
			cel2 = $('<div class="cel2 boxflex1 box_slt">'),
			item1 = $('<div class="item1 box_hlc hover"></div>'),
			item2 = $('<div class="box_hlc item2"></div>'),
			cel2_1 = $('<div class="cel2_1 box_hlc diandian"></div>'),
			cel2_2 = $('<div class="cel2_2 box_hlc diandian"></div>'),
			cel2_3 = $('<div class="cel2_3 box_hcc diandian"></div>'),
			cel2_4 = $('<div class="cel2_4 box_hcc"></div>');



		titleBody.append(title).append(submit);
		listBody.append(cel1).append(cel2);
		item2.append(cel2_1).append(cel2_2).append(cel2_3).append(cel2_4);
		border.append(titleBody).append(listBody);
		body.append(border);

		this.listBody1 = cel1;
		this.listBody2 = cel2;
		this.btn = submit;
		this.item1 = item1;
		this.item2 = item2;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.body{width:100%; padding:20px; box-sizing:border-box;}',
			'.border{border:1px solid rgb(234,243,251);; width:100%;}',
			'.titleBody{width:100%;height:34px;font-size:14px;background:rgb(234,243,251);}',
			'.title{font-weight:bold;padding-left:20px;}',
			'.submit{color:#fff; background:#5576f0; width:50px; height:24px; border-radius:5px; margin:0 10px;}',
			'.listBody{width:100%;position:relative;}',
			'.cel1{width:100px;background:#f9f9f9;font-size:14px;color:#333;border-right:1px solid rgb(234,243,251);;position:absolute;left:0;top:0;bottom:0;}',
			'.cel2{background:#fff;padding-left:100px;}',
			'.item1,.item2{width:100%; height:40px;padding:10px;border-top:1px solid rgb(234,243,251);;border-bottom:1px solid rgb(234,243,251);;}',
			'.item1{border-color:transparent;}',
			'.item2{border-top:none;padding:none;}',
			'.cel1 .select{border-color:rgb(234,243,251);;background:#fff;color:#5576f0;height:41px;position:relative;top:-1px;}',
			'.cel2_1,.cel2_2,.cel2_3,.cel2_4{height:40px;border-right:1px solid rgb(234,243,251);;padding:0 10px;font-size:14px;}',
			'.cel2_1,.cel2_2{width:34%;}',
			'.cel2_3,.cel2_4{width:16%;color:#aaa;}',
			'.cel2_4{border:none;}',
			'.gray{display:none;}',
			'b-switch{display:block; width:60px; height:24px;}'
		];

		this.cssText = css.join('');
	}

	bindEvent(){
		let _this = this;
		this.btn.click(function(){
			let data = _this.getRs(_this.cacheData);
			_this.userClick(data);
		});
	}

	getRs(data){
		let backData = [];

		data.map(lv1=>{
			let lv1_name = lv1.name,
				lv2_data = lv1.children || [];
			lv2_data.map(lv2=>{
				let lv2_name = lv2.name,
					lv3_data = lv2.children || [];
				lv3_data.map(lv3=>{
					if(lv3.checked){
						lv3.__level1__ = lv1_name;
						lv3.__level2__ = lv2_name;
						lv3.__level3__ = lv3.name;
						backData.push(lv3);
					}
				});
			})
		});

		return backData;
	}

	set data(data){
		data = data || [];

		this.cacheData = data;

		let body = this.listBody1,
			item = this.item1,
			_this = this;

		data.map(rs=>{
			let _item = item.clone().data({data:rs});
			_item.text(rs.name);
			body.append(_item);

			_item.click(function(){
				let data = $(this).data('data'),
					child = data.children;
				_this.listBody1.find('div').removeClass('select');
				$(this).addClass('select');
				_this.showLevel2(child,data);
			});
		});

		this.listBody1.find('div').eq(0).trigger('click');
	}

	showLevel2(data,level1){
		let body = this.listBody2,
			item = this.item2,
			_this = this;

		body.html('');
		data.map(rs=>{
			let name = rs.name,
				children = rs.children || [];
			children.map((child,i)=>{
				let _item = item.clone().data({level3:child,level2:rs,level1:level1});
				if(i==0){
					_item.find('.cel2_1').text(name);
				}
				_item.find('.cel2_2').text(child.name);
				_item.find('.cel2_3').text(child.type);

				let _switch = $(`<b-switch></b-switch>`).get(0);
				_switch.val = (child.checked)? true : false;
				_switch.checkBgColor = '#5576f0';
				_item.find('.cel2_4').append(_switch);
				body.append(_item);

				_switch.changeFn = function(val){
					let dom = $(this).parent().parent(),
						level3 = dom.data('level3'),
						level2 = dom.data('level2'),
						level1 = dom.data('level1');

					//选中
					if(val){
						//添加缓存
						level3.checked = true;
						// level3.__level3__ = level3.name;
						// level3.__level2__ = level2.name;
						// level3.__level1__ = level1.name;
					}else{
						//移除缓存
						level3.checked = false;
					}
					_this.btn.removeClass('gray').addClass('hover');
				};
			})

		});

	}

	set submit(fn){
		fn = fn || function(){};
		this.userClick = fn;
	}
}



if(!customElements.get('b-role-authority')){
	customElements.define('b-role-authority', bRoleAuthority);
}

