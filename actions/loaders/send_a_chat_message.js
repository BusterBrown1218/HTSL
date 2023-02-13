export default (actionData) => {
	let sequence = [];
	if (actionData.message && actionData.message !== "Hello!") {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['chat', { text: actionData.message }]);
	}

	return ['Send a Chat Message', sequence];
}