const fs = require("fs");
const axios = require("axios");
const path = require("path");
const package = require("../package.json");
let mergedCommands = [
  "help",
  "h",
  "menu",
  "sc",
  "support",
  "supportgc",
  "script",
];

module.exports = {
  name: "systemcommands",
  alias: [...mergedCommands],
  uniquecommands: ["script", "support", "help"],
  description: "All system commands",
  start: async (
    Atlas,
    m,
    { pushName, prefix, inputCMD, doReact, text, args, botName, botVideo, suppL }
  ) => {
    const pic = fs.readFileSync("./Assets/Atlas.jpg");
    switch (inputCMD) {
      case "script":
      case "sc":
        await doReact("🧣");
        try {
          let repoInfo = await axios.get(
            "https://api.github.com/repos/FantoX/Atlas-MD"
          );
          let repo = repoInfo.data;
          let txt = `            🧣 *${botName}'s Script* 🧣\n\n*🎀 Total Forks:* ${
            repo.forks_count
          }\n*⭐ Total Stars:* ${repo.stargazers_count}\n*📜 License:* ${
            repo.license.name
          }\n*📁 Repo Size:* ${(repo.size / 1024).toFixed(
            2
          )} MB\n*📅 Last Updated:* ${repo.updated_at}\n\n*🔗 Repo Link:* ${
            repo.html_url
          }\n\n❝ Dont forget to give a Star ⭐ to the repo. It's made with restless hardwork by *Team ATLAS*. ❞\n\n*©️ Team ATLAS- 2023*`;
          Atlas.sendMessage(m.from, { image: pic, caption: txt }, { quoted: m });
        } catch (error) {
          await doReact("❌");
            console.error(error);
            m.reply("An error occurred while fetching script info.");
        }
        break;

      case "support":
      case "supportgc":
        await doReact("🔰");
        let txt2 = `              🧣 *Support Group* 🧣\n\n*${botName}* is an open source project, and we are always happy to help you.\n\n*Link:* ${suppL}\n\n*Note:* Please don't spam in the group, and don't message *Admins directly* without permission. Ask for help inside *Group*.\n\n*Thanks for using Atlas.*`;
        Atlas.sendMessage(m.from, { image: pic, caption: txt2 }, { quoted: m });
        break;

      case "help":
      case "h":
      case "menu":
        await doReact("☃️");
        await Atlas.sendPresenceUpdate("composing", m.from);

        function readUniqueCommands(dirPath) {
          const allCommands = [];
          const files = fs.readdirSync(dirPath);
          for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
              const subCommands = readUniqueCommands(filePath);
              allCommands.push(...subCommands);
            } else if (stat.isFile() && file.endsWith(".js")) {
              try {
                const command = require(filePath);
                if (Array.isArray(command.uniquecommands)) {
                  const subArray = [file, ...command.uniquecommands];
                  allCommands.push(subArray);
                }
                } catch (error){
                    console.error(`Error loading command from ${filePath}:`, error);
                }
            }
          }
          return allCommands;
        }

        function formatCommands(allCommands) {
          let formatted = "";
          for (const [file, ...commands] of allCommands) {
             const capitalizedFile =
               file.replace(".js", "").charAt(0).toUpperCase() +
               file.replace(".js", "").slice(1);

              formatted += `╟   🏮 *${capitalizedFile}* 🏮   ╢\n\n`;
            formatted += `\`\`\`${commands
              .map((cmd) => `⥼   ${prefix + cmd}`)
              .join("\n")}\`\`\`\n\n\n`;
          }
          return formatted.trim();
        }
            const pluginsDir = path.join(process.cwd(), "Plugins");
            const allCommands = readUniqueCommands(pluginsDir);
            const formattedCommands = formatCommands(allCommands);
          var helpText = `\nKonnichiwa *${pushName}* Senpai,\n\nI am *${botName}*, a WhatsApp bot built to take your boring WhatsApp experience into next level.\n\n*🔖 My Prefix is:*  ${prefix}\n\n${formattedCommands}\n\n\n*©️ Team ATLAS- 2023*`;
            await Atlas.sendMessage(
              m.from,
                { video: { url: botVideo }, gifPlayback: true, caption: helpText },
                { quoted: m }
            );
        break;

      default:
        break;
    }
  },
};