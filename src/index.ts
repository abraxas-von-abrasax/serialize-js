import { Serialize } from './decorators';
import { serialize } from './serializer';

export * from './decorators';
export * from './serializer';

class Test {
    @Serialize() message = 'Hello world';
    @Serialize() answer = 42;
    @Serialize() uninitialized: string;
    password = 'secret_password';
}

const test = new Test();
const serialized = serialize(test);
console.log(serialized);
