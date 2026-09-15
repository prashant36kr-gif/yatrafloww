import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("trip.discover", () => {
  it("returns mathematically consistent group totals for feasible trips", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trip.discover({
      budgetPerPerson: 2000,
      origin: "Patna",
      duration: 2,
      travelers: 4,
      interest: "nature",
      transport: "any",
    });

    expect(result.totalFound).toBeGreaterThan(0);
    const rajgir = result.results.find(trip => trip.id === "rajgir");
    expect(rajgir).toBeDefined();
    expect(rajgir!.total).toBe(1520);
    expect(rajgir!.travelersTotal).toBe(6080);
    expect(rajgir!.groupBudget).toBe(8000);
    expect(rajgir!.buffer).toBe(480);
    expect(Object.values(rajgir!.breakdown).reduce((sum, value) => sum + value, 0)).toBe(rajgir!.total);
  });

  it("does not return trips above the per-person budget", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trip.discover({
      budgetPerPerson: 600,
      origin: "Patna",
      duration: 2,
      travelers: 1,
      interest: "nature",
      transport: "any",
    });

    expect(result.totalFound).toBe(0);
    expect(result.results).toHaveLength(0);
  });
});

describe("partner.requestInfo", () => {
  it("accepts a valid partner lead", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.partner.requestInfo({
      name: "Aarav Singh",
      email: "aarav@example.com",
      partnerType: "homestay",
      city: "Rajgir",
    });

    expect(result).toEqual({ success: true, message: "Thanks — our partner team will be in touch soon." });
  });
});
