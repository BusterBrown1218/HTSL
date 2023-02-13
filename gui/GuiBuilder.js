const GuiButton = net.minecraft.client.gui.GuiButton;
const GuiTextField = net.minecraft.client.gui.GuiTextField;

export class Input {
	constructor(x, y, width, height) {
		this.mcObject = new GuiTextField(0, Client.getMinecraft().field_71466_p, x, y, width, height);
		this.getX = () => { return this.mcObject.field_146209_f };
		this.getY = () => { return this.mcObject.field_146210_g };
		this.getWidth = () => { return this.mcObject.field_146218_h };
		this.getHeight = () => { return this.mcObject.field_146219_i };
		this.setX = (x) => { this.mcObject.field_146209_f = x };
		this.setY = (y) => { this.mcObject.field_146210_g = y };
		this.setWidth = (width) => { this.mcObject.field_146218_h = width };
		this.setHeight = (height) => { this.mcObject.field_146219_i = height };
		this.setEnabled = (enabled) => {
			const isEnabledField = this.mcObject.class.getDeclaredField('field_146226_p');
			isEnabledField.setAccessible(true);
			isEnabledField.set(this.mcObject, enabled);
		};
		this.setText = (text) => {
			const textField = this.mcObject.class.getDeclaredField('field_146216_j');
			textField.setAccessible(true);
			textField.set(this.mcObject, text);
		}
		this.getText = () => {
			const textField = this.mcObject.class.getDeclaredField('field_146216_j');
			textField.setAccessible(true);
			return textField.get(this.mcObject);
		}
		this.setSelectionEnd = (position) => {
			const Integer = Java.type('java.lang.Integer');
			const pos = new Integer(position);
			const selectionEndField = this.mcObject.class.getDeclaredField('field_146223_s');
			selectionEndField.setAccessible(true);
			selectionEndField.set(this.mcObject, pos);
		}
		this.setCursorPosition = (position) => {
			const Integer = Java.type('java.lang.Integer');
			const pos = new Integer(position);
			const cursorPositionField = this.mcObject.class.getDeclaredField('field_146224_r');
			cursorPositionField.setAccessible(true);
			cursorPositionField.set(this.mcObject, pos);
		}
		this.setLineScrollOffset = (offset) => {
			const Integer = Java.type('java.lang.Integer');
			const offsetInt = new Integer(offset);
			const lineScrollOffsetField = this.mcObject.class.getDeclaredField('field_146225_q');
			lineScrollOffsetField.setAccessible(true);
			lineScrollOffsetField.set(this.mcObject, offsetInt);
		}
		this.setIsFocused = (isFocused) => {
			const isFocusedField = this.mcObject.class.getDeclaredField('field_146213_o');
			isFocusedField.setAccessible(true);
			isFocusedField.set(this.mcObject, isFocused);
		}
		this.render = () => {
			this.mcObject.func_146194_f();
		}
	}
}

export class Button {
	constructor(x, y, width, height, text) {
		this.mcObject = new GuiButton(0, x, y, width, height, text);
		this.getX = () => { return this.mcObject.field_146128_h }
		this.getY = () => { return this.mcObject.field_146129_i }
		this.getWidth = () => { return this.mcObject.field_146120_f }
		this.getHeight = () => { return this.mcObject.field_146121_g }
		this.setX = (x) => { this.mcObject.field_146128_h = x }
		this.setY = (y) => { this.mcObject.field_146129_i = y }
		this.setWidth = (width) => { this.mcObject.field_146120_f = width }
		this.setHeight = (height) => { this.mcObject.field_146121_g = height }
		this.setEnabled = (enabled) => {
			const isEnabledField = this.mcObject.class.getDeclaredField('field_146124_l');
			isEnabledField.setAccessible(true);
			isEnabledField.set(this.mcObject, enabled);
		}
		this.getEnabled = () => {
			const isEnabledField = this.mcObject.class.getDeclaredField('field_146124_l');
			isEnabledField.setAccessible(true);
			return isEnabledField.get(this.mcObject);
		}
		this.setText = (text) => {
			const textField = this.mcObject.class.getDeclaredField('field_146126_j');
			textField.setAccessible(true);
			textField.set(this.mcObject, text);
		}
		this.getText = () => {
			const textField = this.mcObject.class.getDeclaredField('field_146126_j');
			textField.setAccessible(true);
			return textField.get(this.mcObject);
		}
		this.render = (x,y) => {
			this.mcObject.func_146112_a(Client.getMinecraft(), x, y);
		}

	}
}
