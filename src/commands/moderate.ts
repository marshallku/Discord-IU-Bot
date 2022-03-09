import { Message } from "discord.js";
import { Channel } from "../@types/app";

export async function updateRole({
    msg,
    channel,
    content,
}: {
    msg: Message;
    channel: Channel;
    content: string;
}) {
    const user = msg.mentions?.users.first();
    const member = user && msg.guild?.member(user);

    if (!user) {
        msg.reply("누굴요?");
        return;
    }

    if (!member) {
        msg.reply("그런 사람은 없어요. 😥");
        return;
    }

    const split = content.split(" ");
    const [, action, target, ...rest] = split;
    const targetRole = rest.join(" ");

    if (!action || !target || !targetRole) {
        msg.reply(
            "역할 [행동(추가 / 삭제)] [@유저] [역할 이름]으로 사용하실 수 있어요."
        );
        return;
    }

    const role = msg.guild?.roles.cache.find(
        (role) => role.name === targetRole
    );

    if (!role) {
        msg.reply("그런 역할은 없어요. 😥");
        return;
    }

    if (action === "추가") {
        if (!member.roles.cache.has(role.id)) {
            msg.reply("이미 역할이 부여되어있네요.");
            return;
        }

        try {
            await member.roles.add(role.id);
            channel.send(
                `축하합니다! ${target} 님! \`\`${role.name}\`\` 역할을 부여받았어요!`
            );
        } catch {
            msg.reply("역할 부여에 실패했어요. 😥");
        }

        return;
    }

    if (action === "삭제") {
        if (!member.roles.cache.has(role.id)) {
            msg.reply("그런 역할은 부여되어 있지 않네요.");
            return;
        }

        try {
            await member.roles.remove(role.id);
            channel.send(
                `${target} 님에게서 \`\`${role.name}\`\` 역할을 삭제했습니다.`
            );
        } catch {
            msg.reply("역할 삭제에 실패했어요. 😥");
        }
    }
}

export async function banUser({
    msg,
    channel,
    content,
}: {
    msg: Message;
    channel: Channel;
    content: string;
}) {
    const user = msg.mentions?.users.first();
    const member = user && msg.guild?.member(user);

    if (!user) {
        msg.reply("누굴요?");
        return;
    }

    if (!member) {
        msg.reply("그런 사람은 없어요. 😥");
        return;
    }

    const matches = content.match(/ /g);
    const reason = (matches || [])[1];

    await msg.reply(
        "정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다."
    );

    const filter = (m: Message) => msg.author.id === m.author.id;

    try {
        const messageReply = await channel.awaitMessages(filter, {
            time: 10000,
            max: 1,
            errors: ["time"],
        });
        const result = messageReply.first()?.content;

        if (result !== "응" && result !== "ㅇㅇ") {
            msg.reply("작업을 취소합니다.");
            return;
        }

        try {
            await member.ban({
                reason: `${
                    reason
                        ? content.slice(content.lastIndexOf(" ") + 1)
                        : "나빴어"
                }`,
            });
            msg.reply(`${user.tag}을(를) 밴했어요.`);
        } catch {
            msg.reply("이 사람은 밴할 수 없네요.");
        }
    } catch {
        msg.reply("대답하지 않으셨으니 없던 일로 할게요.");
    }
}

export async function kickUser({
    msg,
    channel,
    content,
}: {
    msg: Message;
    channel: Channel;
    content: string;
}) {
    const user = msg.mentions?.users.first();
    const member = user && msg.guild?.member(user);

    if (!user) {
        msg.reply("누굴요?");
        return;
    }

    if (!member) {
        msg.reply("그런 사람은 없어요. 😥");
        return;
    }

    const matches = content.match(/ /g);
    const reason = (matches || [])[1];

    await msg.reply(
        "정말 진행하시겠어요?\n응 혹은 ㅇㅇ을 입력하시면 계속 진행합니다."
    );

    const filter = (m: Message) => msg.author.id === m.author.id;

    try {
        const messageReply = await channel.awaitMessages(filter, {
            time: 10000,
            max: 1,
            errors: ["time"],
        });
        const result = messageReply.first()?.content;

        if (result !== "응" && result !== "ㅇㅇ") {
            msg.reply("작업을 취소합니다.");
            return;
        }

        try {
            await member.kick(
                `${
                    reason
                        ? content.slice(content.lastIndexOf(" ") + 1)
                        : "나빴어"
                }`
            );
            msg.reply(`${user.tag}을(를) 내쫓았어요.`);
        } catch {
            msg.reply("이 사람은 내쫓을 수 없네요.");
        }
    } catch {
        msg.reply("대답하지 않으셨으니 없던 일로 할게요.");
    }
}
