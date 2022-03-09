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
