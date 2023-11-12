export default (actionData) => {
	let sequence = [];

    if (actionData.menu) {
        sequence.push(['click', { slot: 10 }]);
        sequence.push(['option', { option: actionData.menu }]);
    }

	return ['Display Menu', sequence];
}