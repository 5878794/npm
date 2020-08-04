

//历史流程

// b-order-history(
//      id='order_history'
//      sort='desc'                 //数据是否倒序排列，无属性正序排列
//      showOne='true'              //是否只显示一条数据，其它隐藏，无属性全部显示
//      class='b_order_history'
//      )


//js:
// let history = $('#order_history').get(0);
// let data = [
// 	{
// 		no:'1',
// 		name:'创建计划',
// 		state:true,
// 		info:'同意',
// 		img:['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594181331374&di=cf77ff4f40436b635d59c92f8076c4b8&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2Fbf695201a8eade248b9362bda0bdb446.jpeg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594181331374&di=cf77ff4f40436b635d59c92f8076c4b8&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2Fbf695201a8eade248b9362bda0bdb446.jpeg'],
// 		date:'2020-11-11',
// 		user:'张三'
// 	}
// ];
// history.data = data;
// history.imgClick = function(rs){
// 	console.log(rs);        //图片点击返回当前图片路径
// }


let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');

let errImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAACu0lEQVRIia3WXagVVRjG8d/eHeiqunC6KU2IQAQFD3gRaaZYYqCWSYkj0geCQg1iolEWBIXGsYtwvCgjRYmJBCWCAtGIsi9FpIs+FEozFCUHBAOhMuxiZjjjuPaXpwf2xXred63/nsW73rVaF55bBjPxKt7DBwZQlGY9c/IknoJLUZr9PoRVeLuMzcVSbMSPg4A7gNp4AZtwOk/iKW1cbeQ9gh+wfoyw2ThRwuAORG1sxwR835gzgkO4c0BQO0/id/E57intI5gYpdlvQ6VxBsPYh8W1+TPxE5bgYB+wYUUNTKrZ70RptroatBtzHsMbDe9WHNBji/MkXoVjDdiGOiwEhBexJuCPKLY/BNtmtPAqLY/SbEszt1Uei5CewIcB/2M8arTYPlIUWqW/8GCUZl+FFg19YaU9WOD6Kl6E/bgXnzVgFzGjEwyGOgVKfYL78A1aNf+h8lfXRUyP0uxktwW7fWGl7zC9R84JTO0F6xdIUX1341wgdhWLojQ7289C/QLhD/wb8FvYkSfxzf8n8C6cxfgO8Rn4tuydYwaOw1Hc1iNvWB/dqBfwFnyN2xv+PDwTyJ+TJ3HX+6obsIUvXduq4CVFq9uJ3YF5y/IkHrkR4H5Ma3gZNtfGTyoquKn1eRIngwB3uP5gH8fyQO79inbW1NY8ief2A3wNTwf8WaF/FqXZZTwQiuFgnsQTugGfxcuBiQtwocOiojQ7LHzDwKE8iW8KAR/GtsCEtxQ9tauiNNuqKKamJtb9CjiMTwPJP2NtL1hNS3Ap4M/Jk/jNCjhfcbBDWjgATJRmfwqfT1iXJ/HmNh4XLp6N+HUQYAndq3gbNXUFp9pYidcbwZNGn3c3oqfwd22cY3KUZturd+krWFFL6LQtfanc2ufL4WnFXfkL19747+MfxZPhi7EAS+1S9NzVUZqdr8z/AAVPtTTnRsOnAAAAAElFTkSuQmCC';
let successImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAYAAAAAwr0iAAAB1klEQVRIicXWvWsUURQF8J9LBBHRQvCrDBZa2IiVYkCjoJJGQ2RttBO18QOCnZA/IBCxiFVsbERdRYgBUVBiTLRQItZiJRYKFoKFIBZvBsbJvN2d3Z3Nad68O/fec7j3cd9bc37+jFXCOfwZWAXiDbiBcei3gGOYwfZkP1vrI/kE5jLkTzDSjwoM4g6GMrbHOEn1LTiOBtZlbA2MppsqW3AdT3Pkb7PkVFeBKVzO2b7gUN6x1wJqeIbhnP039iXrioBeYQveFZDDYfwoCupVBbZiOVnzqGMpFpivwKkOyHfifYR8GveaBacCBvACD7GAbSXIl7Gj4N8CLrVKUMMIPgp9gv345P/BUYTBhGR9wb+/Sd6WqAm30u6cfTNe4VokbhM+CAevCKP42a6AMfE+TQp9zGItFrExEnNbGLVtIT0DddyP+FwQWpROtCUrK5biKy62S54VAKfxIOK3Ryh5A3ub5KuXIc8LILRjNuK7S3KDRXAT890KIJzeuZJ5fuFKWfKYADiB5yXynO2EvJkAOCoMp1Z4iUdVCIAjeN3CZ6xT8nYEwEHxw3UX36sWQBjLiwX28W7Iywgg3BFvMvtb+NZPAXAAn5PviW7J6exBMoSrIi+csvgHySFIY1XxYyUAAAAASUVORK5CYII=';
let arrowImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAt0lEQVQ4T92SMQ7CMAxFv71wD07CCdjKhMSCGJCIMnIB9iSsjExELJyAUyF1IEaGpSopDSoTGWO9Z3/LhIGPBvJ4Ezi3rwCprDWzpty5cAIoWruJzf/sBG1JF6yirCCEMEqJpjrJqxtFZrkYY+p25HwEljkDy5RoogCzXFPCAaBjeQSWtUpUcBecSWjXhjsjaOG5B8YWImMIrXLwR4EWvfcLEb51wb2Ckhv5/SGVdO09pG8kfxDhASy0RBHeQ/qXAAAAAElFTkSuQmCC';

class bOrderHistory extends HTMLElement{
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

		//是否倒序
		this.descSort = ($(this).attr('sort') == 'desc');
		this.showOne = ($(this).attr('showOne') == 'true');
		this.imgClickFn = function(){};

		this.shadow.appendChild(this.body.get(0));
	}

	createElement(){
		let body = $('<div class="body"></div>'),
			noDate = $('<div class="noDate box_hcc">暂无数据</div>'),
			showMore = $('<div class="showMore hover box_hcc"><span>查看更多</span></div>'),
			item = $('<div class="item box_hlt"></div>'),
			no = $('<div class="no box_hct"></div>'),
			name = $('<div class="name box_hlt"></div>'),
			state = $('<div class="state box_hcc"></div>'),
			info = $('<div class="info box_slt boxflex1"></div>'),
			text = $('<div class="text breakall"></div>'),
			img = $('<div class="img box_hlt box_lines"></div>'),
			date = $('<div class="date box_sct"></div>'),
			user = $('<div class="user box_sct"></div>');

		info.append(text).append(img);
		item.append(no)
			.append(name)
			.append(state)
			.append(info)
			.append(date)
			.append(user);

		this.noDate = noDate;
		this.showMore = showMore;
		this.item = item;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.body{min-width:1000px;width:100%;}',
			'.item{min-height:20px;padding:5px;line-height:20px;background:#e6e7e9;margin-bottom:5px;font-size:12px;color:#333;}',
			'.no{width:60px;}',
			'.noDate{font-size:14px; height:30px;}',
			'.showMore{margin-bottom: 20px;height:30px;padding-top:10px;font-size:12px;color:#909192;}',
			'.showMore span{padding:0 20px; position:relative;}',
			'.showMore span:before{content:"";display:block;position:absolute;left:0;top:50%;width:16px;height:16px;margin-top:-5px;background:url('+arrowImgSrc+') no-repeat center center;background-size:100%;}',
			'.showMore span:after{content:"";display:block;position:absolute;right:0;top:50%;width:16px;height:16px;margin-top:-5px;background:url('+arrowImgSrc+') no-repeat center center;background-size:100%;}',
			'.hideMore span:before,.hideMore span:after{transform:rotate(180deg);margin-top:-10px;}',
			'.name{width:160px;}',
			'.state img{display:block;width:14px;height:14px;}',
			'.text{}',
			'.state{width:60px; min-height:20px;}',
			'.img img{display:block;width:40px;height:40px;margin:2px 2px;}',
			'.date{width:100px;}',
			'.user{width:100px;}'
		];

		this.cssText = css.join('');
	}

	set data(data){
		this.body.find('img').unbind('click');
		this.showMore.unbind('click');
		this.body.html('');

		data = data || [];
		if(this.descSort){
			data = data.reverse();
		}

		if(data.length == 0){
			this.body.append(this.noDate);
			return;
		}

		let body = this.body,
			item = this.item;

		data.map(rs=>{
			let _item = item.clone();
			this.createRow(_item,rs);

			body.append(_item);
		});


		if(this.showOne && data.length > 1){
			let allItem = this.body.find('.item'),
				showOneFn = function(){
					allItem.addClass('hidden');
					allItem.eq(0).removeClass('hidden');
				},
				showAllFn = function(){
					allItem.removeClass('hidden');
				};

			showOneFn();
			this.body.append(this.showMore);
			this.showMore.click(function(){
				if($(this).hasClass('hideMore')){
					//收起
					showOneFn();
					$(this).removeClass('hideMore').find('span').text('查看更多');
				}else{
					//展开
					showAllFn();
					$(this).addClass('hideMore').find('span').text('收起更多');
				}
			});
		}
	}

	createRow(_item,rs){
		_item.find('.no').text(rs.no);
		_item.find('.name').text(rs.name);
		let stateImg = new Image();
		stateImg.src = (rs.state)? successImgSrc : errImgSrc;
		_item.find('.state').append(stateImg);
		_item.find('.text').text(rs.info);
		let imgs = rs.img || [],
			imgBody = _item.find('.img');
		imgs.map(imgSrc=>{
			let imgDom = new Image();
			imgDom.src = imgSrc;
			$(imgDom).addClass('hover');
			imgBody.append(imgDom);
			let _this = this;
			$(imgDom).click(function(){
				let src = $(this).attr('src');
				_this.imgClickFn(src);
			});
		});
		_item.find('.date').text(rs.date);
		_item.find('.user').text(rs.user);
	}

	set imgClick(fn){
		fn = fn || function(){};
		this.imgClickFn = fn;
	}



}



if(!customElements.get('b-order-history')){
	customElements.define('b-order-history', bOrderHistory );
}


