import { request as axios } from "axios";

const housingEditor = 'https://api.housingeditor.com'

export default (actionId, filename) => {
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