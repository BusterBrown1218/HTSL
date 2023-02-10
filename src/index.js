import './gui/LoadActionGUI';
import Settings from "./utils/config";

register("command", ...args => {
    if (args[0].toLowerCase() === 'config') return Settings.openGUI();
}).setName('housingbrown').setAliases(['hb']);

register("worldLoad", () => {
    ChatLib.chat("HTSL loaded successfully!");
});