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
    expect(["good", "watch", "warning", "error"]).toContain(alert.level);
    expect(alert.detail.length).toBeGreaterThan(10);
    expect(["Refresh live weather", "Retry live weather"]).toContain(alert.action);
    if (alert.available) {
      expect(typeof alert.temperatureC).toBe("number");
      expect(alert.daily).toHaveLength(3);
    }
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
    expect(["good", "watch", "warning", "error"]).toContain(alert.level);
    expect(alert.available ? alert.daily.length : alert.headline).toBeTruthy();
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


describe("Bihar hidden-gem affordability", () => {
  it("returns researched Bihar places with homestay or dormitory options", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.trip.discover({ budgetPerPerson: 3000, origin: "Patna", duration: 2, travelers: 2, interest: "offbeat", transport: "any" });
    const biharIds = ["barabar-caves", "dungeshwari-muchalinda", "telhar-kund", "kesaria-stupa", "munger-yoga"];
    const biharTrips = result.results.filter(trip => biharIds.includes(trip.id));
    expect(biharTrips.length).toBeGreaterThanOrEqual(4);
    expect(biharTrips.some(trip => trip.stay.toLowerCase().includes("homestay"))).toBe(true);
    expect(biharTrips.some(trip => trip.stay.toLowerCase().includes("dormitory"))).toBe(true);
    expect(biharTrips.every(trip => trip.researchNote?.includes("estimate"))).toBe(true);
  });
});


describe("latest destinations", () => {
  it("returns current-interest places with access, timing and sources", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const places = await caller.trip.latest();
    expect(places.length).toBeGreaterThanOrEqual(6);
    expect(places.some(place => place.name.includes("Neelakurinji"))).toBe(true);
    expect(places.every(place => place.sources.length >= 2 && place.bestTime.length > 0 && place.access.length > 0)).toBe(true);
  });

  it("returns structured live weather metrics when the provider responds", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const weather = await caller.trip.weatherAlert({ destination: "Munnar" });
    expect(["good", "watch", "warning", "error"]).toContain(weather.level);
    if (weather.available) {
      expect(typeof weather.temperatureC).toBe("number");
      expect(typeof weather.windKph).toBe("number");
      expect(weather.daily).toHaveLength(3);
    } else {
      expect(weather.detail.length).toBeGreaterThan(10);
    }
  }, 15000);
});
