import { Message } from "discord.js";
import parseTime, { HOUR_TO_MS, MINUTE_TO_MS } from "../utils/time";

export default function sendTimerToUser(msg: Message, content: string) {
    const time = content.replace("타이머 ", "");
    const parsedTime = parseTime(time);

    if (parsedTime <= 0) {
        msg.reply("올바른 시간을 입력해주세요.");
        return;
    }

    if (3 * HOUR_TO_MS <= parsedTime) {
        msg.reply("3시간 이하로 설정해주세요!");
        return;
    }

    msg.reply(`${time} 뒤에 알려드릴게요! ⏲️`).then(() => {
        if (5 * MINUTE_TO_MS <= parsedTime) {
            setTimeout(() => {
                msg.reply("1분 남았어요! 🏃");
            }, parsedTime - 1 * MINUTE_TO_MS);
        }

        setTimeout(() => {
            msg.reply("설정한 시간이 끝났어요! 🔔");
        }, parsedTime);
    });
}
