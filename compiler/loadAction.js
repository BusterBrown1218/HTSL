import { addOperation } from "../gui/Queue";
import Action from "../actions/Action";

export default (fileName) => {
	try {
	let importText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`);
	ChatLib.chat("&3[HTSL] &fCompiling . . .");
	let importActions = importText.split("\n");
	let actionList = [];
	let subaction = "";
	let subactions = [];
	let actionData;
	for (let i = 0; i < importActions.length; i++) {
		if (importActions[i].startsWith("    ")) {
			importActions[i] = importActions[i].substr(4);
		}
		let actionArgs = getArgs(importActions[i]);
		actionData = [];
		if (importActions[i].startsWith("//")) {};
		if (importActions[i].startsWith("stat")) {
			actionData = ["change_player_stat", {
				stat: actionArgs[1],
				mode: actionArgs[2],
				value: actionArgs[3]
			}];		
		}
		if (importActions[i].startsWith("applyLayout")) {
			actionData = ["apply_inventory_layout", {layout:actionArgs[1]}];
		}
		if (importActions[i].startsWith("applyPotion")) {
			let override;
			if (actionArgs[4] === "true") override = true;
			actionData = ["apply_potion_effect", {
				effect: actionArgs[1],
				duration: actionArgs[2],
				amplifier: actionArgs[3],
				overrideExistingEffects: override
			}];
		}
		if (importActions[i].startsWith("cancelEvent")) {
			actionData = ["cancel_event", {}];
		}
		if (importActions[i].startsWith("exit") && (subaction === "if" || subaction === "else")) {
			actionData = ["exit", {}];
		}
		if (importActions[i].startsWith("globalstat")) {
			actionData = ["change_global_stat", {
				stat: actionArgs[1],
				mode: actionArgs[2],
				value: actionArgs[3]
			}];
		}
		if (importActions[i].startsWith("changeHealth")) {
			actionData = ["change_health", {
				health: actionArgs[2],
				mode: actionArgs[1],
			}];
		}
		if (importActions[i].startsWith("changePlayerGroup")) {
			let override;
			if (actionArgs[2] === "true") override = true;
			actionData = ["change_player_group", {
				group: actionArgs[1],
				demotionProtection: override
			}];
		}
		if (importActions[i].startsWith("clearEffects")) {
			actionData = ["clear_all_potion_effects", {}];
		}
		if (importActions[i].startsWith("actionBar")) {
			actionData = ["display_action_bar", {
				message: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("title")) {
			actionData = ["display_title", {
				title: actionArgs[1],
				subtitle: actionArgs[2],
				fadeIn: actionArgs[3],
				stay: actionArgs[4],
				fadeOut: actionArgs[5]
			}];
		}
		if (importActions[i].startsWith("failParkour")) {
			actionData = ["fail_parkour", {
				reason: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("fullHeal")) {
			actionData = ["full_heal", {}];
		}
		if (importActions[i].startsWith("xpLevel")) {
			actionData["give_experience_levels", {
				levels: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("giveItem")) {
			actionData = ["give_item", {
			}];
		}
		if (importActions[i].startsWith("houseSpawn")) {
			actionData = ["go_to_house_spawn", {}];
		}
		if (importActions[i].startsWith("kill")) {
			actionData = ["kill_player", {}];
		}
		if (importActions[i].startsWith("parkCheck")) {
			actionData = ["parkour_checkpoint", {}];
		}
		if (importActions[i].startsWith("sound")) {
			actionData = ["play_sound", {
				sound: actionArgs[1],
				pitch: actionArgs[2]
			}];
		}
		if (importActions[i].startsWith("removeItem")) {
			actionData = ["remove_item", {}];
		}
		if (importActions[i].startsWith("resetInventory")) {
			actionData = ["reset_inventory", {}];
		}
		if (importActions[i].startsWith("chat")) {
			actionData = ["send_a_chat_message", {
				message: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("lobby")) {
			actionData = ["send_to_lobby", {
				lobby: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("compassTarget")) {
			actionData = ["set_compass_target", {
				location: actionArgs[1],
				coordinates: actionArgs[2]
			}];
		}
		if (importActions[i].startsWith("gamemode")) {
			actionData = ["set_gamemode", {
				gamemode: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("hungerLevel")) {
			actionData = ["set_hunger_level", {
				level: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("maxHeatlh")) {
			actionData = ["set_max_health", {
				health: actionArgs[1]
			}];
		}
		if (importActions[i].startsWith("tp")) {
			actionData = ["teleport_player", {
				location: actionArgs[1],
				coordinates: actionArgs[2]
			}];
		}
		if (importActions[i].startsWith("function")) {
			let override;
			if (actionArgs[2] === "true") override = true;
			actionData = ["trigger_function", {
				function: actionArgs[1],
				triggerForAllPlayers: override
			}];
		}
		if (importActions[i].startsWith("consumeItem")) {
			actionData = ["use_remove_held_item", {}];
		}
		if (importActions[i].startsWith("enchant")) {
			actionData = ["enchant_held_item", {
				enchantment: actionArgs[1],
				level: actionArgs[2]
			}];
		}
		if (importActions[i].startsWith("if") && (subaction !== "if" && subaction !== "else")) {
			subaction = "if";
			let conditions = conditionCompiler(importActions[i].substring(3, importActions[i].length - 3));
			let matchConditions = false;
			if (actionArgs[1] === "or") {
				matchConditions = true;
			}
			subactions = {
				conditions: conditions,
				matchAnyCondition: matchConditions,
				if: [],
				else: [],
			}
		}
		if (importActions[i].startsWith("}") && subaction === "else") {
			actionData = ["conditional", {
				conditions: subactions.conditions,
				matchAnyCondition: subactions.matchAnyCondition,
				if: subactions.if,
				else: subactions.else
			}];
			subactions = [];
			subaction = "";
		}
		if (importActions[i].startsWith("}") && subaction === "if" && !(importActions[i].startsWith("} else"))) {
			actionData = ["conditional", {
				conditions: subactions.conditions,
				matchAnyCondition: subactions.matchAnyCondition,
				if: subactions.if,
				else: subactions.else
			}];
			subactions = [];
			subaction = "";
		}
		if (importActions[i].startsWith("} else {") && subaction === "if") {
			subaction = "else";
		}
		if (importActions[i].startsWith("random {") && subaction === "") {
			subaction = "random";
			subactions = {
				actions: []
			}
		}
		if (importActions[i].startsWith("}") && subaction === "random") {
			actionData = ["random_action", {
				actions: subactions.actions
			}];
			subactions = [];
			subaction = "";
		}
		// Push the action data to the correct list
		if (actionData.length > 0) {
			if (subaction === "if") {
				subactions.if.push(actionData);
			} 
			if (subaction === "") {
				actionList.push(actionData);
			} 
			if (subaction === "else") {
				subactions.else.push(actionData);
			}
			if (subaction === "random") {
				subactions.actions.push(actionData);
			}
		}
	}

	loadResponse(actionList);
	} catch (error) {
		ChatLib.chat("&3[HTSL] &fFile not found!");
	}
}

function loadResponse(actionList) {
	
	for (let i = 0; i < actionList.length; i++) {
		let actionType = actionList[i][0];
		let actionData = actionList[i][1];
		let action = new Action(actionType, actionData);
		action.load();
	}
	
	addOperation(['done']);
}

function loadTestAction() {
	ChatLib.chat('Loading test action.');
	let change_player_stat = new Action('send_a_chat_message', { message: 'howdy' });
	change_player_stat.load();
	addOperation(['done', { actionName: 'Test Action', actionAuthor: 'Test Author' }]);
}

function getArgs(input) {
	let args = [];
  	let inQuotes = false;
  	let currentArg = '';
  	for (let i = 0; i < input.length; i++) {
    	if (input[i] === '\\' && (input[i + 1] === '"' || input[i + 1] === "'")) {
      	currentArg += input[i + 1];
      	i++;
    	} else if (input[i] === '"' || input[i] === "'") {
      		inQuotes = !inQuotes;
    	} else if (input[i] === ' ' && !inQuotes) {
      	args.push(currentArg);
      	currentArg = '';
    	} else {
      	currentArg += input[i];
    	}
  	}
  	if (currentArg) args.push(currentArg);
  	return args;
}

function conditionCompiler(arg) {
	let conditionList = [];
	if (arg.startsWith("or ")) {
		arg = arg.substring(3, arg.length);
	}
	if (arg.startsWith("and ")) {
		arg = arg.substring(4, arg.length);
	}
	if (arg.startsWith("(")) {
		arg = arg.substring(1, arg.length);
	}
	if (arg.endsWith(")")) {
		arg = arg.substring(0, arg.length - 1);
	}
	arg = arg.split(",");
	for (let i = 0; i < arg.length; i++) {
		let args = [];
		args = getArgs(arg[i]);
		if (arg[i].startsWith("stat")) {
			let mode = "";
			switch (args[2]) {
				case "=":
					mode = "equal_to"
					break;
				case "==":
					mode = "equal_to"
					break;
				case "<":
					mode = "less_than"
					break;
				case "<=":
					mode = "less_than_or_equal_to"
					break;
				case ">":
					mode = "greater_than"
					break;
				case "=>":
					mode = "greater_than_or_equal_to"
					break;
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
			}
			conditionList.push(["player_stat_requirement", {
				stat: args[1],
				comparator: mode,
				compareValue: args[3]
			}]);
		}
		if (arg[i].startsWith("globalstat")) {
			let mode = "";
			switch (args[2]) {
				case "=":
					mode = "equal_to"
					break;
				case "==":
					mode = "equal_to"
					break;
				case "<":
					mode = "less_than"
					break;
				case "<=":
					mode = "less_than_or_equal_to"
					break;
				case ">":
					mode = "greater_than"
					break;
				case "=>":
					mode = "greater_than_or_equal_to"
					break;
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
			}
			conditionList.push(["global_stat_requirement", {
				stat: args[1],
				comparator: mode,
				compareValue: args[3]
			}]);
		}
		if (arg[i].startsWith("hasPotion")) {
			conditionList.push(["has_potion_effect", {
				effect: args[1],
			}]);
		}
		if (arg[i].startsWith("doingParkour")) {
			conditionList.push(["doing_parkour", {}]);
		}
		if (arg[i].startsWith("hasItem")) {
			conditionList.push(["has_item", {}]);
		}
		if (arg[i].startsWith("inRegion")) {
			conditionList.push(["within_region", {
				region: args[1],
			}]);
		}
		if (arg[i].startsWith("hasPermission")) {
			conditionList.push(["required_permission", {
				permission: args[1],
			}]);
		}
		if (arg[i].startsWith("hasGroup")) {
			let includeHigher = false;
			if (args[1] === "true") {
				includeHigher = true;
			}
			conditionList.push(["required_group", {
				group: args[1],
				includeHigherGroups: includeHigher
			}]);
		}
		if (arg[i].startsWith("damageCause")) {
			conditionList.push(["damage_cause", {
				damageCause: args[1],
			}]);
		}
		if (arg[i].startsWith("blockType")) {
			conditionList.push(["block_type", {
				blockType: args[1],
			}]);
		}
		if (arg[i].startsWith("placeholder")) {
			let mode = "";
			switch (args[2]) {
				case "=":
					mode = "equal_to"
					break;
				case "==":
					mode = "equal_to"
					break;
				case "<":
					mode = "less_than"
					break;
				case "<=":
					mode = "less_than_or_equal_to"
					break;
				case ">":
					mode = "greater_than"
					break;
				case "=>":
					mode = "greater_than_or_equal_to"
					break;
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
			}
			conditionList.push(["placeholder_number_requirement", {
				placeholder: args[1],
				comparator: mode,
				compareValue: args[3]
			}]);
		}
		if (arg[i].startsWith("gamemode")) {
			conditionList.push(["required_gamemode", {
				gameMode: args[1].toLowerCase(),
			}]);
		}
		if (arg[i].startsWith("isSneaking")) {
			conditionList.push(["is_sneaking", {}])
		}
	}
	
	return conditionList;
}