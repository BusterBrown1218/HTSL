import './gui/LoadActionGUI';
import Settings from "./utils/config";

register("command", ...args => {
    if (args[0].toLowerCase() === 'config') return Settings.openGUI();
}).setName('htsl').setAliases(['ht']);

register("worldLoad", () => {
    ChatLib.chat("HTSL loaded successfully!");
});