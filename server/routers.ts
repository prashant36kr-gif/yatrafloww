import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const featuredTrips = [
  {
    id: "rajgir",
    name: "Rajgir",
    state: "Bihar",
    eyebrow: "Ancient hills · hot springs · quiet mornings",
    image: "/manus-storage/rajgir_abb99cf8.jpg",
    accent: "lime",
    baseCost: 1520,
    distance: "105 km from Patna",
    travelTime: "2h 30m",
    tags: ["Nature", "Heritage", "Offbeat"],
    transport: "Train + local",
    stay: "Budget homestay",
    stayName: "Rajgir Heritage Homestay",
    stayStatus: "Verified partner",
    highlight: "Best value",
    why: "Rajgir gives you history, hills and a slower pace without the long transfer or resort markup.",
    route: ["Patna", "Rajgir", "Nalanda", "Rajgir", "Patna"],
    activities: ["Vishwa Shanti Stupa", "Griddhakuta Hill", "Nalanda ruins"],
  },
  {
    id: "bodh-gaya",
    name: "Bodh Gaya",
    state: "Bihar",
    eyebrow: "Deep history · temple trails · local food",
    image: "/manus-storage/india-offbeat_898211a1.jpg",
    accent: "orange",
    baseCost: 1780,
    distance: "115 km from Patna",
    travelTime: "3h 15m",
    tags: ["Spiritual", "Culture", "Food"],
    transport: "Train + shared auto",
    stay: "Simple guesthouse",
    stayName: "Sujata Village Stay",
    stayStatus: "Verification in progress",
    highlight: "Most soulful",
    why: "A compact spiritual escape with walkable temple lanes, reliable shared transport and generous food options.",
    route: ["Patna", "Gaya", "Bodh Gaya", "Gaya", "Patna"],
    activities: ["Mahabodhi Temple", "Sujata village", "Monastery walk"],
  },
  {
    id: "deoghar",
    name: "Deoghar",
    state: "Jharkhand",
    eyebrow: "Temple town · forest edges · street breakfasts",
    image: "/manus-storage/india-offbeat_898211a1.jpg",
    accent: "blue",
    baseCost: 2210,
    distance: "255 km from Patna",
    travelTime: "5h 40m",
    tags: ["Spiritual", "Nature", "Food"],
    transport: "Overnight train + local",
    stay: "Dormitory stay",
    stayName: "Baiju Backpacker Dorms",
    stayStatus: "Verified partner",
    highlight: "Longest escape",
    why: "A longer rail-first route that still protects your budget with a dorm bed and low-cost local movement.",
    route: ["Patna", "Jasidih", "Deoghar", "Jasidih", "Patna"],
    activities: ["Baba Baidyanath Temple", "Trikut hills", "Local bazaar"],
  },
];

const transportAdjustment: Record<string, number> = {
  any: 0,
  train: 0,
  bus: -90,
  cab: 1180,
  public: -130,
};

function durationMultiplier(duration: number) {
  if (duration <= 1) return 0.68;
  if (duration === 2) return 1;
  if (duration === 3) return 1.32;
  if (duration === 4) return 1.62;
  return 1.62 + (duration - 4) * 0.28;
}

function createTrip(base: (typeof featuredTrips)[number], input: z.infer<typeof discoverInput>) {
  const multiplier = durationMultiplier(input.duration);
  const total = Math.max(520, Math.round(base.baseCost * multiplier + (transportAdjustment[input.transport] ?? 0)));
  const buffer = Math.max(0, input.budgetPerPerson - total);
  const fitScore = Math.max(58, Math.min(98, Math.round(100 - (total / Math.max(input.budgetPerPerson, 1)) * 12 + (input.interest === "any" ? 2 : base.tags.some(tag => tag.toLowerCase() === input.interest) ? 4 : 0))));
  const travelersTotal = total * input.travelers;
  const groupBudget = input.budgetPerPerson * input.travelers;
  const transportCost = Math.max(160, Math.round(total * 0.28 + (transportAdjustment[input.transport] ?? 0)));
  const stayCost = Math.max(220, Math.round(total * 0.3));
  const foodCost = Math.max(170, Math.round(total * 0.23));
  const activitiesCost = Math.max(90, Math.round(total * 0.12));
  const localCost = Math.max(70, total - transportCost - stayCost - foodCost - activitiesCost);

  return {
    ...base,
    origin: input.origin,
    duration: input.duration,
    travelers: input.travelers,
    interest: input.interest,
    transportPreference: input.transport,
    total,
    buffer,
    fitScore,
    travelersTotal,
    groupBudget,
    breakdown: {
      transport: transportCost,
      stay: stayCost,
      food: foodCost,
      activities: activitiesCost,
      local: localCost,
    },
  };
}

const discoverInput = z.object({
  budgetPerPerson: z.number().int().min(300).max(100000),
  origin: z.string().min(2).max(80),
  duration: z.number().int().min(1).max(14),
  travelers: z.number().int().min(1).max(12),
  interest: z.string().min(1).max(40),
  transport: z.enum(["any", "train", "bus", "cab", "public"]),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  trip: router({
    featured: publicProcedure.query(() => featuredTrips),
    discover: publicProcedure.input(discoverInput).mutation(({ input }) => {
      const results = featuredTrips
        .map(base => createTrip(base, input))
        .filter(trip => trip.total <= input.budgetPerPerson)
        .sort((a, b) => b.fitScore - a.fitScore || a.total - b.total);

      return {
        input,
        results,
        totalFound: results.length,
        message: results.length === 0
          ? "No exact matches yet — try a slightly higher budget or a shorter trip."
          : `${results.length} trips fit your constraints`,
      };
    }),
  }),
  partner: router({
    requestInfo: publicProcedure
      .input(z.object({ name: z.string().min(2), email: z.string().email(), partnerType: z.string().min(2), city: z.string().min(2) }))
      .mutation(({ input }) => {
        console.info(`[YatraFlow] Partner interest from ${input.name} (${input.partnerType}) in ${input.city}`);
        return { success: true, message: "Thanks — our partner team will be in touch soon." } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
export type DiscoverInput = z.infer<typeof discoverInput>;
export type FeaturedTrip = (typeof featuredTrips)[number];
