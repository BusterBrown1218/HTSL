import Navigator from './Navigator';
import { Button } from './GuiBuilder';
import Settings from '../utils/config';

let queue = [];
let fails = [];
let timeWithoutOperation = 0;
let operationTimes = { started: 0, total: 0 };
let currentGuiContext = null;

register('tick', () => {
	if (queue.length > 0) timeWithoutOperation++;
	if (timeWithoutOperation > Settings.guiTimeout & queue.length > 0 && !Settings.useSafeMode) {
		fails.push(`&cOperation timed out. &f(too long without GUI click)`);
		const doneOperation = queue.pop();
		doneLoading(doneOperation[1].actionName, doneOperation[1].actionAuthor);
	}
	if (!Navigator.isReady) return;
	if (queue.length === 0) return;
	timeWithoutOperation = 0;
	if (Navigator.isReturning) return Navigator.returnToEditActions();
	if (Navigator.isSelecting) {
		const attemptResult = Navigator.selectOption(Navigator.optionBeingSelected);
		if (attemptResult === false) fails.push(`&cCouldn't find option &f${Navigator.optionBeingSelected} &cin &f${currentGuiContext}&c.`);
		return;
	}

	if (operationTimes.started === 0) operationTimes.started = Date.now();
	operationTimes.total++;
	timeRemainingButton.setText(`Time Remaining: ${Math.round(((Date.now() - operationTimes.started) / operationTimes.total) * queue.length / 1000)} seconds`);

	let [operationType, operationData] = queue.shift();
	if (operationType === 'setGuiContext') {
		currentGuiContext = operationData.context; // for error messages
		if (queue.length === 0) return;
		[operationType, operationData] = queue.shift();
	}
	switch(operationType) {
		case 'click': return Navigator.click(operationData.slot);
		case 'anvil': return Navigator.inputAnvil(operationData.text);
		case 'returnToEditActions': return Navigator.returnToEditActions();
		case 'back': return Navigator.goBack();
		case 'option': return Navigator.setSelecting(operationData.option);
		case 'chat': return Navigator.inputChat(operationData.text);
		case 'item': return Navigator.selectItem(operationData.item);
		case 'done': return doneLoading(operationData.actionName, operationData.actionAuthor);
	}
})

function doneLoading(actionName, actionAuthor) {
	timeWithoutOperation = 0;
	queue = [];
	operationTimes = { started: 0, total: 0 };
	Client.currentGui.close();

	if (fails.length > 0) {
		ChatLib.chat(`&cFailed to load: &f(${fails.length} error${fails.length > 1 ? 's' : ''})`);
		fails.forEach(fail => ChatLib.chat('   > ' + fail));
		fails = [];
		ChatLib.chat(`&f${queue.length} &coperation${queue.length !== 1 ? 's' : ''} left in queue.`);
	} else {
		ChatLib.chat(`HTSL imported successfully!`);
	}
}

const timeRemainingButton = new Button(0, 0, 0, 20, 'Time Remaining:');

register('guiRender', (x, y) => {
	if (!Player.getContainer()) return;
	if (queue.length === 0) return;

	timeRemainingButton.setWidth(200);
	timeRemainingButton.setX(Renderer.screen.getWidth() / 2 - timeRemainingButton.getWidth() / 2);
	timeRemainingButton.setY(timeRemainingButton.getHeight() * 3);

	timeRemainingButton.render(x,y);
})


export function addOperation(operation) {
	queue.push(operation);
}