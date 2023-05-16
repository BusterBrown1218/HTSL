export function checkOccurences(arr) {
    // Define hardcoded limits for specific strings
    const limits = {
        "apply_inventory_layout": 1,
        "apply_potion_effect": 22,
        "change_global_stat": 5,
        "change_health": 1,
        "change_player_group": 1,
        "change_player_stat": 5,
        "clear_all_potion_effects": 1,
        "conditional": 15,
        "display_action_bar": 1,
        "display_title": 1,
        "enchant_held_item": 23,
        "fail_parkour": 1,
        "full_heal": 1,
        "give_experience_levels": 1,
        "give_item": 20,
        "go_to_house_spawn": 1,
        "kill_player": 1,
        "parkour_checkpoint": 1,
        "play_sound": 1,
        "random_action": 5,
        "remove_item": 20,
        "reset_inventory": 1,
        "send_a_chat_message": 5,
        "send_to_lobby": 1,
        "set_compass_target": 1,
        "set_gamemode": 1,
        "set_hunger_level": 1,
        "set_max_health": 1,
        "teleport_player": 1,
        "trigger_function": 10,
        "use_remove_held_item": 1
    };

    // Create an object to keep track of the occurrences of each string
    let occurrences = {};

    // Loop through the array of arrays
    for (let i = 0; i < arr.length; i++) {
        // Check the first element of each array
        let firstElement = arr[i][0];

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