/**
 * Contains data on all actions and their menus.
 * @const
 */
export default {
    CHANGE_STAT: {
        action_name: "Change Player Stat",
        stat: {
            slot: 10,
            default_value: "Kills",
            type: "chat_input"
        },
        mode: {
            slot: 11,
            default_value: "INCREMENT",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        },
        amount: {
            slot: 12,
            default_value: 1,
            type: "anvil_input"
        }
    },
    CONDITIONAL: {
        action_name: "Conditional",
        conditions: {
            slot: 10,
            default_value: [],
            type: "conditions"
        },
        match_any_condition: {
            slot: 11,
            default_value: false,
            type: "toggle"
        },
        if_actions: {
            slot: 12,
            default_value: [],
            type: "subactions"
        },
        else_actions: {
            slot: 13,
            default_value: [],
            type: "subactions"
        }
    },
    SEND_MESSAGE: {
        action_name: "Send a Chat Message",
        message: {
            slot: 10,
            default_value: "Hello!",
            type: "chat_input"
        }
    },
    PLAY_SOUND: {
        action_name: "Play Sound",
        sound: {
            slot: 10,
            default_value: null,
            type: "sound"
        },
        volume: {
            slot: 11,
            default_value: 0.7,
            type: "anvil_input"
        },
        pitch: {
            slot: 12,
            default_value: 1,
            type: "anvil_input"
        },
        location: {
            slot: 13,
            default_value: null,
            type: "location"
        }
    },
    GIVE_ITEM: {
        action_name: "Give Item",
        item: {
            slot: 10,
            default_value: null,
            type: "item"
        },
        allow_multiple: {
            slot: 11,
            default_value: false,
            type: "toggle"
        },
        inventory_slot: {
            slot: 12,
            default_value: -1,
            type: "slot"
        },
        replace_existing_item: {
            slot: 13,
            default_value: false,
            type: "toggle"
        }
    },
    TITLE: {
        action_name: "Display Title",
        title: {
            slot: 10,
            default_value: "Hello World!",
            type: "chat_input"
        },
        subtitle: {
            slot: 11,
            default_value: "",
            type: "chat_input"
        },
        fade_in: {
            slot: 12,
            default_value: 1,
            type: "anvil_input"
        },
        stay: {
            slot: 13,
            default_value: 5,
            type: "anvil_input"
        },
        fade_out: {
            slot: 14,
            default_value: 1,
            type: "anvil_input"
        }
    },
    EXIT: {
        action_name: "Exit"
    },
    CHANGE_PLAYER_GROUP: {
        action_name: "Change Player's Group",
        group: {
            slot: 10,
            default_value: null,
            type: "dynamic_option_select"
        },
        demotion_protection: {
            slot: 10,
            default_value: true,
            type: "toggle"
        }
    },
    KILL: {
        action_name: "Kill Player"
    },
    FULL_HEAL: {
        action_name: "Full Heal"
    },
    SPAWN: {
        action_name: "Go to House Spawn"
    },
    ACTION_BAR: {
        action_name: "Display Action Bar",
        message: {
            slot: 10,
            default_value: "Hello World!",
            type: "chat_input"
        }
    },
    RESET_INVENTORY: {
        action_name: "Reset Inventory"
    },
    PARKOUR_CHECKPOINT: {
        action_name: "Parkour Checkpoint"
    },
    REMOVE_ITEM: {
        action_name: "Remove Item",
        item: {
            slot: 10,
            default_value: null,
            type: "item"
        }
    },
    POTION_EFFECT: {
        action_name: "Apply Potion Effect",
        effect: {
            slot: 10,
            default_value: null,
            type: "static_option_select",
            options: [
                "Speed",
                "Slowness",
                "Haste",
                "Mining Fatigue",
                "Strength",
                "Instant Health",
                "Instant Damage",
                "Jump Boost",
                "Nausea",
                "Regeneration",
                "Resistance",
                "Fire Resistance",
                "Water Breathing",
                "Invisibility",
                "Blindness",
                "Night Vision",
                "Hunger",
                "Weakness",
                "Poison",
                "Wither",
                "Health Boost",
                "Absorption"
            ]
        },
        duration: {
            slot: 11,
            default_value: 60,
            type: "anvil_input"
        },
        level: {
            slot: 12,
            default_value: 10,
            type: "anvil_input"
        },
        override_existing_effects: {
            slot: 13,
            default_value: false,
            type: "toggle"
        }
    },
    CLOSE_MENU: {
        action_name: "Close Menu"
    },
    DISPLAY_MENU: {
        action_name: "Display Menu",
        menu: {
            slot: 10,
            default_value: null,
            type: "dynamic_option_select"
        }
    },
    CHANGE_TEAM_STAT: {
        action_name: "Change Team Stat",
        stat: {
            slot: 10,
            default_value: "Kills",
            type: "chat_input"
        },
        mode: {
            slot: 11,
            default_value: "INCREMENT",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        },
        amount: {
            slot: 12,
            default_value: 1,
            type: "anvil_input"
        },
        team: {
            slot: 13,
            default_value: "None",
            type: "dynamic_option_select"
        }
    },
    SET_PLAYER_TEAM: {
        action_name: "Set Player Team",
        team: {
            slot: 10,
            default_value: "None",
            type: "dynamic_option_select"
        }
    },
    PAUSE: {
        action_name: "Pause Execution",
        ticks_to_wait: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        }
    },
    ENCHANT_HELD_ITEM: {
        action_name: "Enchant Held Item",
        enchantment: {
            slot: 10,
            default_value: null,
            type: "enchantment"
        },
        level: {
            slot: 11,
            default_value: 1,
            type: "anvil_input"
        }
    },
    APPLY_LAYOUT: {
        action_name: "Apply Inventory Layout",
        layout: {
            slot: 10,
            default_value: null,
            type: "dynamic_option_select"
        }
    },
    TRIGGER_FUNCTION: {
        action_name: "Trigger Function",
        function: {
            slot: 10,
            default_value: null,
            type: "dynamic_option_select"
        },
        trigger_for_all_players: {
            slot: 11,
            default_value: false,
            type: "toggle"
        }
    },
    USE_HELD_ITEM: {
        action_name: "Use/Remove Held Item"
    },
    RANDOM_ACTION: {
        action_name: "Random Action",
        actions: {
            slot: 10,
            default_value: [],
            type: "subactions"
        }
    },
    SET_GAMEMODE: {
        action_name: "Set Gamemode",
        gamemode: {
            slot: 10,
            default_value: null,
            type: "static_option_select",
            options: [
                "Adventure",
                "Survival",
                "Creative"
            ]
        }
    },
    SET_COMPASS_TARGET: {
        action_name: "Set Compass Target",
        location: {
            slot: 10,
            default_value: null,
            type: "location"
        }
    },
    BAIL_PARKOUR: {
        action_name: "Fail Parkour",
        reason: {
            slot: 10,
            default_value: "Failed!",
            type: "chat_input"
        }
    },
    FAIL_PARKOUR: {
        action_name: "Fail Parkour",
        reason: {
            slot: 10,
            default_value: "Failed!",
            type: "chat_input"
        }
    },
    TELEPORT_PLAYER: {
        action_name: "Teleport Player",
        location: {
            slot: 10,
            default_value: null,
            type: "location"
        }
    },
    CHANGE_GLOBAL_STAT: {
        action_name: "Change Global Stat",
        stat: {
            slot: 10,
            default_value: "Kills",
            type: "chat_input"
        },
        mode: {
            slot: 11,
            default_value: "INCREMENT",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        },
        amount: {
            slot: 12,
            default_value: 1,
            type: "anvil_input"
        }
    },
    SEND_TO_LOBBY: {
        action_name: "Send to Lobby",
        location: {
            slot: 10,
            default_value: null,
            type: "static_option_select",
            options: [
                "Main Lobby",
                "Tournament Hall",
                "Blitz SG",
                "The TNT Games",
                "Mega Walls",
                "Arcade Games",
                "Cops and Crims",
                "UHC Champions",
                "Warlords",
                "Smash Heroes",
                "Housing",
                "SkyWars",
                "Speed UHC",
                "Classic Games",
                "Prototype",
                "Bed Wars",
                "Murder Mystery",
                "Build Battle",
                "Duels",
                "Wool Wars"
            ]
        }
    },
    GIVE_EXP_LEVELS: {
        action_name: "Give Experience Levels",
        levels: {
            slot: 10,
            default_value: 1,
            type: "anvil_input"
        }
    },
    CLEAR_EFFECTS: {
        action_name: "Clear All Potion Effects"
    },
    SET_MAX_HEALTH: {
        action_name: "Change Max Health",
        max_health: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        },
        mode: {
            slot: 11,
            default_value: "SET",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        },
        heal_on_change: {
            slot: 12,
            default_value: true,
            type: "toggle"
        }
    },
    CHANGE_MAX_HEALTH: {
        action_name: "Change Max Health",
        max_health: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        },
        mode: {
            slot: 11,
            default_value: "SET",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        },
        heal_on_change: {
            slot: 12,
            default_value: true,
            type: "toggle"
        }
    },
    SET_HEALTH: {
        action_name: "Change Health",
        health: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        },
        mode: {
            slot: 11,
            default_value: "SET",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        }
    },
    CHANGE_HEALTH: {
        action_name: "Change Health",
        health: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        },
        mode: {
            slot: 11,
            default_value: "SET",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        }
    },
    SET_HUNGER_LEVEL: {
        action_name: "Change Hunger Level",
        hunger: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        },
        mode: {
            slot: 11,
            default_value: "SET",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        }
    },
    CHANGE_HUNGER_LEVEL: {
        action_name: "Change Hunger Level",
        hunger: {
            slot: 10,
            default_value: 20,
            type: "anvil_input"
        },
        mode: {
            slot: 11,
            default_value: "SET",
            type: "static_option_select",
            options: [
                "Increment",
                "Decrement",
                "Set",
                "Multiply",
                "Divide"
            ]
        }
    },
    BALANCE_PLAYER_TEAM: {
        action_name: "Balance Player Team"
    },
    CANCEL_EVENT: {
        action_name: "Cancel Event"
    },
    CONSUME_ITEM: {
        action_name: "Use/Remove Held Item"
    }
}