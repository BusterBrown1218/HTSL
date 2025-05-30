/**
 * 
 * @typedef {object} HTSLActionData
 * @type {object}
 * @property {string} type The Housing ID for the action.
 * @property {string} full The corresponding HTSL code for the arguments.
 *                      This field also supports <argument_name> after the command name for arguments.
 * 
 * 
 */
/**
 * Contains metadata corresponding to HTSL actions and their corresponding Housing actions
 * @type {{actions: object.<string, HTSLActionData>}}
 * @const
 */
export default {
    actions: {
        applyLayout: {
            type: "APPLY_LAYOUT",
            full: "applyLayout <layout>"
        },
        applyPotion: {
            type: "POTION_EFFECT",
            full: "applyPotion <effect> <duration> <level> <override_existing_effects> <show_potion_icon>"
        },
        balanceTeam: {
            type: "BALANCE_PLAYER_TEAM",
            full: "balanceTeam"
        },
        cancelEvent: {
            type: "CANCEL_EVENT",
            full: "cancelEvent"
        },
        globalstat: {
            type: "CHANGE_VARIABLE",
            full: "globalstat <variable> <mode> <value>",
            from: "globalstat"
        },
        globalvar: {
            type: "CHANGE_VARIABLE",
            full: "globalvar <variable> <mode> <value> <automatic_unset>",
            from: "globalvar"
        },
        changeHealth: {
            type: "SET_HEALTH",
            full: "changeHealth <mode> <health>"
        },
        hungerLevel: {
            type: "SET_HUNGER_LEVEL",
            full: "hungerLevel <mode> <level>"
        },
        maxHealth: {
            type: "SET_MAX_HEALTH",
            full: "maxHealth <mode> <max_health> <heal_on_change>"
        },
        changePlayerGroup: {
            type: "CHANGE_PLAYER_GROUP",
            full: "changePlayerGroup <group> <demotion_protection>"
        },
        changeGroup: {
            type: "CHANGE_PLAYER_GROUP",
            full: "changeGroup <group> <demotion_protection>"
        },
        stat: {
            type: "CHANGE_VARIABLE",
            full: "stat <variable> <mode> <value>",
            from: "stat"
        },
        var: {
            type: "CHANGE_VARIABLE",
            full: "var <variable> <mode> <value> <automatic_unset>",
            from: "var"
        },
        teamstat: {
            type: "CHANGE_VARIABLE",
            full: "teamstat <variable> <team> <mode> <value>",
            from: "teamstat"
        },
        teamvar: {
            type: "CHANGE_VARIABLE",
            full: "teamvar <variable> <team> <mode> <value> <automatic_unset>",
            from: "teamvar"
        },
        clearEffects: {
            type: "CLEAR_EFFECTS",
            full: "clearEffects"
        },
        closeMenu: {
            type: "CLOSE_MENU",
            full: "closeMenu"
        },
        actionBar: {
            type: "ACTION_BAR",
            full: "actionBar <message>"
        },
        displayMenu: {
            type: "DISPLAY_MENU",
            full: "displayMenu <menu>"
        },
        title: {
            type: "TITLE",
            full: "title <title> <subtitle> <fadein> <stay> <fadeout>"
        },
        enchant: {
            type: "ENCHANT_HELD_ITEM",
            full: "enchant <enchantment> <level>"
        },
        exit: {
            type: "EXIT",
            full: "exit"
        },
        failParkour: {
            type: "BAIL_PARKOUR",
            full: "failParkour <reason>"
        },
        fullHeal: {
            type: "FULL_HEAL",
            full: "fullHeal"
        },
        xpLevel: {
            type: "GIVE_EXP_LEVELS",
            full: "xpLevel <levels>"
        },
        giveItem: {
            type: "GIVE_ITEM",
            full: "giveItem <item> <allow_multiple> <inventory_slot> <replace_existing_item>"
        },
        houseSpawn: {
            type: "SPAWN",
            full: "houseSpawn"
        },
        kill: {
            type: "KILL",
            full: "kill"
        },
        parkCheck: {
            type: "PARKOUR_CHECKPOINT",
            full: "parkCheck"
        },
        pause: {
            type: "PAUSE",
            full: "pause <ticks_to_wait>"
        },
        sound: {
            type: "PLAY_SOUND",
            full: "sound <sound> <volume> <pitch> <location>"
        },
        removeItem: {
            type: "REMOVE_ITEM",
            full: "removeItem <item>"
        },
        resetInventory: {
            type: "RESET_INVENTORY",
            full: "resetInventory"
        },
        chat: {
            type: "SEND_MESSAGE",
            full: "chat <message>"
        },
        lobby: {
            type: "SEND_TO_LOBBY",
            full: "lobby <location>"
        },
        compassTarget: {
            type: "SET_COMPASS_TARGET",
            full: "compassTarget <location>"
        },
        gamemode: {
            type: "SET_GAMEMODE",
            full: "gamemode <gamemode>"
        },
        setTeam: {
            type: "SET_PLAYER_TEAM",
            full: "setTeam <team>"
        },
        tp: {
            type: "TELEPORT_PLAYER",
            full: "tp <location> <prevent_teleport_inside_blocks>"
        },
        function: {
            type: "TRIGGER_FUNCTION",
            full: "function <function> <trigger_for_all_players>"
        },
        consumeItem: {
            type: "USE_HELD_ITEM",
            full: "consumeItem"
        },
        dropItem: {
            type: "DROP_ITEM",
            full: "dropItem <item> <location> <drop_naturally> <disable_item_merging> <prioritize_player> <fallback_to_inventory>"
        },
        changeVelocity: {
            type: "CHANGE_VELOCITY",
            full: "changeVelocity <x_direction> <y_direction> <z_direction>"
        },
        launchTarget: {
            type: "LAUNCH_TO_TARGET",
            full: "launchTarget <target_location> <launch_strength>"
        },
        if: {
            type: "CONDITIONAL",
            full: "if <match_any_condition> (<conditions>) {\n<if_actions>\n} else {\n<else_actions>\n}"
        },
        random: {
            type: "RANDOM_ACTION",
            full: "random {\n<actions>\n}"
        },
        playerWeather: {
            type: "SET_PLAYER_WEATHER",
            full: "playerWeather <weather>"
        },
        playerTime: {
            type: "SET_PLAYER_TIME",
            full: "playerTime <time>"
        },
        displayNametag: {
            type: "TOGGLE_NAMETAG_DISPLAY",
            full: "displayNametag <display_nametag>"
        }
    },
    conditions: {
        blockType: {
            type: "BLOCK_TYPE",
            full: "blockType <item> <match_type_only>"
        },
        damageAmount: {
            type: "DAMAGE_AMOUNT",
            full: "damageAmount <comparator> <compare_value>"
        },
        damageCause: {
            type: "DAMAGE_CAUSE",
            full: "damageCause <cause>"
        },
        doingParkour: {
            type: "IN_PARKOUR",
            full: "doingParkour"
        },
        fishingEnv: {
            type: "FISHING_ENVIRONMENT",
            full: "fishingEnv <environment>"
        },
        globalstat: {
            type: "VARIABLE_REQUIREMENT",
            full: "globalstat <variable> <comparator> <compare_value>",
            from: "globalstat"
        },
        globalvar: {
            type: "VARIABLE_REQUIREMENT",
            full: "globalvar <variable> <comparator> <compare_value> <fallback_value>",
            from: "globalvar"
        },
        hasItem: {
            type: "HAS_ITEM",
            full: "hasItem <item> <what_to_check> <where_to_check> <required_amount>"
        },
        hasPotion: {
            type: "POTION_EFFECT",
            full: "hasPotion <effect>"
        },
        isItem: {
            type: "IS_ITEM",
            full: "isItem <item> <what_to_check> <where_to_check> <required_amount>"
        },
        isSneaking: {
            type: "SNEAKING",
            full: "isSneaking"
        },
        maxHealth: {
            type: "MAX_HEALTH",
            full: "maxHealth <comparator> <compare_value>"
        },
        placeholder: {
            type: "PLACEHOLDER_NUMBER",
            full: "placeholder <placeholder> <comparator> <compare_value>"
        },
        isFlying: {
            type: "FLYING",
            full: "isFlying"
        },
        health: {
            type: "HEALTH",
            full: "health <comparator> <compare_value>"
        },
        hunger: {
            type: "HUNGER_LEVEL",
            full: "hunger <comparator> <compare_value>"
        },
        stat: {
            type: "VARIABLE_REQUIREMENT",
            full: "stat <variable> <comparator> <compare_value>",
            from: "stat"
        },
        var: {
            type: "VARIABLE_REQUIREMENT",
            full: "var <variable> <comparator> <compare_value> <fallback_value>",
            from: "var"
        },
        portal: {
            type: "PORTAL_TYPE",
            full: "portal <portal_type>"
        },
        canPvp: {
            type: "PVP_ENABLED",
            full: "canPvp"
        },
        gamemode: {
            type: "GAMEMODE",
            full: "gamemode <required_gamemode>"
        },
        hasGroup: {
            type: "IN_GROUP",
            full: "hasGroup <required_group> <include_higher_groups>"
        },
        inGroup: {
            type: "IN_GROUP",
            full: "inGroup <required_group> <include_higher_groups>"
        },
        hasPermission: {
            type: "HAS_PERMISSION",
            full: "hasPermission <required_permission>"
        },
        hasTeam: {
            type: "IN_TEAM",
            full: "hasTeam <required_team>"
        },
        inTeam: {
            type: "IN_TEAM",
            full: "inTeam <required_team>"
        },
        teamstat: {
            type: "VARIABLE_REQUIREMENT",
            full: "teamstat <variable> <team> <comparator> <compare_value>",
            from: "teamstat"
        },
        teamvar: {
            type: "VARIABLE_REQUIREMENT",
            full: "teamstat <variable> <team> <comparator> <compare_value> <fallback_value>",
            from: "teamvar"
        },
        inRegion: {
            type: "IN_REGION",
            full: "inRegion <region>"
        }
    }
}