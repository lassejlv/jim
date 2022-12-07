require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send ping pong!"),

  async execute(interaction) {
    interaction.reply("Pong!");
  },
};
