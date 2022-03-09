export function getRandomBoolean() {
    return Math.random() < 0.5;
}

export function getRandomInt(min: number, max: number) {
    const minValue = Math.ceil(min);
    const maxValue = Math.floor(max);

    return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}

export function getInclusiveRandomInt(min: number, max: number) {
    const minValue = Math.ceil(min);
    const maxValue = Math.floor(max);

    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}
