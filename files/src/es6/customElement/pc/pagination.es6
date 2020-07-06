




//==========================================================
//分页显示控件       < 1 2 3 ... 4 5 >
//==========================================================



//html
	// div(class='main')
		// b-pagination

//js
// 	var a = $('b-pagination').get(0);
// 	a.show({
// 		nowPage:10,             //当前页码       默认：1
// 		listLength:149,         //总记录数
// 		pageSize:10             //分页数         默认：10
// 	a.clickFn = function(n){
// 		console.log(n)          //点击事件，返回点击的页码
// 	}
//  a.selectBg = '#ccc';        //设置当前页码显示的背景色  默认：#cc9800



let addStyleFile = require('../fn/addStyleFile');

let addCss = Symbol('addCss'),
	createDom = Symbol('createDom'),
	getTotalPageNumber = Symbol(),
	getList = Symbol(),
	countPage = Symbol(),
	returnData = Symbol(),
	createList = Symbol();





class bPagination extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {
		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);


	}

	constructor() {
		super();

		this.selectBackGround = '#cc9800';

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});
		let style = this[addCss]();
		this.shadow.appendChild(style);

		let dom = this[createDom]();
		this.shadow.appendChild(dom.get(0));
		this.body = dom;

	}

	[addCss](){
		let text = '\n' +
			'.pagination_main{\n' +
			'  height: 35px;\n' +
			'}\n' +
			'.pagination_main a,\n' +
			'.pagination_main div{\n' +
			'  display: block;\n' +
			'  cursor: pointer;\n' +
			'  border:1px solid #aaa;\n' +
			'  height: 35px;\n' +
			'  text-align: center;\n' +
			'  line-height: 35px;\n' +
			'  position: relative;\n' +
			'  margin: 0 5px;\n' +
			'}\n' +
			'\n' +
			'.pagination_pre:link,\n' +
			'.pagination_page:link,\n' +
			'.pagination_next:link,\n' +
			'.pagination_pre:visited,\n' +
			'.pagination_page:visited,\n' +
			'.pagination_next:visited{\n' +
			'  color:#000;\n' +
			'}\n' +
			'\n' +
			'\n' +
			'.pagination_pre:hover,\n' +
			'.pagination_page:hover,\n' +
			'.pagination_next:hover{\n' +
			'  opacity: 0.6;\n' +
			'}\n' +
			'\n' +
			'.pagination_pre,\n' +
			'.pagination_next{\n' +
			'  width: 50px;\n' +
			'}\n' +
			'.pagination_text,\n' +
			'.pagination_page{\n' +
			'  width: 35px;\n' +
			'}\n' +
			'\n' +
			'.pagination_pre:after{\n' +
			'  content: \'﹤\'; display: block;\n' +
			'  position: absolute;\n' +
			'  left:0; top:0;\n' +
			'  width:50px; height: 35px;\n' +
			'  font-size: 16px;\n' +
			'}\n' +
			'.pagination_next:after{\n' +
			'  content: \'﹥\'; display: block;\n' +
			'  position: absolute;\n' +
			'  left:0; top:0;\n' +
			'  width:50px; height: 35px;\n' +
			'  font-size: 16px;\n' +
			'}\n' +
			'\n' +
			'.pagination_text:after{\n' +
			'  content: \'...\';\n' +
			'  display: block;\n' +
			'  position: absolute;\n' +
			'  left:0; top:0;\n' +
			'  width:35px; height: 35px; text-align: center;\n' +
			'  line-height: 29px;\n' +
			'}\n' +
			'\n' +
			'.pagination_main .select{\n' +
			// '  background: #cc9800;\n' +
			'  color: #fff;\n' +
			'  opacity: 1 !important;\n' +
			'}\n' +
			'\n' +
			'.pagination_main .not_use{\n' +
			'  opacity:0.3!important;\n' +
			'}';

		let style = document.createElement("style");
		style.innerHTML = text;

		return style;
	}



	// div(class='pagination_main box_hcc' id='pagination')
		// div(class='pagination_pre')
		// div(class='pagination_page select') 1
		// div(class='pagination_page') 2
		// div(class='pagination_page') 3
		// div(class='pagination_text')
		// div(class='pagination_next')
	[createDom](){
		let dom = $('<div class="pagination_main box_hcc"></div>');
		return dom;
	}

	show(opt){
		let {nowPage=1,listLength,pageSize=10} = opt;

		this.body.find('div').unbind('click');
		this.body.html('');

		if(listLength == 0){
			this.dom.css({display:'none'});
			return;
		}


		let totalPageNumber = this[getTotalPageNumber](listLength,pageSize),
			showList = this[getList](nowPage,totalPageNumber);


		this[createList](showList);
	}

	//计算总页数
	[getTotalPageNumber](number,pageSize){
		return (number/pageSize == parseInt(number/pageSize))?
			parseInt(number/pageSize) : parseInt(number/pageSize)+1;
	}

	//获取要显示的分页数据
	[getList](nowPage,totalPage){
		nowPage = parseInt(nowPage);
		totalPage = parseInt(totalPage);

		var pre = (nowPage-1>0)? nowPage-1 : 1,
			next = (nowPage+1<totalPage)? nowPage+1 : totalPage,
			backData;

		if(totalPage<=7){
			backData = [];
			for(var i=1,l=totalPage;i<=l;i++){
				backData.push(i);
			}
			backData.push(next);
			backData.unshift(pre);
			// backData = [pre,1,2,3,4,5,6,7,next];
		}else{
			backData = this[countPage](pre,next,nowPage,totalPage);
		}

		return this[returnData](backData,nowPage,totalPage);
	}

	//分页条 列表显示计算
	[countPage](pre,next,nowPage,totalPage){
		//设置初始
		var data = [pre,1];

		//判断前面是否需要显示。。。
		if(nowPage-1>3){
			data.push('...');
		}else{
			data.push(2);
		}

		//补充中间
		if(nowPage-1<=3){
			data.push(3);
			data.push(4);
			data.push(5);
		}else if(totalPage-nowPage<=3){
			data.push(totalPage-4);
			data.push(totalPage-3);
			data.push(totalPage-2);
		}else{
			data.push(nowPage-1);
			data.push(nowPage);
			data.push(nowPage+1);
		}


		//判断后面是否需要显示。。。
		if(totalPage-nowPage>3){
			data.push('...');
		}else{
			data.push(totalPage-1);
		}
		//补充完
		data.push(totalPage,next);

		return data;
	}

	//返回具体的分页条的数据
	[returnData](data,nowPage,totalPage){
		var ll = data.length-1,
			back = [];

		for(var i=0,l=data.length;i<l;i++){
			var rs = data[i];
			if(i==0){
				back.push({type:'pre',page:rs,select:false,use:(nowPage!=1)});
			}else if(i==ll){
				back.push({type:'next',page:rs,select:false,use:(nowPage!=totalPage)});
			}else{
				var type = (rs=='...')? 'text' : 'page';
				back.push({type:type,page:rs,select:(nowPage==rs),use:true})
			}
		}

		return back;
	}


	//生成具体的列表domx
	[createList](data){
		for(var i=0,l=data.length;i<l;i++){
			var item;
			if(data[i].select || data[i].type=='text' || !data[i].use){
				item = $('<div class="pagination_'+data[i].type+'"></div>');
				if(data[i].select){
					item.addClass('select').css({
						cursor:'default',
						background:this.selectBackGround
					});
				}
			}else{
				var newUrl = data[i].page;
				item = $('<div data-page="'+newUrl+'" class="pagination_'+data[i].type+'"></div>');
			}

			if(!data[i].use || data[i].type=='text'){
				item.addClass('not_use').css({cursor:'default'});
			}
			if(data[i].type=='page'){
				item.text(data[i].page)
			}

			this.body.append(item);
		}
	}

	//点击事件绑定
	set clickFn(fn){
		this.body.find('div').click(function(){
			let n = $(this).data('page');
			if(n){
				fn(n);
			}
		});
	}

	set selectBg(color){
		this.selectBackGround = color;
		this.body.find('.select').css({
			background:color
		})
	}

}



if(!customElements.get('b-pagination')){
	customElements.define('b-pagination', bPagination );
}


