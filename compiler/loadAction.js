import menus from '../actions/menus';
import { addOperation, isWorking } from '../gui/Queue';
import conditions from '../actions/conditions';
import convertSound from '../utils/convertSound';
import actionLimits from '../utils/actionLimits';

export function working() {
    return isWorking();
};

/**
 * Loads in and automatically imports action data
 * @param {*} script JSON Object containing action data to import
 * @param {*} deleteExisting Whether or not to have the macro delete existing items before ready
 */
export function loadAction(script, deleteExisting) {
    if (isWorking()) return false;
    let limits = actionLimits(script);
    if (typeof limits == "object") {
        ChatLib.chat(`&3[HTSL] &cScript exceeds &e${limits.actionType}&c action limit in &e${limits.context.type.toLowerCase()} ${limits.context.type.startsWith("DEFAULT") ? "&ccontext" : limits.context.name + " &ccontext"}`);
        return false;
    }
    for (let container in script) {
        if (script[container].context != "DEFAULT") {
            addOperation({ type: 'returnToEditActions' });
            addOperation({ type: 'closeGui' });
            switch (script[container].context) {
                case "FUNCTION":
                    addOperation({ type: 'chat', text: `/function edit ${script[container].contextTarget.name}`, func: "/function create " + script[container].contextTarget.name, command: true });
                    break;
                case "EVENT":
                    addOperation({ type: 'chat', text: `/eventactions`, command: true });
                    addOperation({ type: 'option', option: script[container].contextTarget.name });
                    break;
                case "COMMAND":
                    addOperation({ type: 'chat', text: `/customcommands edit ${script[container].contextTarget.name}`, func: "/customcommands create " + script[container].contextTarget.name, command: true });
                    break;
                case "NPC":
                    addOperation({ type: 'goto', name: script[container].contextTarget.name });
                    addOperation({ type: 'click', slot: 12 });
                    break;
                case "BUTTON":
                    addOperation({ type: 'goto', name: script[container].contextTarget.name });
                    break;
                case "PAD":
                    addOperation({ type: 'goto', name: script[container].contextTarget.name });
                    break;
                case "REGION":
                    addOperation({ type: 'chat', text: `/region edit ${script[container].contextTarget.name}`, command: true });
                    addOperation({ type: 'option', option: script[container].contextTarget.trigger });
                    break;
                case "GUI":
                case "CUSTOMMENU":
                    addOperation({ type: 'chat', text: `/custommenu edit ${script[container].contextTarget.name}`, command: true, func: "/custommenu create " + script[container].contextTarget.name });
                    addOperation({ type: 'click', slot: 15 });
                    addOperation({ type: 'click', slot: parseInt(script[container].contextTarget.trigger) });
            }
        }
        if (deleteExisting) {
            addOperation({ type: 'deleteActions' });
        }
        for (let i = 0; i < script[container].actions.length; i++) {
            addOperation({ type: 'click', slot: 50 }); // click "Add Action" Button
            addOperation({ type: 'setGuiContext', context: "Add Action" });
            addOperation({ type: 'option', option: menus[script[container].actions[i].type].action_name });
            importComponent(script[container].actions[i], menus[script[container].actions[i].type]);
            addOperation({ type: 'returnToEditActions' });
        }
    }
    addOperation({ type: 'done' });
}

/**
 * Importing an individual component given the action data and the menu format
 * @param {*} component JSON Object for an individual action/condition
 * @param {*} menu JSON Object determining the format of the action/condition GUI
 */
function importComponent(component, menu, condition) {
    // Go through every setting in the menu
    addOperation({ type: 'setGuiContext', context: component.type });
    if (condition) menu.inverted = {default_value: false, slot: 9, type: "toggle"};
    for (let key in component) {
        if (key === "type") continue;
        if (JSON.stringify(menu[key].default_value).toLowerCase() === JSON.stringify(component[key]).replace("_", " ").toLowerCase()) continue;
        if (menu[key].default_value === component[key]) continue;
        if (component[key] === undefined) continue;
        let setting = menu[key];
        let change = condition === true ? 1 : 0;
        if (["CHANGE_VARIABLE", "VARIABLE_REQUIREMENT"].includes(component.type) && component.team === undefined) {
            if (component.holder !== undefined && !["holder", "inverted"].includes(key)) {
                change -= 1;
            }
        }
        addOperation({ type: 'click', slot: setting.slot + change });
        switch (setting.type) {
            case "string_input":
                addOperation({ type: 'input', text: component[key] });
                break;
            case "conditions":
                for (let condition in component[key]) {
                    addOperation({ type: 'click', slot: 50 }); // click "Add Condition" Button
                    addOperation({ type: 'option', option: conditions[component[key][condition].type].condition_name });
                    importComponent(component[key][condition], conditions[component[key][condition].type], true);
                    addOperation({ type: 'returnToEditActions' });
                }
                addOperation({ type: 'back' });
                break;
            case "static_option_select":
                // Static option select is for Hypixel made options, which will be uppercase for the first character
                addOperation({ type: 'option', option: menu[key].options.find(n => n.toLowerCase() == component[key].replace("_", " ").toLowerCase()) });
                break;
            case "dynamic_option_select":
                addOperation({ type: 'option', option: component[key] });
                break;
            case "location":
                let location = component[key];
                if (location.type.toLowerCase().replace(/ +/g, "_") == "custom_coordinates") {
                    addOperation({ type: 'click', slot: 13 }); // Click "Custom Coordinates" Button
                    addOperation({ type: 'input', text: location.coords });    
                } else {
                    addOperation({ type: 'click', slot: 10 + ["house_spawn_location", "invokers_location", "current_location"].indexOf(location.type.toLowerCase().replace(/ +/g, "_"))})
                }
                break;
            case "subactions":
                for (let subaction in component[key]) {
                    addOperation({ type: 'click', slot: 50 }); // click "Add Action" Button
                    addOperation({ type: 'option', option: menus[component[key][subaction].type].action_name });
                    importComponent(component[key][subaction], menus[component[key][subaction].type]);
                    addOperation({ type: 'returnToEditActions' });
                }
                addOperation({ type: 'back' });
                break;
            case "item":
                addOperation({ type: 'item', item: component[key] });
                break;
            // Action exceptions that cannot fit under other options
            case "sound":
                addOperation({ type: 'click', slot: 48 }); // click "Custom Sound" Button
                addOperation({ type: 'input', text: convertSound(component[key]) });
                break;
            case "slot":
                if (/(\%.*\%)|(\d+)/.test(component[key])) {
                    addOperation({ type: 'click', slot: 8 }); // click "Manual Input" Button
                    addOperation({ type: 'input', text: component[key] });
                } else {
                    addOperation({ type: 'option', option: component[key] });
                }
                break;
            case "custom_time":
                addOperation({ type: 'click', slot: 48 }); // click "Custom Time"
                addOperation({ type: 'input', text: component[key] });
        }
    }

}