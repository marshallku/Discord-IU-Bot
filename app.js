const Discord = require("discord.js");
const client = new Discord.Client();
const token = require("./token.json");
const files = require("./files.json");

const pickImg = array => {
    return array[Math.round(Math.random() * (array.length - 1))].replace("[gfy]", "https://giant.gfycat.com/").replace("[zgfy]", "https://zippy.gfycat.com/").replace("[ten]", "https://tenor.com/view/").replace("[fgfy]", "https://fat.gfycat.com/").replace("[tgfy]", "https://thumbs.gfycat.com/");
};

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: "명령어 확인 : 지은아 도와줘"
        }
    });
});

client.on("message", msg => {
    let content = msg.content;

    if (content.startsWith("지은아")) {
        content = content.slice(4);
        if (content === "도와줘") {
            msg.channel.send("\n지은아 [명령어] 구조로 이루어져있습니다.\n말해 [문자] : 봇이 한 말을 따라합니다.\n안녕, ㅇㅋ, ㅠㅠ, ㅋㅋ, 굿, 헉, 열받네")
        }
        if (content === "안녕") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        if (content === "ㅇㅋ") {
            msg.channel.send(pickImg(files.ok));
        }
        if (content === "ㅠㅠ") {
            msg.channel.send(pickImg(files.cry));
        }
        if (content === "ㅋㅋ") {
            msg.channel.send(pickImg(files.laugh));
        }
        if (content === "굿") {
            msg.channel.send(pickImg(files.good));
        }
        if (content === "헉") {
            msg.channel.send(pickImg(files.surprised));
        }
        if (content === "열받네") {
            msg.channel.send(pickImg(files.angry));
        }
        if (content === "유튜브") {
            msg.channel.send("https://www.youtube.com/channel/UC3SyT4_WLHzN7JmHQwKQZww");
        }
        if (content === "인스타") {
            msg.channel.send("https://www.instagram.com/dlwlrma/");
        }
        if (content.startsWith("말해 ")) {
            msg.channel.send(content.replace("말해 ", ""));
        }
    }
});

client.login(token.token);
