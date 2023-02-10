export default (actionData) => {
	let sequence = [];

	if (actionData.layout) {
		sequence.push(['click', { slot: 10 }]); 
		sequence.push(['option', { option: actionData.layout }]); 
	}

	return ['Apply Inventory Layout', sequence];
}
