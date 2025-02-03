const fs = require("fs");
const url = require("url");
const { checkMod } = require("../System/MongoDB/MongoDb_Core");
const https = require("https");
const pm2 = require("pm2");
const { fork } = require("child_process");
let mergedCommands = ["exec", "run", "html", "gethtml"];

module.exports = {
  name: "coderunner",
  alias: [...mergedCommands],
  uniquecommands: ["exec", "run", "html", "gethtml"],
  description: "To run JavaScript code in run time",
  start: async (
    Atlas,
    m,
    {
      pushName,
      prefix,
      inputCMD,
      doReact,
      text,
      args,
      participants,
      isCreator,
      body,
      botNumber,
      groupName,
      mentionByTag,
      mime,
      isBotAdmin,
      quoted,
      modcheck,
      isintegrated,
    }
  ) => {
    switch (inputCMD) {
      case "exec":
      case "run":
        const isUsermod = await checkMod(m.sender);
        if (!isCreator && !isintegrated && !isUsermod) {
          await doReact("❌");
          return m.reply(
            "Sorry, only my *Mods* can use *Realtime Script Execution*."
          );
        }
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide a command to execute!\n\nExample: *${prefix}exec m.reply("3rd party code is being executed...")*`
          );
        }
        await doReact("🔰");
        try {
          const result = eval(text);
          const out = JSON.stringify(result, null, "\t") || "Evaluated JavaScript";
          m.reply(out);
        } catch (e) {
          m.reply(`Error: ${e.message}`);
        }
        break;

      case "html":
      case "gethtml":
        if (!text) {
          await doReact("❔");
          return m.reply(
            `Please provide an website to get HTML!\n\nExample: *${prefix}html target_website*`
          );
        }

        await doReact("🔰");
        try {
            let target = text;
            let isTxt = text.split(" ")[0] === "--txt";

            if(isTxt){
                target = text.replace("--txt ", "");
            }

            if (!target.includes("http") && !target.includes("https")) {
              target = "http://" + target;
            }

            const parsedUrl = url.parse(target);
            const hostname = parsedUrl.hostname;
            const path = parsedUrl.pathname;

            const options = {
              hostname: hostname,
              path: path,
              method: "GET",
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                Connection: "keep-alive",
                "Accept-Language": "en-US,en;q=0.9",
                Accept:
                  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              },
            };

          const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
              data += chunk;
            });

            res.on("end", () => {
              const fileExtension = isTxt ? ".txt" : ".html";
              const mimeType = isTxt ? "text/plain" : "text/html";
              const cacheFile = `./System/Cache/${hostname}${fileExtension}`;

              fs.writeFile(cacheFile, data, (err) => {
                if (err) {
                  return m.reply("Error: " + err.message);
                }
                  const mainfile = fs.readFileSync(cacheFile);
                  Atlas.sendMessage(
                      m.from,
                      {
                        document: mainfile,
                        fileName: `${hostname}${fileExtension}`,
                        mimetype: mimeType,
                      },
                      { quoted: m }
                  );
                fs.unlinkSync(cacheFile);
              });
            });
            });

            req.on("error", (error) => {
                console.error("Error:", error);
                m.reply(`Error fetching HTML: ${error.message}`);
            });

            req.end();


        } catch (e) {
            await doReact("❌");
            m.reply(`Error: ${e.message}`);
          }
          break;

      default:
        break;
    }
  },
};