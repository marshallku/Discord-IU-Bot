import { Client, Message } from "discord.js";
import { pickRandom } from "./utils/array";
import deleteMessage from "./utils/deleteMessage";
import echoToChannel from "./commands/echo";
import {
    reactHeartAndSendGif,
    sendGifToChannel,
    sendRandomGifToChannel,
} from "./commands/gif";
import sendHelpToChannel from "./commands/help";
import {
    sendCalculationResultToUser,
    sendRandomNumberToUser,
    sendSortResultToUser,
    sendUnitTransformResultToUser,
} from "./commands/math";
import sendEncodeResultToUser from "./commands/encode";
import sendTimerToUser from "./commands/timer";
import {
    sendCoinToUser,
    sendDiceToUser,
    sendLotsResultToChannel,
    sendRockPaperScissorsToUser,
} from "./commands/game";
import files from "./data/files";
import songsForComfort from "./data/songsForComfort";
import quotes from "./data/quotes";

const client = new Client();
const badWords = new RegExp(process.env.BAD_WORDS || "", "gi");

client.on("ready", () => {
    console.log(`Logged in : ${client.user?.tag}`);
    client.user?.setPresence({
        activity: {
            name: "지은아 도와줘 - 명령어 확인",
        },
    });
});

client.on("message", async (msg: Message) => {
    const { author, channel } = msg;
    const prefix = /^지(은|금)아 ?/;

    if (!author || author.bot || !prefix.test(msg.content)) {
        return;
    }

    const fullContent = msg.content.replace(prefix, "");

    // bad word blocker
    if (badWords.test(fullContent)) {
        const { id, username, discriminator } = author;

        console.table({ id, username, discriminator, content: fullContent });
        msg.reply(
            "바르고 고운 말 사용하기!\n지속해서 사용하면 관리자에 의해 차단될 수 있습니다."
        );

        return;
    }

    if (fullContent.endsWith("지워")) {
        deleteMessage(msg, channel);
    }

    const [command, ...content] = fullContent.split(" ");

    switch (command) {
        case "":
            sendRandomGifToChannel(channel);
            break;
        // Help
        case "도와줘":
            sendHelpToChannel(channel);
            break;
        // Greeting, Farewell
        case "안녕":
        case "ㅎㅇ":
            reactHeartAndSendGif({ msg, channel, array: files.hi });
            break;
        case "잘가":
        case "ㅂㅂ":
        case "ㅂㅇ":
            reactHeartAndSendGif({ msg, channel, array: files.bye });
            break;
        // Sending GIFs(Videos)
        case "ㅇㅋ":
            sendGifToChannel(channel, files.ok);
            break;
        case "ㄴㄴ":
            sendGifToChannel(channel, files.no);
            break;
        case "ㅠㅠ":
            sendGifToChannel(channel, files.cry);
            break;
        case "ㅋㅋ":
            sendGifToChannel(channel, files.laugh);
            break;
        case "굿":
            sendGifToChannel(channel, files.good);
            break;
        case "헉":
            sendGifToChannel(channel, files.surprised);
            break;
        case "열받네":
            sendGifToChannel(channel, files.angry);
            break;
        case "화이팅":
        case "파이팅":
            sendGifToChannel(channel, files.fighting);
            break;
        case "사랑해":
            sendGifToChannel(channel, files.love);
            break;
        case "이름":
            msg.reply("예명 : IU(아이유)\n본명 : 이지은 (李知恩, Lee Ji-Eun)");
            break;
        case "유튜브":
            channel.send("https://www.youtube.com/c/dlwlrma");
            break;
        case "뮤비":
        case "뮤직비디오":
            channel.send(`https://youtu.be/${pickRandom(files.mv)}`);
            break;
        // Extra Functions
        case "말해":
            echoToChannel({ content, channel, msg });
            break;
        case "집합시켜":
            channel.send(`@everyone ${author}님이 집합하시랍니다!`);
            break;
        case "정렬해줘":
            sendSortResultToUser(msg, content);
            break;
        case "암호":
            sendEncodeResultToUser(msg, content);
            break;
        case "타이머":
            sendTimerToUser(msg, content);
            break;
        case "잘자":
            msg.reply("Baby, sweet good night\nhttps://youtu.be/aepREwo5Lio");
            break;
        case "힘들다":
        case "힘들어":
            msg.reply(
                `${pickRandom(quotes)}\nhttps://youtu.be/${pickRandom(
                    songsForComfort
                )}`
            );
            break;
        // math
        case "랜덤":
            sendRandomNumberToUser(msg, content);
            break;
        case "계산":
            sendCalculationResultToUser(msg, content);
            break;
        case "단위변환":
            sendUnitTransformResultToUser(msg, content);
            break;
        // mini games
        case "주사위":
            sendDiceToUser(msg);
            break;
        case "동전":
            sendCoinToUser(msg);
            break;
        case "가위바위보":
            sendRockPaperScissorsToUser(msg);
            break;
        case "제비뽑기":
            sendLotsResultToChannel(msg, channel);
            break;
        default:
            msg.react("❌").then(() => {
                msg.reply(
                    "찾을 수 없는 명령어네요. 😥\n``지은아 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있어요."
                );
            });
    }
});

client.login(process.env.TOKEN);

process.on("uncaughtException", (err) => {
    console.error(err);
});
