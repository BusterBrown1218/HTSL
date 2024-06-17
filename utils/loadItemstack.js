const C10PacketCreativeInventoryAction = Java.type("net.minecraft.network.play.client.C10PacketCreativeInventoryAction");
// https://wiki.vg/Protocol#Creative_Inventory_Action

export default (itemStack, slot) => {
	if (Player.getInventory().getStackInSlot(slot - 5) != null && Player.getInventory().getStackInSlot(slot - 5).getItemStack().func_179549_c(itemStack)) return;
	Client.sendPacket(
		new C10PacketCreativeInventoryAction(
			slot, // slot, 36=hotbar slot 1
			itemStack // item to get as a minecraft item stack object
		)
	);
}