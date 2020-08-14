
// part1.showLevel = 3;			//1-3
// part1.data = {
// 	money:7000000,
// 	type:'房抵',
// 	no:'Fd123123123',
// 	from:'来自中介',
// 	product:'中新银行-理财产品1',
// 	productInfo:'产品介绍产品介绍产品介绍产品介绍产品介绍产品介绍产品介绍',
// 	mans:[
// 		{name:'张三',phone:12312312312,idcard:'123333333333333333',address:'阿打发打发发代付链接撒地方科技傲世狂妃'},
// 		{name:'张三(共同)',phone:12312312312,idcard:'123333333333333333',address:'阿打发打发发代付链接撒地方科技傲世狂妃'},
// 		{name:'张三(担保)',phone:12312312312,idcard:'123333333333333333',address:'阿打发打发发代付链接撒地方科技傲世狂妃'}
// 	],
// 	state:'待回款'
// };
// part1.click = function(data){		//查看订单详情按钮点击
// 	console.log(data)
// }




let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText'),
	moneyFormat = require('../lib/fn/number');



class bOrderInfo extends HTMLElement{
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

		//创建dom
		this.createElement();



		this.shadow.appendChild(this.body.get(0));


	}

	createElement(){
		let body = $('<div class="box_slt order_info"></div>'),
			row1 = $('<div class="box_hlc hidden row1"></div>'),
			row2 = $('<div class="box_hlt hidden row2"></div>'),
			row3 = $('<div class="box_hlc hidden row3"></div>'),
			row1Cel1 = $('<div class="row1_cel1"></div>'),
			row1Cel2 = $('<div class="box_slc row1_cel2"><p></p><span></span></div>'),
			row1Cel3 = $('<div class="row1_cel3 boxflex1"></div>'),
			row2Cel1 = $('<div class="box_slt row2_cel1"></div>'),
			row2Cel2 = $('<div class="row2_cel2"><p></p><span></span></div>'),
			row2Cel1Row1 = $('<div class="box_hlc row2_cel1_row1 hidden"><span></span><div></div><p class="boxflex1"></p></div>'),
			row2Cel1Row2 = $('<div class="row2_cel1_row2 hidden"></div>'),
			row3Cel1 = $('<div></div>'),
			row3Cel2 = $('<p class="boxflex1 hover">查看订单详情 >></p>');

		row3.append(row3Cel1).append(row3Cel2);
		row3.append(row2Cel1Row1).append(row2Cel1Row2);
		// row2Cel1.append(row2Cel1Row1).append(row2Cel1Row2)
		// 		.append(row2Cel1Row1.clone()).append(row2Cel1Row2.clone())
		// 		.append(row2Cel1Row1.clone()).append(row2Cel1Row2.clone());
		row2.append(row2Cel1).append(row2Cel2);
		row1.append(row1Cel1).append(row1Cel2).append(row1Cel3);
		body.append(row1).append(row2).append(row3);

		this.body = body;
	}
	createStyle(){
		let css = [
			'.order_info{min-width:1000px;width:100%;}',
			'.row1,.row2,.row3{width:100%;}',
			'.row1,.row3{padding-bottom:20px;}',
			'.row2{padding-bottom:10px;}',
			'.row1_cel1{width:240px;color:#fdc429;font-size:30px;}',
			'.row1_cel2{width:200px;font-size:14px;color:#333;font-weight: bold;}',
			'.row1_cel2 span{font-size:12px;color:#ccc;}',
			'.row1_cel3{text-align:right;font-size:12px;color:#ccc;}',
			'.row3{font-size:16px; color:#0b8700;}',
			'.row3 p{text-align:right;font-size:12px;color:#333;}',
			'.row2_cel1{width:70%;font-size:12px;color:#999;line-height:14px;}',
			'.row2_cel1_row1:first-child{color:#333;}',
			'.row2_cel1_row2{padding-bottom:10px;}',
			'.row2_cel1_row1 span{width:120px;}',
			'.row2_cel1_row1 div{width:120px;}',
			'.row2_cel1_row1:first-child span{font-size:14px;}',
			'.row2_cel2{width:30%;font-size:14px;text-align:right;}',
			'.row2_cel2 p{font-weight: bold;}',
			'.row2_cel2 span{font-size:12px;color:#ccc;}'
		];

		this.cssText = css.join('');
	}

	set showLevel(level){
		if(level == 1){
			this.body.find('.row1').removeClass('hidden');
		}else if(level == 2){
			this.body.find('.row1').removeClass('hidden');
			this.body.find('.row2').removeClass('hidden');
		}else{
			this.body.find('.row1').removeClass('hidden');
			this.body.find('.row2').removeClass('hidden');
			this.body.find('.row3').removeClass('hidden');
		}
	}

	set data(data){
		//part1
		let money = data.money || 0;
		money = moneyFormat(money,0);
		this.body.find('.row1_cel1').text(money);
		this.body.find('.row1_cel2').find('p').text(data.type || '');
		this.body.find('.row1_cel2').find('span').text(data.no || '');
		this.body.find('.row1_cel3').text(data.from || '');

		//part2
		this.body.find('.row2_cel2').find('p').text(data.product);
		this.body.find('.row2_cel2').find('span').text(data.productInfo);
		let body = this.body.find('.row2_cel1'),
			row1 = this.body.find('.row3').find('.row2_cel1_row1'),
			row2 = this.body.find('.row3').find('.row2_cel1_row2'),
			listData = data.mans || [];

		listData.map(rs=>{
			let _row1 = row1.clone().removeClass('hidden'),
				_row2 = row2.clone().removeClass('hidden');
			_row1.find('span').text(rs.name);
			_row1.find('div').text(rs.phone);
			_row1.find('p').text(rs.idcard);
			_row2.text(rs.address);
			body.append(_row1).append(_row2);
		});
		body.find('.row2_cel1_row2').eq(0).css({color:'#333'});

		//part3
		this.body.find('.row3').find('div').text(data.state);
		this.body.find('.row3').find('p').data({data:data});
	}

	set click(fn){
		fn = fn || function(){};
		this.body.find('.row3').find('p').click(function(){
			let data = $(this).data('data');
			fn(data);
		});
	}

}



if(!customElements.get('b-order-info')){
	customElements.define('b-order-info', bOrderInfo );
}


