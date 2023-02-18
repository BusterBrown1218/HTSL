import './gui/LoadActionGUI';
import Settings from "./utils/config";
import codeWindow from './gui/codeWindow';

register("command", ...args => {
    if (args[0].toLowerCase() === 'config') return Settings.openGUI();
    if (args[0].toLowerCase() === 'gui') {
        args.shift();
        codeWindow(args.join(' '));
    }
}).setName('htsl').setAliases(['ht']);

register("worldLoad", () => {
    ChatLib.chat("&3[HTSL] &fLoaded successfully!");
});