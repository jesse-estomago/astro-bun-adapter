/// <reference types="bun-types" />
/// <reference types="node" />
import type { SSRManifest } from "astro";
import type { Options } from "./types";
export declare function start(manifest: SSRManifest, options: Options): void;
export declare function createExports(manifest: SSRManifest, options: Options): {
    stop(): void;
    running(): boolean;
    start(): Promise<void>;
    handle: (req: Request) => Promise<Response>;
};
