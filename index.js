import './gui/LoadActionGUI';
import Settings from "./utils/config";
import codeWindow from './gui/codeWindow';

let loadedMessage = false;

register("command", ...args => {
    let command;
    try	{
		command = args[0].toLowerCase();
	} catch(e) {
		command = 'help';
	}
    if (command === 'config') return Settings.openGUI();
    if (command === 'gui') {
        args.shift();
        return codeWindow(args.join(' '));
    }
    if (command === 'guide') {
        const guideLink = new Message(
            new TextComponent("&3[HTSL] &fJust click this: &b&l[Guide]").setClick("open_url", "https://hypixel.net/threads/guide-htsl.5280752/")
        );
        return ChatLib.chat(guideLink);
    }
    if (command === 'help') {
        ChatLib.chat('&6---------------------');
        ChatLib.chat('&6/htsl help &fShows this message')
        ChatLib.chat('&6/htsl gui <script name> &fOpens a window for editing scripts');
        ChatLib.chat('&6/htsl config &fOpens the settings menu for HTSL');
        ChatLib.chat('&6/htsl guide &fOpen\'s a syntax guide')
        ChatLib.chat('&6---------------------');
    } else {
        ChatLib.chat('&3[HTSL] &fUnknown command! Try /htsl for help!');
    }
}).setName('htsl').setAliases(['ht']);

register("worldLoad", () => {
    if (loadedMessage) return;
    ChatLib.chat("&3[HTSL] &fLoaded successfully!");
    loadedMessage = true;
});