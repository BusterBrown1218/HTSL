export function checkOccurences(arr) {
    // Define hardcoded limits for specific strings
    const limits = {
        "apply_inventory_layout": 5,
        "apply_potion_effect": 22,
        "balance_player_team": 1,
        "change_global_stat": 10,
        "change_health": 5,
        "change_player_group": 1,
        "change_player_stat": 10,
        "change_team_stat": 10,
        "clear_all_potion_effects": 5,
        "close_menu": 1,
        "conditional": 15,
        "display_action_bar": 5,
        "display_menu": 10,
        "display_title": 5,
        "enchant_held_item": 23,
        "fail_parkour": 1,
        "full_heal": 5,
        "give_experience_levels": 5,
        "give_item": 20,
        "go_to_house_spawn": 1,
        "kill_player": 1,
        "parkour_checkpoint": 1,
        "play_sound": 25,
        "pause_exececution": 30,
        "random_action": 5,
        "remove_item": 20,
        "reset_inventory": 1,
        "send_a_chat_message": 20,
        "send_to_lobby": 1,
        "set_compass_target": 5,
        "set_gamemode": 1,
        "set_hunger_level": 5,
        "set_max_health": 5,
        "set_player_team": 1,
        "teleport_player": 5,
        "trigger_function": 10,
        "use_remove_held_item": 1
    };

    // Create an object to keep track of the occurrences of each string
    let occurrences = {};

    // Loop through the array of arrays
    for (let i = 0; i < arr.length; i++) {
        // Check the first element of each array
        let firstElement = arr[i][0];

        if (firstElement == "goto") occurrences = {};

        // Check if the first element is a string and if it has a hardcoded limit
        if (typeof firstElement === 'string' && limits.hasOwnProperty(firstElement)) {
            // Increment the occurrences of the string
            occurrences[firstElement] = (occurrences[firstElement] || 0) + 1;

            // Check if the number of occurrences goes over the hardcoded limit
            if (occurrences[firstElement] > limits[firstElement]) {
                return firstElement;
            }
        }
    }
    return false;
}