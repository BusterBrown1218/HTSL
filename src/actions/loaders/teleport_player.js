export default (actionData) => {
	let sequence = [];

	sequence.push(['click', { slot: 10 }]);

	switch(actionData.location) {
		case 'house_spawn':
			sequence.push(['click', { slot: 10 }]);
			break;
		case 'current_location':
			sequence.push(['click', { slot: 11 }]);
			break;
		case 'custom_coordinates':
			sequence.push(['click', { slot: 12 }]);
			sequence.push(['anvil', { text: actionData.coordinates.join(' ') }]);
			break;
	}

	return ['Teleport Player', sequence];
}