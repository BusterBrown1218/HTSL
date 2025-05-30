
/**
 * Type definition for Conditions
 * @typedef {object} ConditionalData
 * @property {number} slot The slot the option is in.
 * @property {any} default_value The default value for this conditional.
 * @property {string} type The type of conditional. This field can have these values:
 *                      - "dynamic_option_select" means that the slot opens a new menu with any potential possibilities.
 *                      - "toggle" means this slot is togglable between `true` or `false`.
 *                      - "static_option_select" means that the slot opens a new menu with a certain set of possibilities.
 *                        This has an "options" field which is a list of strings with option names.
 *                        @property {string[]} options List of options to be able to select from "static_option_select"
 *                      - "string_input" means the slot requires you to type something in chat/anvil to fill it out.
 */
/**
 * This file contains the data for every Housing conditional.
 * 
 * Each key is an instance of {@link ConditionalData}.
 * @const
 * @type {ConditionalData[]}
 */
export default {
    IN_GROUP: {
        condition_name: "Required Group",
        required_group: {
            slot: 10,
            default_value: null,
            type: "dynamic_option_select"
        },
        include_higher_groups: {
            slot: 11,
            default_value: false,
            type: "toggle"
        }
    },
    VARIABLE_REQUIREMENT: {
        condition_name: "Variable Requirement",
        holder: {
            slot: 10,
            default_value: "Player",
            type: "static_option_select",
            options: [
                "Player",
                "Global",
                "Team"
            ]
        },
        team: {
            slot: 11,
            default_value: "None",
            type: "dynamic_option_select"
        },
        variable: {
            slot: 12,
            default_value: "Kills",
            type: "string_input"
        },
        comparator: {
            slot: 13,
            default_value: "EQUAL",
            type: "static_option_select",
            options: [
                "Less Than",
                "Less Than or Equal",
                "Equal",
                "Greater Than or Equal",
                "Greater Than"
            ]
        },
        compare_value: {
            slot: 14,
            default_value: null,
            type: "string_input"
        },
        fallback_value: {
            slot: 15,
            default_value: null,
            type: "string_input"
        }
    },
    HAS_PERMISSION: {
        condition_name: "Required Permission",
        required_permission: {
            slot: 10,
            default_value: null,
            type: "static_option_select",
            options: [
                "Fly",
                "Wood Door",
                "Iron Door",
                "Wood Trap Door",
                "Iron Trap Door",
                "Fence Gate",
                "Button",
                "Lever",
                "Use Launch Pads",
                "/tp",
                "/tp Other Players",
                "Jukebox",
                "Kick",
                "Ban",
                "Mute",
                "Pet Spawning",
                "Build",
                "Offline Build",
                "Fluid",
                "Pro Tools",
                "Use Chests",
                "Use Ender Chests",
                "Item Editor",
                "Switch Game Mode",
                "Edit Stats",
                "Change Player Group",
                "Change Gamerules",
                "Housing Menu",
                "Team Chat Spy",
                "Edit Actions",
                "Edit Regions",
                "Edit Scoreboard",
                "Edit Event Actions",
                "Edit Commands",
                "Edit Functions",
                "Edit Inventory Layouts",
                "Edit Teams",
                "Edit Custom Menus",
                "Item: Mailbox",
                "Item: Egg Hunt",
                "Item: Teleport Pad",
                "Item: Launch Pad",
                "Item: Action Pad",
                "Item: Hologram",
                "Item: NPCs",
                "Item: Action Button",
                "Item: Leaderboard",
                "Item: Trash Can",
                "Item: Biome Stick"
            ]
        }
    },
    IN_REGION: {
        condition_name: "Within Region",
        region: {
            slot: 10,
            default_value: null,
            type: "dynamic_option_select"
        }
    },
    HAS_ITEM: {
        condition_name: "Has Item",
        item: {
            slot: 10,
            default_value: null,
            type: "item"
        },
        what_to_check: {
            slot: 11,
            default_value: "Metadata",
            type: "static_option_select",
            options: [
                "Item Type",
                "Metadata"
            ]
        },
        where_to_check: {
            slot: 12,
            default_value: "Anywhere",
            type: "static_option_select",
            options: [
                "Hand",
                "Armor",
                "Hotbar",
                "Inventory",
                "Cursor",
                "Crafting Grid",
                "Anywhere"
            ]
        },
        required_amount: {
            slot: 13,
            default_value: "Any Amount",
            type: "static_option_select",
            options: [
                "Any Amount",
                "Equal or Greater Amount"
            ]
        }
    },
    IN_PARKOUR: {
        condition_name: "Doing Parkour"
    },
    POTION_EFFECT: {
        condition_name: "Has Potion Effect",
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
                "Absorption",
            ]
        }
    },
    SNEAKING: {
        condition_name: "Player Sneaking"
    },
    FLYING: {
        condition_name: "Player Flying"
    },
    HEALTH: {
        condition_name: "Player Health",
        comparator: {
            slot: 10,
            default_value: "EQUAL",
            type: "static_option_select",
            options: [
                "Less Than",
                "Less Than or Equal",
                "Equal",
                "Greater Than or Equal",
                "Greater Than"
            ]
        },
        compare_value: {
            slot: 11,
            default_value: null,
            type: "string_input"
        }
    },
    MAX_HEALTH: {
        condition_name: "Max Player Health",
        comparator: {
            slot: 10,
            default_value: "EQUAL",
            type: "static_option_select",
            options: [
                "Less Than",
                "Less Than or Equal",
                "Equal",
                "Greater Than or Equal",
                "Greater Than"
            ]
        },
        compare_value: {
            slot: 11,
            default_value: null,
            type: "string_input"
        }
    },
    HUNGER_LEVEL: {
        condition_name: "Player Hunger",
        comparator: {
            slot: 10,
            default_value: "EQUAL",
            type: "static_option_select",
            options: [
                "Less Than",
                "Less Than or Equal",
                "Equal",
                "Greater Than or Equal",
                "Greater Than"
            ]
        },
        compare_value: {
            slot: 11,
            default_value: null,
            type: "string_input"
        }
    },
    GAMEMODE: {
        condition_name: "Required Gamemode",
        required_gamemode: {
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
    PLACEHOLDER_NUMBER: {
        condition_name: "Placeholder Number Requirement",
        placeholder: {
            slot: 10,
            default_value: null,
            type: "string_input"
        },
        comparator: {
            slot: 11,
            default_value: "EQUAL",
            type: "static_option_select",
            options: [
                "Less Than",
                "Less Than or Equal",
                "Equal",
                "Greater Than or Equal",
                "Greater Than"
            ]
        },
        compare_value: {
            slot: 12,
            default_value: null,
            type: "string_input"
        }
    },
    IN_TEAM: {
        condition_name: "Required Team",
        required_team: {
            slot: 10,
            default_value: "None",
            type: "dynamic_option_select"
        }
    },
    PVP_ENABLED: {
        condition_name: "Pvp Enabled"
    },
    FISHING_ENVIRONMENT: {
        condition_name: "Fishing Environment",
        environment: {
            slot: 10,
            default_value: null,
            type: "static_option_select",
            options: [
                "Water",
                "Lava"
            ]
        }
    },
    PORTAL_TYPE: {
        condition_name: "Portal Type",
        portal_type: {
            slot: 10,
            default_value: "End Portal",
            type: "static_option_select",
            options: [
                "Nether Portal",
                "End Portal"
            ]
        }
    },
    DAMAGE_CAUSE: {
        condition_name: "Damage Cause",
        cause: {
            slot: 10,
            default_value: null,
            type: "static_option_select",
            options: [
                "Entity Attack",
                "Projectile",
                "Suffocation",
                "Fall",
                "Lava",
                "Fire",
                "Fire Tick",
                "Drowning",
                "Starvation",
                "Poison",
                "Thorns"
            ]
        }
    },
    DAMAGE_AMOUNT: {
        condition_name: "Damage Amount",
        comparator: {
            slot: 10,
            default_value: "EQUAL",
            type: "static_option_select",
            options: [
                "Less Than",
                "Less Than or Equal",
                "Equal",
                "Greater Than or Equal",
                "Greater Than"
            ]
        }, 
        compare_value: {
            slot: 11,
            default_value: null,
            type: "string_input"
        } 
    },
    BLOCK_TYPE: {
        condition_name: "Block Type",
        item: {
            slot: 10,
            default_value: null,
            type: "item"
        },
        match_type_only: {
            slot: 11,
            default_value: false,
            type: "toggle"
        }
    },
    IS_ITEM: {
        condition_name: "Is Item",
        item: {
            slot: 10,
            default_value: null,
            type: "item"
        },
        what_to_check: {
            slot: 11,
            default_value: "Metadata",
            type: "static_option_select",
            options: [
                "Item Type",
                "Metadata"
            ]
        },
        where_to_check: {
            slot: 12,
            default_value: "Anywhere",
            type: "static_option_select",
            options: [
                "Hand",
                "Armor",
                "Hotbar",
                "Inventory",
                "Cursor",
                "Crafting Grid",
                "Anywhere"
            ]
        },
        required_amount: {
            slot: 13,
            default_value: "Any Amount",
            type: "static_option_select",
            options: [
                "Any Amount",
                "Equal or Greater Amount"
            ]
        }
    }
}