export default (actionData) => {
	let sequence = [];

	if (actionData.reason && actionData.reason !== "Failed!") {
		sequence.push(['click', { slot: 10 }]); 
		sequence.push(['chat', { text: actionData.reason }]); 
	}

	return ['Fail Parkour', sequence];
}
