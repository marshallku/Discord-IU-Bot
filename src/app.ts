import { Client, Message, MessageReaction, User } from "discord.js";
import { evaluate, format } from "mathjs";
import { decrypt, encrypt } from "./utils/encode";
import { pickRandom, sortArray } from "./utils/array";
import parse from "./utils/parse";
import files from "./data/files";

const client = new Client();
const encryptKey = "aDogWlsHxuRWLMwz5zkVguZboXn9CXYJ";
const gifCategory = [
    "hi",
    "bye",
    "ok",
    "no",
    "good",
    "surprised",
    "angry",
    "laugh",
    "cry",
    "fighting",
    "love",
] as const;
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
    const { author, channel, reply } = msg;
    const prefix = /^지(은|금)아 ?/;

    if (!author || author.bot || !prefix.test(msg.content)) {
        return;
    }

    const content = msg.content.replace(prefix, "");
    const user = msg.mentions?.users.first();
    const member = user && msg.guild?.member(user);

    // bad word blocker
    if (badWords.test(content)) {
        return reply(
            "바르고 고운 말 사용하기!\n지속해서 사용하면 관리자에 의해 차단될 수 있습니다."
        );
    }

    // If user typed nothing
    if (msg.content === "지은아" || msg.content === "지금아") {
        channel.send(
            pickRandom(
                Object.entries(files)
                    .map(([, value]) => value)
                    .flat()
            )
        );
    }

    // Help
    else if (content === "도와줘") {
        channel.send(
            "[지은아 or 지금아] [명령어] 구조로 이루어져 있습니다.\n말해 [문자] : 봇이 한 말을 따라 합니다. 마지막에 -지워를 붙이면 해당 메시지를 지우고 따라 합니다.\n정렬해줘 [배열] : Quick Sort로 배열을 정렬합니다.\n[내쫓아 or 밴] [@유저] [문자(밴 사유, 선택)] : 순서대로 kick, ban입니다.\n역할 [행동(추가 / 삭제)] [@유저] [역할 이름] : 유저의 역할을 관리합니다\n유튜브 : 유튜브 링크를 표시합니다.\n뮤비 or 뮤직비디오 : 뮤직비디오 링크를 무작위로 표시합니다.\n타이머 [시간(n시간 n분 n초)] : 설정한 시간 뒤에 알림을 보내줍니다.\n암호 [행동(생성 / 해독)] [문자열] : 문자열을 암호화, 복화화합니다.\n랜덤 [최소 숫자] [최대 숫자] : 최소 숫자와 최대 숫자 사이의 수 중 하나를 무작위로 뽑습니다.\n계산 [수식] : 해당 수식을 계산해줍니다.\n(단위변환 or 단위 변환) [변환할 항목] [단위] : 단위를 변환해줍니다. 변환할 항목엔 숫자와 단위, 단위엔 단위만 입력하시면 됩니다.\n게임 : 주사위, 동전, 가위바위보\n제비뽑기 [@유저] : 유저 중 한 명만 당첨됩니다. 반드시 2인 이상 언급해야 합니다.\n[힘들다 or 힘들어] : 위로가 필요한 당신에게\n 움짤 목록 : 안녕(or ㅎㅇ), 잘 가(or ㅂㅇ, ㅂㅂ), ㅇㅋ, ㄴㄴ, ㅠㅠ, ㅋㅋ, 굿, 헉, 열받네, 사랑해, 화이팅"
        );
    }

    // Greeting, Farewell
    else if (content === "안녕" || content === "ㅎㅇ") {
        msg.react("💜").then(() => {
            channel.send(pickRandom(files.hi));
        });
    } else if (
        content === "잘 가" ||
        content === "잘가" ||
        content == "ㅂㅂ" ||
        content == "ㅂㅇ"
    ) {
        msg.react("💜").then(() => {
            channel.send(pickRandom(files.bye));
        });
    }

    // Sending GIFs(Videos)
    else if (content === "ㅇㅋ") {
        channel.send(pickRandom(files.ok));
    } else if (content === "ㄴㄴ") {
        channel.send(pickRandom(files.no));
    } else if (content === "ㅠㅠ") {
        channel.send(pickRandom(files.cry));
    } else if (content === "ㅋㅋ") {
        channel.send(pickRandom(files.laugh));
    } else if (content === "굿") {
        channel.send(pickRandom(files.good));
    } else if (content === "헉") {
        channel.send(pickRandom(files.surprised));
    } else if (content === "열 받네" || content === "열받네") {
        channel.send(pickRandom(files.angry));
    } else if (content === "화이팅" || content === "파이팅") {
        channel.send(pickRandom(files.fighting));
    } else if (content === "사랑해") {
        channel.send(pickRandom(files.love));
    }

    // Info
    else if (content.startsWith("이름")) {
        reply("예명 : IU(아이유)\n본명 : 이지은 (李知恩, Lee Ji-Eun)");
    } else if (content === "유튜브") {
        channel.send(
            "https://www.youtube.com/channel/UC3SyT4_WLHzN7JmHQwKQZww"
        );
    } else if (content === "뮤비" || content === "뮤직비디오") {
        channel.send(`https://youtu.be/${pickRandom(files.mv)}`);
    }

    // Extra Functions
    else if (content.startsWith("말해")) {
        if (content.split(" ").length >= 2) {
            if (content.slice(-3) === "-지워") {
                channel
                    .send(content.slice(0, -3).replace("말해 ", ""))
                    .then(() => {
                        try {
                            msg.delete();
                        } catch (err) {
                            channel.send(
                                "메시지 삭제 권한을 부여받지 못했습니다. 서버 관리자에게 문의해주세요.\nhttps://discordapp.com/api/oauth2/authorize?client_id=684667274287906835&permissions=8&scope=bot\n링크를 통해 봇을 추가하시면 문제가 해결됩니다."
                            );
                        }
                    });
            } else {
                channel.send(content.replace("말해 ", ""));
            }
        } else {
            reply("``지은아 말해 [말할 내용]``이 올바른 사용법이에요.");
        }
    } else if (content === "집합시켜") {
        channel.send(`@everyone ${author}님이 집합하시랍니다!`);
    } else if (content.startsWith("정렬해줘")) {
        const arrRegex = content.match(/\[(.*)\]/g);
        if (arrRegex) {
            const array = arrRegex[0];
            const start = new Date().getTime();
            const parsed = parse(array);

            if (parsed) {
                const sorted = sortArray(parsed);
                reply(
                    `[${sorted}]\n정렬하는데 \`\`${
                        new Date().getTime() - start
                    }ms\`\`가 소요되었어요.`
                );
            } else {
                reply("정렬할 수 없는 배열이에요. 😥");
            }
        } else {
            reply("``지은아 정렬해줘 [배열]``로 정렬할 수 있어요.");
        }
    } else if (content.startsWith("암호")) {
        const split = content.split(" ");
        const action = split[1];

        if (action === "생성") {
            reply(encrypt(split.slice(2).join(" ")));
        } else if (action === "해독") {
            try {
                reply(decrypt(split[2]));
            } catch (err) {
                reply("복호화에 실패했어요. 😥");
            }
        } else {
            reply(
                "암호 [행동(생성, 해독)] [문자열]로 암호를 생성하고 해독할 수 있어요."
            );
        }
    } else if (content.startsWith("타이머")) {
        const time = content.replace("타이머 ", "").split(" ");
        const regex = /^([0-9]+)(분|초|시간)$/;
        const timeToMs = (time: number, unit: string) => {
            return `${
                unit === "시간"
                    ? time * 3600000
                    : unit === "분"
                    ? time * 60000
                    : unit === "초"
                    ? time * 1000
                    : 0
            }`;
        };
        try {
            let result = 0;
            time.forEach((time) => {
                const match = time.match(regex);

                if (!match) {
                    return;
                }

                result += +timeToMs(+match[1], match[2]);
            });
            if (result > 10800000) return reply("3시간 이하로 설정해주세요!");
            reply(`${result / 1000}초 뒤에 알려드릴게요! ⏲️`).then(() => {
                setTimeout(() => {
                    reply("설정한 시간이 끝났어요! 🔔");
                }, result);
            });
        } catch (err) {
            reply("올바른 시간을 입력해주세요.");
        }
    } else if (content === "잘 자" || content === "잘자") {
        reply("Baby, sweet good night\nhttps://youtu.be/aepREwo5Lio");
    }

    // math
    else if (content.startsWith("랜덤")) {
        const split = content.split(" ");
        const min = +split[1];
        const max = +split[2];
        if (split.length === 3 && min !== NaN && max !== NaN && max > min) {
            reply(Math.round(Math.random() * (max - min)) + min);
        } else {
            reply(
                "``지은아 랜덤 [최소 숫자] [최대 숫자]``가 올바른 사용법이에요."
            );
        }
    } else if (content.startsWith("계산")) {
        const formula = content.slice(3);

        if (formula) {
            try {
                const result = evaluate(formula);
                const resStr = format(result, { precision: 14 });
                const type = typeof result;
                if (type === "function") {
                    throw "error";
                }
                reply(resStr);
            } catch (err) {
                reply("올바른 수식을 입력해주세요.");
            }
        } else {
            reply("``지은아 계산 [수식]``이 올바른 사용법이에요.");
        }
    } else if (
        content.startsWith("단위변환") ||
        content.startsWith("단위 변환")
    ) {
        const split = content.replace("단위 변환", "단위변환").split(" ");
        if (split.length === 3) {
            try {
                reply(format(evaluate(`${split[1]} to ${split[2]}`)));
            } catch (err) {
                reply("올바른 단위를 입력해주세요.");
            }
        } else {
            reply(
                "``지은아 (단위변환 or 단위 변환) [변환할 항목] [단위]``가 올바른 사용법이에요."
            );
        }
    } else if (
        content === "힘들다" ||
        content === "힘들어" ||
        content === "나 힘들다" ||
        content === "나 힘들어"
    ) {
        const songs = [
            "uZf9Q_SOzvY",
            "Tqudgg0aBAI",
            "SfeaTW4bcAw",
            "JSOBF_WhqEM",
            "8ykMyNHAdKk",
            "eGXJs7zOHC4",
            "l5Rb1pNre40",
            "6hdlWxoRCxA",
            "F0QBv_RsxFE",
            "udyjgsSuMDM",
            "q65-fBdPgCE",
        ];
        reply(`${pickRandom(quotes)}\nhttps://youtu.be/${pickRandom(songs)}`);
    }

    // mini games
    else if (content === "주사위") {
        const result = Math.floor(Math.random() * 5 + 1);
        reply(
            `\n${
                result === 1
                    ? "```┌─────────┐\n│         │\n│    *    │\n│         │\n└─────────┘```"
                    : result === 2
                    ? "```┌─────────┐\n│ *       │\n│         │\n│       * │\n└─────────┘```"
                    : result === 3
                    ? "```┌─────────┐\n│ *       │\n│    *    │\n│       * │\n└─────────┘```"
                    : result === 4
                    ? "```┌─────────┐\n│ *     * │\n│         │\n│ *     * │\n└─────────┘```"
                    : result === 5
                    ? "```┌─────────┐\n│ *     * │\n│    *    │\n│ *     * │\n└─────────┘```"
                    : "```┌─────────┐\n│ *     * │\n│ *     * │\n│ *     * │\n└─────────┘```"
            }`
        );
    } else if (content === "동전") {
        const result = Math.round(Math.random());
        reply(`${result ? "앞" : "뒤"}`);
    } else if (content === "가위바위보") {
        const arr = ["✊", "✌️", "✋"];
        const choose = Math.round(Math.random() * 2);
        const filter = (reaction: MessageReaction, user: User) => {
            return (
                arr.includes(reaction.emoji.name) && user.id === msg.author.id
            );
        };

        Promise.all([msg.react("✊"), msg.react("✌️"), msg.react("✋")]).catch(
            () => reply("다음에 할래요.")
        );

        msg.awaitReactions(filter, {
            max: 1,
            time: 10000,
            errors: ["time"],
        }).then((collected) => {
            const reaction = collected.first();

            if (!reaction) {
                return;
            }

            reply(
                `${
                    reaction.emoji.name === "✊"
                        ? choose === 0
                            ? "✊ 비겼네요 😏"
                            : choose === 1
                            ? "✌️ 제가 졌어요 😥"
                            : "✋ 제가 이겼네요 😁"
                        : reaction.emoji.name === "✌️"
                        ? choose === 0
                            ? "✊ 제가 이겼네요 😁"
                            : choose === 1
                            ? "✌️ 비겼네요 😏"
                            : "✋ 제가 졌어요 😥"
                        : choose === 0
                        ? "✊ 제가 졌어요 😥"
                        : choose === 1
                        ? "✌️ 제가 이겼네요 😁"
                        : "✋ 비겼네요 😏"
                }`
            );
        });
    } else if (content.startsWith("제비뽑기")) {
        const users = msg.mentions.users;
        const size = users.size;

        if (size < 2) {
            reply("2인 이상 언급해주세요!");
        } else {
            const randomUser = pickRandom(users.array());

            channel.send(`당첨! 🎉<@${randomUser}>🎉`);
        }
    }

    // Moderation
    else if (content.startsWith("역할")) {
        if (!user) return reply("누굴요?");

        if (member) {
            const split = content.split(" ");
            const action = split[1];
            if (!action || !split[2] || !split[3])
                return reply(
                    "역할 [행동(추가 / 삭제)] [@유저] [역할 이름]으로 사용하실 수 있어요."
                );
            const role = msg.guild?.roles.cache.find(
                (role) => role.name === split.slice(3).join(" ")
            );
            if (!role) return reply("그런 역할은 없어요. 😥");

            if (action === "추가") {
                if (member.roles.cache.has(role.id)) {
                    reply("이미 역할이 부여되어있네요.");
                } else {
                    member.roles
                        .add(role.id)
                        .then(() => {
                            channel.send(
                                `축하합니다! ${split[2]} 님! \`\`${role.name}\`\` 역할을 부여받았어요!`
                            );
                        })
                        .catch((err) => {
                            console.log(err);
                            reply("역할 부여에 실패했어요. 😥");
                        });
                }
            }
            if (action === "삭제") {
                if (member.roles.cache.has(role.id)) {
                    member.roles
                        .remove(role.id)
                        .then(() => {
                            channel.send(
                                `${split[2]} 님에게서 \`\`${role.name}\`\` 역할을 삭제했습니다.`
                            );
                        })
                        .catch((err) => {
                            console.log(err);
                            reply("역할 삭제에 실패했어요. 😥");
                        });
                } else {
                    reply("그런 역할은 부여되어 있지 않네요.");
                }
            }
            if (action === "확인") {
            }
        } else {
            reply("그런 사람은 없어요. 😥");
        }
    } else if (content.startsWith("밴") || content.startsWith("내쫓아")) {
        if (user) {
            const matches = content.match(/ /g);
            const reason = (matches || [])[1];

            if (member) {
                if (content.startsWith("밴")) {
                    reply(
                        "정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다."
                    ).then(() => {
                        const filter = (m: Message) =>
                            msg.author.id === m.author.id;

                        channel
                            .awaitMessages(filter, {
                                time: 10000,
                                max: 1,
                                errors: ["time"],
                            })
                            .then((messageReply) => {
                                const result = messageReply.first()?.content;

                                if (result === "응" || result === "ㅇㅇ") {
                                    member
                                        .ban({
                                            reason: `${
                                                reason
                                                    ? content.slice(
                                                          content.lastIndexOf(
                                                              " "
                                                          ) + 1
                                                      )
                                                    : "나빴어"
                                            }`,
                                        })
                                        .then(() => {
                                            reply(
                                                `${user.tag}을(를) 밴했어요.`
                                            );
                                        })
                                        .catch(() => {
                                            reply("이 사람은 밴할 수 없네요.");
                                        });
                                } else {
                                    reply("작업을 취소합니다.");
                                }
                            })
                            .catch(() => {
                                reply("대답하지 않으셨으니 없던 일로 할게요.");
                            });
                    });
                } else {
                    reply(
                        "정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다."
                    ).then(() => {
                        const filter = (m: Message) =>
                            msg.author.id === m.author.id;

                        channel
                            .awaitMessages(filter, {
                                time: 10000,
                                max: 1,
                                errors: ["time"],
                            })
                            .then((messageReply) => {
                                const result = messageReply.first()?.content;

                                if (result === "응" || result === "ㅇㅇ") {
                                    member
                                        .kick(
                                            `${
                                                reason
                                                    ? content.slice(
                                                          content.lastIndexOf(
                                                              " "
                                                          ) + 1
                                                      )
                                                    : "나빴어"
                                            }`
                                        )
                                        .then(() => {
                                            reply(
                                                `${user.tag}을(를) 내쫓았어요.`
                                            );
                                        })
                                        .catch(() => {
                                            reply(
                                                "이 사람은 내쫓을 수 없네요."
                                            );
                                        });
                                } else {
                                    reply("작업을 취소합니다.");
                                }
                            })
                            .catch(() => {
                                reply("대답하지 않으셨으니 없던 일로 할게요.");
                            });
                    });
                }
            } else {
                reply("그런 사람은 없어요. 😥");
            }
        } else {
            reply("누굴요?");
        }
    } else {
        msg.react("❌").then(() => {
            reply(
                "찾을 수 없는 명령어네요. 😥\n``지은아 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있어요."
            );
        });
    }
});

client.login(process.env.TOKEN);
