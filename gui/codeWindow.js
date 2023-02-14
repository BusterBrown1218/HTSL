const gui = new Gui();
let guiText;
let cursorLine = 0;
let cursorBlink = 0;
let fileNameSave;

gui.registerDraw(guiRender)

gui.registerKeyTyped(guiTextRegister)

function guiRender(mouseX, mouseY, partialTicks) {
    Renderer.drawRect(Renderer.DARK_GRAY, Renderer.screen.getWidth() / 4, Renderer.screen.getHeight() / 4, Renderer.screen.getWidth() / 2, Renderer.screen.getHeight() / 2);
    let lineLimit = Math.floor((Renderer.screen.getHeight() - 7) / 20);
    let startIndex = 0;
    if (guiText.length > lineLimit) {
        startIndex = guiText.length - lineLimit;
    }
    for (let i = startIndex; i < guiText.length; i++) {
        Renderer.drawString(`&7${i + 1}| &f${guiText[i]}`, Renderer.screen.getWidth() / 4 + 7, Renderer.screen.getHeight() / 4 + (i - startIndex) * 10 + 7);
    }
    if (cursorBlink < 100) {
        cursorBlink = cursorBlink + 1;
    } else {
        cursorBlink = 0;
    }
    if (cursorBlink >= 50.0 && cursorBlink < 100.0) {
        Renderer.drawRect(Renderer.WHITE, Renderer.screen.getWidth() / 4 * 3 - 14, Renderer.screen.getHeight() / 4 + (cursorLine - startIndex) * 10 + 7, 5, 10);
    }
}

function guiTextRegister(typedChar, keyCode) {
    if (keyCode === 28.0) {
        cursorLine = cursorLine + 1;
        guiText.splice(cursorLine, 0, "");
        return;
    }
    if (keyCode === 14.0) {
        if (guiText[cursorLine].length <= 0 && guiText.length > 1) {
            cursorLine = cursorLine - 1;
            return guiText.splice(cursorLine + 1, 1);
        }
        if (guiText[cursorLine].length <= 0) {
            return;
        }
        guiText[cursorLine] = guiText[cursorLine].substring(0, guiText[cursorLine].length - 1);
        return;
    }
    if (keyCode === 1.0) {
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${fileNameSave}.txt`, guiText.join("\n"));
        ChatLib.chat(`Saved text to ${fileNameSave}.txt`);
        return;
    }
    if (keyCode === 42.0 || keyCode === 203.0 || keyCode === 205.0 || keyCode === 29) return;
    if (keyCode === 200) {
        if (cursorLine > 0){
            cursorLine = cursorLine - 1;
        }
        return;
    }
    if (keyCode === 208) {
        if (cursorLine < guiText.length - 1){
            cursorLine = cursorLine + 1;
        }
        return;
    }
    guiText[cursorLine] = guiText[cursorLine] + typedChar;
}

export default (fileName) => {
    if (!fileName) fileName = "default";
    if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`)) {
        ChatLib.chat(`Created new file "${fileName}.txt"`);
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`, "");
    } else {
        ChatLib.chat(`Loading ${fileName}.txt . . .`);
    }
    guiText = [];
    fileNameSave = fileName;
    try {
        guiText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`).split("\n");
        cursorLine = guiText.length - 1;
        return gui.open();
    } catch (error) {
        return ChatLib.chat(`${fileName}.txt can't be loaded! Please make sure this file exists!`);
    }
    
}