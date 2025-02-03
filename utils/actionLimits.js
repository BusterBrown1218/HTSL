/**
 * An object containing the action limit for each type of action.
 * @const
 */
const limits = {
    "APPLY_LAYOUT": 5,
    "POTION_EFFECT": 22,
    "BALANCE_PLAYER_TEAM": 1,
    "CANCEL_EVENT": 1,
    "CHANGE_GLOBAL_STAT": 10,
    "CHANGE_PLAYER_GROUP": 1,
    "CHANGE_STAT": 10,
    "CHANGE_TEAM_STAT": 10,
    "CLEAR_EFFECTS": 5,
    "CLOSE_MENU": 1,
    "CONDITIONAL": 30,
    "ACTION_BAR": 5,
    "DISPLAY_MENU": 10,
    "TITLE": 5,
    "ENCHANT_HELD_ITEM": 23,
    "EXIT": 1,
    "BAIL_PARKOUR": 1,
    "FULL_HEAL": 5,
    "GIVE_EXP_LEVELS": 5,
    "GIVE_ITEM": 20,
    "SPAWN": 1,
    "KILL": 1,
    "PARKOUR_CHECKPOINT": 1,
    "PLAY_SOUND": 25,
    "PAUSE": 30,
    "RANDOM_ACTION": 5,
    "REMOVE_ITEM": 20,
    "RESET_INVENTORY": 1,
    "SEND_MESSAGE": 20,
    "SEND_TO_LOBBY": 1,
    "SET_COMPASS_TARGET": 5,
    "SET_GAMEMODE": 1,
    "SET_HUNGER_LEVEL": 5,
    "SET_MAX_HEALTH": 5,
    "SET_HEALTH": 5,
    "SET_PLAYER_TEAM": 1,
    "TELEPORT_PLAYER": 5,
    "TRIGGER_FUNCTION": 10,
    "USE_HELD_ITEM": 1
};

export default function checkLimits(obj) {
    for (let context in obj) {
        let result = checkContainer(obj[context].actions, { type: obj[context].context, name: obj[context].contextTarget.name });
        if (typeof result === "object") return result;
    }
    return true;
}

function checkContainer(obj, context) {
    let typeCounts = {};

    if (!obj) return true;

    for (let i = 0; i < obj.length; i++) {
        let type = obj[i].type;
        if (typeCounts[type]) {
            typeCounts[type]++;
        } else {
            typeCounts[type] = 1;
        }
        if (type === "CONDITIONAL") {
            let result = checkContainer(obj[i].if_actions, { type: context.type + ": CONDITIONAL" });
            if (typeof result !== "boolean") {
                return result;
            }
            result = checkContainer(obj[i].else_actions, { type: context.type + ": CONDITIONAL" });
            if (typeof result !== "boolean") {
                return result;
            }
        }
        if (type === "RANDOM_ACTION") {
            let result = checkContainer(obj[i].actions, { type: context.type + ": CONDITIONAL" });
            if (typeof result !== "boolean") {
                return result;
            }
        }
    }
    
    for (let type in typeCounts) {
        let count = typeCounts[type];
        if (limits[type] && count > limits[type]) {
            return { actionType: type, context };
        }
    }

    return true;
}