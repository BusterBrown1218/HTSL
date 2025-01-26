import { request as axios } from "axios";
import syntaxs from "../actions/syntax";
import menus from "../actions/menus";
import _conditions from "../actions/conditions";

const housingEditor = 'https://api.housingeditor.com'

/**
 * Converts a HousingEditor action to HTSL.
 * @param {string} actionId Housing Editor Action ID
 * @param {string} filename Filename to export to
 * @returns 
 */
export function convertHE (actionId, filename) {
    if (actionId === 'test') return loadTestAction();

    axios({
        url: `${housingEditor}/actions/${actionId}`,
        method: 'GET',
    }).then(response => {
        const json = response.data;
        FileLib.write(`./config/ChatTriggers/modules/HTSL/imports/${filename}.htsl`, convertData(json.actionData, json.post?.title, json.author?.name));
    }).catch(error => {
        if (!error.response) return ChatLib.chat('&cError: ' + error);
        const response = error.response;
        const contentType = response.headers['Content-Type'];
        if (contentType.indexOf('application/json') > -1) {
            const json = response.data;
            ChatLib.chat('&cError: ' + json.message);
        } else {
            ChatLib.chat('&cError: ' + response.statusText);
        };
    })
}

/**
 * Converts a JSON file to HTSL. 
 * @param {object} json Json object to transform
 * @returns {string} The new HTSL file.
 */
export function convertJSON (json) {
    let script = [];
    for (let context in json) {
        if (json[context].context == "DEFAULT") { 
        } else {
            script.push(`goto ${json[context].context.toLowerCase()} "${json[context].contextTarget.name}"`);
        }
        let actions = json[context].actions;
        for (let action in actions) {
            let syntax = Object.keys(syntaxs.actions).find(n => syntaxs.actions[n].type == actions[action].type);
            if (syntax) syntax = syntaxs.actions[syntax];
                else continue;
            let menu = menus[syntax.type];
            script.push(convertComponent(actions[action], syntax, menu));
        }
    }
    return script.join("\n");
}

/**
 * Converts a JSON component to an HTSL action.
 * @param {object} obj JSON object with the associated data of the action.
 * @param {object} syntax Syntax responsible for the action, obtained from {@link syntaxs}
 * @param {object} menu The menu context of the component, obtained from {@link menus}
 * @returns {string} The corresponding HTSL action.
 */
function convertComponent(obj, syntax, menu) {
    let properties = syntax.full.match(/<(.*?)>/g);
    let action = syntax.full;
    if (properties) properties.forEach((property) => {
        let propertyName = property.match(/<(.*)>/)[1];
        if (typeof obj[propertyName] == "string") obj[propertyName] = obj[propertyName].replace("$", "§");
        if (propertyName === "match_any_condition") {
            action = action.replace(property, obj[propertyName] ? "or" : "and");
        } else if (propertyName === "mode") {
            action = action.replace(property, reverseMode(obj[propertyName]));
        } else if (menu[propertyName].type == "subactions") {
            let actions = obj[propertyName];
            let subactions = [];
            for (let action in actions) {
                let syntax = Object.keys(syntaxs.actions).find(n => syntaxs.actions[n].type == actions[action].type);
                if (syntax) syntax = syntaxs.actions[syntax];
                    else continue;
                let submenu = menus[syntax.type];
                subactions.push(convertComponent(actions[action], syntax, submenu));
            }
            action = action.replace(property, subactions.join("\n"));
        } else if (menu[propertyName].type == "conditions") {
            let conditions = obj[propertyName];
            let conditionList = [];
            for (let condition in conditions) {
                let syntax = Object.keys(syntaxs.conditions).find(n => syntaxs.conditions[n].type == conditions[condition].type);
                if (syntax) syntax = syntaxs.conditions[syntax];
                    else continue;
                let submenu = _conditions[syntax.type];
                conditionList.push(convertComponent(conditions[condition], syntax, submenu));
            }
            action = action.replace(property, conditionList.join(", "));
        } else if (menu[propertyName].type == "location") {
            if (typeof obj[propertyName] == "string") {
                action = action.replace(property, obj[propertyName].includes(" ") ? `"${obj[propertyName]}"` : obj[propertyName]);
                return;
            }
            let location = obj[propertyName];
            action = action.replace(property, `custom_coordinates "${location.relX == 0 ? "" : "~"}${location.x} ${location.relY == 0 ? "" : "~"}${location.y} ${location.relZ == 0 ? "" : "~"}${location.z}${location.yaw == 0 ? "" : " " + location.yaw}${location.pitch == 0 || location.pitch == 0 ? "" : " " + location.pitch}"`);
        } else if (obj[propertyName] != null) action = action.replace(property, String(obj[propertyName]).includes(" ") ? `"${obj[propertyName]}"` : obj[propertyName]).replace("§", "$");
        else action = action.replace(property, "null");
    });
    return action;
}

/**
 * Changes text operators and comparators into script-like strings
 * @param {string} mode String representation of an operator or comparator
 * @returns {string} Operator put into simpler characters (ex. Equal -> ==)
 */
function reverseMode(mode) {
    switch (mode) {
        case "Equal":
            return "==";
        case "Less Than":
            return "<";
        case "Less Than or Equal":
            return "<=";
        case "Greater Than":
            return ">";
        case "Greater Than or Equal":
            return ">=";
        case "Increment":
            return "+=";
        case "Decrement":
            return "-=";
        case "Set":
            return "=";
        case "Multiply":
            return "*=";
        case "Divide":
            return "/=";
        default:
            return mode;
    }
}

/**
 * Old housing editor code for conversion to HTSL.
 * @param {[string, object][]} actionList A list of actions to convert
 * @param {string} title Title of the action 
 * @param {string} author Author of the action.
 * @returns HTSL script
 */
function convertData(actionList, title, author) {
    let script = [];
    script.push(`// Original action "${title}" by ${author}`);

    for (let i = 0; i < actionList.length; i++) {
        if (actionList[i] && actionList[i].length > 0) {
            let actionType = actionList[i][0];
            let actionData = actionList[i][1];
            script.push(readActions(actionType, actionData));
        }
    }

    script = script.join('\n');
    return script;
}

/**
 * Converts an individual JSON action to HTSL.
 * @param {string} actionType Type of the action
 * @param {object} actionData Data associated with the action 
 * @returns {string} The new line
 */
function readActions(actionType, actionData) {
    let line;
    switch (actionType) {
        case "apply_inventory_layout": line = `applyLayout "${actionData.layout}"`;
            break;
        case "apply_potion_effect": line = `applyPotion "${actionData.effect}" "${actionData.duration}" "${actionData.amplifier}" "${actionData.overrideExistingEffects}"`;
            break;
        case "cancel_event": line = `cancelEvent`;
            break;
        case "change_global_stat": line = `globalstat "${actionData.stat}" "${actionData.mode}" "${actionData.value}"`;
            break;
        case "change_team_stat": line = `teamstat ${actionData.stat} ${actionData.team} ${actionData.mode} "${actionData.value}"`;
            break;
        case "pause_execution": line = `pause ${actionData.ticks}`;
            break;

        case "change_health": line = `changeHealth "${actionData.mode}" "${actionData.health}"`;
            break;
        case "change_max_health": line = `maxHealth "${actionData.mode}" "${actionData.health}" ${actionData.healOnChange}`;
            break;
        case "change_player_group": line = `changePlayerGroup "${actionData.group}" ${actionData.promotionProtection}`;
            break;
        case "change_player_stat": line = `stat "${actionData.stat}" "${actionData.mode}" "${actionData.value}"`;
            break;
        case "clear_all_potion_effects": line`clearEffects`;
            break;
        case "conditional": {
            let conditions = [];
            if (actionData.conditions) {
                actionData.conditions.forEach(condition => {
                    conditions.push(readConditions(condition));
                });
            }
            let sublines = [];
            if (actionData.matchAnyCondition) {
                sublines = [`if or (${conditions.join(', ')}) {`];
            } else {
                sublines = [`if and (${conditions.join(', ')}) {`];
            }
            if (actionData.if) {
                actionData.if.forEach(action => {
                    sublines.push(readActions(action[0], action[1]));
                });
            }
            if (actionData.else.length > 0) {
                sublines.push('} else {')
                for (let i = 0; i < actionData.else.length; i++) {
                    sublines.push(readActions(actionData.else[i][0], actionData.else[i][1]));
                }
            }
            sublines.push('}');
            line = sublines.join('\n');
        }
            break;
        case "display_action_bar": line = `actionBar "${actionData.message}"`;
            break;
        case "display_title": line = `title "${actionData.title}" "${actionData.subtitle}" "${actionData.fadeIn}" "${actionData.stay}" "${actionData.fadeOut}"`;
            break;
        case "enchant_held_item": line = `enchant "${actionData.enchantment}" ${actionData.level}`;
            break;
        case "exit": line = `exit`;
            break;
        case "fail_parkour": line = `failParkour "${actionData.reason}"`;
            break;
        case "set_player_team": line = `setTeam "${actionData.team}"`;
        break;
        case "full_heal": line = `fullHeal`;
            break;
        case "give_experience_levels": line = `xpLevel "${actionData.levels}"`;
            break;
        case "give_item": line = `giveItem`;
            break;
        case "go_to_house_spawn": line = `houseSpawn`;
            break;
        case "kill_player": line = `kill`;
            break;
        case "parkour_checkpoint": line = `parkCheck`;
            break;
        case "play_sound": line = `sound "${actionData.sound}" "${actionData.volume}" "${actionData.pitch}" ${actionData.location}`;
            break;
        case "random_action": {
            let sublines = ['random {'];
            if (actionData.actions) {
                for (let i = 0; i < actionData.actions.length; i++) {
                    sublines.push(readActions(actionData.actions[i][0], actionData.actions[i][1]));
                }
            }
            sublines.push('}');
            line = sublines.join('\n');
        }
            break;
        case "remove_item": line = `removeItem`;
            break;
        case "reset_inventory": line = `resetInventory`;
            break;
        case "send_a_chat_message": line = `chat "${actionData.message}"`;
            break;
        case "send_to_lobby": line = `lobby "${actionData.lobby}"`;
            break;
        case "set_compass_target": line = `compassTarget "${actionData.location}" "${actionData.coordinates}"`;
            break;
        case "set_gamemode": line = `gamemode "${actionData.gamemode}"`;
            break;
        case "change_hunger_level": line = `hungerLevel ${actionData.mode} "${actionData.level}"`;
            break;
        case "set_max_health": line = `maxHealth "${actionData.health}"`;
            break;
        case "teleport_player": line = `tp "${actionData.location}" "${actionData.coordinates}"`;
            break;
        case "trigger_function": line = `function "${actionData.function}" ${actionData.triggerForAllPlayers}`;
            break;
        case "use_remove_held_item": line = `consumeItem`;
            break;
        case "close_menu": line = `closeMenu`;
            break;
        case "display_menu": line = `displayMenu "${actionData.menu}"`;
            break;
            case "balance_player_team": line = `balanceTeam`;
            break;
    }

    return line;
}

/**
 * Converts a JSON action conditional to HTSL.
 * @param {[string, object]} condition A list with two parts; 
 *                                     the string represents the type, 
 *                                     the object represents the associated data.
 * @returns {string} The action in HTSL form.
 */
function readConditions(condition) {
    const [conditionType, conditionData] = condition;
    switch (conditionType) {
        case "has_potion_effect": condition = `hasPotion "${conditionData.effect}"`;
            break;
        case "fishing_environment": condition = `fishingEnv "${conditionData.environment}"`;
            break;
        case "doing_parkour": condition = `doingParkour`;
            break;
        case "has_item": condition = `hasItem`;
            break;
        case "is_item": condition = `isItem`;
            break;
        case "within_region": condition = `inRegion "${conditionData.region}"`;
            break;
        case "required_permission": condition = `hasPermission "${conditionData.permission}"`;
            break;
        case "required_team": condition = `hasTeam "${conditionData.team}"`;
            break;
        case "player_stat_requirement": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `stat ${conditionData.stat} ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "placeholder_number_requirement": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `placeholder ${conditionData.placeholder} ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "team_stat_requirement": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `teamstat ${conditionData.stat} ${conditionData.team} ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "global_stat_requirement": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `globalstat "${conditionData.stat}" ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "damage_amount": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `damageAmount ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "player_health": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `health ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "player_max_health": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `maxHealth ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "player_hunger": {
            switch (conditionData.comparator) {
                case "equal_to": conditionData.comparator = "==";
                case "less_than": conditionData.comparator = "<";
                case "less_than_or_equal_to": conditionData.comparator = "<=";
                case "greater_than": conditionData.comparator = ">";
                case "greater_than_or_equal_to": conditionData.comparator = "=>";
            }
            condition = `hunger ${conditionData.comparator} "${conditionData.compareValue}"`;
        }
            break;
        case "required_group": condition = `hasGroup "${conditionData.group}" ${conditionData.includeHigherGroups}`;
            break;
        case "player_flying": condition = `isFlying`;
            break;
        case "player_sneaking": condition = `isSneaking`;
            break;
        case "pvp_enabled": condition = `canPvp`;
            break;
        case "damage_cause": condition = `damageCause "${conditionData.damageCause}"`;
            break;
        case "portal_type": condition = `portal "${conditionData.portalType}"`;
            break;
        case "required_gamemode": condition = `gamemode "${conditionData.gamemode}"`;
            break;
        case "block_type": condition = `blockType`;
            break;
        default: condition = "";
    }

    return condition;
}