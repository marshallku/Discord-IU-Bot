export default function parse(raw: string) {
    try {
        return JSON.parse(raw);
    } catch (err) {
        return false;
    }
}
