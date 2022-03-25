import { Message } from "discord.js";
import type { Channel } from "../@types/app";

export default function echoToChannel({
    msg,
    channel,
    content,
}: {
    msg: Message;
    channel: Channel;
    content: string[];
}) {
    if (content.length <= 0) {
        msg.reply("``지은아 말해 [말할 내용]``이 올바른 사용법이에요.");
        return;
    }

    if (content[content.length - 1] === "지워") {
        channel.send(content.slice(0, -1).join(" "));
        return;
    }

    channel.send(content.join(" "));
}
