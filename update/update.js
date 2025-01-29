import { request as axios } from "axios";
import Settings from "../utils/config";

function versionCompare(myVersion, minimumVersion) {

    var v1 = myVersion.split("."), v2 = minimumVersion.split("."), minLength;

    minLength = Math.min(v1.length, v2.length);

    for (i = 0; i < minLength; i++) {
        if (Number(v1[i]) > Number(v2[i])) {
            return true;
        }
        if (Number(v1[i]) < Number(v2[i])) {
            return false;
        }
    }

    return (v1.length >= v2.length);
}

let load = register("worldLoad", () => {
    try {
        axios({
            url: "https://raw.githubusercontent.com/BusterBrown1218/HTSL/main/metadata.json",
            method: 'GET'
        }).then(response => {
            const latestVersion = response.data.version;
            const currentVersion = JSON.parse(FileLib.read("HTSL", "./metadata.json")).version;
            if (versionCompare(currentVersion, latestVersion)) {
                if (Settings.loadMessage) ChatLib.chat(`&3[HTSL] &fLoaded successfully!`);
                return;
            }
            ChatLib.chat(new Message(new TextComponent("&3[HTSL] &fNew HTSL version available!").setClick("open_url", "https://github.com/BusterBrown1218/HTSL/releases")));
    
        });
    } catch (error) {
        ChatLib.chat("&3[HTSL] &cError while checking version");
    }
    load.unregister();
});

function directoryExists(directoryPath) {
    let dir = new java.io.File(directoryPath);
    return dir.exists() && dir.isDirectory();
}

if (!directoryExists("./config/ChatTriggers/modules/HTSL/imports")) {
    FileLib.write("HTSL", "./imports/default.htsl", "if (!stat kills == 10) {\nchat \"&ahello!\"\n}\nif (stat kills == 10, hasItem \"Stone\" \"Metadata\" \"Cursor\" \"Any Amount\") {\nchat \"&bhellon't!\"\n}\nlaunchTarget \"custom_coordinates\" \"^ ^ ^5\" 10\ndropItem \"Stone\" \"invokers_location\" false true true false\npause 10\nchangeVelocity 3 5 3", true);FileLib.write("HTSL", "./imports/default.htsl", "if (!stat kills == 10) {\nchat \"&ahello!\"\n}\nif (stat kills == 10, hasItem \"Stone\" \"Metadata\" \"Cursor\" \"Any Amount\") {\nchat \"&bhellon't!\"\n}\nlaunchTarget \"custom_coordinates\" \"^ ^ ^5\" 10\ndropItem \"Stone\" \"invokers_location\" false true true false\npause 10\nchangeVelocity 3 5 3", true);
    FileLib.write("HTSL", "./imports/stone.json", "{\"item\": \"{id:\\\"minecraft:stone\\\",Count:1b,Damage:0s}\"}", true);
}