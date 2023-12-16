const gui = new Gui();
let guiText;
let cursorLine = 0;
let cursorBlink = 0;
let cursorIndex;
let fileNameSave;
let lineLimit = Math.floor((Renderer.screen.getHeight() - 7) / 20);
let startIndex = 0;
gui.registerDraw(guiRender)

gui.registerKeyTyped(guiTextRegister)

function guiRender(mouseX, mouseY, partialTicks) {
    Renderer.drawRect(Renderer.color(30, 30, 30, 200), Renderer.screen.getWidth() / 4, Renderer.screen.getHeight() / 4, Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2);
    lineLimit = Math.floor((Renderer.screen.getHeight() - 7) / 20);
    for (let i = startIndex; i < lineLimit + startIndex && i < guiText.length; i++) {
        if (guiText[i].length >= 0) {
            let displayText = guiText[i];
            if (displayText.startsWith("//")) {
                displayText = displayText.replace(/&(\d+|[a-f])/g, '&&2$1');
            } else {
                displayText = displayText.replace(/"(.*?)"/g, '&2"$1&2"&f');
            }
            Renderer.drawString(`&7${i + 1} | &f${syntaxHighlight(displayText)}`, Renderer.screen.getWidth() / 4 + 7, Renderer.screen.getHeight() / 4 + (i - startIndex) * 10 + 7, true)
        }
    }
    if (cursorBlink < 100) {
        cursorBlink = cursorBlink + 1;
    } else {
        cursorBlink = 0;
    }
    if (cursorBlink >= 50.0 && cursorBlink < 100.0) {
        Renderer.drawRect(Renderer.color(200, 200, 200, 200), Renderer.screen.getWidth() / 4 + 7 + Renderer.getStringWidth(guiText[cursorLine + startIndex].replace(/&(\d+|[a-f])/g, "").substring(0, cursorIndex) + `${cursorLine + 1} | `), Renderer.screen.getHeight() / 4 + (cursorLine) * 10 + 7, 5, 10);
    }
}

function guiTextRegister(typedChar, keyCode) {
    let line = guiText[startIndex + cursorLine];
    // Enter key
    if (keyCode === 28.0) {
        guiText.splice(cursorLine + startIndex + 1, 0, "");
        if (startIndex + lineLimit < guiText.length && cursorLine + 1 === lineLimit) {
            startIndex = startIndex + 1;
        } else if (cursorLine + 1 !== lineLimit) {
            cursorLine = cursorLine + 1;
        }
        return;
    }
    // Backspace
    if (keyCode === 14.0) {
        if (cursorIndex > line.length) {
            cursorIndex = line.length;
        }
        if (line.length <= 0 && guiText.length > 1) {
            if (startIndex > 0) {
                startIndex = startIndex - 1;
            } else if (cursorLine < lineLimit && cursorLine > 0) {
                cursorLine = cursorLine - 1;
            }
            guiText.splice(cursorLine + startIndex + 1, 1);
            return cursorIndex = guiText[startIndex + cursorLine].length;
        }
        if (line.length <= 0) {
            return;
        }
        guiText[startIndex + cursorLine] = line.substring(0, cursorIndex - 1) + line.substring(cursorIndex);
        cursorIndex--;
        return;
    }
    // Esc key
    if (keyCode === 1.0) {
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${fileNameSave}.htsl`, guiText.join("\n"));
        ChatLib.chat(`&3[HTSL] &fSaved text to ${fileNameSave}.htsl`);
        return;
    }
    if ([42, 29, 54, 157, 184, 56, 219, 15, 58, 211, 207, 209, 201, 199, 210, 197, 70, 183, 88, 87, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59].includes(keyCode)) return;
    // Up key
    if (keyCode === 200) {
        if (cursorLine > 0) {
            cursorLine = cursorLine - 1;
        } else if (startIndex > 0) {
            startIndex = startIndex - 1;
        }
        return;
    }
    // Down key
    if (keyCode === 208) {
        if (cursorLine + 1 < lineLimit && cursorLine + startIndex + 1 < guiText.length) {
            cursorLine = cursorLine + 1;
        } else if (cursorLine + startIndex + 1 < guiText.length) {
            startIndex = startIndex + 1;
        }
        return;
    }
    // Left key
    if (keyCode === 203) {
        if (cursorIndex > line.length) {
            cursorIndex = line.length;
        }
        return cursorIndex--;
    }
    // Right key
    if (keyCode === 205) {
        cursorIndex++;
        if (cursorIndex > line.length + 1) {
            cursorIndex = line.length + 1;
        }
        return;
    }
    guiText[startIndex + cursorLine] = line.substring(0, cursorIndex) + typedChar + line.substring(cursorIndex, line.length);
    cursorIndex++;
    if (cursorIndex > line.length + 1) {
        cursorIndex = line.length + 1;
    }
}

export default (fileName) => {
    if (!fileName) fileName = "default";
    if (!(FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`) || FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`))) {
        ChatLib.chat(`&3[HTSL] &fCreated new file "${fileName}.htsl"`);
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`, "");
    } else {
        ChatLib.chat(`&3[HTSL] &fLoading ${fileName}.htsl . . .`);
    }
    guiText = [];
    fileNameSave = fileName;
    try {
        if (FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`)) {
            guiText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`);
        } else if (FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`)) {
            guiText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`);
            ChatLib.chat(`&3[HTSL] &eThe .txt file extension won't be supported in future updates. Please change your file extensions to be .htsl`);
        } else {
            return ChatLib.chat(`&3[HTSL] &cCouldn't find the file "${fileName}", please make sure it exists!`);
        }
        guiText = guiText.split("\n");
        lineLimit = Math.floor((Renderer.screen.getHeight() - 7) / 20);
        if (guiText.length > lineLimit) {
            cursorLine = lineLimit - 1;
            startIndex = guiText.length - lineLimit;
        } else {
            cursorLine = guiText.length - 1;
        }
        cursorIndex = guiText[cursorLine].length
        return gui.open();
    } catch (error) {
        return ChatLib.chat(`&3[HTSL] &f${fileName}.htsl can't be loaded! Please make sure this file exists!`);
    }

}

const keywords = [
    "stat",
    "applyLayout",
    "applyPotion",
    "cancelEvent",
    "globalstat",
    "changeHealth",
    "changePlayerGroup",
    "clearEffects",
    "actionBar",
    "title",
    "failParkour",
    "fullHeal",
    "xpLevel",
    "giveItem",
    "houseSpawn",
    "kill",
    "parkCheck",
    "sound",
    "removeItem",
    "resetInventory",
    "chat",
    "lobby",
    "compassTarget",
    "gamemode",
    "hungerLevel",
    "maxHealth",
    "tp",
    "function",
    "consumeItem",
    "enchant",
    "displayMenu",
    "closeMenu",
    "pause",
    "setTeam",
    "teamstat",
    "balanceTeam",
    "if",
    "goto"
];
const conditions = ["stat", "globalstat", "hasPotion", "doingParkour", "hasItem", "inRegion", "hasPermission", "hasGroup", "damageCause", "damageAmount", "blockType", "isSneaking", "gamemode", "placeholder", "hunger", "health", "maxHealth", "teamstat", "hasTeam", "isFlying", "fishingEnv", "isItem", "canPvp", "portal"];


function syntaxHighlight(line) {
    if (line.startsWith("//")) return "&2" + line;
    let ifmatch = line.match(/^if( *)?(and|or)?( *)?\((.*)\)( *)?{/);
    if (ifmatch) {
        let conditionLine = ifmatch[4].split(/,/);
        for (let i = 0; i < conditionLine.length; i++) {
            let conditioncheck = conditionLine[i];
            for (let j = 0; j < conditions.length; j++) {
                if (conditionLine == conditioncheck) conditionLine[i] = conditionLine[i].replace(new RegExp(`^( *)${conditions[j]}(.*)`), `$1&3${conditions[j]}&f$2`);
            }
        }
        line = `if${ifmatch[1]}${ifmatch[2]? ifmatch[2] : ""}${ifmatch[3]? ifmatch[3] : ""}(${conditionLine.join(",")})${ifmatch[5]? ifmatch[5] : ""}{`;
    }
    let saveline = line;
    keywords.forEach((keyword) => {
        if (line == saveline) line = line.replace(new RegExp(`^( *)${keyword}(.*)`), `$1&5${keyword}&f$2`);
    });
    return line;
}