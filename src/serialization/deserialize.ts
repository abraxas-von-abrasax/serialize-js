import { Constructor } from '../utils';
import { Reflector } from '../reflection';
import { isComplex, isList } from '../reflection/util';
import {
    SerializationProp,
    SerializationPropType,
    SimpleListSerializationProp,
    ComplexListSerializationProp,
    ComplexSerializationProp,
} from '../reflection/types';

export function deserialize<T>(target: any, type: Constructor): T {
    const reflector = Reflector.getInstance();
    const proto = type.prototype;
    const props = reflector.getMeta(proto, 'deser_props');
    const res = extractFromTarget(target, props);
    Object.setPrototypeOf(res, type.prototype);
    return res;
}

function extractFromTarget(target: any, props: SerializationProp[]) {
    const result: any = {};

    for (const prop of props) {
        const key = prop.value;
        const el = target[key];

        if (el === undefined) {
            return undefined;
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
            result[key] = propRes;
        }
    }

    return result;
}

function processComplex(target: any, prop: ComplexSerializationProp): any {
    const refProps = Reflector.getInstance().getProps(prop.ref, 'deser_props');
    const obj = extractFromTarget(target, refProps);
    Object.setPrototypeOf(obj, prop.proto);
    return obj;
}

function processList(target: any, prop: SimpleListSerializationProp | ComplexListSerializationProp) {
    const reflector = Reflector.getInstance();

    if (prop.listType === SerializationPropType.SIMPLE) {
        return [...target];
    }

    const itemProps = reflector.getProps(prop.listType, 'deser_props');

    const mapper = (item: any) => {
        const obj = extractFromTarget(item, itemProps);
        if (obj) {
            Object.setPrototypeOf(obj, prop.proto);
        }
        return obj;
    };

    return target
        .map(mapper)
        .filter((el: any) => el !== undefined);
}
