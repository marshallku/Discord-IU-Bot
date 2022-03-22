import { Message } from "discord.js";
import type { Channel } from "../@types/app";

export default function deleteMessage(msg: Message, channel: Channel) {
    try {
        msg.delete();
    } catch (err) {
        channel.send(
            "메시지 삭제 권한을 부여받지 못했습니다. 서버 관리자에게 문의해주세요.\nhttps://discordapp.com/api/oauth2/authorize?client_id=684667274287906835&permissions=8&scope=bot\n링크를 통해 봇을 추가하시면 문제가 해결됩니다."
        );
    }
}
