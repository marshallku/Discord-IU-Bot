const Discord = require("discord.js");
const client = new Discord.Client();
const token = require("./token.json");
const files = require("./files.json");

const pickImg = array => {
    return array[Math.round(Math.random() * (array.length - 1))].replace("[gfy]", "https://giant.gfycat.com/").replace("[zgfy]", "https://zippy.gfycat.com/").replace("[ten]", "https://tenor.com/view/").replace("[fgfy]", "https://fat.gfycat.com/").replace("[tgfy]", "https://thumbs.gfycat.com/");
};

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`)
});

client.on("message", msg => {
    let content = msg.content;

    if (content[0] === "!") {
        content = content.slice(1);
        if (content === "help") {
            msg.channel.send("\n!명령어 구조로 이루어져있습니다.\n!echo 문자 : 봇이 한 말을 따라합니다.\n!지은아,!ㅇㅋ,!ㅠㅠ,!ㅋㅋ,!굿,!헉,!열받네")
        }
        if (content === "지은아") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        if (content === "ㅇㅋ") {
            msg.channel.send(pickImg(files.ok));
        }
        if (content === "ㅠㅠ") {
            msg.channel.send(pickImg(files.cry))
        }
        if (content === "ㅋㅋ") {
            msg.channel.send(pickImg(files.laugh))
        }
        if (content === "굿") {
            msg.channel.send(pickImg(files.good))
        }
        if (content === "헉") {
            msg.channel.send(pickImg(files.surprised))
        }
        if (content === "열받네") {
            msg.channel.send(pickImg(files.angry))
        }
        if (content.startsWith("echo ")) {
            msg.channel.send(content.replace("echo ", ""))
        }
    }
});

client.login(token.token);
