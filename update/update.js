import { request as axios } from "axios";

function versionCompare(myVersion, minimumVersion) {

    var v1 = myVersion.split("."), v2 = minimumVersion.split("."), minLength;   

    minLength= Math.min(v1.length, v2.length);

    for(i=0; i<minLength; i++) {
        if(Number(v1[i]) > Number(v2[i])) {
            return true;
        }
        if(Number(v1[i]) < Number(v2[i])) {
            return false;
        }           
    }

    return (v1.length >= v2.length);
}

let worldLoadMessage = false;

register("worldLoad", () => {
    if (worldLoadMessage) return;
    try {
        axios({
            url: "https://raw.githubusercontent.com/BusterBrown1218/HTSL/main/metadata.json",
            method: 'GET'
        }).then(response => {
            const latestVersion = response.data.version;
            const currentVersion = JSON.parse(FileLib.read("HTSL", "./metadata.json")).version;
            if (versionCompare(currentVersion, latestVersion)) {
                return ChatLib.chat(`&3[HTSL] &fLoaded successfully!`);
            }
            const update = new Message(
                new TextComponent("&3[HTSL] &fNew HTSL version available! Click this message to update!").setClick("suggest_command", "/htsl update")
            );
            ChatLib.chat(update);
            
        });
    } catch (error) {
        ChatLib.chat("&3[HTSL] &fError while checking version");
    }
    worldLoadMessage = true;
});

register("command", ...args => {
    let command;
    try	{
		command = args[0].toLowerCase();
	} catch(e) {
		command = 'help';
	}
    if (command === 'update') {
        
    }
}).setName("htsl");

export default () => {
    axios({
        url: `http://busterbrown1218.xyz/htsl/update/update/fileupdates.txt`,
        method: 'GET'
    }).then(newFileChanges => {
        let fileChanges = newFileChanges.data.split("/n").filter((str) => str !== '');
        let updateProgress = 0;
        fileChanges.forEach(fileChange => {
        if (fileChange === "metadata.json") {
            axios({
                url: `https://raw.githubusercontent.com/BusterBrown1218/HTSL/main/${fileChange}`,
                method: 'GET'
            }).then(newFile => {
                FileLib.write(`./config/ChatTriggers/modules/HTSL/${fileChange}`, JSON.stringify(newFile.data));
                ChatLib.chat(`&3[HTSL] &fUpdated ${fileChange}`);
                updateProgress = updateProgress + 1;
                if (updateProgress >= fileChanges.length) {
                    ChatLib.chat("&3[HTSL] &fFully updated successfully!");
                    ChatLib.chat("&3[HTSL] &fType \"/ct reload\" to use the new features or \"/htsl changelog\"!");
                }
            });
        } else {
            axios({
                url: `http://busterbrown1218.xyz/htsl/update/${fileChange}`,
                method: 'GET'
            }).then(newFile => {
                FileLib.write(`./config/ChatTriggers/modules/HTSL/${fileChange}`, newFile.data.split('/n').join('\n'));
                ChatLib.chat(`&3[HTSL] &fUpdated ${fileChange}`);
                updateProgress = updateProgress + 1;
                if (updateProgress >= fileChanges.length) {
                    ChatLib.chat("&3[HTSL] &fFully updated successfully!");
                    ChatLib.chat("&3[HTSL] &fType \"/ct reload\" to use the new features or \"/htsl changelog\"!");
                }
            });
        }
    });
    });
    
}