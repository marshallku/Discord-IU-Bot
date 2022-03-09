import { Message } from "discord.js";
import { decrypt, encrypt } from "../utils/encode";

export default function sendEncodeResultToUser(msg: Message, content: string) {
    const [, action, ...rest] = content.split(" ");
    const text = rest.join(" ");

    if (action === "생성") {
        msg.reply(encrypt(text));
        return;
    }

    if (action === "해독") {
        try {
            msg.reply(decrypt(text));
        } catch (err) {
            msg.reply("복호화에 실패했어요. 😥");
        }
        return;
    }

    msg.reply(
        "암호 [행동(생성, 해독)] [문자열]로 암호를 생성하고 해독할 수 있어요."
    );
}
