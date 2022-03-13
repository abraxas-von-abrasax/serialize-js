import { Reflector } from './reflection';
import { SerializationProp } from './reflection/types';

export function transform<T = any>(obj: any): T | null {
    const reflector = Reflector.getInstance();
    const proto = Object.getPrototypeOf(obj);
    const metadata = reflector.getMeta(proto, 'ser_props');

    if (!metadata.length) {
        return null;
    }

    const result: any = {};

    for (const entry of metadata) {
        result[entry.value] = processMetadataEntry(entry, obj);
    }

    Object.setPrototypeOf(result, proto);

    return result as T;
}

function processMetadataEntry(entry: SerializationProp, obj: any): any {
    const el = obj[entry.value];
    const isArray = Array.isArray(el);

    return !isArray ? processSingleField(el) : el.map(elItem => processSingleField(elItem));
}

function processSingleField(el: any) {
    if (el === null || el === undefined) {
        return el;
    }

    const reflector = Reflector.getInstance();
    const proto = Object.getPrototypeOf(el);

    return typeof el === 'object' && reflector.getMeta(proto, 'ser_props').length ? transform(el) : el;
}
