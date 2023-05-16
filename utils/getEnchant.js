export default (enchant) => {
	switch (enchant) {
		case 'Protection': return { slot: 10 };
		case 'Fire Protection': return { slot: 11 };
		case 'Feather Falling': return { slot: 12 };
		case 'Blast Protection': return { slot: 13 };
		case 'Projectile Protection': return { slot: 14 };
		case 'Respiration': return { slot: 15 };
		case 'Aqua Affinity': return { slot: 16 };
		case 'Thorns': return { slot: 19 };
		case 'Depth Strider': return { slot: 20 };
		case 'Sharpness': return { slot: 21 };
		case 'Smite': return { slot: 22 };
		case 'Bane Of Arthropods': return { slot: 23 };
		case 'Knockback': return { slot: 24 };
		case 'Fire Aspect': return { slot: 25 };
		case 'Looting': return { slot: 28 };
		case 'Efficiency': return { slot: 29 };
		case 'Silk Touch': return { slot: 30 };
		case 'Unbreaking': return { slot: 31 };
		case 'Fortune': return { slot: 32 };
		case 'Power': return { slot: 33 };
		case 'Punch': return { slot: 34 };
		case 'Flame': return { slot: 10, page: true };
		case 'Infinity': return { slot: 11, page: true };
		default: {
			ChatLib.chat(`&3[HTSL] &6Warning: Unknown effect "${enchant}"`);
			return { slot: 10 }
		}
	}
}
