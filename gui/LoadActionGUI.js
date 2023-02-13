import { Input, Button } from './GuiBuilder';
import loadAction from '../compiler/loadAction';

const button = new Button(0, 0, 0, 20, 'Import HTSL');

const input = new Input(0, 0, 0, 18);
input.setEnabled(false);
input.setText('Enter File Name')
input.mcObject.func_146203_f(24) // set max length

register('guiRender', (x, y) => {
	if (!Player.getContainer()) return;
	if (!isInActionGui()) return;

	const guiTopField = net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredField('field_147009_r');
	const xSizeField = net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredField('field_146999_f');
	guiTopField.setAccessible(true);
	xSizeField.setAccessible(true);
	var chestGuiTop = guiTopField.get(Client.currentGui.get())
	var chestWidth = xSizeField.get(Client.currentGui.get())

	const margin = 30;
	const sizeDifference = 10;

	button.setWidth(chestWidth / 2 - sizeDifference);
	button.setX(Renderer.screen.getWidth() / 2 + sizeDifference);
	button.setY(chestGuiTop - button.getHeight() - 29);

	input.setWidth(chestWidth / 2 + sizeDifference - 5);
	input.setX(Renderer.screen.getWidth() / 2 - input.getWidth() + sizeDifference - 5);
	input.setY(chestGuiTop - input.getHeight() - margin);

	button.render(x, y);
	input.render();
})

register('guiKey', (char, keyCode, gui, event) => {
	if (!Player.getContainer()) return;
	if (!isInActionGui()) return;

	input.mcObject.func_146195_b(true);
	if (input.mcObject.func_146206_l()) {
		input.mcObject.func_146201_a(char, keyCode);
		// fileInputUpdate()
		if (keyCode !== 1) { // keycode for escape key
			cancel(event)
		}
	}
})

function fileInputUpdate() {
	// if (input.getText().length > 0) {
	// 	button.setText('Import HTSL');
	// 	button.setEnabled(true);
	// } else if (input.getText().length === 0) {
	// 	button.setEnabled(false);
	// }
}

register('guiMouseClick', (x, y, mouseButton) => {
	if (!Player.getContainer()) return;
	if (!isInActionGui()) return;

	input.mcObject.func_146192_a(x, y, mouseButton);
	if (x > input.getX() && x < input.getX() + input.getWidth() && y > input.getY() && y < input.getY() + input.getHeight()) {
		if (input.getText() === 'Enter File Name') {
			input.setText('')
			input.setCursorPosition(0);
		}
		input.setEnabled(true);
	} else {
		input.setEnabled(false);
	}

	if (x > button.getX() && x < button.getX() + button.getWidth() && y > button.getY() && y < button.getY() + button.getHeight()) {
		// if (!button.getEnabled()) {
		// 	World.playSound('mob.villager.no', 1, 1)
		// 	return;
		// };

		World.playSound('random.click', 1, 1)
		button.setText('Getting Data...');
		button.setEnabled(true);

		loadAction(input.getText());

		input.setSelectionEnd(0);
		input.setCursorPosition(0);
		input.setLineScrollOffset(0);
		input.setIsFocused(false);
		input.setText('Enter File Name');

		button.setText('Import HTSL');
		button.setEnabled(true);
	}
})

register('guiClosed', (gui) => {
	if (gui.class.getName() !== 'net.minecraft.client.gui.inventory.GuiChest') return;

	const lowerChestField = gui.class.getDeclaredField('field_147015_w');
	lowerChestField.setAccessible(true);
	const lowerChest = lowerChestField.get(gui);

	const inventoryTitleField = net.minecraft.inventory.InventoryBasic.class.getDeclaredField('field_70483_a');
	inventoryTitleField.setAccessible(true);
	const inventoryTitle = inventoryTitleField.get(lowerChest);

	if (inventoryTitle !== 'Edit Actions') return;

	if (button.getText() === 'Error') {
		button.setEnabled(true);
		button.setText('Import HTSL');
	}
})

function isInActionGui() {
	const containerName = Player.getContainer().getName();
	if (Client.currentGui.getClassName() === "GuiEditSign") return
	if (Player.getContainer().getClassName() !== 'ContainerChest') return false;
	if (containerName.match(/Edit |Actions: /)) return true;
	return false;
}
