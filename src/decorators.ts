import { Reflector } from './reflector';

export function Serialize() {
    return function (target: any, value: any) {
        const reflector = Reflector.getInstance();
        const metadata = reflector.getMetadata(target) ?? [];
        metadata.push(value);
        reflector.setMetadata(target, metadata);
    };
}
