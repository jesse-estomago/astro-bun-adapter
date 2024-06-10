/// <reference types="bun-types" />
/// <reference types="node" />
/// <reference types="node" />
import type { Options } from "./types";
export declare function sendStaticFile(pathname: string, localPath: URL, options: Options): Promise<Response>;
export declare function getResolvedHostForHttpServer(host: string | boolean): string | undefined;
