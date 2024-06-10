import type { AstroAdapter, AstroIntegration } from "astro";
import type { Options } from "./types";
export declare function getAdapter(args?: Options): AstroAdapter;
export default function createIntegration(userOptions?: Options): AstroIntegration;
