import { TestClass } from './test-data';

describe('Decorator tests', () => {
    test('class-instances to look as expected after member decoration', () => {
        const instance = new TestClass();
        expect(instance).toBeInstanceOf(TestClass);
        expect(instance.message).toBeUndefined();
        expect(typeof instance.answer).toBe('number');
        expect(instance.answer).toBe(42);
        expect(instance.secretPassword).toBe('password');
    });
});
