const {Client, MessageAttachment} = require('discord.js');
const axios = require("axios");
const fetch = require("node-fetch");
const crypto = require("crypto");
const ytdl = require('ytdl-core');
const fs = require('fs');
const keys = require("./keys.json");
const files = require("./files.json");
const client = new Client();
const gifCategory = ["hi","bye","ok","good","surprised","angry","laugh","cry"];

let latestInsta = null;

const pickRandom = array => {
    return array[Math.round(Math.random() * (array.length - 1))];
};
const pickImg = array => {
    return pickRandom(array).replace("[gfy]", "https://giant.gfycat.com/").replace("[zgfy]", "https://zippy.gfycat.com/").replace("[ten]", "https://tenor.com/view/").replace("[fgfy]", "https://fat.gfycat.com/").replace("[tgfy]", "https://thumbs.gfycat.com/");
};
const quickSort = (arr, l, r) => {
    let i;

    (l < r) &&
    (
        i =  partition(arr, l, r),

        quickSort(arr, l, i - 1),
        quickSort(arr, i + 1, r)
    )

    return arr
};
const partition = (arr, l, r) => {
    let i = l,
        j = r,
        pivot = arr[l];

    while (i < j)
    {
        while (arr[j] > pivot) j--;
        while (i < j && arr[i] <= pivot) i++;
        tmp = arr[i], arr[i] = arr[j], arr[j] = tmp
    }
    return arr[l] = arr[j], arr[j] = pivot, j
};
const parse = raw => {
    try {
        return JSON.parse(raw);
    }
    catch (err) {
        return false;
    }
};
const fetchInsta = action => {
    axios
    .get("https://www.instagram.com/dlwlrma/")
    .then(response => {
        const a = response.data;
        const media = JSON.parse(a.slice(a.indexOf("edge_owner_to_timeline_media") + 30, a.indexOf("edge_saved_media") - 2));
        const latest = media.edges[0].node;

        if (action === "init") {
            latestInsta = latest.id
        }
        else if (action === "check") {
            if (latestInsta && latestInsta !== latest.id) {
                latestInsta = latest.id,
                fs.readFile("./channel.txt", "utf8", function(err, data) {
                    if (err) return console.log(err);
                    const channels = data.split("!!");
                    const comment = latest.edge_media_to_caption.edges[0].node.text;

                    if (latest.is_video) {
                        fetch(`https://www.instagram.com/p/${latest.shortcode}/`)
                        .then(response => {
                            if (response.status === 200) {
                                return response.text()
                            }
                            else {
                                return false
                            }
                        })
                        .then(a => {
                            const attachment = new MessageAttachment(a.slice(a.indexOf("video_url") + 12, a.indexOf("video_view_count") - 3).replace(/\\u0026/gm, "&"));

                            channels.forEach(channel => {
                                const id = channel.replace(/<|#|>/g, "");
                                client.channels.cache.get(id).send(attachment)
                                .then(() => {
                                    client.channels.cache.get(id).send(`>>> ${comment}\nhttps://www.instagram.com/p/${latest.shortcode}`)
                                })
                            })
                        })
                    }
                    else {
                        const attachment = new MessageAttachment(latest.display_url);

                        channels.forEach(channel => {
                            const id = channel.replace(/<|#|>/g, "");
                            client.channels.cache.get(id).send(attachment)
                            .then(() => {
                                client.channels.cache.get(id).send(`>>> ${comment}\nhttps://www.instagram.com/p/${latest.shortcode}`)
                            })
                        })
                    }
                })
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
};

client.on("ready", () => {
    console.log(`Logged in : ${client.user.tag}`);
    client.user.setPresence({
        activity: {
            name: "지은아 도와줘 - 명령어 확인"
        }
    });
    
    fetchInsta("init"),

    setInterval(() => {
        fetchInsta("check")
    }, 1800000)
});

client.on("message", msg => {
    if(msg.author.bot) return;
    let content = msg.content;

    if (content.startsWith("지은아")) {
        const author = msg.author;
        const user = msg.mentions.users.first();
        const member = user && msg.guild.member(user);
        content = content.slice(4);

        // If user typed nothing
        if (content === "") {
            const ranCat = files[pickRandom(gifCategory)];
            msg.channel.send(pickImg(ranCat));
        }

        // Help
        else if (content === "도와줘") {
            msg.channel.send("지은아 [명령어] 구조로 이루어져 있습니다.\n말해 [문자] : 봇이 한 말을 따라 합니다. 마지막에 -지워를 붙이면 해당 메시지를 지우고 따라 합니다.\n정렬해줘 [배열] : Quick Sort로 배열을 정렬합니다.\n[내쫓아 or 밴] [@유저] [문자(밴 사유, 선택)] : 순서대로 kick, ban입니다.\n역할 [행동(추가 / 삭제)] [@유저] [역할 이름] : 유저의 역할을 관리합니다\n인스타 [n번째(생략 가능)] : 인스타그램을 게시글을 표시해줍니다. 마지막에 (숫자)번째를 추가하면 해당 게시물을 보여줍니다.\n유튜브 : 유튜브 링크를 표시합니다.\n뮤비 or 뮤직비디오 : 뮤직비디오 링크를 무작위로 표시합니다.\n암호 [행동(생성 / 해독)] [문자열] : 문자열을 암호화, 복화화합니다.\n날씨 : 기상청에서 받은 중기예보를 알려줍니다.\n게임 : 주사위, 동전, 가위바위보\n\n 움짤 목록 : 안녕, 잘 가, ㅇㅋ, ㅠㅠ, ㅋㅋ, 굿, 헉, 열받네")
        }

        // Greeting, Farewell
        else if (content === "안녕") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.hi));
            })
        }
        else if (content === "잘 가" || content === "잘가") {
            msg.react("💜")
            .then(() => {
                msg.channel.send(pickImg(files.bye));
            })
        }

        // Sending GIFs(Videos)
        else if (content === "ㅇㅋ") {
            msg.channel.send(pickImg(files.ok));
        }
        else if (content === "ㅠㅠ") {
            msg.channel.send(pickImg(files.cry));
        }
        else if (content === "ㅋㅋ") {
            msg.channel.send(pickImg(files.laugh));
        }
        else if (content === "굿") {
            msg.channel.send(pickImg(files.good));
        }
        else if (content === "헉") {
            msg.channel.send(pickImg(files.surprised));
        }
        else if (content === "열 받네" || content === "열받네") {
            msg.channel.send(pickImg(files.angry));
        }

        // notification
        else if (content.startsWith("알림")) {
            const splitted = content.split(" ");
            let action = splitted[1];

            if (action === "추가") {
                let channel = splitted[2].match(/<#(.[0-9]+)>/g);
                
                if (channel) {
                    const path = "./channel.txt";
                    channel = channel[0].replace(/<|#|>/g, "");
    
                    try {
                        if (fs.existsSync(path)) {
                            fs.appendFile(path, `!!${channel}`, function (err) {
                                if (err) {
                                    console.log(err),
                                    msg.reply("채널 추가에 실패했어요. 😢");
                                    return;
                                };
                                console.log(`new channel saved${channel}`),
                                client.channels.cache.get(channel).send(`성공적으로 알림 채널로 등록했어요.\n채널 ID : ${channel}`)
                                .then(() => {
                                    msg.reply("완료!")
                                })
                            });
                        }
                        else {
                            fs.writeFile(path, channel, function (err) {
                                if (err) {
                                    console.log(err),
                                    msg.reply("채널 추가에 실패했어요. 😢");
                                    return;
                                };
                                console.log(`new channel saved${channel}`),
                                client.channels.cache.get(channel).send(`성공적으로 알림 채널로 등록했어요.\n채널 ID : ${channel}`)
                                .then(() => {
                                    msg.reply("완료!")
                                })
                            });
                        }
                    }
                    catch (err) {
                        console.log(err);
                        msg.reply("채널 추가에 실패했어요. 😢")
                    }
                }
                else {
                    msg.reply("올바른 채널을 입력해주세요.")
                }
            }
        }

        // Info
        else if (content.startsWith("인스타")) {
            axios
            .get("https://www.instagram.com/dlwlrma/")
            .then(response => {
                const a = response.data;
                const media = JSON.parse(a.slice(a.indexOf("edge_owner_to_timeline_media") + 30, a.indexOf("edge_saved_media") - 2));
                let target = content.split(" ")[1];

                target && (target = target.replace("번째", "").replace("번쨰", "")),
                +target ? (target =  --target) : (target = 0);

                const targetPost = media.edges[`${target ? target > 11 ? 11 : target : 0}`].node;
                const targetPostComment = targetPost.edge_media_to_caption.edges[0].node.text;

                if (targetPost.is_video) {
                    axios
                    .get(`https://www.instagram.com/p/${targetPost.shortcode}/`)
                    .then(response => {
                        const a = response.data;
                        const attachment = new MessageAttachment(a.slice(a.indexOf("video_url") + 12, a.indexOf("video_view_count") - 3).replace(/\\u0026/gm, "&"));

                        msg.channel.send(attachment)
                        .then(() => {
                            msg.channel.send(`>>> ${targetPostComment}\n더 자세한 내용은 https://www.instagram.com/dlwlrma/ 로!`);
                        })
                    })
                }
                else {
                    const attachment = new MessageAttachment(targetPost.display_url);
                    msg.channel.send(attachment)
                    .then(() => {
                        msg.channel.send(`>>> ${targetPostComment}\n더 자세한 내용은 https://www.instagram.com/dlwlrma/ 로!`);
                    })
                }
            });            
        }
        else if (content === "유튜브") {
            msg.channel.send("https://www.youtube.com/channel/UC3SyT4_WLHzN7JmHQwKQZww");
        }
        else if (content === "뮤비" || content === "뮤직비디오") {
            msg.channel.send(`https://youtu.be/${pickRandom(files.mv)}`)
        }

        // Music
        else if (content.startsWith("재생해줘")) {
            const uri = content.split(" ")[1];
            if (!uri) return msg.reply("재생할 주소를 입력해주세요.");
    
            const voiceChannel = msg.member.voice.channel;
    
            if (!voiceChannel) {
                return msg.reply("음성 채팅방에 들어가셔야 재생할 수 있어요.");
            }
    
            voiceChannel.join().then(connection => {
                const stream = ytdl(uri, {filter: "audioonly"});
                const dispatcher = connection.play(stream);
    
                dispatcher.on("end", () => voiceChannel.leave());
            });
        }

        // Extra Functions
        else if (content.startsWith("말해")) {
            if (content.split(" ").length >= 3) {
                if (content.slice(-3) === "-지워") {
                    msg.delete();
                    msg.channel.send(content.slice(0, -3).replace("말해 ", ""));
                }
                else {
                    msg.channel.send(content.replace("말해 ", ""));
                }
            }
            else {
                msg.reply("``지은아 말해 [말할 내용]``이 올바른 사용법이에요.")
            }
        }
        else if (content === "집합시켜") {
            msg.channel.send(`@everyone ${author}님이 집합하시랍니다!`)
        }
        else if (content.startsWith("정렬해줘")) {
            const array = content.match(/\[(.*)\]/g)[0];
            if (array) {
                const start = new Date().getTime();
                const parsed = parse(array) ;

                if (parsed) {
                    const sorted = quickSort(parsed, 0, parsed.length - 1);
                    msg.reply(`[${sorted}]\n정렬하는데 \`\`${new Date().getTime() - start}ms\`\`가 소요되었어요.`);
                }
                else {
                    msg.reply("정렬할 수 없는 배열이에요. 😥")
                }
            }
            else {
                msg.reply("``지은아 정렬해줘 [배열]``로 정렬할 수 있어요.")
            }
        }
        else if (content.startsWith("암호")) {
            const split = content.split(" ");
            const action = split[1];

            if (action === "생성") {
                const cipher = crypto.createCipher("aes-256-cbc", "key");
                let encrypted = cipher.update(split.slice(2).join(" "), "utf8", "base64");
                encrypted += cipher.final("base64");
                msg.reply(encrypted);
            }
            else if (action === "해독") {
                const decipher = crypto.createDecipher("aes-256-cbc", "key");
                let decrypted = decipher.update(split[2], "base64", "utf8");
                decrypted += decipher.final("utf8");
                if (decrypted) {
                    msg.reply(decrypted);
                }
                else {
                    msg.reply("복호화에 실패했어요. 😥")
                }
            }
            else {
                msg.reply("암호 [행동(생성, 해독)] [문자열]로 암호를 생성하고 해독할 수 있어요.")
            }
        }
        else if (content.startsWith("타이머")) {
            const time = content.replace("타이머 ", "").split(" ");
            const regex = /^([0-9]+)(분|초|시간)$/;
            const timeToMs = (time, unit) => {
                return `${unit === "시간" ? time*3600000 : unit === "분" ? time*60000 : unit === "초" ? time*1000 : false}`
            };
            try {
                let result = 0;
                time.forEach(time => {
                    const match = time.match(regex);
                    result += +timeToMs(match[1], match[2])
                })
                msg.reply(`${result/1000}초 뒤에 알려드릴게요! ⏲️`)
                .then(() => {
                    setTimeout(() => {
                        msg.reply("설정한 시간이 끝났어요! 🔔")
                    }, result)
                })
            }
            catch (err) {
                msg.reply("올바른 시간을 입력해주세요.")
            }
        }

        // weather
        else if (content === "날씨") {
            const date = () => {
                const now = new Date();
                const format = number => {
                    return `${number < 10 ? `0${number}` : number}`
                };
                let hhmm = 0;

                if (now.getHours() <= 6) {
                    now.setDate(now.getDate() - 1);
                    hhmm = "1800"
                }

                const month = now.getMonth() + 1;
                const date = now.getDate();
                hhmm = hhmm ? hhmm : now.getHours() < 18 ? "0600" : "1800";

                return `${now.getFullYear()}${format(month)}${format(date)}${hhmm}`
            };

            fetch(`http://apis.data.go.kr/1360000/MidFcstInfoService/getMidFcst?serviceKey=${keys.weatherApi}&pageNo=1&numOfRows=10&dataType=JSON&stnId=108&tmFc=${date()}`)
            .then(response => {
                return response.json()
            })
            .then(data => {
                msg.channel.send(data.response.body.items.item[0].wfSv)
            })
        }

        // mini games
        else if (content === "주사위") {
            const result = Math.floor(Math.random() * 5 + 1);
            msg.reply(`${result === 1 ? "⚀ (1)" : result === 2 ? "⚁ (2)" : result === 3 ? "⚂ (3)" : result === 4 ? "⚃ (4)" : result === 5 ? "⚄ (5)" : "⚅ (6)"}`);
        }
        else if (content === "동전") {
            const result = Math.round(Math.random());
            msg.reply(`${result ? "앞" : "뒤"}`);
        }
        else if (content === "가위바위보") {
            const arr = ["✊", "✌️", "✋"];
            const choose = Math.round(Math.random() * 2);
            const filter = (reaction, user) => {
                return arr.includes(reaction.emoji.name) && user.id === msg.author.id;
            };

            Promise.all([
		        msg.react("✊"),
		        msg.react("✌️"),
		        msg.react("✋"),
            ])
            .catch(() => msg.reply("다음에 할래요."));

            msg.awaitReactions(filter, { max: 1, time: 10000, errors: ["time"] })
	        .then(collected => {
                const reaction = collected.first();
                msg.reply(`${
                    reaction.emoji.name === "✊"
                    ?
                        choose === 0
                        ? "✊ 비겼네요 😏"
                        : choose === 1
                            ? "✌️ 제가 졌어요 😥"
                            : "✋ 제가 이겼네요 😁"
                    : reaction.emoji.name === "✌️"
                        ?
                            choose === 0
                            ? "✊ 제가 이겼네요 😁"
                            : choose === 1
                                ? "✌️ 비겼네요 😏"
                                : "✋ 제가 졌어요 😥"
                        :
                            choose === 0
                            ? "✊ 제가 졌어요 😥"
                            : choose === 1
                                ? "✌️ 제가 이겼네요 😁"
                                : "✋ 비겼네요 😏"
                }`);
                
	        });
        }

        // Moderation
        else if (content.startsWith("역할")) {
            if (!user) return msg.reply("누굴요?");

            if (member) {
                const split = content.split(" ");
                const action = split[1];
                if (!action || !split[2] || !split[3]) return msg.reply("역할 [행동(추가 / 삭제)] [@유저] [역할 이름]으로 사용하실 수 있어요.");
                const role = msg.guild.roles.cache.find(role => role.name === split.slice(3).join(" "));
                if (!role) return msg.reply("그런 역할은 없어요. 😥");

                if (action === "추가") {
                    if (member.roles.cache.has(role.id)) {
                        msg.reply("이미 역할이 부여되어있네요.")
                    }
                    else {
                        member.roles.add(role.id)
                        .then(() => {
                            msg.channel.send(`축하합니다! ${split[2]} 님! \`\`${role.name}\`\` 역할을 부여받았어요!`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 부여에 실패했어요. 😥");
                        })
                    }
                }
                if (action === "삭제") {
                    if (member.roles.cache.has(role.id)) {
                        member.roles.remove(role.id)
                        .then(() => {
                            msg.channel.send(`${split[2]} 님에게서 \`\`${role.name}\`\` 역할을 삭제했습니다.`)
                        })
                        .catch(err => {
                            console.log(err);
                            msg.reply("역할 삭제에 실패했어요. 😥");
                        })
                    }
                    else {
                        msg.reply("그런 역할은 부여되어 있지 않네요.")
                    }
                }
                if (action === "확인") {

                }
            }
            else {
                msg.reply("그런 사람은 없어요. 😥")
            }
        }
        else if (content.startsWith("밴") || content.startsWith("내쫓아")) {
            if (user) {
                const reason = content.match(/ /g)[1];
                if (member) {
                    if (content.startsWith("밴")) {
                        msg.reply("정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다.")
                        .then(() => {
                            const filter = m => msg.author.id === m.author.id;

                            msg.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
                            .then(reply => {
                                const result = reply.first().content;
                                if (result === "응" || result === "ㅇㅇ") {
                                    member
                                    .ban({
                                        reason: `${reason ? message.slice(message.lastIndexOf(" ")+1) : "나빴어"}`
                                    })
                                    .then(() => {
                                        msg.reply(`${user.tag}을(를) 밴했어요.`)
                                    })
                                    .catch(() => {
                                        msg.reply("이 사람은 밴할 수 없네요.")
                                    })
                                }
                                else {
                                    msg.reply("작업을 취소합니다.")
                                }
                            })
                            .catch(() => {
                                msg.reply("대답하지 않으셨으니 없던 일로 할게요.")
                            })
                        })
                    }
                    else {
                        msg.reply("정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다.")
                        .then(() => {
                            const filter = m => msg.author.id === m.author.id;

                            msg.channel.awaitMessages(filter, { time: 10000, max: 1, errors: ['time'] })
                            .then(reply => {
                                const result = reply.first().content;
                                if (result === "응" || result === "ㅇㅇ") {
                                    member
                                    .kick({
                                        reason: `${reason ? message.slice(message.lastIndexOf(" ")+1) : "나빴어"}`
                                    })
                                    .then(() => {
                                        msg.reply(`${user.tag}을(를) 내쫓았어요.`)
                                    })
                                    .catch(() => {
                                        msg.reply("이 사람은 내쫓을 수 없네요.")
                                    })
                                }
                                else {
                                    msg.reply("작업을 취소합니다.")
                                }
                            })
                            .catch(() => {
                                msg.reply("대답하지 않으셨으니 없던 일로 할게요.")
                            })
                        })
                    }
                }
                else {
                    msg.reply("그런 사람은 없어요. 😥")
                }
            }
            else {
                msg.reply("누굴요?")
            }
        }
        else {
            msg.react("❌")
            .then(() => {
                msg.reply("찾을 수 없는 명령어네요. 😥\n``지은아 도와줘`` 명령어를 이용해 명령어 목록을 확인할 수 있어요.");
            })
        }
    }
});

client.login(keys.token);
