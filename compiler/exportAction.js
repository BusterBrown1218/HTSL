import { addOperation, forceOperation } from "../gui/Queue"
import { convertJSON } from "./convertAction";
import menus from "../actions/menus";
import conditions from "../actions/conditions";

let actionobjs;
let subactions;

/**
 * Function to collect data from an individual action
 * @param {*} menu JSON Object containing the format for the action's GUI
 * @param {[Item]} submenuItems Items currently in the GUI
 * @param {*} actionkey JSON Object containing the properties of the action data
 * @param {*} callback Callback function to indicate when the action is finished processing
 */
function processMenu(menu, submenuItems, actionkey, callback, condition) {
    let action = { type: actionkey };
    if (condition) menu.inverted = {default_value: false, slot: 9, type: "toggle"};
    forceOperation({
        type: "actionOrder", func: () => {
            callback(action);
        }
    });
    for (let j = 0; j < Object.keys(menu).length; j++) {
        let key = Object.keys(menu)[j];
        if (key == "action_name" || key == "condition_name") continue;
        switch (menu[key].type) {
            case "toggle":
                action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]) == "Enabled";
                if (["drop_naturally"].includes(key)) action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[7]) == "Enabled";
                if (["match_any_condition", "prioritize_player", "fallback_to_inventory", "show_potion_icon", "prevent_teleport_inside_blocks"].includes(key)) action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[6]) == "Enabled";
                if (["inverted", "disable_item_merging"].includes(key)) action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[5]) == "Enabled";
                break;
            case "location":
                if (action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]) == "Not Set") {
                    action[key] = '"~ ~ ~"';
                } else if (action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]) == "House Spawn Location") {
                    action[key] = "house_spawn_location";
                } else if (action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]) == "Invokers Location") {
                    action[key] = "invokers_location";
                } else {
                    action[key] = '"custom_coordinates" "' + ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]).replaceAll(",", "") + '"';
                }
                break;
            case "item":
                action[key] = null;
                break;
            case "conditions":
                if (ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]).match(/No Conditions/)) {
                    action[key] = null;
                } else {
                    forceOperation({
                        type: "doneSub", func: () => {
                            action[key] = subactions;
                            subactions = [];
                        }
                    });
                    forceOperation({ type: "back" });
                    forceOperation({
                        type: "export", func: (submenuItems) => {
                            subactions = [];
                            processPage(submenuItems, subactions, conditions, 0, true);
                        }
                    });
                    forceOperation({ type: "click", slot: menu[key].slot + (condition === true ? 1 : 0) });
                }
                break;
            case "subactions":
                if (ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[5]).match(/No Actions/)) {
                    action[key] = null;
                    forceOperation({
                        type: "doneSub", func: () => {
                            subactions = [];
                        }
                    });
                } else {
                    forceOperation({
                        type: "doneSub", func: () => {
                            action[key] = subactions;
                            subactions = [];
                        }
                    });
                    forceOperation({ type: "back" });
                    forceOperation({
                        type: "export", func: (submenuItems) => {
                            subactions = [];
                            processPage(submenuItems, subactions, menus, 0);
                        }
                    });
                    forceOperation({ type: "click", slot: menu[key].slot });
                }
                break;
            case "string_input":
                action[key] = submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3].substring(6);
                if (["ticks_to_wait"].includes(key)) action[key] = submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[5].substring(6);
                if (action[key] == "Not Set") action[key] = null;
                break;
            default:
                action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot + (condition === true ? 1 : 0)].getLore()[3]);
                if (action[key] == "Not Set") action[key] = null;
                if (key == "ticks_to_wait") action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot].getLore()[5]);
                if (key == "team" && Object.keys(menu).length > 2) action[key] = ChatLib.removeFormatting(submenuItems[menu[key].slot].getLore()[6]);
                break;
        }
    }
}

/**
 * Exports action data to HTSL file
 * @param {string} fileName File name to which to write exported HTSL code
 */
export default (fileName) => {
    let items = Player.getContainer().getItems();
    items = items.splice(0, Player.getContainer().getSize() - 9 - 36);
    actionobjs = [];

    if (!processPage(items, actionobjs, menus, 0)) return false;

    addOperation({
        type: "doneExport", func: () => {
            FileLib.write("HTSL", `imports/${fileName}.htsl`, convertJSON([{
                context: "DEFAULT",
                contextTarget: {},
                actions: actionobjs
            }]), true);
        }
    });
}

/**
 * Collects the data from an ingame page of actions
 * @param {[Item]} items List of items in the menu available 
 * @param {*} actionList JSON Object dictating the formatting of actions
 * @param {*} menuList JSON Object dictating the formatting of the ingame menu for each action
 * @param {Number} page Which page number is currently being exported, allows the macro to return to the page consistently
 * @returns {boolean} Whether or not page processing will run successfully
 */
function processPage(items, actionList, menuList, page, condition) {
    forceOperation({
        type: "donePage", func: () => {
            if (Player.getContainer().getItems()[Player.getContainer().getSize() - 37]) if (ChatLib.removeFormatting(Player.getContainer().getItems()[Player.getContainer().getSize() - 37].getName()) == "Next Page") {
                let nextItems = Player.getContainer().getItems();
                nextItems = nextItems.splice(0, Player.getContainer().getSize() - 9 - 36);
                forceOperation({
                    type: "export", func: (subMenuItems) => {
                        processPage(subMenuItems, actionList, menuList, page + 1, condition);
                    }
                });
                forceOperation({ type: "click", slot: Player.getContainer().getSize() - 37 });
            }
        }
    });

    for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i]) continue;
        let menu;
        let actionkey;
        for (let key in menuList) {
            if (menuList[key]?.condition_name == ChatLib.removeFormatting(items[i].getName())) {
                menu = menuList[key];
                actionkey = key;
                break;
            }
            if (menuList[key]?.action_name == ChatLib.removeFormatting(items[i].getName())) {
                menu = menuList[key];
                actionkey = key;
                break;
            }
        }
        if (ChatLib.removeFormatting(items[i].getName()) == "No Actions!") continue;
        if (!menu) return false;
        if (["Change Player's Group", "Set Gamemode"].includes(menu.action_name) && ChatLib.removeFormatting(items[i].getLore()[3]) == "You are not allowed to edit this action!") {
            forceOperation({
                type: "actionOrder", func: () => {
                    actionList.push({ type: actionkey });
                }
            })
            continue;
        }
        if (Object.keys(menu).length > 1) {
            // operations forced to the front of the queue, so they need to be added backwards

            // get back on the right page
            for (let j = 0; j < page; j++) {
                forceOperation({ type: "click", slot: Player.getContainer().getSize() - 37 })
            }

            forceOperation({ type: "back" });
            forceOperation({
                type: "export", func: (submenuItems) => {
                    processMenu(menu, submenuItems, actionkey, (action) => {
                        actionList.push(action);
                    }, condition);
                }
            });
            forceOperation({ type: "click", slot: i });
        } else {
            forceOperation({
                type: "actionOrder", func: () => {
                    actionList.push({ type: actionkey });
                }
            })
        }
    }
    return true;
}