import Settings from '../utils/config';
import utilInputAnvil from '../utils/inputAnvil';
import loadItem from '../utils/loadItemstack';

function getItemFromNBT(nbtStr) {
  let nbt = net.minecraft.nbt.JsonToNBT.func_180713_a(nbtStr); // Get MC NBT object from string
  let count = nbt.func_74771_c('Count') // get byte
  let id = nbt.func_74779_i('id') // get string
  let damage = nbt.func_74765_d('Damage') // get short
  let tag = nbt.func_74781_a('tag') // get tag
  let item = new Item(id); // create ct item object
  item.setStackSize(count);
  item = item.getItemStack(); // convert to mc object
  item.func_77964_b(damage); // set damage of mc item object
  if (tag) item.func_77982_d(tag); // set tag of mc item object
  item = new Item(item); // convert back to ct object
  return item;
}

const S2EPacketCloseWindow = Java.type(
  "net.minecraft.network.play.server.S2EPacketCloseWindow"
);
const C0EPacketClickWindow = Java.type(
  "net.minecraft.network.play.client.C0EPacketClickWindow"
);
const slotIdField =
  C0EPacketClickWindow.class.getDeclaredField("field_149552_b");
slotIdField.setAccessible(true);

const arrow = new Image(
  javax.imageio.ImageIO.read(
    new java.io.File("./config/ChatTriggers/modules/HTSL/assets/red-arrow.png")
  )
);
let drawArrow = false;
let drawArrowAt = { x: 0, y: 0 };
let slotToClick = -1;

const guiTopField =
  net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredField(
    "field_147009_r"
  );
const guiLeftField =
  net.minecraft.client.gui.inventory.GuiContainer.class.getDeclaredField(
    "field_147003_i"
  );
guiTopField.setAccessible(true);
guiLeftField.setAccessible(true);

register("postGuiRender", () => {
  if (drawArrow) {
    Renderer.translate(0, 0, 400);
    Renderer.drawImage(
      arrow,
      drawArrowAt.x + drawArrowAt.offsetX,
      drawArrowAt.y + drawArrowAt.offsetY,
      50,
      50
    );
  }
}).setPriority(Priority.HIGHEST);

register("guiOpened", (event) => {
  setNotReady();
  if (event.gui.class.toString() == "class net.minecraft.client.gui.inventory.GuiInventory") return;
  Navigator.guiIsLoading = true;
});

register("packetSent", (packet, event) => {
  if (Player.getContainer().getName() === "Housing Menu") return;
  if (!Navigator.isWorking) return;
  const slotId = slotIdField.get(packet);
  if (!slotId) return;
  if (slotId !== slotToClick) cancel(event);
  else slotToClick = -1;
}).setFilteredClass(C0EPacketClickWindow);

let chatInput = "";

function getChatInput() {
  return chatInput;
}

register("chat", (event) => {
  if (!Navigator.isWorking) return;
  Navigator.isReady = true;
  chatInput = new Message(EventLib.getMessage(event)).getMessageParts()[1].getClickValue();
  cancel(event);
}).setCriteria(
  /->newLine<-Please enter the text you wish to set in chat!->newLine<- (?:\[PREVIOUS\] )?\[CANCEL\]/
);

register("guiRender", () => {
  if (Navigator.isReady) return;
  if (!Player.getContainer()) return;
  let container = Player.getContainer();
  if (container.getClassName() === "ContainerCreative") return;
  if (container.getName() === "Housing Menu") return;
  if (Navigator.itemsLoaded.lastItemAddedTimestamp === 0) return; // no items loaded yet so wait for items to load
  if (container.getItems().splice(container.getSize() - 44, 9).filter(n => n).length == 0 && container.getClassName() !== "ContainerPlayer") return;
  Navigator.isReady = true;
  Navigator.guiIsLoading = false;
});

// wait for all items in gui to load before continuing
register("renderItemIntoGui", (item) => {
  if (Navigator.guiIsLoading) {
    if (item.name in Navigator.itemsLoaded.items) return;
    Navigator.itemsLoaded.items[item.name] = item;
    Navigator.itemsLoaded.lastItemAddedTimestamp = Date.now();
  }
});

function setArrowToSlot(slotId) {
  const MCSlot = Player.getContainer().container.func_75139_a(slotId);
  const slot = new Slot(MCSlot);
  const slotX = slot.getDisplayX();
  const slotY = slot.getDisplayY();
  const guiTop = guiTopField.get(Client.currentGui.get());
  const guiLeft = guiLeftField.get(Client.currentGui.get());
  drawArrowAt = {
    x: slotX + guiLeft,
    y: slotY + guiTop,
    offsetX: 10,
    offsetY: -45,
  };
  setNotReady();
  drawArrow = true;
}

function click(slotId) {
  slotToClick = slotId;
  if (Settings.useSafeMode) {
    setArrowToSlot(slotId);
  } else {
    Client.sendPacket(
      new C0EPacketClickWindow(
        Player.getContainer().getWindowId(),
        slotId,
        0,
        0,
        null,
        0
      )
    );
    setNotReady();
  }
}

function returnToEditActions() {
  Navigator.isReturning = true;
  const containerName = Player.getContainer().getName();
  if (containerName.match(/Edit |Actions: /))
    return (Navigator.isReturning = false);
  goBack();
}

function setSelecting(option) {
  Navigator.isSelecting = true;
  Navigator.optionBeingSelected = option;
}

function selectItem(item) {
  switch (item.type) {
    case "customItem":
      const itemStack = getItemFromNBT(
        item.item.replace(/\\/g, "")
      ).getItemStack();
      Navigator.isLoadingItem = true;
      loadItem(itemStack, 26);
      setNotReady();
      break;
    case "clickSlot":
      click(item.slot + 35);
      break;
  }
}

register("guiKey", (_character, code, _gui, event) => {
  if (Navigator.goto) return;
  if (!Navigator.isWorking) return;
  // if (
  //   code === Keyboard.KEY_ESCAPE ||
  //   code === Client.getMinecraft().field_71474_y.field_151445_Q.func_151463_i()
  // )
  //   cancel(event);
});

register("packetReceived", (packet, event) => {
  if (packet instanceof S2EPacketCloseWindow) {
    if (Settings.useSafeMode || !Navigator.isWorking) return;
    cancel(event);
  }

  if (!Navigator.isLoadingItem) return;
  if (
    packet.class.getName() ===
    "net.minecraft.network.play.server.S2FPacketSetSlot"
  ) {
    const containerName = Player.getContainer().getName();
    if (containerName !== "Select an Item") return;
    Navigator.isLoadingItem = false;
    click(53); // slot that is used to load items
  }
});

function selectOption(optionName) {
  const playerContainer = Player.getContainer();

  let index = -1;

  for (let item of playerContainer.getItems()) {
    index++;
    if (item === null) continue; // skip the empty slots
    if (ChatLib.removeFormatting(item.name) === optionName) {
      click(index);
      Navigator.isSelecting = false;
      return;
    }
  }
  if (playerContainer.getStackInSlot(53)?.getID() === 262) {
    click(53);
    return;
  }
  goBack();
  Navigator.isSelecting = false;
  return false;
}

const goBack = () => click(Player.getContainer().getSize() - 5 - 36); // click the back button on all size guis

function inputAnvil(text) {
  slotToClick = 2;
  utilInputAnvil(text, true);
  setNotReady();
}

function inputChat(text, func, command) {
  if (text.startsWith("/") && !command) text = "&r" + text;
  if (func) {
    Navigator.func = func;
  }
  if (Settings.useSafeMode) Client.Companion.setCurrentChatMessage(text);
  else {
    ChatLib.say(`${command? "" : "/ac "}` + text);
  }
  setNotReady();
}

register("chat", (event) => {
  if (!Navigator.isWorking) return;
  ChatLib.command(`function create ${Navigator.func}`);
  cancel(event);
}).setCriteria("Could not find a function with that name!");

function setNotReady() {
  Navigator.itemsLoaded = { items: {}, lastItemAddedTimestamp: 0 };
  Navigator.isReady = false;
  drawArrow = false;
}

export default Navigator = {
  isWorking: false,
  isReady: false,
  isSelecting: false,
  isReturning: false,
  isLoadingItem: false,
  guiIsLoading: true,
  goto: false,
  itemsLoaded: { items: {}, lastItemAddedTimestamp: 0 },
  getChatInput,
  selectOption,
  selectItem,
  setSelecting,
  click,
  goBack,
  returnToEditActions,
  inputAnvil,
  inputChat,
};