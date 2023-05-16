export default (effect) => {
	switch (effect) {
		case 'speed': return { slot: 10 };
		case 'slowness': return { slot: 11 };
		case 'haste': return { slot: 12 };
		case 'mining_fatigue': return { slot: 13 };
		case 'strength': return { slot: 14 };
		case 'instant_health': return { slot: 15 };
		case 'instant_damage': return { slot: 16 };
		case 'jump_boost': return { slot: 19 };
		case 'nausea': return { slot: 20 };
		case 'regeneration': return { slot: 21 };
		case 'resistance': return { slot: 22 };
		case 'fire_resistance': return { slot: 23 };
		case 'water_breathing': return { slot: 24 };
		case 'invisibility': return { slot: 25 };
		case 'blindness': return { slot: 28 };
		case 'night_vision': return { slot: 29 };
		case 'hunger': return { slot: 30 };
		case 'weakness': return { slot: 31 };
		case 'poison': return { slot: 32 };
		case 'wither': return { slot: 33 };
		case 'health_boost': return { slot: 34 };
		case 'absorption': return { slot: 10, page: true }; // of course its the only one on the page 2
		default: {
			ChatLib.chat(`&3[HTSL] &6Warning: Unknown effect "${effect}"`);
			return { slot: 10 }
		}
	}
}
