/*
 显示树形菜单。。。。

 type 说明见下面


 unitCode\unitName：执法单位第一层
 departmentCode\departmentName：执法部门第二层
 teamCode\teamName：执法小组第三层
 code\name
 let manData = [{"id":7084,"name":"邓艾","code":"5101092085","account":"0109da","mobile":"18828076604","headImg":null,"identity":"510724199511132436","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"3551302905227034907","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010920102","teamName":"西园街道办事处","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010907-","organizationName":null,"online":false,"sourceType":null,"groupName":"邓艾","regionCode":"51010907","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":25385,"name":"谢勇","code":"5101092086","account":"0109xy","mobile":"13881983201","headImg":null,"identity":"510922198210233579","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010920102","teamName":"西园街道办事处","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010907-","organizationName":null,"online":false,"sourceType":null,"groupName":"谢勇","regionCode":"51010907","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":3,"name":"杨海涛","code":"5101092056","account":"0109yht123","mobile":"13980083326","headImg":null,"identity":"513623198212264312","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"4067764804182195926","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929901","teamName":"芳草","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010902-","organizationName":null,"online":false,"sourceType":null,"groupName":"杨海涛","regionCode":"51010902","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":25384,"name":"巫治奎","code":"5101092061","account":"0109wzk123","mobile":"13558736053","headImg":null,"identity":"510122197811176014","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929901","teamName":"芳草","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010902-","organizationName":null,"online":false,"sourceType":null,"groupName":"巫治奎","regionCode":"51010902","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":4,"name":"袁媛","code":"5101092046","account":"0109yy123","mobile":"13880402266","headImg":null,"identity":"510113198204070021","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"3727584696494123523","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929902","teamName":"合作","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010905-","organizationName":null,"online":false,"sourceType":null,"groupName":"袁媛","regionCode":"51010905","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":5,"name":"任金辉","code":"5101092047","account":"0109rjh123","mobile":"18030624100","headImg":null,"identity":"510902199009219328","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929902","teamName":"合作","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010905-","organizationName":null,"online":false,"sourceType":null,"groupName":"任金辉","regionCode":"51010905","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":6,"name":"张鼎","code":"5101092048","account":"0109zd123","mobile":"13551179879","headImg":null,"identity":"510124199006190018","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929902","teamName":"合作","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010905-","organizationName":null,"online":false,"sourceType":null,"groupName":"张鼎","regionCode":"51010905","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":9,"name":"张加利","code":"5101092078","account":"0109zjl123","mobile":"18782983604","headImg":null,"identity":"511621199007211043","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"3812996995240092502","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929903","teamName":"桂溪","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010904-","organizationName":null,"online":false,"sourceType":null,"groupName":"张加利","regionCode":"51010904","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":25382,"name":"唐斯洋","code":"5101092079","account":"0109tsy123","mobile":"18080037905","headImg":null,"identity":"513434199202210030","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929903","teamName":"桂溪","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010904-","organizationName":null,"online":false,"sourceType":null,"groupName":"唐斯洋","regionCode":"51010904","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":25383,"name":"沈蓉","code":"5101092080","account":"0109sr123","mobile":"18081120506","headImg":null,"identity":"51372319860409002x","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929903","teamName":"桂溪","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010904-","organizationName":null,"online":false,"sourceType":null,"groupName":"沈蓉","regionCode":"51010904","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":26417,"name":"贺加贝","code":"5101092091","account":"0109hjb","mobile":"18581832546","headImg":null,"identity":"630103199208292034","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929904","teamName":"肖家河","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010903-","organizationName":null,"online":false,"sourceType":null,"groupName":"贺加贝","regionCode":"51010903","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":10,"name":"陈雪","code":"5101092102","account":"0109cx666","mobile":"13628031477","headImg":null,"identity":"510104198812172869","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"3519178763658729545","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929904","teamName":"肖家河","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010903-","organizationName":null,"online":false,"sourceType":null,"groupName":"陈雪","regionCode":"51010903","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":12,"name":"冉婕","code":"5101092066","account":"0109rj123","mobile":"18208151117","headImg":null,"identity":"513002199207180026","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"3619894216281205376","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929905","teamName":"中和街道办事处","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010906-","organizationName":null,"online":false,"sourceType":null,"groupName":"冉婕","regionCode":"51010906","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":26415,"name":"向岱舟","code":"5101092106","account":"0109xdz123","mobile":"13488986191","headImg":null,"identity":"510122199305142865","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929905","teamName":"中和街道办事处","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010906-","organizationName":null,"online":false,"sourceType":null,"groupName":"向岱舟","regionCode":"51010906","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":26416,"name":"邹圣辉","code":"5101092107","account":"0109zsh123","mobile":"15756272711","headImg":null,"identity":"511025199410146539","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929905","teamName":"中和街道办事处","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010906-","organizationName":null,"online":false,"sourceType":null,"groupName":"邹圣辉","regionCode":"51010906","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":13,"name":"缪强","code":"5101092040","account":"0109mq123","mobile":"13678052563","headImg":null,"identity":"511324197911123192","gender":"男","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":"3567028384788331508","deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929908","teamName":"石羊","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010901-","organizationName":null,"online":false,"sourceType":null,"groupName":"缪强","regionCode":"51010901","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":14,"name":"王一帆","code":"5101092070","account":"0109wyf123","mobile":"18782983494","headImg":null,"identity":"62262619881030041X","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929908","teamName":"石羊","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010901-","organizationName":null,"online":false,"sourceType":null,"groupName":"王一帆","regionCode":"51010901","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""},{"id":22234,"name":"李素雅","code":"5101092071","account":"0109lisuya","mobile":"18782916437","headImg":null,"identity":"654201199201100845","gender":"女","createUserId":null,"createTime":null,"token":null,"status":1,"channelId":null,"deviceType":3,"unitCode":"5101092","unitName":"成都高新技术产业开发区大队","departmentCode":"510109299","departmentName":"高新区卫生执法监督大队-管理","teamCode":"51010929908","teamName":"石羊","sessionId":null,"location":null,"currentTask":null,"onlineTime":null,"logoutTime":null,"manageRegion":"51010901-","organizationName":null,"online":false,"sourceType":null,"groupName":"李素雅","regionCode":"51010901","mapStatus":0,"signTime":null,"logoutTimeDisplay":null,"timeExecuteDisplay":null,"onlineDuration":null,"typeCode":""}];
 */

let $$ = require('../lib/event/$$'),
	showTree1 = require('./treeSelect1'),
	showTree2 = require('./treeSelect2'),
	showTree3 = require('./treeSelect3'),
	showTree4 = require('./treeSelect4'),
	stopBodyScroll = require('../lib/event/divScrollBodyNotScroll');


let createDom = function(){
	let zz = $('<div></div>'),
		body = $('<div></div>'),
		main = $('<div></div>'),
		btn = $('<div>选择</div>');

	zz.css({
		position:'fixed',
		left:0,right:0,top:0,bottom:0,
		background:'rgba(0,0,0,0.5)',
		'z-index':'1000'
	}).addClass('box_scc');
	body.css({
		width:'95%',
		height:'95%',
		background:'#fff',
		'padding':'0.2rem',
		'box-sizing':'border-box'
	}).addClass('box_slc');
	main.addClass('boxflex1').css({
		'overflow-x':'hidden',
		'overflow-y':'scroll',
		width:'100%',
		'-webkit-overflow-scrolling': 'touch'
	});
	btn.css({
		width:'100%',
		height:'0.8rem',
		'line-height':'0.8rem',
		'font-size':'0.32rem',
		'text-align':'center',
		color:'#fff',
		background:'#5290f1',
		'margin-top':'0.2rem'
	});

	body.append(main).append(btn);
	zz.append(body);

	return {btn,zz,main}
};




let handleDataForMan = function(data){
	let newData = {},
		backData = [];

	data.map(rs=>{
		let code1 = rs.unitCode,
			code2 = rs.departmentCode,
			code3 = rs.teamCode,
			code4 = rs.code;

		if(!newData[code1]){
			newData[code1] = {
				code:code1,
				name:rs.unitName,
				parent:0,
				children:{

				}
			}
		}

		if(!newData[code1].children[code2]){
			newData[code1].children[code2] = {
				code:code2,
				name:rs.departmentName,
				parent:code1,
				children:{

				}
			}
		}

		if(!newData[code1].children[code2].children[code3]){
			newData[code1].children[code2].children[code3] = {
				code:code3,
				name:rs.teamName,
				parent:code2,
				children:{

				}
			}
		}

		newData[code1].children[code2].children[code3].children[code4] = {
			code:code4,
			name:rs.name,
			parent:code3
		}


	});

	let forFn = function(obj){
		for(let [key,val] of Object.entries(obj)){
			if(val.children){
				backData.push({
					code:val.code,
					name:val.name,
					parent:val.parent
				});
				forFn(val.children);
			}else{
				backData.push({
					code:val.code,
					name:val.name,
					parent:val.parent
				});
			}
		}
	};

	forFn(newData);

	return backData;
};


module.exports = function(opt,type){
	return new Promise((success)=>{
		//创建dom
		let {btn,zz,main} = createDom();
		opt.dom = main.get(0);
		$('body').append(zz);

		//阻止body滚动
		let cc = new stopBodyScroll({
			canScrollDom:main,
			notScrollDom:zz
		});


		//生成树形菜单
		let dd;
		if(type == 1){
			//最后一层是多选框的
			// new showTree1({
			// 	dom:document.body,                  //放入的容器
			// 	data:treeData,                      //数据
			// 	selected:['010101','010103'],       //初始选中的选项的code
			// 	notEdit:['010103']                  //不能修改的选项的code
			// });
			//TODO
			// opt.data = manData;
			// opt.data = handleDataForMan(opt.data);
			dd = new showTree1(opt);
		}else if(type == 2){
			//每级都是checkbox
			//最终输出带层级的文本
			dd = new showTree2(opt);
		}else if(type == 3) {
			//最后一级是checkbox
			//最终输出带层级的文本
			dd = new showTree3(opt);
		}else if(type == 4){
			//倒数第二级是checkbox
			dd = new showTree4(opt);
		}else{
			throw '树形结构菜单的类型不存在，只有1-4类'
		}

		//点击返回数据
		$$(btn).myclickok(function(){
			let data = dd.getSelectVal();
			success(data);
			dd.destroy();
			cc.destroy();
			$$(btn).unbind(true);
			$$(zz).unbind(true);
			zz.remove();
		});
		$$(zz).myclickok(function(e){
			e.stopPop();
		}).myclickdown(function(e){
			e.stopPop();
		}).myclickup(function(e){
			e.stopPop();
		});
	})
};