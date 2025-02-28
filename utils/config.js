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
		name: "Save Import Directories",
		description: 'Will keep the folder of your import inbetween imports so you don\'t have to navigate to the same directory multiple times',
		category: "General",
		subcategory: "General",
	})
	saveDirectory = true;

	@SwitchProperty({
		name: "Save Import File Name",
		description: 'Will keep the name of your import inbetween imports so you don\'t have to type the same name multiple times',
		category: "General",
		subcategory: "General",
	})
	saveFile = false;

	@SwitchProperty({
		name: "Load Message",
		description: 'Toggles whether or not the load message shows. Doesn\'t disable update-check',
		category: "General",
		subcategory: "General",
	})
	loadMessage = true;

	@SwitchProperty({
		name: "Delete Existing Actions on Command Import",
		description: 'Before importing using the command, HTSL will delete any existing actions in the first non-default context',
		category: "General",
		subcategory: "General",
	})
	deleteOnCommandImport = false;

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

	@SwitchProperty({
		name: "Emergency reload button",
		description: 'Reloads chattriggers in case of softlock. Mainly use for debugging.',
		category: "General",
		subcategory: "General",
	})
	reloadButton = false;

	// Importing/Exporting 

	@SwitchProperty({
		name: "Safe Mode",
		description: 'Will show you where to click while loading in an action, this requires manual input and is no longer considered a "macro".\n\n&aSafeMode is recommended if you want to be extra careful not to break the rules.',
		category: "Importing/Exporting",
		subcategory: "Importing/Exporting",
	})
	useSafeMode = true;

	@SliderProperty({
		name: "GUI Timeout",
		description: "Amount of ticks after not clicking anything in the GUI before declaring an error and timing out.\n\n&eIf you have lots of lagspikes / slow internet and HTSL keeps timing out you should increase this.",
		category: "Importing/Exporting",
		subcategory: "Importing/Exporting",
		min: 60,
		max: 200
	})
	guiTimeout = 60;

	@SliderProperty({
		name: "GUI Delay",
		description: "Adds extra delay between clicks while importing. Not required, but it might help if imports freeze often. Measured in milliseconds",
		category: "Importing/Exporting",
		subcategory: "Importing/Exporting",
		min: 0,
		max: 1000
	})
	guiDelay = 0;
	
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

	@TextProperty({
		name: "Working Directory",
		description: "Modifies the directory HTSL will import from. To use the default HTSL/imports directory, set to $DEFAULT_FOLDER",
		category: "Import Menu",
		subcategory: "Import Menu"
	})
	workingDirectory = "$DEFAULT_FOLDER"
	
	constructor() {
		this.initialize(this);
	}
}

export default new Settings();
