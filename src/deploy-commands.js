require("dotenv").config();
const { REST, Routes } = require("discord.js");
const { TOKEN, CLIENT_ID } = process.env;
const fs = require("node:fs");
const Logger = require("./utils/Logger");

const commands = [];

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    new Logger("INFO").log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    new Logger("SUCCESS").log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
