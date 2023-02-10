import LimitedAction from "../LimitedAction";

export default (actionData) => {
	let sequence = [];

	if (actionData.actions) {
		sequence.push(['click', { slot: 10 }]); // select "Actions"
		actionData.actions.forEach(action => {
			let actionSequence = new LimitedAction(action[0], action[1]).getSequence()
			sequence.push(...actionSequence);
		})
		sequence.push(['back']);
	}

	return ['Random Action', sequence];
}