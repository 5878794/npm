
//同 b-input-text

//增加 autoHeight='true'  参数，会自动根据textarea高度变化而变化
//     input.rowHeight = 30;   实际会设置成30的3倍，150的高度


let bInputText = require('./b-input-text');

$.fn.autoHeight = function(){
	function autoHeight(elem){
		elem.style.height = 'auto';
		elem.scrollTop = 0; //防抖动
		elem.style.height = elem.scrollHeight + 'px';
	}
	this.each(function(){
		autoHeight(this);
		$(this).on('keyup', function(){
			autoHeight(this);
		});
	});
};



class bInputTextarea extends bInputText{
	constructor() {
		super();
	}

	createInput(){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';

		let input =  $(`<textarea autocomplete="off" class="boxflex1 __input__ __textarea__" type="password" placeholder="${placeholder}" data-rule="${rule}"></textarea>`);
		input.css({
			width:'100%',
			display:'block',
			height:this.userStyle.rowHeight*3+'px',
			lineHeight:'120%',
			background:'none',
			border:'none',
			fontSize:'12px'
		});

		this.autoHeight = ($(this).attr('autoHeight') == 'true');
		if(this.autoHeight){
			input.css({
				minHeight:this.userStyle.rowHeight*3+'px',
				overflow:'hidden',
				resize:'none'
			});
			input.autoHeight();
		}

		this.inputBodyDom.css({
			height:'auto',
			paddingTop:'10px',
			paddingBottom:'10px'
		})

		this.inputBodyDom.prepend(input);
		this.inputDom = input;
	}
}


if(!customElements.get('b-input-textarea')){
	customElements.define('b-input-textarea', bInputTextarea );
}
