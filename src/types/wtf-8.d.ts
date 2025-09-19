declare module "wtf-8"

{
    export function encode(str: string): Uint8Array;
    export function decode(bytes: Uint8Array | string): string;
}