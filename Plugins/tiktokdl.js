let mergedCommands = [
  "tiktok",
  "tiktokdl",
  "tiktokmp3",
  "tiktokmp4",
  "tiktokdoc",
];

module.exports = {
  name: "tiktokDl",
  alias: [...mergedCommands],
  uniquecommands: ["tiktok", "tiktokmp3", "tiktokmp4", "tiktokdoc"],
  description: "All Tiktok Downloader Commands",
  start: async (
    Atlas,
    m,
    {
      inputCMD,
      text,
      prefix,
      doReact,
      args,
      isMedia,
      quoted,
      botImage1,
      botName,
    }
  ) => {
    if (!text) {
      await doReact("❌");
      return m.reply(
        `Please provide a Toktok video link !\n\nExample: ${prefix}say Atlas MD is OP`
      );
    }
    if (!text.includes("tiktok")) {
      await doReact("❌");
      return m.reply("Please provide a valid Tiktok link!");
    }

    switch (inputCMD) {
      case "tiktok":
      case "tiktokdl":
        await doReact("📥");
        let buttons = [
          {
            buttonId: `${prefix}tiktokmp3 ${args[0]}`,
            buttonText: { displayText: "♬ Audio" },
            type: 1,
          },
          {
            buttonId: `${prefix}tiktokmp4 ${args[0]}`,
            buttonText: { displayText: "▶ Video" },
            type: 1,
          },
          {
            buttonId: `${prefix}tiktokdoc ${args[0]}`,
            buttonText: { displayText: "∎ Document" },
            type: 1,
          },
        ];

        txtmain = `
          *『 Tiktok Downloader 』*
    
*🧩 Video Url :* _${text}_\n\n
*📌 Select the format*
*${prefix}tiktokmp3 <link>*
*${prefix}tiktokmp4 <link>*
*${prefix}tiktokdoc <link>*`;
         try{
              await Atlas.sendMessage(
                m.from,
                { image: { url: botImage1 }, caption: txtmain },
                { quoted: m }
              );
         }catch(error){
              await doReact("❌");
                m.reply(
                   `An error occurred while sending message.`
                );
              console.error(error);
        }

        break;

      case "tiktokmp3":
        await doReact("📥");
          try{
                require("../System/Tiktokscraper")
                    .Tiktok(args[0])
                    .then((data) => {
                     Atlas.sendMessage(
                        m.from,
                         { audio: { url: data.audio }, mimetype: "audio/mpeg" },
                        { quoted: m }
                       );
                    });
          }catch(error){
               await doReact("❌");
             m.reply(
              `An error occurred while fetching the tiktok audio.`
             );
            console.error(error)
         }
        break;

      case "tiktokmp4":
        await doReact("📥");
            try{
              require("../System/Tiktokscraper")
                  .Tiktok(args[0])
                    .then((data) => {
                      Atlas.sendMessage(
                         m.from,
                        {
                           video: { url: data.watermark },
                           caption: `Downloaded by: *${botName}*`,
                         },
                         { quoted: m }
                       );
                    });
           }catch(error){
                await doReact("❌");
               m.reply(
                  `An error occurred while fetching the tiktok video.`
                 );
             console.error(error)
          }
        break;

      case "tiktokdoc":
        await doReact("📥");
           try{
              require("../System/Tiktokscraper")
              .Tiktok(args[0])
              .then((data) => {
                Atlas.sendMessage(
                   m.from,
                   {
                      document: { url: data.audio },
                     mimetype: "audio/mpeg",
                       fileName: `Downloaded by ${botName}.mp3`,
                   },
                 { quoted: m }
               );
              });
        }catch(error){
            await doReact("❌");
             m.reply(
               `An error occurred while fetching the tiktok audio document.`
               );
            console.error(error);
        }
        break;

      default:
        break;
    }
  },
};