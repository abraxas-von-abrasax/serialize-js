import { Reflector } from '../reflection';
import { isComplex, isList } from '../reflection/util';
import {
    SerializationProp,
    SerializationPropType,
    SimpleListSerializationProp,
    ComplexListSerializationProp,
    ComplexSerializationProp,
} from '../reflection/types';

export function deserialize<T>(target: any, type: new (...args: any[]) => any): T {
    const props = Reflector.getInstance().getMeta(type.prototype, 'deser_props');
    return extractFromTarget(target, props, createClassObject(type));
}

function createClassObject<T>(type: new (...args: any[]) => any): T | undefined {
    try {
        return new type();
    } catch (error) {
        // Cannot construct object. Ignore this case silently and return null
        return undefined;
    }
}

/**
 * Extracts decorated properties from target object and adds them to source (the source object will be mutated after
 * this call!)
 * @param target raw object
 * @param props serialization props
 * @param source class object (will be mutated!)
 */
function extractFromTarget(target: any, props: SerializationProp[], source: any) {
    for (const prop of props) {
        const key = prop.value;
        const el = target[key];

        if (el === undefined) {
            continue;
        }

        let propRes;

        if (isComplex(prop)) {
            propRes = processComplex(el, prop);
        } else if (isList(prop)) {
            propRes = processList(el, prop as (SimpleListSerializationProp | ComplexListSerializationProp));
        } else {
            propRes = el;
        }

        if (propRes !== undefined) {
            source[key] = propRes;
        }
    }

    return source;
}

function processComplex(target: any, prop: ComplexSerializationProp): any {
    const refProps = Reflector.getInstance().getProps(prop.ref, 'deser_props');
    return extractFromTarget(target, refProps, createClassObject(prop.proto.constructor as any));
}

function processList(target: any, prop: SimpleListSerializationProp | ComplexListSerializationProp) {
    const reflector = Reflector.getInstance();

    if (prop.listType === SerializationPropType.SIMPLE) {
        // Objects have a simple type
        return [...target];
    }

    // Objects have a complex type
    const itemProps = reflector.getProps(prop.listType, 'deser_props');

    const mapper = (item: any) => extractFromTarget(item, itemProps, createClassObject(prop.proto.constructor as any));

    return target
        .map(mapper)
        .filter((el: any) => el !== undefined);
}
