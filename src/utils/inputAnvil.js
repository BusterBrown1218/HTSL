export default (input) => {
	if (Client.currentGui.getClassName() === 'GuiRepair') { // check if in anvil gui
		let outputSlotField = Player.getContainer().container.class.getDeclaredField('field_82852_f');
		outputSlotField.setAccessible(true);
		let outputSlot = outputSlotField.get(Player.getContainer().container); // outputSlot is a net.minecraft.inventory.InventoryCraftResult

		let outputSlotItemField = outputSlot.class.getDeclaredField('field_70467_a');
		outputSlotItemField.setAccessible(true);
		let outputSlotItem = outputSlotItemField.get(outputSlot); // array with one item, net.minecraft.item.ItemStack

		outputSlotItem[0] = new Item(339).setName(input).itemStack; // set the single item in the array an item with the name of the input

		outputSlotItemField.set(outputSlot, outputSlotItem); // actually set the outputSlot in the anvil to the new item

		Player.getContainer().click(2, false) // click that new item
	}
}
