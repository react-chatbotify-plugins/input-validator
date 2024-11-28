// Import necessary polyfills for TextEncoder and TextDecoder
import { TextDecoder, TextEncoder } from "util";

// Set global TextEncoder and TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.structuredClone === "undefined") {
    global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}