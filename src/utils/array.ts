export function parseArray(string: string): (string | number)[] {
    if (!string.startsWith("[") || !string.endsWith("]")) {
        throw new Error("Can't parse this array");
    }

    return string
        .slice(1, -1)
        .split(",")
        .map((x) => x.trim())
        .map((x) => {
            const number = +x;

            if (Number.isNaN(number)) {
                return x;
            }

            return number;
        });
}

export function pickRandom<T>(array: T[]) {
    return array[Math.round(Math.random() * (array.length - 1))];
}

function checkNumberArray<T>(array: T[]) {
    if (array.length < 1) {
        return false;
    }

    return array.reduce((acc, cur) => acc && !Number.isNaN(+cur), true);
}

export function sortArray<T>(array: T[]) {
    if (array.length < 1) {
        return array;
    }

    const isNumberArray = checkNumberArray(array);

    if (isNumberArray) {
        const numberArray = array as unknown as number[];

        return numberArray.sort((a, b) => a - b);
    }

    return array.sort();
}
