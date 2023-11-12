export default (actionData) => {
	let sequence = [];

    if (actionData.team) {
        sequence.push(['click', { slot: 10 }]);
        sequence.push(['option', { option: actionData.team }]);
    }

	return ['Set Player Team', sequence];
}