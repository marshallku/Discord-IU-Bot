import { Message } from "discord.js";
import type { Channel } from "../@types/app";
import { pickRandom } from "../utils/array";
import files from "../data/files";

export function sendRandomGifToChannel(channel: Channel) {
    channel.send(
        pickRandom(
            Object.entries(files)
                .map(([, value]) => value)
                .flat()
        )
    );
}

export function reactHeartAndSendGif({
    msg,
    channel,
    array,
}: {
    msg: Message;
    channel: Channel;
    array: string[];
}) {
    msg.react("💜").then(() => {
        channel.send(pickRandom(array));
    });
}

export function sendGifToChannel(channel: Channel, array: string[]) {
    channel.send(pickRandom(array));
}
