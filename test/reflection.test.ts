import { Reflector } from '../src/reflection';
import { SerIDKey } from '../src/reflection/types';

describe('Reflection tests', () => {
    test('reflector to be a singleton', () => {
        const reflector = Reflector.getInstance();
        (reflector as any).testAttribute = 42;
        const reflector2 = Reflector.getInstance();
        expect(reflector2).toBeInstanceOf(Reflector);
        expect((reflector2 as any).testAttribute).toBe(42);
    });

    it('should extract the serialization ID correctly', () => {
        const obj: any = {};
        Object.defineProperty(obj, SerIDKey, { value: 42 });
        const testRes = Reflector.extractID(obj);
        expect(testRes).toBe(42);
    });

    it('should track an object correctly', () => {
        const obj: any = {};
        const id = Reflector.getInstance().trackTarget(obj);
        expect(obj[SerIDKey]).toBe(id);
    });

    it('should not overwrite an already set entity ID', () => {
        const obj: any = {};
        const reflector = Reflector.getInstance();
        const id = reflector.trackTarget(obj);
        const idAfterSecondTrackingRequest = reflector.trackTarget(obj);
        expect(id).toBe(idAfterSecondTrackingRequest);
    });
});
