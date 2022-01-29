import { METADATA_KEY } from './util';

export function Serialize() {
    return function (target: any, value: any) {
        const metadata = Reflect.hasMetadata(METADATA_KEY, target)
            ? Reflect.getMetadata(METADATA_KEY, target)
            : [];

        metadata.push(value);

        Reflect.defineMetadata(METADATA_KEY, metadata, target);
    };
}
