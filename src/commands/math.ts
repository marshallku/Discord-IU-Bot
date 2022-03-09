import { Message } from "discord.js";
import { evaluate, format } from "mathjs";
import { sortArray } from "../utils/array";
import parse from "../utils/parse";

export function sendSortResultToUser(msg: Message, content: string) {
    const arrRegex = content.match(/\[(.*)\]/g);

    if (arrRegex) {
        const array = arrRegex[0];
        const start = new Date().getTime();
        const parsed = parse(array);

        if (parsed) {
            const sorted = sortArray(parsed);
            msg.reply(
                `[${sorted}]\n정렬하는데 \`\`${
                    new Date().getTime() - start
                }ms\`\`가 소요되었어요.`
            );
        } else {
            msg.reply("정렬할 수 없는 배열이에요. 😥");
        }
    } else {
        msg.reply("``지은아 정렬해줘 [배열]``로 정렬할 수 있어요.");
    }
}

export function sendRandomNumberToUser(msg: Message, content: string) {
    const [, minString, maxString] = content.split(" ");
    const min = +minString;
    const max = +maxString;

    if (Number.isNaN(min) || Number.isNaN(max) || max <= min) {
        msg.reply(
            "``지은아 랜덤 [최소 숫자] [최대 숫자]``가 올바른 사용법이에요."
        );
        return;
    }

    msg.reply(Math.round(Math.random() * (max - min)) + min);
}

export function sendCalculationResultToUser(msg: Message, content: string) {
    const formula = content.slice(3);

    if (formula) {
        try {
            const result = evaluate(formula);
            const resStr = format(result, { precision: 14 });
            const type = typeof result;
            if (type === "function") {
                throw "error";
            }
            msg.reply(resStr);
        } catch (err) {
            msg.reply("올바른 수식을 입력해주세요.");
        }
    } else {
        msg.reply("``지은아 계산 [수식]``이 올바른 사용법이에요.");
    }
}

export function sendUnitTransformResultToUser(msg: Message, content: string) {
    const split = content.replace("단위 변환", "단위변환").split(" ");
    if (split.length === 3) {
        try {
            msg.reply(format(evaluate(`${split[1]} to ${split[2]}`)));
        } catch (err) {
            msg.reply("올바른 단위를 입력해주세요.");
        }
    } else {
        msg.reply(
            "``지은아 (단위변환 or 단위 변환) [변환할 항목] [단위]``가 올바른 사용법이에요."
        );
    }
}
