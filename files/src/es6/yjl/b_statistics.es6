

//汇总

//html:
// 	b-statistics(
// 		itemWidth='25%'
// 		id='statistics'
// 	)


//js:
// 	let statistics = $('#statistics').get(0);
// 	statistics.data = [{name:'',value:''},...]



let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');


class bStatistics extends HTMLElement{
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

		this.itemWidth = $(this).attr('itemWidth') || '25%';

		//创建dom
		this.createElement();

		this.shadow.appendChild(this.body.get(0));
	}

	createElement(){
		let body = $('<div class="body box_slt"></div>'),
			title = $('<div class="title">汇总</div>'),
			main = $('<div class="box_hlt box_lines main"></div>'),
			item = $('<div class="item box_hlc" style="width:'+this.itemWidth+'"><p></p><span></span></div>');

		body.append(title).append(main);

		this.main = main;
		this.item = item;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.body{margin:20px 0;width:100%;padding:0 20px 10px 20px;background:#fff;}',
			'.title{width:100%;padding:20px 0 0 0;color:#333;font-size:16px;font-weight:bold;}',
			'.item{font-size:14px;color:#333;padding:5px 10px;}',
			'.main{width:100%;padding:10px 0;}',
			'.item span{color:#aaa;display:block;padding-left:5px;}'
		];

		this.cssText = css.join('');
	}


	set data(data){
		data = data || [];

		let body = this.main,
			item = this.item;
		body.html('');
		data.map(rs=>{
			let _item = item.clone();
			_item.find('p').text(rs.name+':');
			_item.find('span').text(rs.value);
			body.append(_item);
		})
	}

}



if(!customElements.get('b-statistics')){
	customElements.define('b-statistics', bStatistics );
}


