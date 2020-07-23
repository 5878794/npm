




//==========================================================
//表格类型  列表显示
//==========================================================


// html:
// 	b-table-list

//js:
//获取元素对象
	//  let table = $('b-table-list').get(0);

//设置表单样式等整体设置
	// table.setting = {
	// 	titleRowHeight:30,       //标题行 高度    默认：30
	// 	titleRowStyle:null,      //标题行附加样式   {background:red;}
	// 	titleCelStyle:null,      //标题列附加样式
	//
	// 	rowHeight:30,           //列表行 高度   默认：30
	// 	rowStyle:null,          //行附加样式
	// 	celStyle:null,          //列附加样式
	//
	// 	rowHoverStyle:null,         //行hover附加样式    2个必须一起设置
	// 	rowNotHoverStyle:null       //
	//  noDataHtml:'<div>暂无数据</div>'        //无数据显示的东东    有默认值
	// };


//设置表单绑定参数等
	// table.data = [
	// 	{
	// 		name:'客户',          //must,标题行名称
	// 		width:'25%',         //must,cel宽度
	//      type:'text',          //数据插入方式 html\text  默认：text
	// 		style:{color:'red'},        //字体颜色
	//      key:'a1',              // key 或 children字段必须出现一个
	// 		cursor:'pointer',      //是否显示可点击鼠标样式
	// 		icon:'icon',            //该列是否有图标
	//      iconStyle:{width:'',height:''},
	// 		children:[
	// 			{style:'red',key:'a1',cursor:'pointer',type:'html'},//该列内显示的子数据，竖向排列
	// 			{style: 'green', key: 'a2'},
	// 			{style: 'yellow', key: 'a3'}
	// 		]
	// 	},
	// 	{
	// 		name:'操作',
	// 		width:'25%',
	// 		style:{color:'#ccc'},
	// 		key:'d',                //数据对应的key
	// 		cursor:'pointer'
	// 	}
	// ];

//绑定数据
	// let data = [
	// 	{
	// 		id:1,
	// 		icon:'http://172.16.21.17:8930//image/apiDoc/jiekouwendang_36.png',
	// 		a1:'阿道夫就啊看风景阿克索德减肥了卡时间的反馈啦就是打开了飞机阿法快速的反馈及拉萨打飞机拉屎的空间',
// 	    	a2:'a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2a2',
// 	    	a3:'a3',
// 	    	b1:'b1',
// 	    	b2:'b2',
// 	    	c:'c',
// 	    	d:'d'
	// 	},
	//  ........
	// ];
	// table.show(data);



//事件处理
//行点击事件
	// table.body.find('.__row__').click(function(){
	//      let data = $(this).data('data');
	//      console.log(data);
	// });

//元素点击事件
// table.body.find('.__key9__').click(function(e){
// 	e.stopPropagation();        //阻止冒泡，避免点击到行
// 	let data = $(this).parent().parent().data('data');
// 	console.log(data);
// });


let addStyleFile = require('../fn/addStyleFile');

let createTitleRow = Symbol(),
	getTitleRowStyle = Symbol(),
	createRowList = Symbol(),
	getRowListStyle = Symbol(),
	setLevel2Body = Symbol(),
	addEvent = Symbol();


class bTableList extends HTMLElement{
	//元素加入页面回调
	connectedCallback() {
		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.shadow.appendChild(all);

	}

	constructor() {
		super();

		//创建shadow容器
		this.shadow = this.attachShadow({mode: 'open'});

		this.body = $('<div></div>');
		this.titleBody = $('<div></div>');
		this.listBody = $('<div></div>');
		this.body.append(this.titleBody).append(this.listBody);


		this.minWidth = parseInt($(this).attr('minWidth'));
		this.addEventRun = false;
		if(this.minWidth){
			this[addEvent]();
		}

		//表格数据
		this.tableData = [];


		//配置参数
		this.titleRowHeight = 30;
		this.titleRowStyle = null;      //{color:#ccc;}
		this.titleCelStyle = null;
		this.noDataHtml = '<div class="box_hcc" style="width:100%;height:100px;font-size:14px;color:#333;">暂无数据</div>';

		this.rowHeight = 30;
		this.rowStyle = null;
		this.celStyle = null;

		this.rowHoverStyle = null;
		this.rowNotHoverStyle = null;


		this[setLevel2Body]();
		this.shadow.appendChild(this.body.get(0));

	}

	set setting(opt){
		for(let [key,val] of Object.entries(opt)){
			this[key] = val;
		}
	}

	set data(data){
		this.tableData = data;
	}

	show(data){
		let _this = this;
		if(this.rowHoverStyle && this.rowNotHoverStyle){
			this.body.find('.__row__').unbind('hover');
		}
		this.titleBody.html('');
		this.listBody.html('');

		this.body.css({display:'none'});

		this[createTitleRow]();
		this[createRowList](data);

		if(this.rowHoverStyle && this.rowNotHoverStyle){
			this.body.find('.__row__').hover(function(){
				$(this).css(_this.rowHoverStyle);
			},function(){
				$(this).css(_this.rowNotHoverStyle);
			});
		}


		if(this.minWidth){
			this[setLevel2Body](this.minWidth);
		}
		this.body.css({display:'flex'}).addClass('box_slt');

	}

	//创建表头
	[createTitleRow](){
		let {rowCss,celCss} = this[getTitleRowStyle]();

		let row = $('<div class="box_hcc __table_row__"></div>');
		row.css(rowCss);

		this.tableData.map(rs=>{
			let cel = $('<div></div>');
			cel.css(celCss);
			cel.css({width:rs.width}).text(rs.name);

			row.append(cel);
		});

		this.titleBody.append(row);
	}
	//创建列表
	[createRowList](data){
		let {rowCss,celCss} = this[getRowListStyle]();

		data.map(rowData=>{
			let row = $('<div class="box_hcc __row__ __table_row__"></div>');
			row.css(rowCss).data({data:rowData});

			this.tableData.map(rs=>{
				//创建列
				let cel = $('<div class="box_scc diandian"></div>'),
					celBody = null;
				cel.css(celCss);
				cel.css({width:rs.width});

				//判断该列是否有图标
				if(rs.icon){
					cel.removeClass('box_scc').addClass('box_hcc');
					let img = new Image();
					img.src = rowData[rs.icon];
					$(img).addClass('__'+rs.icon+'__');
					if(rs.iconStyle){
						$(img).css(rs.iconStyle);
					}
					cel.append(img);

					if(rs.children && rs.children.length != 0){
						celBody = $('<div class="boxflex1 diandian box_slc" style="text-align:left;padding-left:10px;"></div>');
						cel.append(celBody);
					}
				}

				//处理该列是否有子集
				let insertBody = (celBody)? celBody : cel;
				if(rs.children && rs.children.length != 0){
					//插入子元素
					rs.children.map(children=>{
						let childrenDom = $('<div class="diandian"></div>');

						let type = (children.type == 'html')? 'html' : 'text';

						childrenDom[type](rowData[children.key]).css({
							width:'100%'
						}).addClass('__'+children.key+'__');

						if(children.style){
							childrenDom.css(children.style);
						}

						if(children.cursor){
							childrenDom.addClass('hover');
						}

						insertBody.append(childrenDom);
					});
				}else{
					//无子元素
					if(rs.key){
						let item = $('<div class="diandian" style="width:100%;"></div>');
						let type = (rs.type == 'html')? 'html' : 'text';
						item[type](rowData[rs.key]);

						if(rs.style){
							item.css(rs.style);
						}

						insertBody.append(item).addClass('__'+rs.key+'__');
						if(rs.cursor){
							cel.addClass('hover');
						}
					}
				}
				row.append(cel);
			});

			this.listBody.append(row);
		});

		if(data.length == 0){
			let div = $(this.noDataHtml);
			this.body.append(div);
		}
	}


	//获取标题行的css
	[getTitleRowStyle](){
		//行=================
		let row = {
			width:'100%',
			height:this.titleRowHeight+'px',
			'text-align':'center',
			'line-height':this.titleRowHeight+'px'
		};

		//应用传入的样式
		if(this.titleRowStyle && typeof this.titleRowStyle == 'object'){
			for(let [key,val] of Object.entries(this.titleRowStyle)){
				row[key] = val;
			}
		}


		//列=================
		let cel = {
			height:this.titleRowHeight+'px'
		};
		if(this.titleCelStyle && typeof this.titleCelStyle == 'object'){
			for(let [key,val] of Object.entries(this.titleCelStyle)){
				cel[key] = val;
			}
		}


		return {rowCss:row,celCss:cel};
	}
	//获取列表行的css
	[getRowListStyle](){
		//行=================
		let row = {
			width:'100%',
			height:this.rowHeight+'px',
			'text-align':'center'
		};

		//应用传入的样式
		if(this.rowStyle && typeof this.rowStyle == 'object'){
			for(let [key,val] of Object.entries(this.rowStyle)){
				row[key] = val;
			}
		}


		//列=================
		let cel = {
			height:this.rowHeight+'px',
			padding:'0 0.5%'
		};
		if(this.celStyle && typeof this.celStyle == 'object'){
			for(let [key,val] of Object.entries(this.celStyle)){
				cel[key] = val;
			}
		}


		return {rowCss:row,celCss:cel};
	}

	//设置标题容器和列表容器样式
	[setLevel2Body](width){
		if(width){
			//设置table滚动
			this.body.css({
				width:'100%'
			});
			this.titleBody.css({
				width:'100%',
				overflowX:'hidden',
				overflowY:'scroll'
			});
			this.listBody.css({
				width:'100%',
				overflowX:'auto',
				overflowY:'scroll'
			}).addClass('scroll_style1');
			this.body.find('.__table_row__').css({
				minWidth:width+'px'
			});
		}else{
			this.titleBody.css({
				width:'100%'
			});
			this.listBody.css({
				width:'100%',
				overflow:'auto'
			}).addClass('scroll_style1');
		}
	}

	//2个滚动条的联动滚动
	[addEvent](){
		if(this.addEventRun){return;}
		this.addEventRun = true;
		let _this = this;
		this.listBody.get(0).addEventListener('scroll',function(e){
			let left = $(this).scrollLeft();
			_this.titleBody.scrollLeft(left);
		},false)
	}

	set rowWidth(width){
		width = parseInt(width);
		this.minWidth = width;
		this[setLevel2Body](this.minWidth);
		this[addEvent]();
	}
	set tableHeight(height){
		let titleHeight = parseInt(this.titleBody.height()),
			listHeight = height - titleHeight;
		this.listBody.css({
			maxHeight:listHeight+'px'
		})
	}

	autoHeight(){
		this.body.css({
			width:'100%',
			height:'100%'
		}).addClass('box_slt');
		this.listBody.addClass('boxflex1')
	}

}



if(!customElements.get('b-table-list')){
	customElements.define('b-table-list', bTableList );
}


