// config.js
import { @Vigilant @SliderProperty @SwitchProperty @NumberProperty @TextProperty @ButtonProperty @SliderProperty @CheckboxProperty } from 'Vigilance';

@Vigilant("HTSL", `HTSL`, {
	getCategoryComparator: () => (a, b) => {
		const categories = ["General", "Actions / Items",  "Miscellaneous"];

		return categories.indexOf(a.name) - categories.indexOf(b.name);
	},
})
class Settings {

	// Actions / Items 

	@SwitchProperty({
		name: "Safe Mode",
		description: 'Will show you where to click while loading in an action, this requires manual input and is no longer considered a "macro".\n\n&aSafeMode is recommended if you want to be extra careful not to break the rules.',
		category: "Actions / Items",
		subcategory: "Actions / Items",
	})
	useSafeMode = false;

	
	// MISCELLANEOUS

	@SliderProperty({
		name: "GUI Cooldown",
		description: "Amount of cooldown between clicking an item in a GUI.\n\nvalues under 20 will result in more errors.",
		category: "Miscellaneous",
		subcategory: "Miscellaneous",
		min: 10,
		max: 100
	})
	guiCooldown = 20;

	@SliderProperty({
		name: "GUI Timeout",
		description: "Amount of ticks after not clicking anything in the GUI before declaring an error and timing out.\n\n&eIf you have lots of lagspikes / slow internet and HTSL keeps timing out you should increase this.",
		category: "Miscellaneous",
		subcategory: "Miscellaneous",
		min: 60,
		max: 200
	})
	guiTimeout = 60;


	
	constructor() {
		this.initialize(this);
	}
}

export default new Settings();
