export default (actionData) => {
	let sequence = [];

	if (actionData.message) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['chat', { text: actionData.message }]);
	}

	return ['Display Action Bar', sequence];
}