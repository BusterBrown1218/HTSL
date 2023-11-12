import convertSound from "../../utils/convertSound";

export default (actionData) => {
	let sequence = [];

	if (actionData.sound) {
		sequence.push(['click', { slot: 10 }]);
		sequence.push(['click', { slot: 48 }]);
		console.log(convertSound(actionData.sound));
		sequence.push(['chat', { text: convertSound(actionData.sound) }]);
	}

	if (!isNaN(actionData.volume) && actionData.volume !== 0.7) {
		sequence.push(['click', { slot: 11 }]);
		sequence.push(['anvil', { text: actionData.volume }]);
	}

	if (!isNaN(actionData.pitch) && actionData.pitch !== 1) {
		sequence.push(['click', { slot: 12 }]);
		sequence.push(['anvil', { text: actionData.pitch }]);
	}

	if (actionData.location) {
		sequence.push(['click', {slot: 13 }]);
		switch(actionData.location) {
			case 'house_spawn':
				sequence.push(['click', { slot: 10 }]);
				break;
			case 'current_location':
				sequence.push(['click', { slot: 11 }]);
				break;
			case 'invokers_location':
				sequence.push(['click', { slot: 12 }]);
				break;
			case 'custom_coordinates':
				sequence.push(['click', { slot: 13 }]);
				sequence.push(['anvil', { text: actionData.coordinates.join(' ') }]);
				break;
		}	
	}

	return ['Play Sound', sequence]; 
}