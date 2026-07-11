/**
 * mocks/browser.ts
 *
 * MSW browser-side service worker setup.
 * Import `worker` only in client components that need to start MSW.
 */

import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
