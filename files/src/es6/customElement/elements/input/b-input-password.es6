
//同 b-input-text

let bInputText = require('./b-input-text');


class bInputPassword extends bInputText{
	constructor() {
		super();

	}

	createInput(){
		let rule = this.rule || '',
			placeholder = this.placeholder || '';

		let input =  $(`<input autocomplete="off" class="boxflex1 __input__" type="password" placeholder="${placeholder}" data-rule="${rule}"/>`);
		input.css({
			display:'block',
			width:'100%',
			height:this.userStyle.rowHeight+'px',
			lineHeight:this.userStyle.rowHeight+'px',
			background:'none',
			border:'none',
			fontSize:'12px',
			paddingLeft:'4px'
		});

		this.inputBodyDom.prepend(input);
		this.inputDom = input;
	}
}


if(!customElements.get('b-input-password')){
	customElements.define('b-input-password', bInputPassword );
}
