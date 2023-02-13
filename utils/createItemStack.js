const NBTList = Java.type('net.minecraft.nbt.NBTTagList');
const NBTCompound = Java.type('net.minecraft.nbt.NBTTagCompound');

export default (itemData) => {
	let customItem = new Item(itemData.id);
	if (itemData.name) customItem.setName(itemData.name);
	if (itemData.meta) customItem.itemStack.func_77964_b(itemData.meta);
	if (itemData.lore) customItem.setLore(itemData.lore);
	if (itemData.damage) customItem.setDamage(itemData.damage);
	if (itemData.unbreakable || itemData.enchantments || itemData.hideFlags) {
		const nbt = customItem.itemStack.func_77978_p();

		if (itemData.unbreakable) nbt.func_74757_a('Unbreakable', true);
		if (itemData.enchantments) {
			const enchants = new NBTList();
			itemData.enchantments.forEach(enchant => {
				const enchantNBT = new NBTCompound();
				enchantNBT.func_74768_a('id', enchant[0]);
				enchantNBT.func_74768_a('lvl', enchant[1]);
				enchants.func_74742_a(enchantNBT);
			});
			nbt.func_74782_a('ench', enchants);
		}
		if (itemData.hideFlags) nbt.func_74768_a('HideFlags', itemData.hideFlags);
		customItem.itemStack.func_77982_d(nbt);
	}
	return customItem.itemStack;
}