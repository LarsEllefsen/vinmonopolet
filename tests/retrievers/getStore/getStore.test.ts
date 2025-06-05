import { afterEach, vi, expect, test } from "vitest";
import getStoreResponse from "../../../tests/files/getStoreResponse.json";
import { mockFetch } from "../../../tests/mockFetch";
import getStore from "../../../src/retrievers/getStore";

afterEach(() => {
  vi.clearAllMocks();
});

test("Can get store", async () => {
  mockFetch(getStoreResponse);

  const store = await getStore("143");

  expect(store.storeNumber).toBe("143");
  expect(store.name).toBe("Oslo, Oslo City");
  expect(store.category).toBe("Kategori 6");
  expect(store.city).toBe("Oslo");
  expect(store.zip).toBe("0050");
  expect(store.streetAddress).toBe("Stenersgata 1");
  expect(store.gpsCoordinates).toEqual([59.9126054, 10.7515334]);
  expect(store.openingHours).toEqual([
    {
      closes: { formattedHour: "18:00", hour: 6, minute: 0 },
      opens: { formattedHour: "10:00", hour: 10, minute: 0 },
      weekDay: "Mandag",
    },
    {
      closes: { formattedHour: "18:00", hour: 6, minute: 0 },
      opens: { formattedHour: "10:00", hour: 10, minute: 0 },
      weekDay: "Tirsdag",
    },
    {
      closes: { formattedHour: "18:00", hour: 6, minute: 0 },
      opens: { formattedHour: "10:00", hour: 10, minute: 0 },
      weekDay: "Onsdag",
    },
    {
      closes: { formattedHour: "18:00", hour: 6, minute: 0 },
      opens: { formattedHour: "10:00", hour: 10, minute: 0 },
      weekDay: "Torsdag",
    },
    {
      closes: { formattedHour: "18:00", hour: 6, minute: 0 },
      opens: { formattedHour: "10:00", hour: 10, minute: 0 },
      weekDay: "Fredag",
    },
    { closes: undefined, opens: undefined, weekDay: "Lørdag" },
    { closes: undefined, opens: undefined, weekDay: "Søndag" },
  ]);
});
