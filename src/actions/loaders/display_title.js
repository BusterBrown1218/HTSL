export default (actionData) => {
	let sequence = [];

	if (actionData.title) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['chat', { text: actionData.title }]);
	}

	if (actionData.subtitle) {
		sequence.push(['click', { slot: 11 }]);
		sequence.push(['chat', { text: actionData.subtitle }]);
	}

	if (!isNaN(actionData.fadeIn) && actionData.fadeIn !== 1) {
		sequence.push(['click', { slot: 12 }]);
		sequence.push(['anvil', { text: actionData.fadeIn }]);
	}
	
	if (!isNaN(actionData.stay) && actionData.stay !== 5) {
		sequence.push(['click', { slot: 13 }]);
		sequence.push(['anvil', { text: actionData.stay }]);
	}

	if (!isNaN(actionData.fadeOut) && actionData.fadeOut !== 1) {
		sequence.push(['click', { slot: 14 }]);
		sequence.push(['anvil', { text: actionData.fadeOut }]);
	}

	return ['Display Title', sequence];
}