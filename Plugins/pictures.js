const gis = require("g-i-s");
const axios = require("axios");
const hxzapi = require("hxz-api");
let mergedCommands = [
  "gig",
  "gimage",
  "googleimage",
  "image",
  "ppcouple",
  "couplepp",
  "gifsearch",
  "gif",
  "pin",
  "pinterest",
];

module.exports = {
  name: "pictures",
  alias: [...mergedCommands],
  uniquecommands: ["image", "couplepp", "gif", "pin"],
  description: "All picture related commands",
  start: async (Atlas, m, { inputCMD, text, doReact, prefix, botName, tenorApiKey }) => {
    switch (inputCMD) {
      case "ppcouple":
      case "couplepp":
        await doReact("❤️");
        try {
          let imgRes = await axios.get(
            "https://zany-teal-alligator-suit.cyclic.app/couple"
          );
          Atlas.sendMessage(
            m.from,
            { image: { url: imgRes.data.male }, caption: `_For Him..._` },
            { quoted: m }
          );
          Atlas.sendMessage(
            m.from,
            { image: { url: imgRes.data.female }, caption: `_For Her..._` },
            { quoted: m }
          );
        } catch (error) {
          await doReact("❌");
          m.reply(`An error occurred while fetching couple pps.`);
           console.error(error);
        }
        break;

      case "gig":
      case "gimage":
      case "googleimage":
      case "image":
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide an image Search Term !\n\nExample: *${prefix}image cheems*`
          );
        }
        await doReact("🎴");
        try {
          gis(text, async (error, result) => {
            if (error){
                await doReact("❌");
                m.reply(
                  `An error occurred while fetching images from google.`
                 );
               console.error(error);
               return;
              }
            n = result;
            let images = n[Math.floor(Math.random() * n.length)].url;
            let resText = `\n_🎀 Image Search Term:_ *${text}*\n\n_🧩 Powered by_ *${botName}*\n`;
             await Atlas.sendMessage(
               m.from,
               {
                 image: { url: images },
                 caption: resText,
               },
              { quoted: m }
            );
          });
        } catch (error) {
            await doReact("❌");
             m.reply(
              `An error occurred while fetching images from google.`
              );
             console.error(error);
         }
        break;
      case "gif":
      case "gifsearch":
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide an Tenor gif Search Term !\n\nExample: *${prefix}gif cheems bonk*`
          );
        }
        await doReact("🎴");
        try {
            let resGif = await axios.get(
              `https://tenor.googleapis.com/v2/search?q=${text}&key=${tenorApiKey}&client_key=my_project&limit=12&media_filter=mp4`
           );
            let resultGif = Math.floor(Math.random() * 12);
           let gifUrl = resGif.data.results[resultGif].media_formats.mp4.url;
           await Atlas.sendMessage(
             m.from,
             {
               video: { url: gifUrl },
               gifPlayback: true,
               caption: `🎀 Gif serach result for: *${text}*\n`,
             },
             { quoted: m }
           );
         } catch (error) {
             await doReact("❌");
              m.reply(`An error occurred while fetching gifs.`);
                console.error(error)
         }
        break;

      case "pin":
      case "pinterest":
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide an Pinterest image Search Term !\n\nExample: *${prefix}pin cheems*`
          );
        }
        await doReact("📍");
        try {
          hxzapi
             .pinterest(text)
               .then(async (res) => {
                imgnyee = res[Math.floor(Math.random() * res.length)];
                  let txt = `\n_🎀 Pinterest Search Term:_ *${text}*\n\n_🧩 Powered by_ *${botName}*\n`;
                  let buttonMessage = {
                    image: { url: imgnyee },
                   caption: txt,
                    };
               Atlas.sendMessage(m.from, buttonMessage, { quoted: m });
             })
               .catch((_) => {
                   await doReact("❌");
                     m.reply(`An error occurred while fetching images from pinterest.`);
                     console.error(_);
               });
         } catch (error) {
              await doReact("❌");
              m.reply(`An error occurred while fetching images from pinterest.`);
             console.error(error)
        }

        break;

      default:
        break;
    }
  },
};