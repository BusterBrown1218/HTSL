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
		let action = actionArgs[0];
		actionData = [];
		let compileError;
		if (action === "//") {};
		if (action === "stat") {
			switch (actionArgs[2]) {
				case "inc":
				case "+=":
					actionArgs[2] = "increment";
					break;
				case "dec":
				case "-=":
					actionArgs[2] = "decrement";
					break;
				case "=":
					actionArgs[2] = "set";
					break;
				case "mult":
				case "*=":
					actionArgs[2] = "multiply";
					break;
				case "div":
				case "/=":
				case "//=":
					actionArgs[2] = "divide";
					break;
			}
			if (!['increment', 'decrement', 'set', 'multiply', 'divide'].includes(actionArgs[2])) compileError = `&cUnknown operator &e${actionArgs[2]}&c on line &e${i + 1}`;
			actionData = ["change_player_stat", {
				stat: actionArgs[1],
				mode: actionArgs[2],
				value: actionArgs[3]
			}];		
		}
		if (action === "applyLayout") {
			actionData = ["apply_inventory_layout", { layout: actionArgs[1] }];
		}
		if (action === "applyPotion") {
			let override = false;
			if (actionArgs[4] === "true") override = true;
			actionData = ["apply_potion_effect", {
				effect: actionArgs[1],
				duration: actionArgs[2],
				amplifier: actionArgs[3],
				overrideExistingEffects: override
			}];
		}
		if (action === "cancelEvent") {
			actionData = ["cancel_event", {}];
		}
		if (action === "exit" && (subaction === "if" || subaction === "else")) {
			actionData = ["exit", {}];
		}
		if (action === "globalstat") {
			switch (actionArgs[2]) {
				case "inc":
				case "+=":
					actionArgs[2] = "increment";
					break;
				case "dec":
				case "-=":
					actionArgs[2] = "decrement";
					break;
				case "=":
					actionArgs[2] = "set";
					break;
				case "mult":
				case "*=":
					actionArgs[2] = "multiply";
					break;
				case "div":
				case "/=":
				case "//=":
					actionArgs[2] = "divide";
					break;
			}
			if (!['increment', 'decrement', 'set', 'multiply', 'divide'].includes(actionArgs[2])) compileError = `&cUnknown operator &e${actionArgs[2]}&c on line &e${i + 1}`;
			actionData = ["change_global_stat", {
				stat: actionArgs[1],
				mode: actionArgs[2],
				value: actionArgs[3]
			}];	
		}
		if (action === "changeHealth") {
			actionData = ["change_health", {
				health: actionArgs[2],
				mode: actionArgs[1],
			}];
		}
		if (action === "changePlayerGroup") {
			let override;
			if (actionArgs[2] === "true") override = true;
			actionData = ["change_player_group", {
				group: actionArgs[1],
				demotionProtection: override
			}];
		}
		if (action === "clearEffects") {
			actionData = ["clear_all_potion_effects", {}];
		}
		if (action === "actionBar") {
			actionData = ["display_action_bar", {
				message: actionArgs[1]
			}];
		}
		if (action === "title") {
			actionData = ["display_title", {
				title: actionArgs[1],
				subtitle: actionArgs[2],
				fadeIn: actionArgs[3],
				stay: actionArgs[4],
				fadeOut: actionArgs[5]
			}];
		}
		if (action === "failParkour") {
			actionData = ["fail_parkour", {
				reason: actionArgs[1]
			}];
		}
		if (action === "fullHeal") {
			actionData = ["full_heal", {}];
		}
		if (action === "xpLevel") {
			actionData = ["give_experience_levels", {
				levels: actionArgs[1]
			}];
		}
		if (action === "giveItem") {
			let allowMultiple = false;
			if (actionArgs[2] === "true") allowMultiple = true;
			actionData = ["give_item", {
				item: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${actionArgs[1]}.json`)) },
				allowMultiple: allowMultiple
			}];
		}
		if (action === "houseSpawn") {
			actionData = ["go_to_house_spawn", {}];
		}
		if (action === "kill") {
			actionData = ["kill_player", {}];
		}
		if (action === "parkCheck") {
			actionData = ["parkour_checkpoint", {}];
		}
		if (action === "sound") {
			actionData = ["play_sound", {
				sound: actionArgs[1],
				pitch: actionArgs[2]
			}];
		}
		if (action === "removeItem") {
			actionData = ["remove_item", {
				item: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${actionArgs[1]}.json`)) }
			}];
		}
		if (action === "resetInventory") {
			actionData = ["reset_inventory", {}];
		}
		if (action === "chat") {
			actionData = ["send_a_chat_message", {
				message: actionArgs[1]
			}];
		}
		if (action === "lobby") {
			actionData = ["send_to_lobby", {
				lobby: actionArgs[1]
			}];
		}
		if (action === "compassTarget") {
			actionData = ["set_compass_target", {
				location: actionArgs[1],
				coordinates: actionArgs[2]
			}];
		}
		if (action === "gamemode") {
			actionData = ["set_gamemode", {
				gamemode: actionArgs[1]
			}];
		}
		if (action === "hungerLevel") {
			actionData = ["set_hunger_level", {
				level: actionArgs[1]
			}];
		}
		if (action === "maxHealth") {
			actionData = ["set_max_health", {
				health: actionArgs[1]
			}];
		}
		if (action === "tp") {
			if (!["house_spawn", "current_location", "custom_coordinates"].includes(actionArgs[1])) compileError = `&cUnknown location type &e"${actionArgs[1]}"&c on line &e${i + 1}`;
			if (actionArgs[1] === "custom_coordinates") {
				try {
					actionData = ["teleport_player", {
						location: actionArgs[1],
						coordinates: actionArgs[2].split(" ")
					}];
				} catch (error) {
					compileError = `&cLocation type &e"custom_coordinates"&c requires a second argument. Line &e${i + 1}`;
				}
			} else {
				actionData = ["teleport_player", {
					location: actionArgs[1]
				}];
			}
		}
		if (action === "function") {
			let override;
			if (actionArgs[2] === "true") override = true;
			actionData = ["trigger_function", {
				function: actionArgs[1],
				triggerForAllPlayers: override
			}];
		}
		if (action === "consumeItem") {
			actionData = ["use_remove_held_item", {}];
		}
		if (action === "enchant") {
			actionData = ["enchant_held_item", {
				enchantment: actionArgs[1],
				level: actionArgs[2]
			}];
		}
		if (action === "if" && (subaction !== "if" && subaction !== "else")) {
			subaction = "if";
			let conditions = conditionCompiler(importActions[i].substring(3, importActions[i].length - 3));
			compileError = conditions.compileError;
			let matchConditions = false;
			if (actionArgs[1] === "or") {
				matchConditions = true;
			}
			subactions = {
				conditions: conditions.list,
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
		if (importActions[i].startsWith("}") && subaction === "if" && !(importActions[i].startsWith("} else") || importActions[i].startsWith("}else"))) {
			actionData = ["conditional", {
				conditions: subactions.conditions,
				matchAnyCondition: subactions.matchAnyCondition,
				if: subactions.if,
				else: subactions.else
			}];
			subactions = [];
			subaction = "";
		}
		if ((importActions[i].startsWith("} else {") || importActions[i].startsWith("}else")) && subaction === "if") {
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
		if (compileError) {
			ChatLib.chat(`&3[HTSL] ${compileError}`);
			return ChatLib.chat(`&3[HTSL] &cFailed line: &e${importActions[i]}`);
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
		} else if (action) {
			if (!(action.startsWith("//")) && action !== "if" && !(action.startsWith("}")) && action !== "random") {
				ChatLib.chat(`&3[HTSL] &cError, unknown action "&e${action}&c" found on line &e${i + 1}`);
				return ChatLib.chat(`&3[HTSL] &cFailed line: &e${importActions[i]}`);
			}
		}
	}

	loadResponse(actionList);
	} catch (error) {
		ChatLib.chat(`&3[HTSL] &fError compiling ${fileName}, please make sure it exists!`);
		ChatLib.chat(error);
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
	let result = [];
	let match;
	let re = /"((?:\\"|[^"])*)"|'((?:\\'|[^'])*)'|(\S+)/g;
	while ((match = re.exec(input)) !== null) {
	  	result.push(match[1] || match[2] || match[3]);
	}
	return result;
}

function conditionCompiler(arg) {
	let conditionList = [];
	let compileError
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
		if (arg[i].startsWith(" ")) {
			arg[i] = arg[i].substr(1);
		}
	}
	for (let i = 0; i < arg.length; i++) {
		let args = [];
		args = getArgs(arg[i]);
		let condition = args[0];
		if (condition === "stat") {
			let mode = "";
			switch (args[2]) {
				case "=":
					mode = "equal_to"
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
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
				default:
					compileError = `&cUnknown compare operation &e"${args[2]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
			}
			conditionList.push(["player_stat_requirement", {
				stat: args[1],
				comparator: mode,
				compareValue: args[3]
			}]);
		}
		if (condition === "globalstat") {
			let mode = "";
			switch (args[2]) {
				case "=":
					mode = "equal_to"
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
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
				default:
					compileError = `&cUnknown compare operation &e"${args[2]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
			}
			conditionList.push(["global_stat_requirement", {
				stat: args[1],
				comparator: mode,
				compareValue: args[3]
			}]);
		}
		if (condition === "hasPotion") {
			conditionList.push(["has_potion_effect", {
				effect: args[1],
			}]);
		}
		if (condition === "doingParkour") {
			conditionList.push(["doing_parkour", {}]);
		}
		if (condition === "inRegion") {
			conditionList.push(["within_region", {
				region: args[1],
			}]);
		}
		if (condition === "hasPermission") {
			conditionList.push(["required_permission", {
				permission: args[1],
			}]);
		}
		if (condition === "hasGroup") {
			let includeHigher = false;
			if (args[1] === "true") {
				includeHigher = true;
			}
			conditionList.push(["required_group", {
				group: args[1],
				includeHigherGroups: includeHigher
			}]);
		}
		if (condition === "damageCause") {
			conditionList.push(["damage_cause", {
				damageCause: args[1],
			}]);
		}
		if (condition === "blockType") {
			conditionList.push(["block_type", {
				blockType: args[1],
			}]);
		}
		if (condition === "placeholder") {
			let mode = "";
			switch (args[2]) {
				case "=":
					mode = "equal_to"
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
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
				default:
					compileError = `&cUnknown compare operation &e"${args[2]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
			}
			conditionList.push(["placeholder_number_requirement", {
				placeholder: args[1],
				comparator: mode,
				compareValue: args[3]
			}]);
		}
		if (condition === "gamemode") {
			conditionList.push(["required_gamemode", {
				gameMode: args[1].toLowerCase(),
			}]);
		}
		if (condition === "isSneaking") {
			conditionList.push(["is_sneaking", {}])
		}
		if (condition === "hasItem") {
			let item_type = "metadata";
			if (args[2] === "item_type") item_type = "item_type";
			let requireAmount = false;
			if (args[4] === "requireAmount") requireAmount = true;
			conditionList.push(["has_item", {
				item: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) },
				whatToCheck: item_type,
				whereToCheck: args[3],
				requireAmount: requireAmount
			}]);
		}
		if (condition === "health") {
			let mode = "";
			switch (args[1]) {
				case "=":
					mode = "equal_to"
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
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
				default:
					compileError = `&cUnknown compare operation &e"${args[1]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
			}
			conditionList.push(["player_health", {
				comparator: mode,
				compareValue: args[2]
			}])
		}
		if (condition === "maxHealth") {
			let mode = "";
			switch (args[1]) {
				case "=":
					mode = "equal_to"
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
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
				default:
					compileError = `&cUnknown compare operation &e"${args[1]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
			}
			conditionList.push(["max_player_health", {
				comparator: mode,
				compareValue: args[2]
			}])
		}
		if (condition === "hunger") {
			let mode = "";
			switch (args[1]) {
				case "=":
					mode = "equal_to"
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
				case ">=":
					mode = "greater_than_or_equal_to"
					break;
				case "=<":
					mode = "less_than_or_equal_to"
					break;
				default:
					compileError = `&cUnknown compare operation &e"${args[1]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
			}
			conditionList.push(["player_hunger", {
				comparator: mode,
				compareValue: args[2]
			}])
		}
		if (conditionList.length !== i + 1 && !(condition === "" || !condition)) {
			compileError = `&cUnknown condition &e"${arg[i]}"`;
			let conditions = {
				list: conditionList,
				compileError: compileError
			}
			return conditions;
		}
	}
	let conditions = {
		list: conditionList,
		compileError: compileError
	}
	return conditions;
}