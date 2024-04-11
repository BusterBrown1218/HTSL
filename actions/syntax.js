export default {
    actions: {
        applyLayout: {
            type: "APPLY_LAYOUT",
            full: "applyLayout <layout>"
        },
        applyPotion: {
            type: "POTION_EFFECT",
            full: "applyPotion <effect> <duration> <level> <override_existing_effects>"
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
            type: "CHANGE_GLOBAL_STAT",
            full: "globalstat <stat> <mode> <amount>"
        },
        changeHealth: {
            type: "CHANGE_HEALTH",
            full: "changeHealth <mode> <health> <heal_on_change>"
        },
        hungerLevel: {
            type: "SET_HUNGER_LEVEL",
            full: "hungerLevel <mode> <hunger>"
        },
        maxHealth: {
            type: "SET_MAX_HEALTH",
            full: "maxHealth <mode> <max_health> <heal_on_change>"
        },
        changePlayerGroup: {
            type: "CHANGE_PLAYER_GROUP",
            full: "changePlayerGroup <group> <demotion_protection>"
        },
        stat: {
            type: "CHANGE_STAT",
            full: "stat <stat> <mode> <amount>"
        },
        teamstat: {
            type: "CHANGE_TEAM_STAT",
            full: "teamstat <stat> <team> <mode> <amount>"
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
            full: "title <title> <subtitle> <fade_in> <stay> <fade_out>"
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
            full: "tp <location>"
        },
        function: {
            type: "TRIGGER_FUNCTION",
            full: "function <function> <trigger_for_all_players>"
        },
        consumeItem: {
            type: "USE_HELD_ITEM",
            full: "consumeItem"
        },
        if: {
            type: "CONDITIONAL",
            full: "if <match_any_condition> (<conditions>) {\n<if_actions>\n} else {\n<else_actions>\n}"
        },
        random: {
            type: "RANDOM_ACTION",
            full: "random {\n<actions>\n}"
        }
    },
    conditions: {
        blockType: {
            type: "BLOCK_TYPE",
            full: "blockType <item> <match_type_only>"
        },
        damageAmount: {
            type: "DAMAGE_AMOUNT",
            full: "damageAmount <mode> <amount>"
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
            type: "GLOBAL_STAT",
            full: "globalstat <stat> <mode> <amount>"
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
            full: "maxHealth <mode> <amount>"
        },
        placeholder: {
            type: "PLACEHOLDER_NUMBER",
            full: "placeholder <placeholder> <mode> <amount>"
        },
        isFlying: {
            type: "FLYING",
            full: "isFlying"
        },
        health: {
            type: "HEALTH",
            full: "health <mode> <amount>"
        },
        hunger: {
            type: "HUNGER_LEVEL",
            full: "hunger <mode> <amount>"
        },
        stat: {
            type: "PLAYER_STAT",
            full: "stat <stat> <mode> <amount>"
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
        hasPermission: {
            type: "HAS_PERMISSION",
            full: "hasPermission <required_permission>"
        },
        hasTeam: {
            type: "IN_TEAM",
            full: "hasTeam <required_team>"
        },
        teamstat: {
            type: "TEAM_STAT",
            full: "teamstat <stat> <team> <mode> <amount>"
        },
        inRegion: {
            type: "IN_REGION",
            full: "inRegion <region>"
        }
    }
}