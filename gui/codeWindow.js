const gui = new Gui();
let guiText;
let cursorLine = 0;
let cursorBlink = 0;
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
            if (guiText[i].startsWith("//")) {
                Renderer.drawString(`&7${i + 1}| &2${guiText[i]}`,Renderer.screen.getWidth() / 4 + 7, Renderer.screen.getHeight() / 4 + (i - startIndex) * 10 + 7, true);
            } else {
                Renderer.drawString(`&7${i + 1}| &f${guiText[i]}`, Renderer.screen.getWidth() / 4 + 7, Renderer.screen.getHeight() / 4 + (i - startIndex) * 10 + 7, true);
            }
        }
    }
    if (cursorBlink < 100) {
        cursorBlink = cursorBlink + 1;
    } else {
        cursorBlink = 0;
    }
    if (cursorBlink >= 50.0 && cursorBlink < 100.0) {
        Renderer.drawRect(Renderer.color(200, 200, 200, 200), Renderer.screen.getWidth() / 4 * 3 - 14, Renderer.screen.getHeight() / 4 + (cursorLine) * 10 + 7, 5, 10);
    }
}

function guiTextRegister(typedChar, keyCode) {
    if (keyCode === 28.0) {
        guiText.splice(cursorLine + startIndex + 1, 0, "");
        if (startIndex + lineLimit < guiText.length && cursorLine + 1 === lineLimit) {
            startIndex = startIndex + 1;
        } else if (cursorLine + 1 !== lineLimit) {
            cursorLine = cursorLine + 1;
        }
        return;
    }
    if (keyCode === 14.0) {
        if (guiText[cursorLine + startIndex].length <= 0 && guiText.length > 1) {   
            if (startIndex > 0) {
                startIndex = startIndex - 1;
            } else if (cursorLine < lineLimit && cursorLine > 0) {
                cursorLine = cursorLine - 1;
            }
            return guiText.splice(cursorLine + startIndex + 1, 1);
        }
        if (guiText[cursorLine + startIndex].length <= 0) {
            return;
        }
        guiText[cursorLine + startIndex] = guiText[cursorLine + startIndex].substring(0, guiText[cursorLine + startIndex].length - 1);
        return;
    }
    if (keyCode === 1.0) {
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${fileNameSave}.txt`, guiText.join("\n"));
        ChatLib.chat(`&3[HTSL] &fSaved text to ${fileNameSave}.txt`);
        return;
    }
    if ([42, 203, 205, 29, 54, 157, 184, 56, 219, 15, 58, 211, 207, 209, 201, 199, 210, 197, 70, 183, 88, 87, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59].includes(keyCode)) return;
    if (keyCode === 200) {
        if (cursorLine > 0){
            cursorLine = cursorLine - 1;
        } else if (startIndex > 0) {
            startIndex = startIndex - 1;
        }
        return;
    }
    if (keyCode === 208) {
        if (cursorLine + 1 < lineLimit && cursorLine + startIndex + 1 < guiText.length){
            cursorLine = cursorLine + 1;
        } else if (cursorLine + startIndex + 1 < guiText.length) {
            startIndex = startIndex + 1;
        }
        return;
    }
    guiText[cursorLine + startIndex] = guiText[cursorLine + startIndex] + typedChar;
}

export default (fileName) => {
    if (!fileName) fileName = "default";
    if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`)) {
        ChatLib.chat(`&3[HTSL] &fCreated new file "${fileName}.txt"`);
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`, "");
    } else {
        ChatLib.chat(`&3[HTSL] &fLoading ${fileName}.txt . . .`);
    }
    guiText = [];
    fileNameSave = fileName;
    try {
        guiText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`).split("\n");
        lineLimit = Math.floor((Renderer.screen.getHeight() - 7) / 20);
        if (guiText.length > lineLimit) {
            cursorLine = lineLimit - 1;
            startIndex = guiText.length - lineLimit;
        } else {
            cursorLine = guiText.length - 1;
        }
        return gui.open();
    } catch (error) {
        return ChatLib.chat(`&3[HTSL] &f${fileName}.txt can't be loaded! Please make sure this file exists!`);
    }
    
}