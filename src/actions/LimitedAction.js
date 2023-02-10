import loaders from './loaders/_import_limited';

export default class LimitedAction {
	constructor(type, actionData) {
		this.loader = loaders[type]; // get the function that loads the action
		this.sequence = this.loader(actionData); // get the sequence of operations that loads the action ['Action Name', ['operation', data: 'operation specific' }]]
	}
	getSequence() {
		let sequence = [];

		sequence.push(['setActionName', { actionName: this.sequence[0] }]);
		sequence.push(['click', { slot: 50 }]); // click "Add Action Button"
		sequence.push(['option', { option: this.sequence[0] }]); // click the action type

		this.sequence[1].forEach(operation => {
			sequence.push(operation);
		});

		sequence.push(['returnToEditActions']);

		return sequence;
	}
}