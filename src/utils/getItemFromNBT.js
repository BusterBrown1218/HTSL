// Get a ChatTriggers item object from a string of NBT
const getItemFromNBT = (nbtStr) => {
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

export default getItemFromNBT;
