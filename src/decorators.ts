import { Reflector } from './reflection';
import {
    SerializationPropType,
    ComplexSerializationProp,
    ListSerializationProp,
    ComplexListSerializationProp,
    SimpleListSerializationProp,
} from './reflection/types';

export function Serialize(): PropertyDecorator {
    return function (target: any, value: any): void {
        Reflector.getInstance().pushMeta(target, 'ser_props', { value, type: SerializationPropType.UNKNOWN });
    };
}

export function Deserialize(): PropertyDecorator {
    return function (target: any, propertyKey: string | symbol): void {
        const prop = { value: propertyKey.toString(), type: SerializationPropType.SIMPLE };
        Reflector.getInstance().pushMeta(target, 'deser_props', prop);
    };
}

export function DeserializeAs(type: new (...args: any[]) => any): PropertyDecorator {
    return function (target: any, propertyKey: string | symbol): void {
        const reflector = Reflector.getInstance();
        const proto = type.prototype;
        const ref = reflector.trackTarget(proto);

        const prop: ComplexSerializationProp = {
            value: propertyKey.toString(),
            type: SerializationPropType.COMPLEX,
            proto,
            ref,
        };

        reflector.pushMeta(target, 'deser_props', prop);
    };
}

export function DeserializeArray(type?: new (...args: any[]) => any): PropertyDecorator {
    return function (target: any, propertyKey: string | symbol) {
        const reflector = Reflector.getInstance();

        let ref;

        if (type) {
            ref = reflector.trackTarget(type.prototype);
        }

        let prop: ListSerializationProp = {
            value: propertyKey.toString(),
            type: SerializationPropType.LIST,
        };

        if (ref) {
            (prop as ComplexListSerializationProp).listType = ref;
            (prop as ComplexListSerializationProp).proto = type!.prototype;
        } else {
            (prop as SimpleListSerializationProp).listType = SerializationPropType.SIMPLE;
        }

        Reflector.getInstance().pushMeta(target, 'deser_props', prop);
    };
}
