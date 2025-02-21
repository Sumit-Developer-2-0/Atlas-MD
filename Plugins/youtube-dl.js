const YT = require("../System/Ytdl-Core.js");
const fs = require("fs");
const yts = require("youtube-yts");
const ffmpeg = require("fluent-ffmpeg");
const { getBuffer } = require("../System/Function2.js");

let mergedCommands = [
  "play",
  "song",
  "ytmp3",
  "mp3",
  "ytaudio",
  "yta",
  "ytmp4",
  "mp4",
  "ytvideo",
  "ytv",
  "video",
];

module.exports = {
  name: "mediaDownloader",
  alias: [...mergedCommands],
  uniquecommands: ["song", "video", "ytmp3", "ytmp4"],
  description: "All file dowloader commands",
  start: async (Atlas, m, { inputCMD, text, doReact, prefix, pushName, botName, botImage1 }) => {
    switch (inputCMD) {
      case "play":
      case "song":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `Please provide a song name !\n\nExample: *${prefix}song despacito*`
          );
        }
        await doReact("📥");
          let song, videoUrl, videoId
          try{
            songInfo = await yts(text);
            song = songInfo.videos[0];
            videoUrl = song.url;
           videoId = videoUrl.split("v=")[1];
             await Atlas.sendMessage(
                m.from,
                {
                  image: { url: song.thumbnail },
                  caption: `\nDownloading: *${song.title}*
            
_🕛 Duration:_ *${song.timestamp}*

_🎀 Channel Name:_ *${song.author.name}*

_🏮 Video Uploaded:_ *${song.ago}*\n`,
                },
              { quoted: m }
           );
         }catch(error){
             await doReact("❌");
              m.reply(
                  `An error occurred while searching for the song on youtube.`
                );
               console.error(error)
             return;
         }
         try{
               YT.mp3(videoId).then((file) => {
                 const inputPath = file.path;
                  const outputPath = inputPath + ".opus";
              ffmpeg(inputPath)
                  .format("opus")
                .on("error", (err) => {
                    console.error("Error converting to opus:", err);
                   })
                   .on("end", async () => {
                    await Atlas.sendPresenceUpdate("recording", m.from);
                     Atlas.sendMessage(
                       m.from,
                       {
                           audio: fs.readFileSync(outputPath),
                        mimetype: "audio/mpeg",
                         ptt: true,
                       },
                        { quoted: m }
                       );
                       fs.unlinkSync(inputPath);
                        fs.unlinkSync(outputPath);
                    })
                      .save(outputPath);
                    });
          }catch(error){
             await doReact("❌");
                m.reply(
                 `An error occurred while downloading and converting the audio.`
                 );
               console.error(error)
          }
        break;

      case "ytmp3":
      case "mp3":
      case "ytaudio":
        if (
          !text ||
          (!text.includes("youtube.com/watch?v=") &&
            !text.includes("youtu.be/"))
        ) {
          await doReact("❌");
          return m.reply(
            `Please provide a valid YouTube Video link to download as audio!\n\nExample: *${prefix}mp3 put_link*`
          );
        }
        await doReact("📥");
          try{
               songInfo = await yts(text);
                song = songInfo.videos[0];
               videoUrl = song.url;
               videoId = videoUrl.split("v=")[1];

              await Atlas.sendMessage(
                  m.from,
                {
                   image: { url: song.thumbnail },
                  caption: `\nDownloading: *${song.title}*
            
_🕛 Duration:_ *${song.timestamp}*

_🎀 Channel Name:_ *${song.author.name}*

_🏮 Video Uploaded:_ *${song.ago}*\n`,
                  },
                 { quoted: m }
              );
          }catch(error){
            await doReact("❌");
                m.reply(
                 `An error occurred while searching for the youtube video.`
                );
              console.error(error)
               return;
        }
         try{
              YT.mp3(videoId).then(async(file) => {
                    const inputPath = file.path;
                     const outputPath = inputPath + ".opus";
                      ffmpeg(inputPath)
                         .format("opus")
                       .on("error", (err) => {
                           console.error("Error converting to opus:", err);
                           })
                         .on("end", async () => {
                          await Atlas.sendPresenceUpdate("recording", m.from);

                         Atlas.sendMessage(
                           m.from,
                              {
                                audio: fs.readFileSync(inputPath),
                               mimetype: "audio/mpeg",
                               ptt: true,
                             },
                             { quoted: m }
                         );
                          fs.unlinkSync(inputPath);
                           fs.unlinkSync(outputPath);
                          })
                         .save(outputPath);
                   });
          }catch(error){
              await doReact("❌");
                 m.reply(
                 `An error occurred while downloading and converting the audio.`
                   );
              console.error(error)
           }

        break;

      case "ytmp4":
      case "mp4":
      case "ytvideo":
        if (
          !text ||
          (!text.includes("youtube.com/watch?v=") &&
            !text.includes("youtu.be/"))
        ) {
          await doReact("❌");
          return m.reply(
            `Please provide a valid YouTube Video link to download as audio!\n\nExample: *${prefix}mp4 put_link*`
          );
        }
        await doReact("📥");
          let ytaud3
          try{
              songInfo = await yts(text);
              song = songInfo.videos[0];
              videoUrl = song.url;
            videoId = videoUrl.split("v=")[1];
            result = await yts(videoId);
                 await Atlas.sendMessage(
                    m.from,
                   {
                      image: { url: song.thumbnail },
                      caption: `\nDownloading: *${song.title}*
            
_🕛 Duration:_ *${song.timestamp}*

_🎀 Channel Name:_ *${song.author.name}*

_🏮 Video Uploaded:_ *${song.ago}*\n`,
                     },
                    { quoted: m }
                  );
              ytaud3 = await YT.mp4(videoUrl);
          Atlas.sendMessage(
              m.from,
              {
                 video: { url: ytaud3.videoUrl },
                 caption: `${song.title} By: *${botName}*`,
               },
                { quoted: m }
               );
         }catch(error){
             await doReact("❌");
             m.reply(
               `An error occurred while downloading the youtube video`
             );
            console.error(error);
         }
        break;

      case "video":
        if (!text) {
          await doReact("❌");
          return m.reply(
            `Please provide an YouTube video name !\n\nExample: *${prefix}video dandilions*`
          );
        }
        await doReact("📥");
          try{
             songInfo = await yts(text);
           song = songInfo.videos[0];
             videoUrl = song.url;
            videoId = videoUrl.split("v=")[1];
           await Atlas.sendMessage(
                 m.from,
                  {
                    image: { url: song.thumbnail },
                    caption: `\nDownloading: *${song.title}*
            
_🕛 Duration:_ *${song.timestamp}*

_🎀 Channel Name:_ *${song.author.name}*

_🏮 Video Uploaded:_ *${song.ago}*\n`,
                  },
                 { quoted: m }
               );
                const ytaud2 = await YT.mp4(videoUrl);
                 Atlas.sendMessage(
                   m.from,
                    {
                      video: { url: ytaud2.videoUrl },
                    caption: `${song.title} By: *${botName}*`,
                   },
                     { quoted: m }
                  );
           }catch(error){
              await doReact("❌");
               m.reply(
                   `An error occurred while downloading the video`
                );
                console.error(error)
        }

        break;

      case "yts":
      case "ytsearch":
        if (!text) {
          await doReact("❌");
          return m.reply(`Please provide a search term!`);
        }
        await doReact("📥");
        try{
             let search = await yts(text);
            let thumbnail = search.all[0].thumbnail;
            let num = 1;
           var txt = `*🏮 YouTube Search Engine 🏮*\n\n_🧩 Search Term:_ *${text
            }*\n\n*📌 Total Results:* *${search.all.length}*\n`;

            for (let i of search.all) {
             txt += `\n_Result:_ *${num++}*\n_🎀 Title:_ *${
               i.title
             }*\n_🔶 Duration:_ *${i.timestamp}*\n_🔷 Link:_ ${i.url}\n\n`;
           }
            let buttonMessage = {
                image: { url: thumbnail },
                caption: txt,
              };

            Atlas.sendMessage(m.from, buttonMessage, { quoted: m });
          }catch(error){
            await doReact("❌");
                m.reply(
                 `An error occurred while searching on youtube`
                );
               console.error(error)
          }
        break;

      default:
        break;
    }
  },
};