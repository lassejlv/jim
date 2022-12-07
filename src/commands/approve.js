require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const endPoint = "https://dcordbots.xyz/api/v1/bots/update";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("approve")
    .setDescription("✅ Approve discord bot on dcordbots...")
    .addStringOption((option) =>
      option
        .setName("client_id")
        .setDescription(
          "Please enter the bots client_id you wan't to approve..."
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.options.getString("client_id");

    fetch(`${endPoint}?type=ap&botId=${id}&userId=${interaction.user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Bot was not found!") {
          interaction.reply(`❌ **${data.message}**`);
        } else if (data.message === "Missing Permissions!") {
          interaction.reply(`❌ **${data.message}**`);
        } else if (data.message === "User not found!") {
          interaction.reply(`❌ **Missing Permissions!**`);
        } else {
          interaction.reply(`✅ **${data.message}**`);
        }
      })
      .catch((e) => {
        interaction.reply(`${e.message}`);
      });
  },
};
