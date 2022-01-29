export * from './decorators';
export * from './serializer';

declare global {
    namespace Reflect {
        function hasMetadata(key: string, target: any): any;
        function getMetadata(key: string, target: any): any;
        function defineMetadata(key: string, metadata: any, target: any): void;
    }
}
