


let addStyleFile = require('../fn/addStyleFile'),
	addStyleText = require('../fn/addStyleText');
require('../../lib/jq/extend');


class bExeclShow extends HTMLElement{
	constructor() {
		super();

		let body = this.attachShadow({mode: 'open'});
		this.body = $(body);


		//挂载css
		let all = addStyleFile('../res/css/all.css');
		this.body.append(all);

		//
		let style = this.createStyle(),
			styleDom = addStyleText(style);
		this.body.append($(styleDom));

		let height = $(this).attr('height') || 300,
			width = $(this).attr('width') || '100%';
		this.info = $(this).attr('info') || '';

		let reg = new RegExp(/^\d*$/);
		this.width = (reg.test(width))? width+'px' : width;
		this.height = (reg.test(height))? height+'px' : height;

		$(this).css({
			display:'block',
			width:this.width,
			height:this.height,
			overflow:'auto',
			border:'1px solid #22222d'
		});


		this.table = null;
		this.showDefaultDom();
	}

	createStyle(){
		return 'table{min-width:100%;border-collapse:collapse;}' +
			'tr{height:24px;}' +
			'td{border:1px solid #ccc;min-width:50px;background:#feffff;font-size:14px;}';
	}

	showDefaultDom(){
		let dom = $('<div>'+this.info+'</div>');
		dom.css({
			background:'#e5e5e5',
			color:'#8e8f90',
			fontSize:'18px',
			textAlign:'center',
			lineHeight:this.height,
			width:this.width,
			height:this.height
		});
		this.defaultDom = dom;

		this.body.append(dom);
	}

	set data(data){
		this.defaultDom.remove();
		if(this.table){
			this.table.remove();
		}

		this.table = $('<table></table>');

		let html = [];
		data.map(row=>{
			html.push('<tr>');
			row.map(cel=>{
				html.push('<td>'+cel+'</td>');
			});
			html.push('</tr>');
		});
		this.table.html(html.join(''));

		this.body.append(this.table);
	}
}



if(!customElements.get('b-execl-show')){
	customElements.define('b-execl-show', bExeclShow );
}



