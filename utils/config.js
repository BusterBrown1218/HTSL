// config.js
import { @Vigilant @SliderProperty @SwitchProperty @NumberProperty @TextProperty @ButtonProperty @SliderProperty @CheckboxProperty } from 'Vigilance';

@Vigilant("HTSL", `HTSL`, {
	getCategoryComparator: () => (a, b) => {
		const categories = ["General", "Importing/Exporting", "Import Menu"];

		return categories.indexOf(a.name) - categories.indexOf(b.name);
	},
})
class Settings {

	// General
	
	@SwitchProperty({
		name: "Save Imports",
		description: 'Will keep the filename of your import inbetween imports so you don\'t have to type the same thing multiple times',
		category: "General",
		subcategory: "General",
	})
	saveimports = false;

	@SwitchProperty({
		name: "Close GUI on Exit",
		description: 'Closes the GUI when it finishes an import or exits due to error/cancelation',
		category: "General",
		subcategory: "General",
	})
	closeGUI = true;

	@SwitchProperty({
		name: "Play Sound on Exit",
		description: 'Play a sound when the import finishes',
		category: "General",
		subcategory: "General",
	})
	playSoundOnFinish = true;

	@SwitchProperty({
		name: "Cancel Sounds while Importing/Exporting",
		description: 'Prevents sounds from playing while importing/Exporting',
		category: "General",
		subcategory: "General",
	})
	cancelSounds = true;

	// Importing/Exporting 

	@SwitchProperty({
		name: "Safe Mode",
		description: 'Will show you where to click while loading in an action, this requires manual input and is no longer considered a "macro".\n\n&aSafeMode is recommended if you want to be extra careful not to break the rules.',
		category: "Importing/Exporting",
		subcategory: "Importing/Exporting",
	})
	useSafeMode = false;

	@SliderProperty({
		name: "GUI Timeout",
		description: "Amount of ticks after not clicking anything in the GUI before declaring an error and timing out.\n\n&eIf you have lots of lagspikes / slow internet and HTSL keeps timing out you should increase this.",
		category: "Importing/Exporting",
		subcategory: "Importing/Exporting",
		min: 60,
		max: 200
	})
	guiTimeout = 60;

	@SwitchProperty({
		name: "Export Color Codes",
		description: 'Exporting will check for color codes, but it will be slower',
		category: "Importing/Exporting",
		subcategory: "Importing/Exporting",
	})
	exportColorCodes = true;
	
	// Import Menu

	@SwitchProperty({
		name: "Toggle File Explorer window",
		description: "Turning this on will add a toggle button to show the file explorer instead of always being open",
		category: "Import Menu",
		subcategory: "Import Menu"
	})
	toggleFileExplorer = false;

	@SwitchProperty({
		name: "Alternate Icons",
		description: "Toggles between the different icons (default icons by Sandy, alternate icons by ixNoah)",
		category: "Import Menu",
		subcategory: "Import Menu"
	})
	altIcons = false;

	@SwitchProperty({
		name: "Items as Icons",
		description: "Instead of showing the json icon, it will show the item it represents",
		category: "Import Menu",
		subcategory: "Import Menu"
	})
	itemIcons = false;

	@SliderProperty({
		name: "GUI Debounce",
		description: "Adds a delay between when it allows you to next click, prevents accidentally clicking something (Milliseconds)",
		category: "Import Menu",
		subcategory: "Import Menu",
		min: 0,
		max: 50
	})
	debounce = 10;

	
	constructor() {
		this.initialize(this);
	}
}

export default new Settings();
