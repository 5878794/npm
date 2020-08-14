

let inputStyle = require('./../es6/inputStyle'),
	selectData = require('./selectData');

module.exports = {
	//自身点击添加变成删除按钮
	addDelFn(btn,body,item){
		btn.btnData = [
			{
				name:'添加',
				type:'add',
				style:{color:'#5576f0'},
				showHide:{
					name:'删除',
					type:'del',
					style:{color:'red'}
				}
			}
		];

		btn.clickFn = function(type){
			if(type=='add'){
				//添加
				let _item = item.clone().attr({id:''});
				selectData(_item);
				body.append(_item);
				inputStyle.set(true,true);
			}else{
				//删除
				body.html('');
			}
		};
	},
	//添加多个子元素，子元素自身带删除
	addChildDelFn(btn,body,item){
		btn.btnData = [
			{
				name:'添加',
				type:'add',
				style:{color:'#5576f0'}
			}
		];

		btn.clickFn = function(){
			let _item = item.clone().attr({id:''}),
				title1 = _item.find('b-title1').get(0),
				body1 = $(title1).parent();

			title1.btnData = [
				{
					name:'删除',
					type:'del',
					style:{color:'red'}
				}
			];
			title1.clickFn = function(){
				body1.remove();
			};

			selectData(_item);
			body.append(_item);
			inputStyle.set(true,true);

		};
	},
	//添加按钮，按钮带子菜单
	addLevel2BtnFn(btn,body,item1,item2){
		btn.btnData = [
			{name:'添加',type:'btn5',style:{color:'#5576f0'},children:[                       //鼠标悬浮出2级菜单按钮
					{name:'动产',type:'btn2'},
					{name:'不动产',type:'btn1'}
				]
			}
		];

		btn.clickFn = function(type){
			let _item;
			if(type=='btn1'){
				_item = item1.clone().attr({id:''});
			}else{
				_item = item2.clone().attr({id:''});

			}

			let title1 = _item.find('b-title1').get(0),
				body1 = $(title1).parent();

			title1.btnData = [
				{
					name:'删除',
					type:'del',
					style:{color:'red'}
				}
			];
			title1.clickFn = function(){
				body1.remove();
			};

			selectData(_item);
			body.append(_item);
			inputStyle.set(true,true);
		};
	}

};