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


describe("trip.optimize", () => {
  it("returns a component swap that can restore feasibility", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trip.optimize({
      tripId: "rajgir",
      budgetPerPerson: 1400,
      origin: "Patna",
      duration: 2,
      travelers: 4,
      interest: "nature",
      transport: "any",
    });

    expect(result.feasible).toBe(false);
    expect(result.overBy).toBe(120);
    expect(result.best.newTotal).toBeLessThan(result.trip.total);
    expect(result.best.savings).toBeGreaterThan(0);
    expect(result.options.every(option => option.newTotal === result.trip.total - option.savings)).toBe(true);
  });
});

describe("trip.discover infeasibility guidance", () => {
  it("explains what could unlock a trip instead of inventing a result", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trip.discover({
      budgetPerPerson: 1000,
      origin: "Patna",
      duration: 2,
      travelers: 4,
      interest: "nature",
      transport: "any",
    });

    expect(result.totalFound).toBe(0);
    expect(result.message).toContain("No feasible");
    expect(result.unlockSuggestions.length).toBeGreaterThan(0);
    expect(result.nearestBudget).toBeGreaterThan(1000);
  });
});


describe("destination support", () => {
  it("returns research-backed hidden gems with image references", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const gems = await caller.trip.hiddenGems();
    expect(gems.length).toBeGreaterThanOrEqual(8);
    expect(gems.some(gem => gem.name === "Chitkul")).toBe(true);
    expect(gems.every(gem => gem.image.startsWith("/manus-storage/"))).toBe(true);
  });

  it("returns a weather planning alert for a selected destination", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alert = await caller.trip.weatherAlert({ destination: "Chitkul" });
    expect(alert.level).toBe("watch");
    expect(alert.detail).toContain("Chitkul");
    expect(alert.action).toBe("Verify live forecast");
  });
});

describe("feedback.submit", () => {
  it("accepts valid traveller feedback", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.feedback.submit({
      name: "Aarav Singh",
      email: "aarav@example.com",
      rating: 5,
      category: "hidden-gems",
      message: "Please add more quiet villages in the northeast.",
    });
    expect(result.success).toBe(true);
  });
});


describe("map routes and weather severity", () => {
  it("returns complete route stops for each hidden gem", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const gems = await caller.trip.hiddenGems();
    expect(gems.every(gem => gem.routeStops.length >= 3)).toBe(true);
    expect(gems.find(gem => gem.name === "Dholavira")?.routeStops.at(-1)?.name).toBe("Dholavira");
  });

  it("marks mountain destinations with a watch alert", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alert = await caller.trip.weatherAlert({ destination: "Turtuk" });
    expect(alert.level).toBe("watch");
    expect(alert.headline).toContain("Mountain");
  });
});


describe("research-backed feasible trips", () => {
  it("includes additional source-backed destinations when the budget allows", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trip.discover({ budgetPerPerson: 4000, origin: "Patna", duration: 2, travelers: 2, interest: "heritage", transport: "any" });
    expect(result.results.some(trip => trip.id === "varanasi-sarnath")).toBe(true);
    expect(result.results.some(trip => trip.id === "purulia")).toBe(true);
    expect(result.results.find(trip => trip.id === "varanasi-sarnath")?.researchNote).toContain("₹3,500");
  });
});
