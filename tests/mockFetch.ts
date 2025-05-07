import { vi } from "vitest";

export const mockFetch = (response: any) => {
  global.fetch = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => response });
};
