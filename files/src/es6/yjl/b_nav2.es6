

//2级目录

//html:
// 	b-nav2(
//
// 		id='nav2'
// 	)


//js:
// 	let nav = $('#nav2').get(0);
// 	nav.data = [{name:'',value:''},...]



let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');
let urlParam = require('../lib/fn/getParamFromUrl');


class bNav2 extends HTMLElement{
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
		let body = $('<div class="body box_hlc"></div>'),
			item = $('<div class="item hover"></div>');

		this.item = item;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.body{height:43px;margin:20px 0;width:100%;padding:0 20px;background:#fff;}',
			'.item{font-size:14px;color:#aaa;margin:0 20px;height:40px;line-height:40px;border-bottom:3px solid transparent;}',
			'.body .select{color:#5576f0;border-color:#5576f0;}'
		];

		this.cssText = css.join('');
	}


	set data(data){
		data = data || [];

		let body = this.body,
			item = this.item,
			urlType = urlParam().type || 1;

		body.html('');
		data.map(rs=>{
			let _item = item.clone();
			_item.text(rs.name);
			_item.attr({type:rs.type});
			_item.click(function(){
				let type = $(this).attr('type'),
					url = window.location.pathname+'?type='+type;
				window.location.href = url;
			});

			if(urlType == rs.type){
				_item.addClass('select');
				$('title').text(rs.name);
			}

			body.append(_item);
		});



	}

}



if(!customElements.get('b-nav2')){
	customElements.define('b-nav2', bNav2 );
}


