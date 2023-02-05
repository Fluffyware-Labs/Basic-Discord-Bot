function loadButtons(client) {
	const ascii = require("ascii-table");
	const fs = require('fs');
	const table = new ascii().setHeading("Buttons", "Status");

	const buttonsFolder = fs.readdirSync("./Buttons");
	for (const folder of buttonsFolder) {
	  const buttonFiles = fs
		.readdirSync(`./Buttons/${folder}`)
		.filter((file) => file.endsWith(".js"));
  
	  for (const file of buttonFiles) {
		const button = require(`../Buttons/${folder}/${file}`);

		client.buttons.set(button.name, button)
  
		table.addRow(file, "loaded");
		continue;
	  }
	}
  
	return console.log(table.toString(), "\n Loaded Buttons");
  }

module.exports = { loadButtons };  