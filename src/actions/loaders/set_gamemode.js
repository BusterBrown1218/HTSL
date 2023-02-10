export default (actionData) => {
	let sequence = [];

	if (actionData.gamemode) {
		sequence.push(['click', { slot: 10 }]);
		switch (actionData.gamemode) {
			case 'adventure':
				sequence.push(['click', { slot: 10 }]);
				break;
			case 'survival':
				sequence.push(['click', { slot: 11 }]);
				break;	
			case 'creative':
				sequence.push(['click', { slot: 12 }]);
				break;
		}
	}

	return ['Set Gamemode', sequence];
}