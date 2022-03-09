import { Message, MessageReaction, User } from "discord.js";
import { Channel } from "../@types/app";
import { pickRandom } from "../utils/array";
import { getInclusiveRandomInt, getRandomBoolean } from "../utils/random";

export function sendDiceToUser(msg: Message) {
    const result = getInclusiveRandomInt(1, 6);
    const diceStrings = [
        "",
        "```┌─────────┐\n│         │\n│    *    │\n│         │\n└─────────┘```",
        "```┌─────────┐\n│ *       │\n│         │\n│       * │\n└─────────┘```",
        "```┌─────────┐\n│ *       │\n│    *    │\n│       * │\n└─────────┘```",
        "```┌─────────┐\n│ *     * │\n│         │\n│ *     * │\n└─────────┘```",
        "```┌─────────┐\n│ *     * │\n│    *    │\n│ *     * │\n└─────────┘```",
        "```┌─────────┐\n│ *     * │\n│ *     * │\n│ *     * │\n└─────────┘```",
    ];

    msg.reply(`\n${diceStrings[result]}`);
}

export function sendCoinToUser(msg: Message) {
    const result = getRandomBoolean();

    msg.reply(`${result ? "앞" : "뒤"}`);
}

export function sendRockPaperScissorsToUser(msg: Message) {
    const arr = ["✊", "✌️", "✋"];
    const choose = getInclusiveRandomInt(0, 2);
    const filter = (reaction: MessageReaction, user: User) =>
        arr.includes(reaction.emoji.name) && user.id === msg.author.id;

    Promise.all([msg.react("✊"), msg.react("✌️"), msg.react("✋")]).catch(() =>
        msg.reply("다음에 할래요.")
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

        msg.reply(
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
}

export function sendLotsResultToChannel(msg: Message, channel: Channel) {
    const { users } = msg.mentions;
    const size = users.size;

    if (size < 2) {
        msg.reply("2인 이상 언급해주세요!");
    } else {
        const randomUser = pickRandom(users.array());

        channel.send(`당첨! 🎉<@${randomUser}>🎉`);
    }
}
