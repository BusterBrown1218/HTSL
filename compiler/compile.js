import { loadAction, working } from "./loadAction";
import menus from "../actions/menus";
import conditions from "../actions/conditions";
import syntaxes from "../actions/syntax";

let shortcuts = [];

export function isImporting() {
	return working();
}

/**
 * Compiles an HTSL program into a series of Actions.
 * @param {string} fileName The name of the file to compile. 
 * @param {string} dissallowedFiles Files to exclude from the compilation.
 * @param {boolean} nested Whether to check for nested files or not. 
 * @returns 
 */
export function compile(fileName, dissallowedFiles, nested) {
	// try {
		if (!dissallowedFiles) dissallowedFiles = [];
		let importText;
		if (FileLib.exists(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`)) {
			importText = FileLib.read(`./config/ChatTriggers/modules/HTSL/imports/${fileName}.htsl`);
		} else {
			return ChatLib.chat(`&3[HTSL] &cCouldn't find the file "&f${fileName}&c", please make sure it exists!`);
		}
		dissallowedFiles.push(fileName);
		let noFiles = dissallowedFiles;
		shortcuts = [];
		if (!nested) ChatLib.chat("&3[HTSL] &fCompiling . . .");
		let actionobj = preProcess(importText.split("\n"), noFiles);
		if (typeof actionobj == "string") return ChatLib.chat(actionobj);
		// processor
		for (let j = 0; j < actionobj.length; j++) {
			if (actionobj[j].compiled) { actionobj[j].compiled = undefined; continue; }
			let actionsList = actionobj[j].actionList;
			let newActionList = [];
			for (let i = 0; i < actionsList.length; i++) {
				let args = actionsList[i].line.includes("\n") ? getMultiline(actionsList[i].line) : getArgs(actionsList[i].line.trim());
				let currentLine = actionsList[i].trueLine;
				if (typeof args == "boolean" && !args) { return ChatLib.chat(`&3[HTSL] &cSomething went wrong with expression evaluation on &eline ${currentLine}`); }
				let keyword = args.shift();
				if (syntaxes.actions[keyword]) {
					let syntax = syntaxes.actions[keyword];
					let comp = componentFunc(args, syntax, menus[syntax.type]);
					if (typeof comp == "string") {
						let line = comp.match(/\{line-?(\d+)?\}/);
						if (line[1]) currentLine = currentLine + Number(line[1]);
						return ChatLib.chat(`&3[HTSL] &c${comp.replace(/{line-?(\d+)?}/g, currentLine)}`);
					}
					if (comp) {
						newActionList.push(comp);
					} else {
						return ChatLib.chat(`&3[HTSL] &cUnknown action &e${keyword}&c on &eline ${currentLine}`);
					}
				} else {
					return ChatLib.chat(`&3[HTSL] &cUnknown action &e${keyword}&c on &eline ${currentLine}`);
				}
				multiLineOffset = 0;
			}
			actionobj[j].actionList = [];
			actionobj[j].actions = newActionList;
		}

		if (!nested) {
			if (!loadAction(actionobj)) return false;
		} else return actionobj.map(n => { n.compiled = true; return n });
	// } catch (error) {
	// 	ChatLib.chat(`&3[HTSL] &eEncountered an unknown error, please seek support about the following error:`);
	// 	ChatLib.chat(error);
	// 	console.error(error);
	// }
}

/**
 * Performs shortcut substitution on the given input text.
 * @param {string} text Text to perform the substitution on.
 * @param {object[]} shortcuts A series of shortcuts.
 * @returns {string} Text with shortcuts substituted.
 */
function replaceshortcuts(text, shortcuts) {
	shortcuts.forEach(shortcut => {
		let regex = new RegExp('\\b' + shortcut.name + '\\b', 'g');
		text = text.replace(regex, (match, offset, string) => {
			// Check if the match is inside quotes
			let inQuotes = (string.charAt(offset - 1) === "'" || string.charAt(offset - 1) === '"') &&
				(string.charAt(offset + match.length) === "'" || string.charAt(offset + match.length) === '"');
			// If the match is not inside quotes, replace it with the shortcut value
			return inQuotes ? match : shortcut.value;
		});
	});
	return text;
}

/**
 * Transforms a string of each argument into a list of arguments, accounting for special HTSL formatting.
 * @param {string} input 
 * @returns {string[]} A list of arguments.
 */
function getArgs(input) {
	let conversions = [
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +globalstat +(?:"([^"]*)"|([^ ]*))/g, replacement: "$1 %stat.global/$2$3%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +stat +(?:"([^"]*)"|([^ ]*))/g, replacement: "$1 %stat.player/$2$3%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +teamstat +(.*)? +(?:"([^"]*)"|([^ ]*))/g, replacement: "$1 \"%stat.team/$2 $3$4%\"" }, { regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +randomint +(.*)? +?(.*)?/g, replacement: "$1 \"%random.int/$2 $3%\"" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +health/g, replacement: "$1 %player.health%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +maxHealth/g, replacement: "$1 %player.maxhealth%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +hunger/g, replacement: "$1 %player.hunger%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +locX/g, replacement: "$1 %player.location.x%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +locY/g, replacement: "$1 %player.location.y%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +locZ/g, replacement: "$1 %player.location.z%" },
		{ regex: /(=|>|<|set|dec|mult|div|ment|inc|multiply|divide|equal|Less Than|Less Than or Equal|Greater Than|Greater Than or Equal) +unix/g, replacement: "$1 %date.unix%" }
	];
	for (let conversion of conversions) {
		input = input.replace(conversion.regex, conversion.replacement);
	}

	// Loop through the input string and split it into arguments based on spaces, but quoted args go together
	let args = [];
	let inQuotes = false;
	let inPercents = false;
	let inCurlyBrackets = false;
	let arg = "";
	for (let i = 0; i < input.length; i++) {
		if (input[i].match(/\s/) && !inQuotes && !inCurlyBrackets && !inPercents) {
			// Add completed word to args list
			// Shortcut handling
			let shortcut = shortcuts.find(m => m.name === arg);
			if (shortcut) {
				arg = getArgs(shortcut.value);
				args.push(...arg);
				arg = "";
				continue;
			}
			// Slot choice for items
			let slotMatch = arg.match(/slot\_(\d+)/);
			if (slotMatch) {
				arg = { slot: Number(slotMatch[1]) };
			}
			if (arg === "null") args.push(null); // User wants to ignore parameter
			else if (arg !== "") args.push(arg);
			arg = "";
		} else if (arg.length === 0) {
			// Arg is beginning, check for combined args
			let notWrapped = !(inQuotes || inCurlyBrackets || inPercents);
			if (input[i] === '"' && notWrapped) {
				inQuotes = true;
				arg += input[i];
			} else if (input[i] === '{' && notWrapped) {
				inCurlyBrackets = true;
			} else if (input[i] === "%" && notWrapped) {
				inPercents = true;
				arg += input[i];
			} else if (input[i] === '\\' && ["\"", "(", "{", "%"].includes(input[i + 1]) && notWrapped) {
				arg += input[i + 1];
				i++;
			} else {
				arg += input[i];
			}
		} else if ((input[i + 1]?.match(/\s/) || i + 1 === input.length) && (inQuotes || inCurlyBrackets || inPercents) && input[i - 1] !== "\\") {
			// Word is ending, check if completed arg
			if (input[i] === '"' && inQuotes) {
				inQuotes = false;
				arg += input[i];
				args.push(arg);
				arg = "";
			} else if (input[i] === "%" && inPercents) {
				inPercents = false;
				arg += input[i];
				args.push(arg);
				arg = "";
			} else if (input[i] === '}' && inCurlyBrackets) {
				inCurlyBrackets = false;
				// If the argument is in curly brackets
				shortcuts.forEach((shortcut) => {
					arg = arg.replace(shortcut.name, shortcut.value);
				});
				try {
					args.push(evaluateExpression(arg));
					arg = "";
					continue;
				} catch (e) {
					return false; // Invalid expression
				}
			} else {
				arg += input[i];
			}
		} else {
			arg += input[i];
		}
		if (i + 1 === input.length) {
			let shortcut = shortcuts.find(m => m.name === arg);
			if (shortcut) {
				arg = getArgs(shortcut.value);
				args.push(...arg);
				arg = "";
				continue;
			}
			// Slot choice for items
			let slotMatch = arg.match(/slot\_(\d+)/);
			if (slotMatch) {
				arg = { slot: Number(slotMatch[1]) };
				args.push(arg);
				arg = "";
				continue;
			}
			if (arg === "null") args.push(null); // User wants to ignore parameter
			else if (arg !== "") args.push(arg);
			arg = "";
		}
	}
	return args;
}

/**
 * Evaluates an JS expression from the code.
 * @param {string} expression The expression to evaluate
 * @returns The result of the expression
 */
function evaluateExpression(expression) {
	let func = new Function('return ' + expression.replaceAll("(", "evaluateExpression("));
	return func().toString().replaceAll("evalExpression(", "(");
}

/**
 * If a multiline expression is ahead (e.g parenthesis), this will parse each argument int oa list.
 * @param {string} input 
 * @returns {string[]} The multiline expressions in a list.
 */
function getMultiline(input) {
	let result = [];
	let depth = 0;
	let start = 0;
	let inQuote = false;
	for (let i = 0; i < input.length; i++) {
		if (input[i] === '"' && (i === 0 || input[i - 1] !== '\\')) {
			inQuote = !inQuote;
		}
		if (inQuote) continue;
		if (input[i] === '(' || input[i] === '{') {
			if (depth === 0) start = i;
			depth++;
		} else if (input[i] === ')' || input[i] === '}') {
			depth--;
			if (depth === 0) {
				result.push(input.substring(start + 1, i));
			}
		} else if (depth === 0 && /\S/.test(input[i])) {
			let end = input.slice(i).search(/\s/);
			if (end === -1) end = input.length;
			else end += i;
			result.push(input.substring(i, end));
			i = end;
		}
	}
	return result;
}

/**
 * Collapses possible ways of writing operators into 1 format
 * @param {string} operator The operation
 * @returns The formated version of the operation
 */
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
	if (!['increment', 'decrement', 'set', 'multiply', 'divide', "unset"].includes(operator.toLowerCase())) return `Unknown operator &e${operator}&c on &eline {line}`;
	return operator.toUpperCase();
}

/**
 * Collapses possible ways of writing comparators into 1 format
 * @param {string} comparator The comparator
 * @returns The formated version of the comparator
 */
function validComparator(comparator) {
	switch (comparator.toLowerCase()) {
		case "=":
		case "==":
		case "equal":
			comparator = "EQUAL";
			break;
		case "<":
			comparator = "Less Than";
			break;
		case "=<":
		case "<=":
			comparator = "Less Than or Equal";
			break;
		case ">":
			comparator = "Greater Than";
			break;
		case "=>":
		case ">=":
			comparator = "Greater Than or Equal";
			break;
	}
	if (!["EQUAL", "Less Than", "Less Than or Equal", "Greater Than", "Greater Than or Equal"].includes(comparator)) return `Unknown comparator &e${comparator}&c on &eline {line}`;
	return comparator;
}

function splitOutsideBrackets(str) {
	let result = [];
	let start = 0;
	let brackets = 0;

	for (let i = 0; i < str.length; i++) {
		if (str[i] === '{') {
			brackets++;
		} else if (str[i] === '}') {
			brackets--;
		} else if (str[i] === ',' && brackets === 0) {
			result.push(str.slice(start, i));
			start = i + 1;
		}
	}

	result.push(str.slice(start));
	return result;
}

function componentFunc(args, syntax, menu) {
	if (menu.action_name == "Go to House Spawn") return `Hypixel has deprecated &ehouseSpawn&c. You cannot use this action on &eline {line}`;
	let params = [];
	if (syntax.full.match(/\<(.*?)\>/g)) params = syntax.full.match(/\<(.*?)\>/g).map(n => n.substring(1, n.length - 1));
	let component = { type: syntax.type };
	
	if (["CHANGE_VARIABLE", "VARIABLE_REQUIREMENT"].includes(syntax.type)) {
		params.splice(0, 0, "holder");
		if (["teamstat", "teamvar"].includes(syntax.from)) {
			args.splice(0, 0, "Team");
		} else {
			args.splice(0, 0, syntax.from.startsWith("global") ? "Global" : "Player");
		}
		if (syntax.from.endsWith("stat")) {
			if (args[3].startsWith('"') && args[3].endsWith('"')) { // Remove quotes around amounts
				args[3] = args[3].substring(1, args[3].length - 1) + "L";
			}
			params.push(syntax.type === "CHANGE_VARIABLE"? "automatic_unset" : "fallback_value");
			args.push(syntax.type === "CHANGE_VARIABLE"? "true" : "0L");
		}
	}
	for (let j = 0; j < params.length; j++) {
		if (!args[j]) continue;
		if (typeof args[j] == "string") if (args[j].startsWith('"') && args[j].endsWith('"') && params[j] !== "value") {
			args[j] = args[j].substring(1, args[j].length - 1);
		}
		console.log(params[j]);
		// handle operator aliases
		if (menu[params[j]].type == "static_option_select" && menu[params[j]].options?.includes("Increment")) {
			args[j] = validOperator(args[j]);
			if (args[j].match(/Unknown operator(.*)/)) return args[j];
		}
		// handle comparator aliases
		if (menu[params[j]].type == "static_option_select" && menu[params[j]].options?.includes("Less Than")) {
			args[j] = validComparator(args[j]);
			if (args[j].match(/Unknown comparator(.*)/)) return args[j];
		}
		// handle custom location location type
		if (menu[params[j]].type == "location") {
			if (!["house_spawn", "current_location", "invokers_location", "custom_coordinates", "house_spawn_location"].includes(args[j].toLowerCase().replace(/ +/g, "_"))) return `Invalid location &e${args[j]}&c on &eline {line}`;
			if (args[j].toLowerCase().replace(/ +/g, "_") == "custom_coordinates") {
				args[j] = {
					type: "custom_coordinates",
					coords: args[j + 1]
				}
				args.splice(j + 1, 1);
			} else if (args[j].toLowerCase().replace(/ +/g, "_") == "house_spawn") {
				args[j] = { type: "house_spawn_location" }
			} else {
				args[j] = { type: args[j] }
			}
		}
		// handle toggles
		if (menu[params[j]].type == "toggle") {
			if (["or", "true"].includes(args[j])) {
				args[j] = true
			} else {
				args[j] = false;
			}
		}
		// handle items
		if (menu[params[j]].type == "item") {
			if (typeof args[j] == "object") {
				args[j].type = "clickSlot";
			} else {
				if (!FileLib.exists("HTSL", `imports/${args[j]}.json`)) return `Unknown item &e${args[j]}&c on &eline {line}`;
				args[j] = JSON.parse(FileLib.read("HTSL", `imports/${args[j]}.json`));
				args[j].type = "customItem";
			}
		}
		// handle conditions w/ recursion
		if (menu[params[j]].type == "conditions") {
			let conditionsArg = splitOutsideBrackets(args[j]);
			let conditionList = [];
			for (let i = 0; i < conditionsArg.length; i++) {
				let conditionArgs = getArgs(conditionsArg[i].trim());
				if (typeof conditionArgs == "boolean" && !conditionArgs) return `Something went wrong with expression evaluation on &eline {line}`;
				// Inverted check
				let inverted = false;
				if (conditionArgs[0].startsWith("!")) {
					inverted = true;
					conditionArgs[0] = conditionArgs[0].substring(1);
				}
				
				let keyword = conditionArgs.shift();
				if (keyword == "" || !keyword) continue;
				if (syntaxes.conditions[keyword]) {
					let subsyntax = syntaxes.conditions[keyword];
					let comp = componentFunc(conditionArgs, subsyntax, conditions[subsyntax.type]);
					if (typeof comp == "string") return comp;
					if (comp) {
						if (inverted) comp.inverted = true;
						conditionList.push(comp);
					} else {
						return `Unknown condition &e${args[j]}&c on &eline {line}`;
					}
				} else {
					return `Unknown condition &e${args[j]}&c on &eline {line}`;
				}
			}
			args[j] = conditionList;
		}
		// handle subactions w/ recursion
		if (menu[params[j]].type == "subactions") {
			let subactions = [];
			let lines = preProcess(args[j].split("\n"))[0].actionList;
			for (let i = 0; i < lines.length; i++) {
				let subargs = getArgs(lines[i].line);
				if (typeof subargs == "boolean" && !subargs) return `Something went wrong with expression evaluation on &eline {line-${i + lines[i].trueLine}}`;
				let keyword = subargs.shift();
				if (keyword == "" || !keyword) continue;
				if (syntaxes.actions[keyword]) {
					let subsyntax = syntaxes.actions[keyword];
					let comp = componentFunc(subargs, subsyntax, menus[subsyntax.type]);
					if (typeof comp == "string") return comp.replace("{line}", `{line-${i + lines[i].trueLine}}`);
					if (comp) {
						subactions.push(comp);
					} else {
						return `Unknown action &e${keyword}&c on &eline {line-${i + lines[i].trueLine}}`;
					}
				} else {
					return `Unknown action &e${keyword}&c on &eline {line-${i + lines[i].trueLine}}`;
				}
			}
			args[j] = subactions;
		}

		component[params[j]] = args[j];
	}
	return component;
}

function handleLoop(string) {
	let [match, length, indexName] = string.split("\n")[0].match(/loop (\d+) ([^ ]*) {[^]*/);
	if (shortcuts.find(shortcut => shortcut.name == indexName)) throw {};
	indexName = indexName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	let newLines = [];
	for (let i = 1; i <= Number(length); i++) {
		let loopLines = string.replace(new RegExp(`(\\b${indexName}\\b)|("${indexName}")|(\\[${indexName}\\])`, "g"), (match, p1, p2, p3) => {
			if (p2) {
				// If indexName is part of a string, don't replace it
				return p2;
			} else if (p3) {
				// If indexName is inside square brackets, replace it with i - 1
				return '[' + (i - 1) + ']';
			} else {
				// Otherwise, replace indexName with i - 1
				return i - 1;
			}
		}).split("\n");
		loopLines.shift();
		newLines.push(...loopLines);
	}
	return newLines;
}

export function preProcess(importActions, dissallowedFiles) {
	if (!dissallowedFiles) dissallowedFiles = [];
	let trueActions = [];
	let actionobj = [];
	let multilineAction;
	let multilineActionLength = 0;
	let currentContext = { context: "DEFAULT", contextTarget: {}, trueActions: [] };
	let multilineComment = false;
	let depth = 0;
	for (let i = 0; i < importActions.length; i++) {
		importActions[i] = replaceshortcuts(importActions[i].trim(), shortcuts);
		if (multilineAction) multilineActionLength++;
		if (importActions[i] == "") continue;
		if (importActions[i].startsWith("//")) continue;
		if (importActions[i].startsWith("/*")) { multilineComment = true; continue; }
		if (importActions[i].endsWith("*/")) {
			if (multilineComment) { multilineComment = false; continue; }
			else return ChatLib.chat(`&3[HTSL] &cBroken multiline comment on line &e${i + 1}`);
		}
		if (multilineComment) continue;
		if (importActions[i].endsWith("{")) depth++;
		if (importActions[i].endsWith("{") && !multilineAction) { multilineAction = [{ line: importActions[i], trueLine: i }]; multilineActionLength++; continue; }
		if (importActions[i].startsWith("}")) depth--;
		if (importActions[i] == "}" && multilineAction && depth == 0) {
			if (multilineAction[0].line.startsWith("loop")) {
				let newContexts = preProcess(handleLoop(multilineAction.map(obj => obj.line).join("\n")));
				// handle default context
				if (newContexts[0].context == "DEFAULT") {
					trueActions.push(...newContexts[0].actionList.map(line => { line.trueLine = line.trueLine + i - (1) * (1 + newContexts[0].actionList.length); return line }));
				} else {
					actionobj.push({
						context: currentContext.context,
						contextTarget: currentContext.contextTarget,
						actionList: trueActions
					});
					actionobj.push({
						context: newContexts[0].context,
						contextTarget: newContexts[0].contextTarget,
						actionList: newContexts[0].actionList.map(line => { line.trueLine = line.trueLine + i - (j + 1) * (1 + newContexts[0].actionList.length); return line })
					});
				}

				// handle other contexts
				for (let j = 1; j < newContexts.length; j++) {
					let context = newContexts[j];
					if (j == newContexts - 1) {
						trueActions.push(...context.actionList.map(line => { line.trueLine = line.trueLine + i - (newContexts.length) * (1 + newContexts[newContexts.length - 1].actionList.length); return line }))
						currentContext = { context: context.context, contextTarget: context.contextTarget };
					} else actionobj.push({
						context: context.context,
						contextTarget: context.contextTarget,
						actionList: context.actionList.map(line => { line.trueLine = line.trueLine + i - (j + 1) * (1 + context.actionList.length); return line })
					});
				};
				multilineAction = undefined;
				multilineActionLength = 0;
				continue;
			}
			multilineAction.push({ line: "}", trueLine: i });
			let lastLine = 0;
			let newLines = [multilineAction[0].line];
			for (let j = 1; j < multilineAction.length; j++) {
				for (let k = 1; k < multilineAction[j].trueLine - lastLine; k++) {
					newLines.push("");
				}
				newLines.push(multilineAction[j].line);
				lastLine = multilineAction[j].trueLine;
			}
			newLines = newLines.join("\n");
			if (newLines.startsWith("if")) {
				newLines = newLines.replace(/^if +\(/, "if and (").replace(/ *} +else +{ */, "\n} {\n");
			}
			trueActions.push({ line: newLines, trueLine: i - multilineActionLength + 2 });

			multilineAction = undefined;
			multilineActionLength = 0;
			continue;
		}
		if (multilineAction) { multilineAction.push({ line: importActions[i], trueLine: i }); continue; }

		let goto = importActions[i].match(/goto +(.*) +(.*)/);
		if (goto) {
			actionobj.push({
				context: currentContext.context,
				contextTarget: currentContext.contextTarget,
				actionList: trueActions
			});
			let gotoArgs = getArgs(importActions[i]);
			for (let j = 0; j < gotoArgs.length; j++) {
				if (gotoArgs[j].match(/^"(?:.*)"$/)) gotoArgs[j] = gotoArgs[j].substring(1, gotoArgs[j].length - 1);
			}
			if (gotoArgs.length == 5 && gotoArgs[3] == "as") {
				if (dissallowedFiles.includes(gotoArgs[4])) return `&3[HTSL] &cNested file calls detected`;
				let fileCall = compile(gotoArgs[4], dissallowedFiles, true);
				fileCall[0].context = gotoArgs[1].toUpperCase();
				fileCall[0].contextTarget = { name: gotoArgs[2].match(/^"(?:.*)"$/) };
				actionobj.push(...fileCall);
			} else if (gotoArgs.length == 6 && gotoArgs[2] == "region" && gotoArgs[4] == "as") {
				if (dissallowedFiles.includes(gotoArgs[4])) return `&3[HTSL] &cNested file calls detected`;
				let fileCall = compile(gotoArgs[4], dissallowedFiles, true);
				fileCall[0].context = gotoArgs[1].toUpperCase();
				fileCall[0].contextTarget = { name: gotoArgs[2], trigger: gotoArgs[4] };
				actionobj.push(...fileCall)
			} else currentContext = { context: gotoArgs[1].toUpperCase(), contextTarget: { name: gotoArgs[2], trigger: gotoArgs[3] } };
			trueActions = [];
			continue;
		}

		if (importActions[i].startsWith("define")) {
			let shortcutName = importActions[i].split(/ +/)[1].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			if (syntaxes[shortcutName] || ["goto", "//", "/*", "*/", "loop"].includes(shortcutName)) return ChatLib.chat(`&3[HTSL] &cInvalid shortcut name &e${importActions[i].split(/ +/)[1]}`);
			if (shortcuts.find(shortcut => shortcut.name == shortcutName)) return ChatLib.chat(`&3[HTSL] &cCannot have two shortcuts of the same name!`);
			shortcuts.push({
				name: shortcutName,
				value: importActions[i].substring(8 + importActions[i].split(/ +/)[1].length)
			});
			continue;
		}

		// line
		trueActions.push({ line: importActions[i], trueLine: i });
	}
	actionobj.push({
		context: currentContext.context,
		contextTarget: currentContext.contextTarget,
		actionList: trueActions
	});
	if (multilineComment) return ChatLib.chat(`&3[HTSL] &cUnclosed multiline comment!`);
	if (depth > 0) return ChatLib.chat(`&3[HTSL] &cUnclosed multiline action!`);
	return actionobj;
}