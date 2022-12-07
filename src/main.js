require("dotenv").config();
const fs = require("fs");
const path = require("path");
const {
  Client,
  Events,
  Collection,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const { TOKEN } = process.env;
const Logger = require("./utils/Logger");
const { EmbedBuilder } = require("discord.js");
const Time = Date.now();

// Create a new client instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Set the Collection
client.commands = new Collection();

// Command Handler
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    new Logger("WARN").log(
      `The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Ready Event
client.once(Events.ClientReady, (c) => {
  // Set Status to the bot

  c.user.setActivity("Follow my rules or you will get shot 🔫💪", {
    type: ActivityType.Watching,
  });

  new Logger("INFO").log(`Logged in as ${c.user.tag}`);
  new Logger("INFO").log(`Client started in ${Date.now() - Time}ms`);
});

// InteractionCreate Event
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    new Logger("ERROR").log(
      `No command matching ${interaction.commandName} was found.`
    );
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Guild Create
client.on("guildCreate", (guild) => {
  let embed = new EmbedBuilder()
    .setTitle("New Server!")
    .setColor("Green")
    .setDescription(`I joined the server **${guild.name}(${guild.id})**`)
    .addFields(
      {
        name: "Name",
        value: guild.name,
        inline: true,
      },
      {
        name: "ID",
        value: guild.id,
        inline: true,
      },

      {
        name: "Member Count",
        value: guild.memberCount,
        inline: true,
      },
      {
        name: "Owner",
        value: guild.ownerId,
        inline: true,
      }
    )
    .setTimestamp();

  client.channels.cache.get("1041133794880655380").send({ embeds: [embed] });
});

client.on("guildDelete", (guild) => {
  let embed = new EmbedBuilder()
    .setTitle("Left Server!")
    .setColor("Red")
    .setDescription(`I left the server **${guild.name}(${guild.id})**`)
    .addFields(
      {
        name: "Name",
        value: guild.name,
        inline: true,
      },
      {
        name: "ID",
        value: guild.id,
        inline: true,
      },

      {
        name: "Member Count",
        value: guild.memberCount,
        inline: true,
      },
      {
        name: "Owner",
        value: guild.ownerId,
        inline: true,
      }
    )
    .setTimestamp();

  client.channels.cache.get("1041133794880655380").send({ embeds: [embed] });
});

client.login(TOKEN);
