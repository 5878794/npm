

let publishInput = require('./_input-all');

class bInputText extends publishInput{
	constructor() {
		super();

		this.createInput();
		this.addEvent();
	}


	createInput(){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';

		let input =  $(`<input autocomplete="off" class="boxflex1 __input__" type="text" placeholder="${placeholder}" data-rule="${rule}"/>`);
		input.css({
			display:'block',
			width:'100%',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			background:'none',
			border:'none',
			fontSize:'12px'
		});

		this.inputBodyDom.prepend(input);
		this.inputDom = input;
	}

	addEvent(){
		let input = this.inputDom.get(0),
			_this = this;

		input.addEventListener('input',function(){
			let val = $.trim($(this).val());
			_this.changeFunction(val);
		},false)
	}

	set value(val){
		this.inputDom.val(val);
	}
	get value(){
		return this.inputDom.val();
	}

}


if(!customElements.get('b-input-text')){
	customElements.define('b-input-text', bInputText );
}