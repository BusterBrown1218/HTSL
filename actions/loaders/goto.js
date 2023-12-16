export default (actionData) => {
    let sequence = [];

    sequence.push(['returnToEditActions']);
    sequence.push(['closeGui']);

    if (actionData.container && actionData.name) {
        switch (actionData.container) {
            case "function":
                sequence.push(['chat', { text: `/function edit ${actionData.name}`, func: actionData.name, command: true }]);
                break;
            case "event":
                sequence.push(['chat', { text: `/eventactions`, command: true }]);
                sequence.push(['option', { option: actionData.name }]);
                break;
            case "command":
                sequence.push(['chat', { text: `/customcommands`, command: true }]);
                sequence.push(['option', { option: actionData.name.startsWith("/")? actionData.name : "/" + actionData.name }]);
                break;
            case "npc":
                sequence.push(['goto', { name: actionData.name }]);
                sequence.push(['click', { slot: 12 }]);
                break;
            case "button":
                sequence.push(['goto', { name: actionData.name }]);
                break;
            case "pad":
                sequence.push(['goto', { name: actionData.name }]);
                break;
        }
    }

    return ['goto', sequence];
}