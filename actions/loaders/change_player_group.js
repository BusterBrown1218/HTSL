export default (actionData) => {
	let sequence = [];

	if (actionData.group) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['option', { option: actionData.group }]);
	}

	if (actionData.demotionProtection) {
		sequence.push(['click', { slot: 11 }]);
	}

	return ['Change Player\'s Group', sequence];
}