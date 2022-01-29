import { METADATA_KEY } from './util';

export function serialize<T = any>(obj: any): T | null {
    if (!Reflect.hasMetadata(METADATA_KEY, obj)) {
        return null;
    }

    const metadata = Reflect.getMetadata(METADATA_KEY, obj);
    const result = {};

    for (const entry of metadata) {
        (result as any)[entry] = processMetadataEntry(entry, obj);
    }

    Object.setPrototypeOf(result, obj.__proto__);

    return result as T;
}

function processMetadataEntry(entry: string, obj: any): any {
    const el = obj[entry];
    const isArray = Array.isArray(el);

    let computed;

    if (!isArray) {
        computed = typeof el === 'object' && Reflect.hasMetadata(METADATA_KEY, el) ? serialize(el) : el;
    } else {
        computed = [];
        for (const elItem of el) {
            const elItemComputed = typeof elItem === 'object' && Reflect.hasMetadata(METADATA_KEY, elItem)
                ? serialize(elItem)
                : elItem;
            computed.push(elItemComputed);
        }
    }

    return computed;
}
