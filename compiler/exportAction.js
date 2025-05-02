import { addOperation, forceOperation } from "../gui/Queue"
import { convertJSON } from "./convertAction";
import menus from "../actions/menus";
import conditions from "../actions/conditions";

let actionobjs;
let subactions;

/**
 * Exports action data to HTSL file
 * @param {string} fileName File name to which to write exported HTSL code
 */
export default (fileName) => {
    let items = Player.getContainer().getItems();
    items = items.splice(0, Player.getContainer().getSize() - 9 - 36);
    actionobjs = [];

    if (!processPage(items, actionobjs, menus, false)) return false;

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
 * @param {boolean} condition Indicate if the current page being processed contains conditions
 * @returns {boolean} Whether or not page processing will run successfully
 */
function processPage(items, actionList, menuList, condition) {
    forceOperation({
        type: "donePage", func: () => {
            if (Player.getContainer().getItems()[Player.getContainer().getSize() - 37]) if (ChatLib.removeFormatting(Player.getContainer().getItems()[Player.getContainer().getSize() - 37].getName()) == "Next Page") {
                let nextItems = Player.getContainer().getItems();
                nextItems = nextItems.splice(0, Player.getContainer().getSize() - 9 - 36);
                forceOperation({
                    type: "export", func: (subMenuItems) => {
                        processPage(subMenuItems, actionList, menuList, condition);
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
        if (Object.keys(menu).length > 1) {
            // operations forced to the front of the queue, so they need to be added backwards
            let lore = Object.values(items[i].getLore());
            let actionobj = { type: actionkey };
            let inAction = false;
            for (let line of lore) {
                if (line === "§5§o§7§oInverted" && condition && lore.indexOf(line) !== lore.length - 1) { // Condition is inverted
                    actionobj["inverted"] = true;
                    continue;
                }
                let match = line.match(/^§5§o§7([^:]*): ?§?f?(.*)?$/);
                if (!match) continue;
                let [property, value] = [match[1].toLowerCase().replaceAll(" ", "_"), match[2]?.replaceAll("§", "&")];
                if (property.endsWith("_name")) continue;
                if (value === "Not Set") {
                    actionobj[property] = null;
                    continue;
                }

                if (value?.length >= 30 && value?.endsWith("&7...")) { // Preview is truncated
                    if (!inAction) {
                        forceOperation({ type: "back" });
                        inAction = true;
                    }
                    forceOperation({
                        type: "export", func: (settingItems) => {
                            let itemLore = Object.values(settingItems[menu[property].slot].getLore());
                            let currentValueIndex = itemLore.indexOf("§5§o§7Current Value:");
                            let currentValue = itemLore.splice(currentValueIndex + 1, itemLore.lastIndexOf("§5§o") - currentValueIndex - 1)
                                .map(n => n.substring(6).replaceAll("§", "&"))
                                .join(" ").substring(2);

                            if (menu[property].type === "location") {
                                if (currentValue === "House Spawn Location") actionobj[property] = "house_spawn";
                                else if (currentValue === "Invokers Location") actionobj[property] = "invokers_location";
                                else actionobj[property] = `"custom_coordinates" "${currentValue.replaceAll(/(?:,|yaw: |pitch: )/g, "")}"`;
                            } else actionobj[property] = currentValue 
                        }
                    });
                }

                switch (menu[property].type) {
                    case "conditions":
                    case "subactions":
                        if (lore[lore.indexOf(line) + 1] === "§5§o§7 - §cNone") { // Check if there are any conditions/subactions
                            actionobj[property] = [];
                            break;
                        }
                        if (!inAction) {
                            forceOperation({ type: "back" });
                            inAction = true;
                        }
                        forceOperation({
                            type: "doneSub", func: () => {
                                actionobj[property] = subactions;
                                subactions = [];
                            }
                        });
                        forceOperation({ type: "returnToActionSettings" });
                        forceOperation({
                            type: "export", func: (subMenuItems) => {
                                subactions = [];
                                processPage(subMenuItems, subactions, menu[property].type === "conditions" ? conditions : menus, menu[property].type === "conditions");
                            }
                        });
                        forceOperation({ type: "click", slot: menu[property].slot });
                        break;
                    case "toggle":
                        actionobj[property] = value === "&aEnabled";
                        break;
                    case "item":
                        actionobj[property] = null;
                        break;
                    case "location":
                        if (value === "House Spawn Location") actionobj[property] = "house_spawn";
                        else if (value === "Invokers Location") actionobj[property] = "invokers_location";
                        else actionobj[property] = `"custom_coordinates" "${value.replaceAll(/(?:,|yaw: |pitch: )/g, "")}"`;
                        break;
                    default:
                        actionobj[property] = value;
                        break;
                }
            }
            if (inAction) forceOperation({ type: "click", slot: i });
            forceOperation({
                type: "actionOrder", func: () => {
                    actionList.push(actionobj);
                }
            });
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