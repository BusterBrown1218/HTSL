import { addOperation } from "../gui/Queue";
import Action from "../actions/Action";
import { checkOccurences } from "../utils/actionLimits";

export default (fileName) => {
	try {
		let importText;
		if (FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`)) {
			importText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`);
		} else if (FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`)) {
			importText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.txt`);
			ChatLib.chat(`&3[HTSL] &eThe .txt file extension won't be supported in future updates. Please change your file extensions to be .htsl`);
		} else {
			return ChatLib.chat(`&3[HTSL] &cCouldn't find the file "${fileName}", please make sure it exists!`);
		}
		ChatLib.chat("&3[HTSL] &fCompiling . . .");
		let importActions = importText.split("\n");
		let actionList = [];
		let subaction = "";
		let subactions = [];
		let actionData;
		for (let i = 0; i < importActions.length; i++) {
			let actionArgs = getArgs(importActions[i].trim());
			let action = actionArgs[0];
			actionData = [];
			let compileError;
			if (action === "//") { };
			if (action === "stat") {
				actionArgs[2] = validOperator(actionArgs[2]);
				if (null === actionArgs[2]) compileError = `&cUnknown operator on line &e${i + 1}`;
				actionData = ["change_player_stat", {
					stat: actionArgs[1],
					mode: actionArgs[2],
					value: actionArgs[3]
				}];
			}
			if (action === "teamstat") {
				actionArgs[3] = validOperator(actionArgs[3]);
				if (null === actionArgs[3]) compileError = `&cUnknown operator on line &e${i + 1}`;
				actionData = ["change_team_stat", {
					stat: actionArgs[1],
					team: actionArgs[2],
					mode: actionArgs[3],
					value: actionArgs[4]
				}];
			}
			if (action === "applyLayout") {
				actionData = ["apply_inventory_layout", { layout: actionArgs[1] }];
			}
			if (action === "applyPotion") {
				let override = false;
				if (actionArgs.length !== 5) compileError = `&cIncomplete arguments on line &e${i + 1}`;
				if (actionArgs[4] === "true") override = true;
				actionData = ["apply_potion_effect", {
					effect: actionArgs[1].toLowerCase(),
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
				actionArgs[2] = validOperator(actionArgs[2]);
				if (null === actionArgs[2]) compileError = `&cUnknown operator on line &e${i + 1}`;
				actionData = ["change_global_stat", {
					stat: actionArgs[1],
					mode: actionArgs[2],
					value: actionArgs[3]
				}];
			}
			if (action === "changeHealth") {
				actionArgs[1] = validOperator(actionArgs[1]);
				if (null === actionArgs[1]) compileError = `&cUnknown operator on line &e${i + 1}`;
				actionData = ["change_health", {
					health: actionArgs[2],
					mode: actionArgs[1],
				}];
			}
			if (action === "changePlayerGroup") {
				let override = true;
				if (actionArgs[2] === "true") override = false;
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
				if (actionArgs.length !== 6) compileError = `&cIncomplete arguments on line &e${i + 1}`;
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
				let replace = false;
				if (actionArgs[4] === "true") replace = true;
				if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${actionArgs[1]}.json`)) compileError = `&cUnknown item file &e${actionArgs[1]}&c on line ${i + 1}`;
				
				actionData = ["give_item", {
					item: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${actionArgs[1]}.json`)) },
					allowMultiple: allowMultiple,
					slot: actionArgs[3],
					replace
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
				if (!["house_spawn", "current_location", "custom_coordinates", "invokers_location"].includes(actionArgs[4])) compileError = `&cUnknown location type &e"${actionArgs[4]}"&c on line &e${i + 1}`;
				if (actionArgs[4] === "custom_coordinates") {
					try {
						if (actionArgs[5]) {
							actionData = ["play_sound", {
								sound: actionArgs[1],
								volume: actionArgs[2],
								pitch: actionArgs[3],
								location: actionArgs[4],
								coordinates: actionArgs[5].split(" ")
							}];
						} else {
							actionData = ["play_sound", { 
								sound: actionArgs[1],
								volume: actionArgs[2],
								pitch: actionArgs[3],
								location: actionArgs[4],
							}];
						}
					} catch (error) {
						compileError = `&cLocation type &e"custom_coordinates"&c requires a second argument. Line &e${i + 1}`;
					}
				} else {
					actionData = ["play_sound", {
						sound: actionArgs[1],
						volume: actionArgs[2],
						pitch: actionArgs[3],
						location: actionArgs[4]
					}];
				}
			}
			if (action === "removeItem") {
				if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${actionArgs[1]}.json`)) compileError = `&cUnknown item file &e${actionArgs[1]}&c on line ${i + 1}`;
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
				if (!["house_spawn", "current_location", "custom_coordinates"].includes(actionArgs[1])) compileError = `&cUnknown location type &e${actionArgs[1]}&c on line ${i + 1}`;
				try {
					if (actionArgs[2]) {
						actionData = ["set_compass_target", {
							location: actionArgs[1],
							coordinates: actionArgs[2].split(" ")
						}];
					} else {
						actionData = ["set_compass_target", { location: actionArgs[1] }];
					}
				} catch (error) {
					compileError = `&cLocation type &e"custom_coordinates"&c requires a second argument. Line &e${i + 1}`;
				}
			}
			if (action === "gamemode") {
				if (!["adventure", "survival", "creative"].includes(actionArgs[1])) compileError = `&cUnknown gamemode type &e${actionArgs[1]}&c on line ${i + 1}`;
				actionData = ["set_gamemode", {
					gamemode: actionArgs[1]
				}];
			}
			if (action === "hungerLevel") {
				actionArgs[1] = validOperator(actionArgs[1]);
				if (null === actionArgs[1]) compileError = `&cUnknown operator on line &e${i + 1}`;
				actionData = ["set_hunger_level", {
					level: actionArgs[1]
				}];
			}
			if (action === "maxHealth") {
				let heal = true;
				if (actionArgs[3] === "false") heal = !heal;
				actionArgs[1] = validOperator(actionArgs[1]);
				if (null === actionArgs[1]) compileError = `&cUnknown operator on line &e${i + 1}`;
				actionData = ["set_max_health", {
					mode: actionArgs[1],
					health: actionArgs[2],
					healOnChange: heal
				}];
			}
			if (action === "tp") {
				if (!["house_spawn", "current_location", "custom_coordinates", "invokers_location"].includes(actionArgs[1])) compileError = `&cUnknown location type &e"${actionArgs[1]}"&c on line &e${i + 1}`;
				if (actionArgs[1] === "custom_coordinates") {
					try {
						if (actionArgs[2]) {
							actionData = ["teleport_player", {
								location: actionArgs[1],
								coordinates: actionArgs[2].split(" ")
							}];
						} else {
							actionData = ["teleport_player", { location: actionArgs[1] }];
						}
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
			if (action === "displayMenu") {
				actionData = ["display_menu", {
					menu: actionArgs[1]
				}];
			}
			if (action === "pause") {
				actionData = ["pause_execution", {
					ticks: actionArgs[1]
				}];
			}
			if (action === "setTeam") {
				actionData = ["set_player_team", {
					team: actionArgs[1]
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
			if (action === "closeMenu") {
				actionData = ["close_menu", {}];
			}
			if (action === "balanceTeam") {
				actionData = ["balance_player_team", {}];
			}
			if (subaction !== "" && (action === "if" || action === "random")) compileError = `&cInvalid nested actions &e${action}`;
			if (action === "if" && !(subaction == "if" || subaction == "else")) {
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
				if (!(action.startsWith("//")) && !(subaction == "if" || subaction == "else") && !(action.startsWith("}")) && subaction !== "random") {
					ChatLib.chat(`&3[HTSL] &cError, unknown action "&e${action}&c" found on line &e${i + 1}`);
					return ChatLib.chat(`&3[HTSL] &cFailed line: &e${importActions[i]}`);
				}
			}
		}

		// Function checkOccurences returns false unless there are too many of one action.
		let exceedsLimits = checkOccurences(actionList);
		if (exceedsLimits) return ChatLib.chat(`&3[HTSL] &cScript exceeds the action limit for &e${exceedsLimits}`);

		loadResponse(actionList);
	} catch (error) {
		ChatLib.chat(`&3[HTSL] &eEncountered an unknown error, please seek support about the following error:`);
		ChatLib.chat(error);
		console.error(error);
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
			mode = validComparator(args[2]);
			if (mode === null) {
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
		let mode = "";
		let item_type = "metadata";
		let requireAmount = false;
		switch (condition) {
			case "globalstat":
				mode = validComparator(args[2]);
				if (mode === null) {
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
				break;
			case "teamstat":
				mode = validComparator(args[3]);
				if (mode === null) {
					compileError = `&cUnknown compare operation &e"${args[2]}"`;
					let conditions = {
						list: conditionList,
						compileError: compileError
					}
					return conditions;
				}
				conditionList.push(["team_stat_requirement", {
					stat: args[1],
					team: args[2],
					comparator: mode,
					compareValue: args[4]
				}]);
				break;
			case "hasTeam":
				conditionList.push(["required_team", {
					team: args[1],
				}]);
				break;
			case "isFlying":
				conditionList.push(["player_flying"]);
				break;
			case "canPvp":
				conditionList.push(["pvp_enabled"]);
				break;
			case "hasPotion":
				conditionList.push(["has_potion_effect", {
					effect: args[1],
				}]);
				break;
			case "fishingEnv":
				conditionList.push(["fishing_environment", {
					environment: args[1],
				}]);
				break;
			case "portal":
				conditionList.push(["portal_type", {
					portal: args[1],
				}]);
				break;
			case "doingParkour":
				conditionList.push(["doing_parkour", {}]);
				break;
			case "inRegion":
				conditionList.push(["within_region", {
					region: args[1],
				}]);
				break;
			case "hasPermission":
				conditionList.push(["required_permission", {
					permission: args[1],
				}]);
				break;
			case "hasGroup":
				let includeHigher = false;
				if (args[1] === "true") {
					includeHigher = true;
				}
				conditionList.push(["required_group", {
					group: args[1],
					includeHigherGroups: includeHigher
				}]);
				break;
			case "damageCause":
				conditionList.push(["damage_cause", {
					damageCause: args[1],
				}]);
				break;
			case "placeholder":
				mode = validComparator(args[2]);
				if (mode === null) {
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
				break;
			case "gamemode":
				if (!["adventure", "survival", "creative"].includes(args[1])) compileError = `&cUnknown gamemode type &e${args[1]}`;
				conditionList.push(["required_gamemode", {
					gameMode: args[1].toLowerCase(),
				}]);
				break;
			case "isSneaking":
				conditionList.push(["is_sneaking", {}]);
				break;
			case "hasItem":
				if (args[2] === "item_type") item_type = "item_type";
				if (args[4] === "requireAmount") requireAmount = true;
				if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) compileError = `&cUnknown item file &e${args[1]}`;
				conditionList.push(["has_item", {
					item: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) },
					whatToCheck: item_type,
					whereToCheck: args[3],
					requireAmount: requireAmount
				}]);
				break;
			case "isItem":
				if (args[2] === "item_type") item_type = "item_type";
				if (args[4] === "requireAmount") requireAmount = true;
				if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) compileError = `&cUnknown item file &e${args[1]}`;
				conditionList.push(["is_item", {
					item: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) },
					whatToCheck: item_type,
					whereToCheck: args[3],
					requireAmount: requireAmount
				}]);
				break;
			case "health":
				mode = validComparator(args[1]);
				if (mode === null) {
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
				}]);
				break;
			case "maxHealth":
				mode = validComparator(args[1])
				if (mode === null) {
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
				}]);
				break;
			case "hunger":
				mode = validComparator(args[1]);
				if (mode == null) {
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
				}]);
				break;
			case "blockType":
				let matchBlockType = false;
				if (!FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) compileError = `&cUnknown item file &e${args[1]}`;
				if (args[2] === "true") matchBlockType = !matchBlockType;
				conditionList.push(["block_type", {
					blockType: { type: "customItem", itemData: JSON.parse(FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${args[1]}.json`)) },
					matchTypeOnly: matchBlockType
				}]);
				break;
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

function validOperator(operator) {
	switch (operator) {
		case "inc":
		case "+=":
			operator = "increment";
			break;
		case "dec":
		case "-=":
			operator = "decrement";
			break;
		case "=":
			operator = "set";
			break;
		case "mult":
		case "*=":
			operator = "multiply";
			break;
		case "div":
		case "/=":
		case "//=":
			operator = "divide";
			break;
	}
	if (!['increment', 'decrement', 'set', 'multiply', 'divide'].includes(operator)) return null;
	return operator
}

function validComparator(comparator) {
	switch (comparator) {
		case "=":
		case "==":
			comparator = "equal_to";
			break;
		case "<":
			comparator = "less_than";
			break;
		case "<=":
			comparator = "less_than_or_equal_to";
			break;
		case ">":
			comparator = "greater_than";
			break;
		case "=>":
		case ">=":
			comparator = "greater_than_or_equal_to";
			break;
		case "=<":
			comparator = "less_than_or_equal_to";
			break;
		default: {
			comparator = null;
		}
	}
	return comparator;
}