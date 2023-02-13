import getPotionEffect from "../../utils/getPotionEffect";
import LimitedAction from "../LimitedAction";

export default (actionData) => {
	let sequence = [];

	if (actionData.conditions) {
		sequence.push(['click', { slot: 10 }]); // select conditions tab
		actionData.conditions.forEach(condition => {
			sequence.push(...loadCondition(condition))
		})
		sequence.push(['back']); // go back to conditional main tab
	}

	if (actionData.matchAnyCondition) sequence.push(['click', { slot: 11 }]); // select match any condition

	if (actionData.if && actionData.if.length > 0) {
		sequence.push(['click', { slot: 12 }]); // select if actions tab
		actionData.if.forEach(action => {
			let actionSequence = new LimitedAction(action[0], action[1]).getSequence()
			sequence.push(...actionSequence);
		})
		sequence.push(['back']); // go back to conditional main tab
	}

	if (actionData.else && actionData.else.length > 0) {
		sequence.push(['click', { slot: 13 }]); // select else actions tab
		actionData.else.forEach(action => {
			let actionSequence = new LimitedAction(action[0], action[1]).getSequence()
			sequence.push(...actionSequence);
		})
		sequence.push(['back']); // go back to conditional main tab
	}

	return ['Conditional', sequence];
}

function loadCondition(condition) {
	let sequence = [];
	const conditionType = condition[0];
	const conditionData = condition[1];

	sequence.push(['click', { slot: 50 }]); // add conditional
	switch (conditionType) {
		case "has_potion_effect":
			ChatLib.chat("Hi")
			sequence.push(['setGuiContext', { context: 'Condition -> Has Potion Effect' }]);
			sequence.push(['option', { option: "Has Potion Effect" }]); // select potion effect condition
			if (conditionData.effect) {
				sequence.push(['click', { slot: 10}]); // select "Effect"
				let { slot, page } = getPotionEffect(conditionData.effect);
				if (page) {
					sequence.push(['click', { slot: 53 }]);
				}
				sequence.push(['click', { slot: slot }]);
			}
			sequence.push(['back']); // go back to edit conditionals tab 
			break;
		
		case "doing_parkour":
			sequence.push(['option', { option: "Doing Parkour" }]); // select doing parkour condition
			break;

		case "has_item":
			sequence.push(['setGuiContext', { context: 'Condition -> Has Item' }]);
			sequence.push(['option', { option: "Has Item" }]); // select has item condition
			if (conditionData.item) {
				sequence.push(['click', { slot: 10 }]); // select "Item"
				sequence.push(['item', { item: conditionData.item }]); // slot 36 is the first slot in the hotbar
			}
			if (conditionData.whatToCheck === "item_type") { // item metadata is default
				sequence.push(['click', { slot: 11 }]); // select "What to Check"
				sequence.push(['click', { slot: 10 }]); // select "Item Type"
			}
			if (conditionData.whereToCheck && conditionData.whereToCheck !== 'anywhere') {
				sequence.push(['click', { slot: 12 }]); // select "Where to Check"
				switch (conditionData.whereToCheck) { // the default is "Anywhere" that is why there is no case for it
					case "Hand":
						sequence.push(['click', { slot: 10 }]); // select "Hand"
						break;
					case "Armor":
						sequence.push(['click', { slot: 11 }]); // select "Armor"
						break;
					case "Hotbar":
						sequence.push(['click', { slot: 12 }]); // select "Hotbar"
						break;
					case "Inventory":
						sequence.push(['click', { slot: 13 }]); // select "Inventory"
						break;
				}
			}
			if (conditionData.requireAmount ) {	// Any Amount is the default here
				sequence.push(['click', { slot: 13 }]); // select "Required Amount"
				sequence.push(['click', { slot: 11 }]); // select "Equal or Greater Amount"
			}
			sequence.push(['back']); // go back to edit conditionals tab 
			break;
		
		case 'within_region':
			sequence.push(['setGuiContext', { context: 'Condition -> Within Region' }]);
			sequence.push(['option', { option: "Within Region" }]); // select within region condition
			if (conditionData.region) {
				sequence.push(['click', { slot: 10 }]); // select "Region"
				sequence.push(['option', { option: conditionData.region }]);
			}
			sequence.push(['back']); // go back to edit conditionals tab
			break;

		case 'required_permission':
			sequence.push(['setGuiContext', { context: 'Condition -> Required Permission' }]);
			sequence.push(['option', { option: "Required Permission" }]); // select required permission condition
			if (conditionData.permission) {
				sequence.push(['click', { slot: 10 }]); // select "Permission"
				sequence.push(['option', { option: conditionData.permission }]);
			}
			sequence.push(['back']); // go back to edit conditionals tab
			break;

		case 'player_stat_requirement':
			sequence.push(['option', { option: "Player Stat Requirement" }]); // select player stat requirement condition
			if (conditionData.stat && conditionData.stat !== 'Kills') {
				sequence.push(['click', { slot: 10 }]); // select "Stat"
				sequence.push(['chat', { text: conditionData.stat }]);
			}
			if (conditionData.comparator && conditionData.comparator !== 'equal_to') { // default is "Equal"
				sequence.push(['click', { slot: 11 }]); // select "Comparator"
				switch (conditionData.comparator) {
					case "less_than":
						sequence.push(['click', { slot: 10 }]); // select "Less Than"
						break;
					case "less_than_or_equal_to":
						sequence.push(['click', { slot: 11 }]); // select "Less Than or Equal"
						break;
					case "greater_than_or_equal_to":
						sequence.push(['click', { slot: 13 }]); // select "Greater Than or Equal"
						break;
					case "greater_than":
						sequence.push(['click', { slot: 14 }]); // select "Greater Than"
						break;
				}
			}
			if (!isNaN(conditionData.compareValue)) {
				sequence.push(['click', { slot: 12 }]); // select "Compare Value"
				sequence.push(['anvil', { text: conditionData.compareValue }]);
			}
			sequence.push(['back']); // go back to edit conditionals tab
			break;

		case 'global_stat_requirement':
			sequence.push(['option', { option: "Global Stat Requirement" }]); // select global stat requirement condition
			if (conditionData.stat && conditionData.stat !== 'Kills') {
				sequence.push(['click', { slot: 10 }]); // select "Stat"
				sequence.push(['chat', { text: conditionData.stat }]);
			}
			if (conditionData.comparator && conditionData.comparator !== 'equal_to') { // default is "Equal"
				sequence.push(['click', { slot: 11 }]); // select "Comparator"
				switch (conditionData.comparator) {
					case "less_than":
						sequence.push(['click', { slot: 10 }]); // select "Less Than"
						break;
					case "less_than_or_equal_to":
						sequence.push(['click', { slot: 11 }]); // select "Less Than or Equal"
						break;
					case "greater_than_or_equal_to":
						sequence.push(['click', { slot: 13 }]); // select "Greater Than or Equal"
						break;
					case "greater_than":
						sequence.push(['click', { slot: 14 }]); // select "Greater Than"
						break;
				}
			}
			if (!isNaN(conditionData.compareValue)) {
				sequence.push(['click', { slot: 12 }]); // select "Compare Value"
				sequence.push(['anvil', { text: conditionData.compareValue }]);
			}
			sequence.push(['back']); // go back to edit conditionals tab
			break;

		case 'required_group':
			sequence.push(['setGuiContext', { context: 'Condition -> Required Group' }]);
			sequence.push(['click', { slot: 10 }]); // select "Required Group"
			if (conditionData.group) {
				sequence.push(['click', { slot: 10 }]); // select "Group"
				sequence.push(['option', { option: conditionData.group }]);
			}
			if (conditionData.includeHigherGroups) {
				sequence.push(['click', { slot: 11 }]); // select "Include Higher Groups"
			}
			sequence.push(['back']); // go back to edit conditionals tab
			break;


		// special cases start here:
		case 'damage_cause':
			sequence.push(['setGuiContext', { context: 'Condition -> Damage Cause' }]);
			sequence.push(['option', { option: "Damage Cause" }]); // select damage cause condition
			if (conditionData.damageCause) {
				sequence.push(['click', { slot: 10 }]); // select "Cause"
				sequence.push(['option', { option: conditionData.damageCause }]);
			}
			sequence.push(['back']); // go back to edit conditionals tab
			break;

		case 'block_type':
			sequence.push(['setGuiContext', { context: 'Condition -> Block Type' }]);
			sequence.push(['option', { option: "Block Type" }]); // select block type condition
			if (conditionData.blockType) {
				sequence.push(['click', { slot: 10 }]); // select "Item"
				sequence.push(['item', { item: conditionData.blockType }]);
			}
			break;

	}
	return sequence;
}