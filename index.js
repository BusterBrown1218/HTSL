import './gui/LoadActionGUI';
import update from './update/update';
import Config from "./utils/config";
import codeWindow from './gui/codeWindow';

register("command", ...args => {
    let command;
    try	{
		command = args[0].toLowerCase();
	} catch(e) {
		command = 'help';
	}
    if (command === 'config') return Config.openGUI();
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
    if (command === 'update') {
        return update();
    }
    if (command === 'changelog') {
        ChatLib.chat("&3[HTSL] &fChanges:")
        return ChatLib.chat(FileLib.read('./config/ChatTriggers/modules/HTSL/update/changelog.txt'));
    }
    if (command === 'saveitem') {
        if (args.length < 2) return ChatLib.chat("&3[HTSL] &cPlease enter a filename to save it to!");
        let itemHeld = Player.getHeldItem().getNBT().toString().replace(/["']/g, '\\$&');
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`, `{"item": "${itemHeld}"}`);
        return ChatLib.chat(`&3[HTSL] &fSaved item to ${args[1]}.json`);
    }
    if (command === 'help') {
        ChatLib.chat('&6---------------------');
        ChatLib.chat('&6/htsl help &fShows this message')
        ChatLib.chat('&6/htsl gui <script name> &fOpens a window for editing scripts');
        ChatLib.chat('&6/htsl config &fOpens the settings menu for HTSL');
        ChatLib.chat('&6/htsl guide &fOpen\'s a syntax guide');
        ChatLib.chat('&6/htsl update &fForce updates HTSL (will save your files)');
        ChatLib.chat('&6/htsl changelog &fShows you all the significant changes made in the last update!');
        ChatLib.chat('&6/htsl saveitem <filename> &fSave an item to import!');
        ChatLib.chat('&6---------------------');
    } else {
        ChatLib.chat('&3[HTSL] &fUnknown command! Try /htsl for help!');
    }
}).setName('htsl').setAliases(['ht']);