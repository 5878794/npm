

//跟进记录

// b-follow-record(
//      id='follow_record'
//      sort='desc'                 //数据是否倒序排列，无属性正序排列
//      showOne='true'              //是否只显示一条数据，其它隐藏，无属性全部显示
//      class='b_order_history'
//      )


//js:
// let history = $('#follow_record').get(0);
// let data = [
// 	{
// 		no:'1',
// 		info:'同意',
// 		img:['https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594181331374&di=cf77ff4f40436b635d59c92f8076c4b8&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2Fbf695201a8eade248b9362bda0bdb446.jpeg','https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594181331374&di=cf77ff4f40436b635d59c92f8076c4b8&imgtype=0&src=http%3A%2F%2Fspider.nosdn.127.net%2Fbf695201a8eade248b9362bda0bdb446.jpeg'],
// 		date:'2020-11-11',
// 		user:'张三'
// 	}
// ];
// history.data = data;


let addStyleFile = require('../customElement/fn/addStyleFile'),
	addStyleText = require('../customElement/fn/addStyleText');

let arrowImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAt0lEQVQ4T92SMQ7CMAxFv71wD07CCdjKhMSCGJCIMnIB9iSsjExELJyAUyF1IEaGpSopDSoTGWO9Z3/LhIGPBvJ4Ezi3rwCprDWzpty5cAIoWruJzf/sBG1JF6yirCCEMEqJpjrJqxtFZrkYY+p25HwEljkDy5RoogCzXFPCAaBjeQSWtUpUcBecSWjXhjsjaOG5B8YWImMIrXLwR4EWvfcLEb51wb2Ckhv5/SGVdO09pG8kfxDhASy0RBHeQ/qXAAAAAElFTkSuQmCC';

class bFollowRecord extends HTMLElement{
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

		this.shadow.appendChild(this.body.get(0));
	}

	createElement(){
		let body = $('<div class="body"></div>'),
			noDate = $('<div class="noDate box_hcc">暂无数据</div>'),
			showMore = $('<div class="showMore hover box_hcc"><span>查看更多</span></div>'),
			item = $('<div class="item box_hlt"></div>'),
			no = $('<div class="no box_hct"></div>'),
			info = $('<div class="info box_slt boxflex1"></div>'),
			text = $('<div class="text breakall"></div>'),
			img = $('<div class="img box_hlt box_lines"></div>'),
			date = $('<div class="date box_sct"></div>'),
			user = $('<div class="user box_sct"></div>');

		info.append(text).append(img);
		item.append(no)
			.append(date)
			.append(user)
			.append(info);

		this.noDate = noDate;
		this.showMore = showMore;
		this.item = item;
		this.body = body;
	}
	createStyle(){
		let css = [
			'.body{margin:10px 0;padding:0 20px;min-width:1000px;width:100%;}',
			'.item{min-height:20px;padding:5px;line-height:20px;background:#e6e7e9;margin-bottom:5px;font-size:12px;color:#333;}',
			'.no{width:60px;}',
			'.noDate{font-size:14px; height:30px;}',
			'.showMore{height:30px;padding-top:10px;font-size:12px;color:#909192;margin-bottom: 20px;}',
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


		if(this.showMore && data.length > 1){
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




}



if(!customElements.get('b-follow-record')){
	customElements.define('b-follow-record', bFollowRecord );
}


