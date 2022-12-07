require("dotenv").config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const endPoint = "https://dcordbots.xyz/api/v1/bot";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("🔑 Check a bot on dcordbots..")
    .addStringOption((option) =>
      option
        .setName("client_id")
        .setDescription("Please enter the bots client_id you wan't to check...")
        .setRequired(true)
    ),

  async execute(interaction) {
    const id = interaction.options.getString("client_id");

    fetch(`${endPoint}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          interaction.reply(`${data.message}`);
        } else {
          const Embed = new EmbedBuilder()
            .setTitle(`${data.username}#${data.discriminator}`)
            .setDescription(data.shortDescription)
            .addFields([
              {
                name: "client_id",
                value: data.id,
                inline: true,
              },

              {
                name: "username",
                value: data.username + "#" + data.discriminator,
                inline: true,
              },

              {
                name: "status",
                value: data.status,
                inline: true,
              },

              {
                name: "owner",
                value: `<@${data.owner}>`,
                inline: true,
              },

              {
                name: "views",
                value: `${data.views}`,
                inline: true,
              },

              {
                name: "supports_slash_commands",
                value: `${data.supportsSlashCommands}`,
                inline: true,
              },

              {
                name: "prefix",
                value: data.prefix,
                inline: true,
              },

              {
                name: "isBanned",
                value: `${data.isBanned}`,
                inline: true,
              },

              {
                name: "createdAt",
                value: moment(data.createdAt).fromNow(),
                inline: true,
              },
            ])
            .setThumbnail(data.avatar)
            .setTimestamp()
            .setColor(process.env.MAIN_COLOR);

          interaction.reply({ embeds: [Embed] });
        }
      })
      .catch((e) => {
        interaction.reply(`${e.message}`);
        console.log(e);
      });
  },
};
