import './gui/LoadActionGUI';
import Config from "./utils/config";
import codeWindow from './gui/codeWindow';
import convertAction from './compiler/convertAction';
import { addOperation } from './gui/Queue';
import Navigator from './gui/Navigator';

function getArgs(input) {
	let result = [];
	let match;
	let re = /"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)'|(\S+)/g;
	while ((match = re.exec(input)) !== null) {
		result.push(match[1] || match[2] || match[3]);
	}
	return result;
}

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
            new TextComponent("&3[HTSL] &fJust click this: &b&l[Guide]").setClick("open_url", "https://hypixel.net/threads/updated-guide-htsl.5555038/")
        );
        return ChatLib.chat(guideLink);
    }
    if (command === 'changelog') {
        ChatLib.chat("&3[HTSL] &fChanges:");
        let changelog = FileLib.read('./config/ChatTriggers/modules/HTSL/update/changelog.txt').split("\n");
        changelog.forEach(line => {
            ChatLib.chat(line.trim());
        });
        return;
    }
    if (command === 'saveitem') {
        if (args.length < 2) return ChatLib.chat("&3[HTSL] &cPlease enter a filename to save it to!");
        let itemHeld = Player.getHeldItem().getNBT().toString().replace(/["]/g, '\\$&');
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`, `{"item": "${itemHeld}"}`);
        return ChatLib.chat(`&3[HTSL] &fSaved item to ${args[1]}.json`);
    }
    if (command === 'convert') {
        if (args.length < 3) return ChatLib.chat("&3[HTSL] &cPlease enter the action id and then the filename to save it to!");
        convertAction(args[1], args[2]);
        return ChatLib.chat(`&3[HTSL] &fConverting action into HTSL script saved at ${args[2]}.htsl`);
    }
    if (command === "addfunctions") {
        if (args.length == 1) return ChatLib.chat("&3[HTSL] &cPlease add a filename!");
        if (FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.htsl`)) {
            Navigator.isReady = true;
            FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.htsl`).trim().split(/\n/).forEach(line => {
                if (line.match(/^ *goto function (.*)/)) {
                    let name = getArgs(line)[2];
                    addOperation(['closeGui']);
                    addOperation(['wait', { time: 750 }]);
                    addOperation(['chat', { text: `/function edit ${name}`, func: name, command: true }]);
                }
            });
            addOperation(['closeGui']);
            addOperation(['done']);
            return;
        } else {
            return ChatLib.chat("&3[HTSL] &cFile not found!");
        }
    }
    if (command === "listscripts") {
        let files;
        if (args.length == 1) {
            files = readDir("./config/ChatTriggers/modules/HTSL/imports/", false).filter(e => e.endsWith("htsl") || e.endsWith("\\")); 
        } else {
            args.shift();
            files = readDir(`./config/ChatTriggers/modules/HTSL/imports/${args.join(" ")}/`, false);
        }
        files.filter(e => e.endsWith("\\")).forEach(directory => {
            ChatLib.chat(`&3Directory: &f${directory.substring(0, directory.length - 1)}`);
        })
        ChatLib.chat("\n&3[HTSL] &fMain Directory:\n");
        return files.filter(e => e.endsWith(".htsl")).forEach(file => {
            ChatLib.chat(file);
        });
    }
    if (command === 'help') {
        ChatLib.chat('&8&m-------------------------------------------------');
        ChatLib.chat('&6/htsl help &7Opens the HTSL help menu!')
        ChatLib.chat('&6/htsl gui <script name> &7Opens a window for editing scripts!');
        ChatLib.chat('&6/htsl config &7Opens the settings menu for HTSL!');
        ChatLib.chat('&6/htsl guide &7Opens a syntax guide!');
        ChatLib.chat('&6/htsl changelog &7Shows you all the significant changes made in the last update!');
        ChatLib.chat('&6/htsl saveitem <filename> &7Save an item to import!');
        ChatLib.chat('&6/htsl convert <action id> <filename> &7Converts a HousingEditor action to HTSL!');
        ChatLib.chat('&6/htsl addfunctions <filename> &7Imports all the required functions to prepare for import!');
        ChatLib.chat('&6/htsl listscripts&7Lists all your scripts');
        ChatLib.chat('&8&m-------------------------------------------------');
    } else {
        ChatLib.chat('&3[HTSL] &fUnknown command! Try /htsl for help!');
    }
}).setName('htsl').setAliases(['ht']);

function readDir(path, walk) {
    let files = new java.io.File(path).listFiles();
    let fileNames = [];
    let regex = new RegExp(path.replace(/\//g, "\\\\") + "(.*)");
    files.forEach(file => {
        if (file.isDirectory()) {
            if (walk) {
                readDir(path + file.getName() + "/").forEach(newFile => fileNames.push((file.toString() + "\\" + newFile.toString()).match(regex)[1]));
            } else {
                fileNames.push(file.toString().match(regex)[1] + "\\");
            }
        } else {
            let match = file.toString().match(regex);
            if (match) fileNames.push(match[1]);
        }
    });
    return fileNames;
}