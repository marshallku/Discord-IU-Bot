export const SECOND_TO_MS = 1000;
export const MINUTE_TO_MS = 60 * SECOND_TO_MS;
export const HOUR_TO_MS = 60 * MINUTE_TO_MS;

const TIME_TO_NUMBER = {
    초: SECOND_TO_MS,
    분: MINUTE_TO_MS,
    시간: HOUR_TO_MS,
};

export default function parseTime(text: string) {
    const timeRegex = /^([0-9]+)(분|초|시간)$/;

    return text
        .split(" ")
        .map((x) => x.match(timeRegex) || [])
        .filter((x) => x.length > 0)
        .map((matchArray) => {
            const [, timeString, unitString] = matchArray;

            return (
                +timeString * TIME_TO_NUMBER[unitString as "초" | "분" | "시간"]
            );
        })
        .filter((x) => !Number.isNaN(x))
        .reduce((acc, cur) => acc + cur, 0);
}
