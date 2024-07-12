import { Input, Button } from './GuiBuilder';
import { compile, isImporting } from '../compiler/compile';
import exportAction from '../compiler/exportAction';
import Settings from '../utils/config';
import getItemFromNBT from '../utils/getItemFromNBT';
import loadItemstack from '../utils/loadItemstack';

const guiTopField = net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredField('field_147009_r');
const xSizeField = net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredField('field_146999_f');
guiTopField.setAccessible(true);
xSizeField.setAccessible(true);

// init buttons
const importButton = new Button(0, 0, 0, 20, 'Import HTSL');
const exportButton = new Button(0, 0, 0, 20, 'Export HTSL');
const refreshFiles = new Button(0, 0, 0, 20, '⟳');
const backDir = new Button(0, 0, 0, 20, '⇪');
const forwardPage = new Button(0, 0, 15, 20, '⇨');
const backwardPage = new Button(0, 0, 15, 20, '⇦');
const toggleShow = new Button(0, 0, 0, 20, '⇩');
let show = false;

// load assets
const htslIcon = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/htsl.png`)
	)
);
const itemIcon = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/item.png`)
	)
);
const folderIcon = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/folder.png`)
	)
);
const nh_htslIcon = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/nh_htsl.png`)
	)
);
const nh_itemIcon = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/nh_item.png`)
	)
);
const nh_folderIcon = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/nh_folder.png`)
	)
);
const trashBin = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/bin_closed.png`)
	)
);
const openTrashBin = new Image(
	javax.imageio.ImageIO.read(
		new java.io.File(`./config/ChatTriggers/modules/HTSL/assets/bin.png`)
	)
);
const menuClick = new Sound({ source: "click.ogg", category: "master" });
const trashSound = new Sound({ source: "paper.ogg", category: "master" });

const input = new Input(0, 0, 0, 18);
input.setEnabled(false);
input.setText('Enter File Name');
input.mcObject.func_146203_f(1000); // set max length

// const exportButton = new Button(0, 0, 0, 20, 'Export HTSL');

let files = [];
let filteredFiles = [];
let subDir = "";
let page = 0;
let linesPerPage;
let hoveringIndex;
let renderItemIcons = [];

register('guiRender', (x, y) => {
	if (!Player.getContainer()) return;
	if (!isInActionGui()) return;
	if (isImporting()) return;

	// placements
	// let chestGuiTop = guiTopField.get(Client.currentGui.get());
	let chestWidth = xSizeField.get(Client.currentGui.get());
	let chestX = Renderer.screen.getWidth() / 2 - chestWidth / 2;
	let topBound = input.getY() + 30;
	let xBound = input.getX() + input.getWidth();

	input.setY(Renderer.screen.getHeight() / 7 - 20);
	input.setWidth(chestX * 6 / 7);
	input.setX(chestX / 2 - input.getWidth() / 2);

	importButton.setY(input.getY() - 25);
	exportButton.setY(input.getY() - 25);
	importButton.setX(input.getX());
	importButton.setWidth(input.getWidth() / 2);
	exportButton.setX(input.getX() + input.getWidth() / 2);
	exportButton.setWidth(importButton.getWidth());
	try {
		if ((Settings.toggleFileExplorer && show) || !Settings.toggleFileExplorer) {
			refreshFiles.setWidth(chestX - xBound - 10 < 10 ? 10 : chestX - xBound - 10);
			refreshFiles.setX((chestX - xBound) / 2 + xBound - refreshFiles.getWidth() / 2);
			refreshFiles.setY(input.getY());
			backDir.setWidth(chestX - xBound - 10 < 10 ? 10 : chestX - xBound - 10);
			backDir.setX((chestX - xBound) / 2 + xBound - refreshFiles.getWidth() / 2);
			backDir.setY(input.getY() - 25);

			forwardPage.setY(Renderer.screen.getHeight() / 7 * 6 + 2);
			forwardPage.setX(input.getWidth() + input.getX() - 5);
			backwardPage.setY(Renderer.screen.getHeight() / 7 * 6 + 2);
			backwardPage.setX(input.getX() - 5);

			// rendering

			Renderer.drawRect(Renderer.color(30, 30, 30, 200), input.getX() - 5, topBound, input.getWidth() + 10, Renderer.screen.getHeight() / 7 * 6 - topBound);

			linesPerPage = Math.floor((Renderer.screen.getHeight() / 7 * 6 - topBound - 9) / 20);
			let hovered = false;
			for (let i = page * linesPerPage; i < filteredFiles.length && i < (page + 1) * linesPerPage; i++) {
				let type;
				if (filteredFiles[i].endsWith(".htsl")) {
					type = Settings.altIcons ? nh_htslIcon : htslIcon;
				} else if (filteredFiles[i].endsWith(".json")) {
					type = Settings.altIcons ? nh_itemIcon : itemIcon;
				} else if (!filteredFiles[i].includes(".")) {
					type = Settings.altIcons ? nh_folderIcon : folderIcon;
				}
				if (y < topBound + 20 + 20 * (i - page * linesPerPage) && y > topBound + 20 * (i - page * linesPerPage) && x < xBound && x > input.getX()) {
					if (hoveringIndex != i) {
						menuClick.rewind();
						menuClick.play();
						hoveringIndex = i;
					}
					hovered = true;
					Renderer.drawRect(Renderer.color(60, 60, 60, 200), input.getX() - 3, topBound + 2 + 20 * (i - page * linesPerPage), input.getWidth() + 6, 21);
					if (filteredFiles[i].includes(".")) {
						if (x < xBound - 8 && x > xBound - 24) {
							Renderer.drawImage(openTrashBin, xBound - 24, topBound + 3 + 20 * (i - page * linesPerPage), 16, 16);
						} else {
							Renderer.drawImage(trashBin, xBound - 24, topBound + 3 + 20 * (i - page * linesPerPage), 16, 16);
						}
					}
					if (Settings.itemIcons && filteredFiles[i].endsWith(".json")) {
						let item
						if (renderItemIcons[subDir.replace("\\", "/") + filteredFiles[i]]) item = renderItemIcons[subDir.replace("\\", "/") + filteredFiles[i]];
						else {
							item = getItemFromNBT(JSON.parse(FileLib.read("HTSL", `imports/${subDir.replace("\\", "/")}${filteredFiles[i]}`)).item);
							renderItemIcons[subDir.replace("\\", "/") + filteredFiles[i]] = item;
						}
						if (!item) {
							Renderer.drawImage(type, input.getX() - 2, topBound + 3 + 20 * (i - page * linesPerPage), 20, 20);
						} else {
							item.draw(input.getX(), topBound + 4 + 20 * (i - page * linesPerPage), 1, 200);
						}
					} else Renderer.drawImage(type, input.getX() - 2, topBound + 3 + 20 * (i - page * linesPerPage), 20, 20);
					Renderer.drawString(filteredFiles[i].replace(subDir, "").replace("\\", ""), input.getX() + 21, topBound + 9 + 20 * (i - page * linesPerPage), true);
				} else {
					if (Settings.itemIcons && filteredFiles[i].endsWith(".json")) {
						let item
						if (renderItemIcons[subDir.replace("\\", "/") + filteredFiles[i]]) item = renderItemIcons[subDir.replace("\\", "/") + filteredFiles[i]];
						else {
							item = getItemFromNBT(JSON.parse(FileLib.read("HTSL", `imports/${subDir.replace("\\", "/")}${filteredFiles[i]}`)).item);
							renderItemIcons[subDir.replace("\\", "/") + filteredFiles[i]] = item;
						}
						if (!item) {
							Renderer.drawImage(type, input.getX(), topBound + (Settings.altIcons ? 6 : 5) + 20 * (i - page * linesPerPage), Settings.altIcons ? 14 : 16, Settings.altIcons ? 14 : 16);
						} else {
							item.draw(input.getX(), topBound + 4 + 20 * (i - page * linesPerPage), 1, 200);
						}
					} else Renderer.drawImage(type, input.getX(), topBound + (Settings.altIcons ? 6 : 5) + 20 * (i - page * linesPerPage), Settings.altIcons ? 14 : 16, Settings.altIcons ? 14 : 16);
					Renderer.drawString(filteredFiles[i].replace(subDir, "").replace("\\", "").replace(/(.*)\.(.*)/, "$1&8.$2"), input.getX() + 21, topBound + 9 + 20 * (i - page * linesPerPage), true);
				}
				// Renderer.drawImage(openTrashBin, xBound - 24, topBound + 3 + 20 * (i - page * linesPerPage), 16, 16);
				if (input.getText() != "Enter File Name" && input.getText() != "") {
					Renderer.drawRect(Renderer.color(252, 229, 15, 100), input.getX() + 21 + Renderer.getStringWidth(filteredFiles[i].substring(0, filteredFiles[i].toLowerCase().indexOf(input.getText().toLowerCase()))), topBound + 5 + 20 * (i - page * linesPerPage), Renderer.getStringWidth(input.getText()), 17)
				}
			}
			if (!hovered) hoveringIndex = -1;
			if (filteredFiles.length == 0) {
				Renderer.drawString("Nothing is here...", input.getX() + 10, topBound + 9, true);
			}

			if (subDir != "") {
				backDir.render(x, y);
				Renderer.drawString("&7/" + subDir.replace(/\\/g, "/"), chestX / 2 - Renderer.getStringWidth("/" + subDir.replace(/\\/g, "/")) / 2, topBound - 10, true)
			};
			if ((page + 1) * linesPerPage < filteredFiles.length) {
				forwardPage.render(x, y);
			}
			if (page > 0) {
				backwardPage.render(x, y);
			}
			refreshFiles.render(x, y);
		}
	} catch (e) { console.log(e) }
	if (Settings.toggleFileExplorer) {
		toggleShow.setX(input.getX() - 15);
		toggleShow.setWidth(10);
		toggleShow.setY(input.getY());
		toggleShow.render(x, y);
	}
	input.render();
	importButton.render(x, y);
	exportButton.render(x, y);
});

register('guiKey', (char, keyCode, gui, event) => {
	if (!Player.getContainer()) return;
	if (!isInActionGui()) return;

	input.mcObject.func_146195_b(true);
	if (input.mcObject.func_146206_l()) {
		input.mcObject.func_146201_a(char, keyCode);
		if (input.getText() != "Enter File Name") filteredFiles = files.filter(n => n.toLowerCase().includes(input.getText().toLowerCase()))
		else filteredFiles = files;
		// fileInputUpdate()
		if (keyCode !== 1) { // keycode for escape key
			cancel(event);
		}
	}
});

let lastClick = 0;

register('guiMouseClick', (x, y, mouseButton) => {
	if (!Player.getContainer()) return;
	if (!isInActionGui()) return;

	if (isImporting()) return;

	if (Settings.debounce > Date.now() - lastClick) return;
	lastClick = Date.now();

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

	if (isButtonHovered(refreshFiles, x, y)) { readFiles(); World.playSound('random.click', 0.5, 1) }
	if (subDir != "" && isButtonHovered(backDir, x, y)) {
		if (subDir.endsWith("\\")) {
			subDir = subDir.slice(0, -1);
		}
		let lastBackslashIndex = subDir.lastIndexOf("\\");
		if (lastBackslashIndex !== -1) {
			subDir = subDir.slice(0, lastBackslashIndex + 1); // Keep the backslash at the end
		} else {
			subDir = ""; // Set to empty string if no more backslashes
		}

		readFiles();
		World.playSound('random.click', 0.5, 1);
	}
	if ((page + 1) * linesPerPage < files.length && isButtonHovered(forwardPage, x, y)) {
		page++;
		World.playSound('random.click', 0.5, 1);
	}
	if (page > 0 && isButtonHovered(backwardPage, x, y)) {
		page--;
		World.playSound('random.click', 0.5, 1);
	}
	if (Settings.toggleFileExplorer && isButtonHovered(toggleShow, x, y)) {
		show = !show;
		World.playSound('random.click', 0.5, 1);
		toggleShow.setText(show ? '⇧' : '⇩');
		readFiles();
	}

	handleInputClick(importButton, compile, x, y);
	handleInputClick(exportButton, exportAction, x, y);

	let index = -1;
	if (x >= input.getX() && x <= input.getX() + input.getWidth()) {
		index = Math.floor((y - (input.getY() + 30)) / 20);
		if (index < 0 || index >= linesPerPage || index >= filteredFiles.length) {
			index = -1; // Ensure the index is within the bounds of the array
		} else {
			index += page * linesPerPage;
		}
	}
	if (index >= 0) {
		if (!filteredFiles[index]) return;
		if (filteredFiles[index].includes(".")) {
			if (x < input.getX() + input.getWidth() - 8 && x > input.getX() + input.getWidth() - 24) {
				trashSound.rewind();
				trashSound.play();
				FileLib.delete("HTSL", `imports/${subDir.replace("\\", "/")}${filteredFiles[index]}`);
				files = [];
				filteredFiles = [];
				readFiles();
				return;
			}
		}
		if (filteredFiles[index].endsWith('.htsl')) {
			if (Player.asPlayerMP().player.field_71075_bZ.field_75098_d === false) ChatLib.command("gmc");
			if (compile(subDir.replace("\\", "/") + filteredFiles[index].substring(0, filteredFiles[index].length - 5))) World.playSound('random.click', 0.5, 1);
			if (Settings.saveFiles) {
				input.setText(filteredFiles[index].substring(0, filteredFiles[index].length - 5));
				filteredFiles = files.filter(n => n.toLowerCase().includes(input.getText().toLowerCase()));
			}
		} else if (!filteredFiles[index].includes(".")) {
			subDir += filteredFiles[index];
			files = [];
			filteredFiles = [];
			readFiles();
			World.playSound('random.click', 0.5, 1);
		} else {
			if (Player.asPlayerMP().player.field_71075_bZ.field_75098_d === false) {
				World.playSound('mob.villager.no', 0.5, 1);
				return ChatLib.chat(`&3[HTSL] &cMust be in creative mode to import an item!`);
			}
			let nbt = JSON.parse(FileLib.read('HTSL', `/imports/${subDir.replace("\\", "/") + filteredFiles[index]}`)).item;
			let item = getItemFromNBT(nbt);
			let slot = Player.getInventory().getItems().indexOf(null);
			if (slot < 9) slot += 36;
			loadItemstack(item.getItemStack(), slot);
			World.playSound('random.click', 0.5, 1);
		}
	}
});

function handleInputClick(button, action, x, y) {
	if (isButtonHovered(button, x, y)) {
		World.playSound('random.click', 0.5, 1)

		if (input.getText() === "Enter File Name" || input.getText() === "") {
			input.setText('default');
		}

		if (Player.asPlayerMP().player.field_71075_bZ.field_75098_d === false) ChatLib.command("gmc");
		action(subDir + input.getText());

		input.setSelectionEnd(0);
		input.setCursorPosition(0);
		input.setLineScrollOffset(0);
		input.setIsFocused(false);
		if (!Settings.saveFile || input.getText() == "default") input.setText('Enter File Name');
	}
}

function isButtonHovered(button, x, y) {
	return x > button.getX() &&
		x < button.getX() + button.getWidth() &&
		y > button.getY() &&
		y < button.getY() + button.getHeight();
}

register('guiClosed', (gui) => {
	if (gui.class.getName() !== 'net.minecraft.client.gui.inventory.GuiChest') return;

	const lowerChestField = gui.class.getDeclaredField('field_147015_w');
	lowerChestField.setAccessible(true);
	const lowerChest = lowerChestField.get(gui);

	const inventoryTitleField = net.minecraft.inventory.InventoryBasic.class.getDeclaredField('field_70483_a');
	inventoryTitleField.setAccessible(true);
	const inventoryTitle = inventoryTitleField.get(lowerChest);

	if (inventoryTitle !== 'Edit Actions') return;

	if (importButton.getText() === 'Error') {
		importButton.setEnabled(true);
		importButton.setText('Import HTSL');
	}
});

register('guiOpened', (gui) => {
	if (!Player.getContainer()) return;
	// for some reason this event triggers before the gui actually loads?? so we have to wait
	setTimeout(() => {
		if (!isInActionGui()) return wasInActionGui = false;
		if (wasInActionGui) return;
		if (!wasInActionGui && isInActionGui()) wasInActionGui = true;

		if (!Settings.saveDirectory) subDir = "";
		readFiles();
	}, 50);
});

let wasInActionGui = false;
function isInActionGui() {
	const containerName = Player.getContainer().getName();
	if (Client.currentGui.getClassName() === "GuiEditSign") return false;
	if (Player.getContainer().getClassName() !== "ContainerChest") return false;
	if (containerName.match(/Edit Actions|Actions: /)) return true;
	return false;
}

function readFiles() {
	page = 0;
	files = [];
	filteredFiles = [];
	renderItemIcons = [];
	if (Settings.toggleFileExplorer && !show) return;
	try {
		files = readDir(`./config/ChatTriggers/modules/HTSL/imports/${subDir.replace(/\\+/g, "/")}`, false).filter(n => n.endsWith(".htsl") || n.endsWith(".json") || !n.includes("."));
		files.sort().sort((a, b) => {
			let isDirA = a.endsWith('\\');
			let isDirB = b.endsWith('\\');

			if (isDirA && !isDirB) return -1;
			if (!isDirA && isDirB) return 1;

			let extA = a.split('.').pop();
			let extB = b.split('.').pop();
			if (extA < extB) return -1;
			if (extA > extB) return 1;

			return 0;
		});
		if (input.getText() != "Enter File Name") filteredFiles = files.filter(n => n.toLowerCase().includes(input.getText().toLowerCase()));
		else filteredFiles = files;
	} catch (e) {
		console.error(e);
		ChatLib.chat(`&3[HTSL] &cSomething went wrong reading your imports...`);
	}
}

function readDir(path, walk) {
	let files = new java.io.File(path).listFiles();
	let fileNames = [];
	files.forEach(file => {
		if (file.isDirectory()) {
			if (walk) {
				readDir(path + file.getName() + "/").forEach(newFile => fileNames.push((file.toString() + "\\" + newFile.toString()).substring(path.length)));
			} else {
				fileNames.push(file.toString().substring(path.length) + "\\");
			}
		} else {
			fileNames.push(file.toString().substring(path.length));
		}
	});
	return fileNames;
}