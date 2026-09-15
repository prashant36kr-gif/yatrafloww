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

const hiddenGems = [
  { id: "chitkul", name: "Chitkul", state: "Himachal Pradesh", image: "/manus-storage/chitkul_886298cc.webp", tags: ["Nature", "Peace", "Backpacking"], bestTime: "Mar–Jun · Sep–Oct", description: "India’s last village on the Baspa River, with wooden homes, quiet trails and high-altitude air.", source: "Colorful Destinations India" },
  { id: "pithoragarh", name: "Pithoragarh", state: "Uttarakhand", image: "/manus-storage/pithoragarh_3915b021.jpg", tags: ["Himalaya", "Heritage", "Wildlife"], bestTime: "Apr–Jun · Sep–Nov", description: "A Kumaon valley of forts, alpine meadows, monasteries and wide Himalayan views.", source: "Image research reference" },
  { id: "ukhimath", name: "Ukhimath", state: "Uttarakhand", image: "/manus-storage/ukhimath_e2a5290b.jpg", tags: ["Spiritual", "Lake", "Slow travel"], bestTime: "Oct–Mar", description: "The winter seat of Kedarnath, with Omkareshwar Temple and the reflective Deoria Tal hike.", source: "Image research reference" },
  { id: "mana", name: "Mana Village", state: "Uttarakhand", image: "/manus-storage/mana-village_0e1c3c53.jpg", tags: ["Mythology", "Hiking", "Culture"], bestTime: "May–Jun · Sep–Oct", description: "India’s last inhabited village near Badrinath, Vyas Gufa, Bhim Pul and the Saraswati River.", source: "Image research reference" },
  { id: "bundi", name: "Bundi", state: "Rajasthan", image: "/manus-storage/bundi_8620930e.jpg", tags: ["Heritage", "Art", "Architecture"], bestTime: "Oct–Mar", description: "A quieter Rajasthan canvas of palace murals, stepwells and blue-painted old-city lanes.", source: "Image research reference" },
  { id: "warwan", name: "Warwan Valley", state: "Kashmir", image: "/manus-storage/warwan-valley_d8915316.jpg", tags: ["Trekking", "Wilderness", "Community"], bestTime: "Jul–Sep", description: "A raw Himalayan valley for serious trekkers, river camps and long mountain silence.", source: "Image research reference" },
  { id: "turtuk", name: "Turtuk", state: "Ladakh", image: "/manus-storage/turtuk_958e4b02.jpg", tags: ["Balti culture", "Apricots", "Borderlands"], bestTime: "May–Sep", description: "A northern village of Balti homes, apricot orchards and Shyok Valley views.", source: "Image research reference" },
  { id: "dholavira", name: "Dholavira", state: "Gujarat", image: "/manus-storage/dholavira_1977cc3f.jpg", tags: ["Archaeology", "Desert", "Stargazing"], bestTime: "Nov–Feb", description: "Harappan ruins, salt flats and zero-light-pollution skies beyond the Rann crowds.", source: "Image research reference" },
];

const routeData: Record<string, { name: string; lat: number; lng: number }[]> = {
  chitkul: [{ name: "Shimla", lat: 31.1048, lng: 77.1734 }, { name: "Sangla", lat: 31.4216, lng: 78.2695 }, { name: "Chitkul", lat: 31.3516, lng: 78.4372 }],
  pithoragarh: [{ name: "Haldwani", lat: 29.2183, lng: 79.513 }, { name: "Almora", lat: 29.5971, lng: 79.6591 }, { name: "Pithoragarh", lat: 29.5829, lng: 80.2182 }],
  ukhimath: [{ name: "Rishikesh", lat: 30.0869, lng: 78.2676 }, { name: "Rudraprayag", lat: 30.2844, lng: 78.9811 }, { name: "Ukhimath", lat: 30.5286, lng: 79.1986 }],
  mana: [{ name: "Rishikesh", lat: 30.0869, lng: 78.2676 }, { name: "Joshimath", lat: 30.555, lng: 79.565 }, { name: "Mana Village", lat: 30.7739, lng: 79.4933 }],
  bundi: [{ name: "Jaipur", lat: 26.9124, lng: 75.7873 }, { name: "Kota", lat: 25.2138, lng: 75.8648 }, { name: "Bundi", lat: 25.438, lng: 75.6373 }],
  warwan: [{ name: "Srinagar", lat: 34.0837, lng: 74.7973 }, { name: "Kishtwar", lat: 33.313, lng: 75.767 }, { name: "Warwan Valley", lat: 33.706, lng: 75.725 }],
  turtuk: [{ name: "Leh", lat: 34.1526, lng: 77.5771 }, { name: "Nubra Valley", lat: 35.3, lng: 77.55 }, { name: "Turtuk", lat: 35.5269, lng: 76.8346 }],
  dholavira: [{ name: "Bhuj", lat: 23.242, lng: 69.6669 }, { name: "Rann of Kutch", lat: 23.7337, lng: 69.8597 }, { name: "Dholavira", lat: 23.887, lng: 70.213 }],
};

const feedbackInput = z.object({ name: z.string().min(2).max(80), email: z.string().email(), rating: z.number().int().min(1).max(5), category: z.string().min(2).max(40), message: z.string().min(10).max(1000) });
const weatherInput = z.object({ destination: z.string().min(2).max(80) });

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

const discoverInput = z.object({
  budgetPerPerson: z.number().int().min(300).max(100000),
  origin: z.string().min(2).max(80),
  duration: z.number().int().min(1).max(14),
  travelers: z.number().int().min(1).max(12),
  interest: z.string().min(1).max(40),
  transport: z.enum(["any", "train", "bus", "cab", "public"]),
});

type DiscoverParams = z.infer<typeof discoverInput>;

function createTrip(base: (typeof featuredTrips)[number], input: DiscoverParams) {
  const multiplier = durationMultiplier(input.duration);
  const total = Math.max(520, Math.round(base.baseCost * multiplier + (transportAdjustment[input.transport] ?? 0)));
  const buffer = Math.max(0, input.budgetPerPerson - total);
  const preferenceFit = input.interest === "any" || base.tags.some(tag => tag.toLowerCase() === input.interest);
  const fitScore = Math.max(58, Math.min(98, Math.round(100 - (total / Math.max(input.budgetPerPerson, 1)) * 12 + (preferenceFit ? 4 : 0))));
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
    preferenceFit,
    confidence: "Estimated / calculated",
    freshness: "Demo estimate · reviewed Sep 2026",
    sourceNote: "Illustrative MVP estimate; partner and live inventory feeds are planned later.",
    breakdown: {
      transport: transportCost,
      stay: stayCost,
      food: foodCost,
      activities: activitiesCost,
      local: localCost,
    },
    explainability: [
      { label: "Budget fit", value: `₹${total.toLocaleString("en-IN")} / ₹${input.budgetPerPerson.toLocaleString("en-IN")}`, reason: `₹${buffer.toLocaleString("en-IN")} buffer for uncertainty and small extras` },
      { label: "Time fit", value: `${input.duration} ${input.duration === 1 ? "day" : "days"}`, reason: `Transfer is approximately ${base.travelTime}` },
      { label: "Group fit", value: `${input.travelers} travellers`, reason: "Shared routes and stays improve group economics" },
      { label: "Preference fit", value: preferenceFit ? `${input.interest} matched` : "Broad match", reason: preferenceFit ? "Activities align with your selected interest" : "Ranked for overall feasibility first" },
      { label: "Transport choice", value: "Train / bus / cab / local", reason: "Choose cost ↔ time; no single vehicle is forced" },
    ],
  };
}

const optimizeInput = z.object({
  tripId: z.string().min(1),
  budgetPerPerson: z.number().int().min(300).max(100000),
  origin: z.string().min(2).max(80),
  duration: z.number().int().min(1).max(14),
  travelers: z.number().int().min(1).max(12),
  interest: z.string().min(1).max(40),
  transport: z.enum(["any", "train", "bus", "cab", "public"]),
});

function buildOptimizerOptions(trip: ReturnType<typeof createTrip>, budgetPerPerson: number) {
  const options = [
    {
      id: "shared-transport",
      title: "Use public / shared transport",
      component: "Transport",
      savings: Math.max(80, Math.round(trip.breakdown.transport * 0.28)),
      reason: "Trade a little time for a lower fare and keep the route intact.",
    },
    {
      id: "dorm-stay",
      title: "Swap to a dormitory stay",
      component: "Stay",
      savings: Math.max(120, Math.round(trip.breakdown.stay * 0.33)),
      reason: "Keep the same neighbourhood while giving the overnight line more breathing room.",
    },
    {
      id: "free-experience",
      title: "Choose a free local experience",
      component: "Activities",
      savings: Math.max(80, Math.round(trip.breakdown.activities * 0.45)),
      reason: "Replace one ticketed activity with a walk, market or public viewpoint.",
    },
  ].map(option => ({
    ...option,
    newTotal: Math.max(420, trip.total - option.savings),
    groupTotal: Math.max(420, trip.total - option.savings) * trip.travelers,
    fits: trip.total - option.savings <= budgetPerPerson,
  }));

  const best = [...options].sort((a, b) => Number(b.fits) - Number(a.fits) || a.newTotal - b.newTotal)[0];
  return { options, best };
}

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
    hiddenGems: publicProcedure.query(() => hiddenGems.map(gem => ({ ...gem, routeStops: routeData[gem.id] ?? [] }))),
    weatherAlert: publicProcedure.input(weatherInput).query(({ input }) => {
      const mountainDestination = ["Chitkul", "Pithoragarh", "Ukhimath", "Mana Village", "Warwan Valley", "Turtuk"].includes(input.destination);
      return { destination: input.destination, level: mountainDestination ? "watch" : "info", headline: mountainDestination ? "Mountain conditions can change quickly" : "Check conditions before you leave", detail: `Planning alert for ${input.destination}: confirm the live forecast, road conditions, closures and local advisories before departure.`, updatedAt: new Date().toISOString(), action: "Verify live forecast" } as const;
    }),
    discover: publicProcedure.input(discoverInput).mutation(({ input }) => {
      const all = featuredTrips.map(base => createTrip(base, input));
      const results = all.filter(trip => trip.total <= input.budgetPerPerson).sort((a, b) => b.fitScore - a.fitScore || a.total - b.total);
      const cheapest = [...all].sort((a, b) => a.total - b.total)[0];

      return {
        input,
        results,
        totalFound: results.length,
        nearestBudget: cheapest?.total ?? null,
        unlockSuggestions: results.length === 0 && cheapest ? [
          `Increase budget to ₹${cheapest.total.toLocaleString("en-IN")}`,
          "Use public / shared transport to lower travel cost",
          "Add 1 day for more route options",
          "Change origin to expand the feasible radius",
        ] : [],
        message: results.length === 0
          ? "No feasible complete trip found under current constraints"
          : `${results.length} trips fit your constraints`,
      };
    }),
    optimize: publicProcedure.input(optimizeInput).mutation(({ input }) => {
      const base = featuredTrips.find(trip => trip.id === input.tripId) ?? featuredTrips[0];
      const trip = createTrip(base, input);
      const optimizer = buildOptimizerOptions(trip, input.budgetPerPerson);
      return {
        trip,
        budgetPerPerson: input.budgetPerPerson,
        overBy: Math.max(0, trip.total - input.budgetPerPerson),
        feasible: trip.total <= input.budgetPerPerson,
        message: trip.total <= input.budgetPerPerson ? "Already within budget — protect the buffer." : optimizer.best.fits ? "One component swap brings this trip back within budget." : "No single swap is enough yet; combine the smallest trade-offs.",
        ...optimizer,
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
  feedback: router({
    submit: publicProcedure.input(feedbackInput).mutation(({ input }) => {
      console.info(`[YatraFlow] Feedback from ${input.name}: ${input.rating}/5 (${input.category})`);
      return { success: true, message: "Thanks — your feedback will help us make travel planning more useful." } as const;
    }),
  }),
});

export type AppRouter = typeof appRouter;
export type DiscoverInput = DiscoverParams;
export type FeaturedTrip = (typeof featuredTrips)[number];
