
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
    "CONDITIONAL": 15,
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
    let counts = {};

    // Recursive function to count action types
    function countActions(actions, context, parentActionType) {
        if (actions) actions.forEach(action => {
            if (action.type) {
                counts[`${context.type}_${context.name}`] = counts[context.type] || {};
                counts[`${context.type}_${context.name}`][action.type] = (counts[`${context.type}_${context.name}`][action.type] || 0) + 1;
                if (counts[`${context.type}_${context.name}`][action.type] > limits[action.type]) {
                    throw { context: context, actionType: action.type };
                }
            }
            ['if_actions', 'else_actions', 'actions'].forEach(subAction => {
                if (action[subAction]) {
                    let subContext = { type: action.type, name: subAction };
                    let subObj = action[subAction].map(a => ({ context: subContext.name, contextTarget: { name: subContext.type }, actions: [a] }));
                    let result = checkLimits(subObj);
                    if (result !== true) {
                        throw result;
                    }
                }
            });
        });
    }

    try {
        if (obj) obj.forEach(item => {
            countActions(item.actions, { type: item.context, name: item.contextTarget.name || 'default' });
        });
    } catch (e) {
        return e;
    }

    return true;
}