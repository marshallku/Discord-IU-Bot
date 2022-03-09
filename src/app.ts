import { Client, Message, MessageReaction, User } from "discord.js";
import { pickRandom } from "./utils/array";
import files from "./data/files";
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
import songsForComfort from "./data/songsForComfort";
import {
    sendCoinToUser,
    sendDiceToUser,
    sendLotsResultToChannel,
    sendRockPaperScissorsToUser,
} from "./commands/game";
import { banUser, kickUser, updateRole } from "./commands/moderate";

const client = new Client();
const quotes = [
    "Q. 힘들 땐 어떻게 일어나나요?\nA. 가끔, 져요.",
    "Q. 원하는 것들을 이루기 위해서는 무언가를 포기해야 한다고 들었습니다. 포기하신 건 뭔가요?\nA. 아까워하는 마음입니다.",
    "불안하면서 근사해 보이게 사느니, 그냥 초라하더라도 마음 편하게 살아야지”라는 생각을 했어요.",
    "못해요, 못해요’를 입에 달고 살다가 그걸 고쳐보려고 이 생각 저 생각 해봤더니, 결국 ‘잘 모르니까 한번 해볼게요’를 이유 삼아 저 자신을 바꿀 수밖에 없겠더라고요.",
    "잘한다는 기준이 너무 애매해서, 모두를 만족시킬 수는 없으니까. 네가 네 것을 찾고, 너만의 그것을 좋아해 주는 사람들을 만나면 돼.",
    "허무해질 때는 재빨리 다음 스텝을 생각해요. 저도 그게 썩 좋은 방법이라고 생각하지 않아요. 하지만 빠져나갈 수 있는 제일 쉬운 방법이라서 그렇게 해왔어요.",
    "기쁠 때 기쁘고, 슬플 때 울고, 배고프면 힘없고, 아프면 능률 떨어지고, 그런 자연스러운 일들이 좀 자연스럽게 내색되고 또 자연스럽게 받아들여졌으면 좋겠습니다.",
];
const badWords = /words|to|block/gi;

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

    const content = msg.content.replace(prefix, "");

    // bad word blocker
    if (badWords.test(content)) {
        return msg.reply(
            "바르고 고운 말 사용하기!\n지속해서 사용하면 관리자에 의해 차단될 수 있습니다."
        );
    }

    // If user typed nothing
    if (msg.content === "지은아" || msg.content === "지금아") {
        sendRandomGifToChannel(channel);
    }

    // Help
    else if (content === "도와줘") {
        sendHelpToChannel(channel);
    }

    // Greeting, Farewell
    else if (content === "안녕" || content === "ㅎㅇ") {
        reactHeartAndSendGif({ msg, channel, array: files.hi });
    } else if (
        content === "잘 가" ||
        content === "잘가" ||
        content == "ㅂㅂ" ||
        content == "ㅂㅇ"
    ) {
        reactHeartAndSendGif({ msg, channel, array: files.bye });
    }

    // Sending GIFs(Videos)
    else if (content === "ㅇㅋ") {
        sendGifToChannel(channel, files.ok);
    } else if (content === "ㄴㄴ") {
        sendGifToChannel(channel, files.no);
    } else if (content === "ㅠㅠ") {
        sendGifToChannel(channel, files.cry);
    } else if (content === "ㅋㅋ") {
        sendGifToChannel(channel, files.laugh);
    } else if (content === "굿") {
        sendGifToChannel(channel, files.good);
    } else if (content === "헉") {
        sendGifToChannel(channel, files.surprised);
    } else if (content === "열 받네" || content === "열받네") {
        sendGifToChannel(channel, files.angry);
    } else if (content === "화이팅" || content === "파이팅") {
        sendGifToChannel(channel, files.fighting);
    } else if (content === "사랑해") {
        sendGifToChannel(channel, files.love);
    }

    // Info
    else if (content.startsWith("이름")) {
        msg.reply("예명 : IU(아이유)\n본명 : 이지은 (李知恩, Lee Ji-Eun)");
    } else if (content === "유튜브") {
        channel.send("https://www.youtube.com/c/dlwlrma");
    } else if (content === "뮤비" || content === "뮤직비디오") {
        channel.send(`https://youtu.be/${pickRandom(files.mv)}`);
    }

    // Extra Functions
    else if (content.startsWith("말해")) {
        echoToChannel({ content, channel, msg });
    } else if (content === "집합시켜") {
        channel.send(`@everyone ${author}님이 집합하시랍니다!`);
    } else if (content.startsWith("정렬해줘")) {
        sendSortResultToUser(msg, content);
    } else if (content.startsWith("암호")) {
        sendEncodeResultToUser(msg, content);
    } else if (content.startsWith("타이머")) {
        sendTimerToUser(msg, content);
    } else if (content === "잘 자" || content === "잘자") {
        msg.reply("Baby, sweet good night\nhttps://youtu.be/aepREwo5Lio");
    }

    // math
    else if (content.startsWith("랜덤")) {
        sendRandomNumberToUser(msg, content);
    } else if (content.startsWith("계산")) {
        sendCalculationResultToUser(msg, content);
    } else if (
        content.startsWith("단위변환") ||
        content.startsWith("단위 변환")
    ) {
        sendUnitTransformResultToUser(msg, content);
    } else if (
        content === "힘들다" ||
        content === "힘들어" ||
        content === "나 힘들다" ||
        content === "나 힘들어"
    ) {
        msg.reply(
            `${pickRandom(quotes)}\nhttps://youtu.be/${pickRandom(
                songsForComfort
            )}`
        );
    }

    // mini games
    else if (content === "주사위") {
        sendDiceToUser(msg);
    } else if (content === "동전") {
        sendCoinToUser(msg);
    } else if (content === "가위바위보") {
        sendRockPaperScissorsToUser(msg);
    } else if (content.startsWith("제비뽑기")) {
        sendLotsResultToChannel(msg, channel);
    }

    // Moderation
    else if (content.startsWith("역할")) {
        updateRole({ msg, channel, content });
    } else if (content.startsWith("밴")) {
        banUser({ msg, channel, content });
    } else if (content.startsWith("내쫓아")) {
        kickUser({ msg, channel, content });
    } else {
        msg.react("❌").then(() => {
            msg.reply(
                "찾을 수 없는 명령어네요. 😥\n``지은아 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있어요."
            );
        });
    }
});

client.login(process.env.TOKEN);
