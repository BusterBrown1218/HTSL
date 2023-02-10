import getPotionEffect from "../../utils/getPotionEffect";

export default (actionData) => {
	let sequence = [];

	if (actionData.effect) {
		sequence.push(['click', { slot: 10 }]);
		let { slot, page } = getPotionEffect(actionData.effect);
		if (page) {
			sequence.push(['click', { slot: 53 }]);
		}
		sequence.push(['click', { slot }]); 
	}

	if (!isNaN(actionData.duration) && actionData.duration !== 60) {
		sequence.push(['click', { slot: 11 }]);
		sequence.push(['anvil', { text: actionData.duration }]);
	}

	if (!isNaN(actionData.amplifier) && actionData.amplifier !== 1) {
		sequence.push(['click', { slot: 12 }]);
		sequence.push(['anvil', { text: actionData.amplifier }]);
	}

	if (actionData.overrideExistingEffects) {
		sequence.push(['click', { slot: 13 }]);
	}

	return ['Apply Potion Effect', sequence];
}