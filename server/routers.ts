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
  {
    id: "barabar-caves",
    name: "Barabar Caves",
    state: "Bihar",
    eyebrow: "Ancient caves · lakes · slow history",
    image: "/manus-storage/barabar-caves_46bba451.jpg",
    accent: "blue",
    baseCost: 2200,
    distance: "95 km from Patna",
    travelTime: "Train to Jehanabad + local road",
    tags: ["Heritage", "Nature", "Offbeat"],
    transport: "Train + shared auto",
    stay: "Village homestay",
    stayName: "Barabar Village Homestay",
    stayStatus: "Research estimate",
    highlight: "Ancient craft",
    why: "A low-cost overnight history trip to the oldest surviving rock-cut caves, with a village homestay replacing resort pricing.",
    route: ["Patna", "Jehanabad", "Barabar Caves", "Village homestay", "Patna"],
    activities: ["Lomas Rishi Cave", "Sudama Cave", "Barabar hills"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.thrillophilia.com/unexplored-places-in-bihar", "https://tourism.bihar.gov.in/"],
    researchNote: "₹2,200 estimate: rail/shared road allowance, one village homestay, simple meals and a short local ride. Confirm access, opening hours and homestay availability before departure.",
  },
  {
    id: "dungeshwari-muchalinda",
    name: "Dungeshwari & Muchalinda",
    state: "Bihar",
    eyebrow: "Buddhist trail · hills · lakeside calm",
    image: "/manus-storage/india-offbeat_898211a1.jpg",
    accent: "lime",
    baseCost: 1900,
    distance: "115 km from Patna",
    travelTime: "Train to Gaya + shared auto",
    tags: ["Spiritual", "Nature", "Budget"],
    transport: "Train + shared auto",
    stay: "Dormitory stay",
    stayName: "Bodh Gaya Pilgrim Dormitory",
    stayStatus: "Research estimate",
    highlight: "Quiet pilgrimage",
    why: "A slower Bodh Gaya add-on: trek to Dungeshwari Hills, then walk around Muchalinda Lake and the Mahabodhi area from a low-cost pilgrim dormitory.",
    route: ["Patna", "Gaya", "Dungeshwari Hills", "Muchalinda Lake", "Bodh Gaya", "Patna"],
    activities: ["Dungeshwari trek", "Muchalinda Lake", "Monastery walk"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.thrillophilia.com/unexplored-places-in-bihar", "https://tourism.bihar.gov.in/"],
    researchNote: "₹1,900 estimate: rail to Gaya, shared autos, one pilgrim dormitory bed, simple meals and low-cost local movement. Hill weather and local access should be checked before trekking.",
  },
  {
    id: "telhar-kund",
    name: "Telhar Kund",
    state: "Bihar",
    eyebrow: "Waterfall · forest hike · Kaimur",
    image: "/manus-storage/meghalaya-falls_c026cd1d.jpg",
    accent: "lime",
    baseCost: 2800,
    distance: "Kaimur · road-first from Patna",
    travelTime: "Train to Bhabua Road + shared vehicle",
    tags: ["Waterfalls", "Hiking", "Nature"],
    transport: "Train + shared jeep",
    stay: "Forest-edge homestay",
    stayName: "Kaimur Forest Homestay",
    stayStatus: "Research estimate",
    highlight: "Local picnic route",
    why: "A budget nature escape to the waterfall, kund and viewpoint near Karamchat Dam, using a shared jeep and a local homestay instead of a private resort.",
    route: ["Patna", "Bhabua Road", "Kaimur", "Telhar Kund", "Kaimur homestay", "Patna"],
    activities: ["Telhar waterfall", "Forest hike", "Karamchat Dam"],
    bestTime: "Jul–Feb",
    researchSources: ["https://www.thrillophilia.com/unexplored-places-in-bihar", "https://tourism.bihar.gov.in/"],
    researchNote: "₹2,800 estimate: train, shared jeep split across travellers, one forest-edge homestay, food and a small weather buffer. Avoid the hike during unsafe rainfall and confirm local access.",
  },
  {
    id: "kesaria-stupa",
    name: "Kesaria Stupa",
    state: "Bihar",
    eyebrow: "Buddhist archaeology · East Champaran",
    image: "/manus-storage/dholavira_1977cc3f.jpg",
    accent: "orange",
    baseCost: 2600,
    distance: "110 km from Patna",
    travelTime: "Bus/train to Motihari + local",
    tags: ["Heritage", "Spiritual", "Rail-friendly"],
    transport: "Train + shared bus",
    stay: "Motihari dormitory",
    stayName: "Motihari Traveller Dorms",
    stayStatus: "Research estimate",
    highlight: "Ashokan legacy",
    why: "An affordable East Champaran heritage loop around one of Bihar’s largest Buddhist stupas, with a dormitory base in Motihari.",
    route: ["Patna", "Motihari", "Kesaria Stupa", "Motihari", "Patna"],
    activities: ["Kesaria Stupa", "Local heritage walk", "Champaran food trail"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.thrillophilia.com/unexplored-places-in-bihar", "https://tourism.bihar.gov.in/"],
    researchNote: "₹2,600 estimate: lowest practical rail/bus allowance, one Motihari dormitory bed, simple meals and shared local transport. Verify the monument’s current access and timings locally.",
  },
  {
    id: "lauriya-nandangarh",
    name: "Lauriya Nandangarh",
    state: "Bihar",
    eyebrow: "Ashokan pillar · West Champaran · archaeology",
    image: "/manus-storage/bundi_8620930e.jpg",
    accent: "blue",
    baseCost: 3200,
    distance: "28 km from Bettiah",
    travelTime: "Train to Bettiah/Narkatiaganj + local",
    tags: ["Heritage", "Archaeology", "Offbeat"],
    transport: "Train + shared auto",
    stay: "Bettiah homestay",
    stayName: "Bettiah Heritage Homestay",
    stayStatus: "Research estimate",
    highlight: "Ashokan history",
    why: "A rail-first West Champaran trip to the Ashokan pillar and stupa landscape, made accessible with a Bettiah homestay and shared last-mile rides.",
    route: ["Patna", "Bettiah", "Narkatiaganj", "Lauriya Nandangarh", "Bettiah", "Patna"],
    activities: ["Ashokan pillar", "Stupa site", "Burhi Gandak riverside"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.thrillophilia.com/unexplored-places-in-bihar", "https://tourism.bihar.gov.in/"],
    researchNote: "₹3,200 estimate: rail to Bettiah/Narkatiaganj, one Bettiah homestay, simple meals and shared local rides. The site is rural; confirm return transport before setting out.",
  },
  {
    id: "munger-yoga",
    name: "Munger Yoga & Ganga",
    state: "Bihar",
    eyebrow: "Yoga tradition · Ganga · slow city break",
    image: "/manus-storage/bihar-yoga_7203c23c.webp",
    accent: "lime",
    baseCost: 2400,
    distance: "175 km from Patna",
    travelTime: "Train + local e-rickshaw",
    tags: ["Wellness", "Culture", "Slow travel"],
    transport: "Train + local",
    stay: "Ashram dormitory",
    stayName: "Munger Ashram Dormitory",
    stayStatus: "Research estimate",
    highlight: "Reset affordably",
    why: "A low-cost wellness break around the Bihar School of Yoga area, Ganga views and a simple ashram dormitory instead of a premium retreat.",
    route: ["Patna", "Munger", "Yoga district", "Ganga riverside", "Munger", "Patna"],
    activities: ["Yoga tradition walk", "Ganga ghats", "Munger Fort area"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.thrillophilia.com/unexplored-places-in-bihar", "https://www.biharschoolofyoga.com/"],
    researchNote: "₹2,400 estimate: train, one ashram dormitory bed, simple vegetarian meals and local e-rickshaw movement. The Bihar School of Yoga may have its own admission or visitor rules; confirm directly.",
  },
  {
    id: "varanasi-sarnath",
    name: "Varanasi & Sarnath",
    state: "Uttar Pradesh",
    eyebrow: "Ghats · Buddhist heritage · rail-first",
    image: "/manus-storage/bundi_8620930e.jpg",
    accent: "orange",
    baseCost: 3500,
    distance: "206 km from Patna",
    travelTime: "3h 20m–7h 40m by train",
    tags: ["Heritage", "Spiritual", "Budget"],
    transport: "Direct train",
    stay: "Budget guesthouse",
    stayName: "Old City Guesthouse",
    stayStatus: "Research estimate",
    highlight: "Culture close by",
    why: "A rail-friendly two-day circuit pairing Varanasi’s ghats with Sarnath’s Buddhist heritage, using shared city transport and low-cost sights.",
    route: ["Patna", "Varanasi", "Sarnath", "Varanasi", "Patna"],
    activities: ["Ganga ghats", "Sarnath museum", "Dhamek Stupa"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.railyatri.in/patna-saheb-to-varanasi-jn-trains", "https://www.tripsavvy.com/sarnath-the-complete-guide-4686998", "https://varanasismartcity.gov.in/about/sarnath"],
    researchNote: "₹3,500 conservative two-day planning estimate: lowest practical rail class allowance, one budget night, simple meals, shared local transport and low-cost Sarnath entries. Verify date-specific fare on IRCTC.",
  },
  {
    id: "purulia",
    name: "Purulia",
    state: "West Bengal",
    eyebrow: "Ajodhya Hills · Joychandi Pahar · nature",
    image: "/manus-storage/warwan-valley_d8915316.jpg",
    accent: "lime",
    baseCost: 3500,
    distance: "407 km from Patna",
    travelTime: "7h 40m–9h 40m by train",
    tags: ["Nature", "Hiking", "Rail-friendly"],
    transport: "Train + shared jeep",
    stay: "Town guesthouse",
    stayName: "Purulia Budget Stay",
    stayStatus: "Research estimate",
    highlight: "Forest break",
    why: "A low-cost eastern India escape built around a Joychandi Pahar hike and a shared-vehicle Ajodhya Hills circuit.",
    route: ["Patna", "Purulia", "Joychandi Pahar", "Ajodhya Hills", "Patna"],
    activities: ["Joychandi Pahar", "Ajodhya viewpoints", "Local market"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.wbtourism.gov.in/The%20Mountains/details?template_id=1&id=63f5f76ac2833880ea035474", "https://www.shoestringtravel.in/2021/01/purulia-tour-guide-detailed-itinerary.html", "https://www.irctc.co.in/nget/train-search"],
    researchNote: "₹3,500 conservative estimate: Sleeper rail allowance, one budget night, simple meals, shared auto/jeep movement and a small activity buffer. A private taxi materially increases cost.",
  },
  {
    id: "orchha",
    name: "Orchha",
    state: "Madhya Pradesh",
    eyebrow: "Bundela forts · temples · Betwa River",
    image: "/manus-storage/dholavira_1977cc3f.jpg",
    accent: "blue",
    baseCost: 6000,
    distance: "805 km rail route from Patna",
    travelTime: "14h–18h to Jhansi",
    tags: ["Heritage", "Temples", "Budget"],
    transport: "Train + shared auto",
    stay: "Heritage guesthouse",
    stayName: "Orchha Budget Homestay",
    stayStatus: "Research estimate",
    highlight: "Walkable history",
    why: "A compact, walkable heritage town where forts, temples and Betwa riverside monuments can be explored without a private guide or taxi.",
    route: ["Patna", "Jhansi", "Orchha", "Betwa", "Jhansi", "Patna"],
    activities: ["Orchha Fort", "Ram Raja Temple", "Betwa Chhatris"],
    bestTime: "Nov–Feb",
    researchSources: ["https://www.mptourism.com/destination-orchha.php", "https://www.rome2rio.com/s/Patna/Orchha", "https://www.irctc.co.in/"],
    researchNote: "₹6,000 covers a conservative Sleeper rail allowance, Jhansi–Orchha transfer, two budget nights, meals and local movement. This is two sightseeing days plus roughly 30–36 hours of transit, not a two-calendar-day door-to-door trip.",
  },
  {
    id: "cherrapunji",
    name: "Cherrapunji",
    state: "Meghalaya",
    eyebrow: "Waterfalls · caves · living-root bridges",
    image: "/manus-storage/meghalaya-falls_c026cd1d.jpg",
    accent: "blue",
    baseCost: 5000,
    distance: "Patna to Guwahati rail gateway",
    travelTime: "16h–24h to Guwahati",
    tags: ["Waterfalls", "Nature", "Northeast"],
    transport: "Train + shared Sumo",
    stay: "Sohra homestay",
    stayName: "Sohra Shared Homestay",
    stayStatus: "Research estimate",
    highlight: "Rainforest route",
    why: "A shared-transport Sohra circuit around Mawsmai Cave, Nohkalikai and Seven Sisters viewpoints, with a living-root-bridge option when weather allows.",
    route: ["Patna", "Guwahati", "Shillong", "Sohra", "Shillong", "Guwahati"],
    activities: ["Mawsmai Cave", "Nohkalikai Falls", "Root bridge trail"],
    bestTime: "Oct–Mar",
    researchSources: ["https://www.meghalayatourism.in/explore/destinations/by-interest/living-root-bridges/sohra-cherrapunji/", "https://www.makemytrip.com/railways/patna-guwahati-train-tickets.html", "https://www.lostwithpurpose.com/guwahati-shillong-cherrapunjee/"],
    researchNote: "₹5,000 covers Sleeper rail positioning, shared Guwahati–Shillong–Sohra transport, one budget night, food and activity buffer. Patna-origin travellers need additional rail travel days.",
  },
  {
    id: "mcleod-ganj",
    name: "McLeod Ganj",
    state: "Himachal Pradesh",
    eyebrow: "Tibetan culture · monasteries · Bhagsu",
    image: "/manus-storage/mana-village_0e1c3c53.jpg",
    accent: "orange",
    baseCost: 6500,
    distance: "Pathankot gateway + 91 km road",
    travelTime: "Long-distance train + HRTC bus",
    tags: ["Mountains", "Culture", "Trekking"],
    transport: "Train + HRTC bus",
    stay: "Dorm / shared room",
    stayName: "Dharamkot Shared Stay",
    stayStatus: "Research estimate",
    highlight: "Tibetan trails",
    why: "A budget hill stay using Pathankot as the rail gateway, HRTC buses for the climb, and free temples, markets and waterfall walks.",
    route: ["Patna", "Pathankot", "Dharamshala", "McLeod Ganj", "Pathankot", "Patna"],
    activities: ["Dalai Lama Temple", "Bhagsu Waterfall", "Tibetan Market"],
    bestTime: "Mar–May · Sep–Nov",
    researchSources: ["https://hpkangra.nic.in/tourist-place/mcleodganj/", "https://www.redbus.in/online-bus/pathankot-to-dharamshala-operator-hrtc", "https://www.ndtv.com/travel/how-to-plan-a-mcleod-ganj-trip-under-rs-5-000-budget-friendly-tips-you-can-use-9651158"],
    researchNote: "₹6,500 includes a conservative Patna–Pathankot rail allowance, HRTC bus connections, two shared nights, meals and a weather/transport buffer. It represents two destination days, not a two-calendar-day door-to-door trip.",
  },
  {
    id: "puducherry",
    name: "Puducherry",
    state: "Puducherry",
    eyebrow: "White Town · promenade · Auroville",
    image: "/manus-storage/turtuk_958e4b02.jpg",
    accent: "lime",
    baseCost: 8500,
    distance: "2,292 km from Patna by rail",
    travelTime: "About 45h fastest by rail",
    tags: ["Beach", "Heritage", "Food"],
    transport: "Train + Chennai connection",
    stay: "Budget guesthouse",
    stayName: "White Town Guesthouse",
    stayStatus: "Research estimate",
    highlight: "Coastal slow travel",
    why: "A walkable coastal heritage break with White Town, Promenade Beach, temples and a low-cost Auroville or Paradise Beach add-on.",
    route: ["Patna", "Chennai", "Puducherry", "White Town", "Puducherry", "Chennai"],
    activities: ["Promenade Beach", "White Town walk", "Auroville visit"],
    bestTime: "Jan–Mar · Aug–Oct",
    researchSources: ["https://pondytourism.py.gov.in/onlinebs/FAQ.aspx", "https://www.rome2rio.com/Train/Patna/Puducherry", "https://www.zingbus.com/blog/places-to-visit-in-pondicherry-budget-travel-guide/"],
    researchNote: "₹8,500 includes a conservative Patna–Chennai–Puducherry surface-transport allowance, two budget nights, meals and local movement. It is a two-day on-ground plan with multiple transit days from Patna.",
  },
  {
    id: "gokarna",
    name: "Gokarna",
    state: "Karnataka",
    eyebrow: "Beaches · temples · backpacker coast",
    image: "/manus-storage/pithoragarh_3915b021.jpg",
    accent: "orange",
    baseCost: 11000,
    distance: "Patna to Gokarna Road",
    travelTime: "About 40h by train via Madgaon",
    tags: ["Beach", "Temple", "Backpacking"],
    transport: "Train via Madgaon",
    stay: "Hostel / guesthouse",
    stayName: "Gokarna Backpacker Stay",
    stayStatus: "Research estimate",
    highlight: "Coastal backpacking",
    why: "A compact two-day coastal circuit covering the temple town, Gokarna Beach, Kudle and Om Beach with walking and local transport.",
    route: ["Patna", "Madgaon", "Gokarna Road", "Gokarna", "Om Beach", "Madgaon"],
    activities: ["Mahabaleshwar Temple", "Kudle Beach", "Om Beach"],
    bestTime: "Oct–Mar",
    researchSources: ["https://karnatakatourism.org/en/destinations/gokarna", "https://www.rome2rio.com/Train/Patna/Gokarna-Road", "https://www.irctc.co.in/nget/train-search"],
    researchNote: "₹11,000 includes a conservative Patna–Madgaon–Gokarna rail allowance, two budget nights, meals, local transfers and a small activity buffer. Due to the 40-hour rail journey, this is a two-day on-ground stay, not a two-calendar-day door-to-door trip.",
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

const latestDestinations = [
  { id: "munnar-neelakurinji", name: "Munnar Neelakurinji", state: "Kerala", badge: "Bloom watch · 2026", summary: "Purple-blue highland flowers are drawing attention to Chokramudi and Meesapulimala viewpoints this season.", whyNow: "Recent reporting says flowering began in late August 2026; verify the exact open viewpoint before travelling.", bestTime: "Aug–Oct", access: "Road from Munnar; local/forest-managed access", image: "/manus-storage/neelakurinji_3045818c.jpg", sources: ["https://www.keralatourism.org/destination/neelakurinji-the-blue-beauty-in-munnar/377/", "https://eravikulamnationalpark.in/"] },
  { id: "meghalaya-monsoon", name: "Meghalaya Monsoon Routes", state: "Meghalaya", badge: "Waterfall season", summary: "Sohra, Nohkalikai, Seven Sisters, caves and living-root bridges become especially dramatic in the rains.", whyNow: "Official tourism guidance identifies June–September as the strongest window for waterfall flow, with landslide and road checks essential.", bestTime: "Jun–Sep", access: "Shillong hub + shared taxi to Sohra", image: "/manus-storage/meghalaya-falls_c026cd1d.jpg", sources: ["https://www.meghalayatourism.in/experiences/nature-&-wildlife/seasons/", "https://www.meghalayatourism.in/explore/destinations/by-region/khasi-hills/sohra/"] },
  { id: "zanskar-valley-latest", name: "Zanskar Valley", state: "Ladakh", badge: "New road corridor", summary: "Remote monasteries, Penzi La landscapes and the Nimmu–Padum–Darcha road make this a frontier-scale Himalayan journey.", whyNow: "The 298-km road connection is improving access, but passes, permits and road openings remain seasonal.", bestTime: "Jun–Sep", access: "Long road journey from Leh or Kargil", image: "/manus-storage/zanskar_8566282b.jpg", sources: ["https://ladakh.gov.in/places-centres/zanskar/", "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2016417"] },
  { id: "gurez-valley-latest", name: "Gurez Valley", state: "Jammu & Kashmir", badge: "Offbeat valley", summary: "Kishanganga river views, Dard-Shina culture, log houses and Tulail make Gurez a strong slow-travel pick.", whyNow: "Visitor interest and tourism infrastructure are growing, while official access and security checks remain important.", bestTime: "Jun–Sep", access: "Srinagar → Bandipora → Razdan Pass", image: "/manus-storage/gurez_85e9265c.jpg", sources: ["https://bandipore.nic.in/tourist-place/gurez-valley/", "https://www.jktdc.co.in/Gurez.aspx"] },
  { id: "odisha-coastal-heritage", name: "Odisha Coastal Heritage", state: "Odisha", badge: "2026 events", summary: "Puri, Konark, Chandrabhaga, Raghurajpur and Chilika combine living pilgrimage, UNESCO heritage, craft and nature.", whyNow: "Odisha Tourism lists the 2026 Konark Festival and Chilika Bird Festival among current events; confirm dates before booking.", bestTime: "Oct–Feb", access: "Bhubaneswar → Puri → Konark", image: "/manus-storage/dholavira_1977cc3f.jpg", sources: ["https://odishatourism.gov.in/content/tourism/en.html", "https://whc.unesco.org/en/list/246/"] },
  { id: "chopta-tungnath-latest", name: "Chopta–Tungnath", state: "Uttarakhand", badge: "High-altitude classic", summary: "A steep temple and Chandrashila route with meadows, birdlife and big Garhwal views.", whyNow: "Recent conservation reporting highlights rising footfall and the need for marked trails, low-waste travel and seasonal checks.", bestTime: "Apr–Jun · Oct–Nov", access: "Road via Rudraprayag/Ukhimath; trek from Chopta", image: "/manus-storage/pithoragarh_3915b021.jpg", sources: ["https://uttarakhandtourism.gov.in/destination/chopta", "https://gmvnonline.com/tungnath-destination"] },
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

const weatherLocations: Record<string, { latitude: number; longitude: number; label: string }> = {
  Chitkul: { latitude: 31.3516, longitude: 78.4372, label: "Chitkul" }, Pithoragarh: { latitude: 29.5829, longitude: 80.2182, label: "Pithoragarh" }, Ukhimath: { latitude: 30.5286, longitude: 79.1986, label: "Ukhimath" }, "Mana Village": { latitude: 30.7739, longitude: 79.4933, label: "Mana Village" }, "Warwan Valley": { latitude: 33.706, longitude: 75.725, label: "Warwan Valley" }, Turtuk: { latitude: 35.5269, longitude: 76.8346, label: "Turtuk" }, Rajgir: { latitude: 25.0268, longitude: 85.4206, label: "Rajgir" }, "Bodh Gaya": { latitude: 24.6961, longitude: 84.9912, label: "Bodh Gaya" }, Deoghar: { latitude: 24.492, longitude: 86.696, label: "Deoghar" }, "Barabar Caves": { latitude: 25.005, longitude: 85.066, label: "Barabar Caves" }, "Telhar Kund": { latitude: 24.8904, longitude: 83.744, label: "Telhar Kund" }, "Kesaria Stupa": { latitude: 26.334, longitude: 84.854, label: "Kesaria Stupa" }, Munger: { latitude: 25.3757, longitude: 86.474, label: "Munger" }, Varanasi: { latitude: 25.3176, longitude: 82.9739, label: "Varanasi" }, Purulia: { latitude: 23.332, longitude: 86.365, label: "Purulia" }, Orchha: { latitude: 25.3519, longitude: 78.6407, label: "Orchha" }, Cherrapunji: { latitude: 25.284, longitude: 91.721, label: "Cherrapunji" }, "McLeod Ganj": { latitude: 32.2426, longitude: 76.3213, label: "McLeod Ganj" }, Puducherry: { latitude: 11.9416, longitude: 79.8083, label: "Puducherry" }, Gokarna: { latitude: 14.5479, longitude: 74.3188, label: "Gokarna" },
};

const weatherCodeLabel = (code: number) => code === 0 ? "Clear sky" : code <= 3 ? "Partly cloudy" : code <= 48 ? "Hazy / foggy" : code <= 57 ? "Drizzle" : code <= 67 ? "Rain" : code <= 77 ? "Snow" : code <= 82 ? "Rain showers" : "Thunderstorm risk";

async function getLiveWeather(destination: string) {
  let known = weatherLocations[destination];
  if (!known) {
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.search = new URLSearchParams({ name: destination, count: "1", language: "en", format: "json" }).toString();
    const geoResponse = await fetch(geoUrl, { signal: AbortSignal.timeout(5000) });
    if (geoResponse.ok) {
      const geo = await geoResponse.json() as { results?: { latitude: number; longitude: number; name: string }[] };
      const result = geo.results?.[0];
      if (result) known = { latitude: result.latitude, longitude: result.longitude, label: result.name };
    }
  }
  if (!known) throw new Error(`Could not locate ${destination}`);
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({ latitude: String(known.latitude), longitude: String(known.longitude), current: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m", daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset", timezone: "auto", forecast_days: "3" }).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
  const data = await response.json() as { current: Record<string, number | string>; daily: Record<string, (number | string)[]>; timezone: string };
  const current = data.current;
  const daily = data.daily;
  const temp = Number(current.temperature_2m); const wind = Number(current.wind_speed_10m); const gust = Number(current.wind_gusts_10m); const rainChance = Number(daily.precipitation_probability_max?.[0] ?? 0); const code = Number(current.weather_code);
  const level = code >= 95 || gust >= 45 || rainChance >= 75 ? "warning" : gust >= 30 || rainChance >= 45 ? "watch" : "good";
  return { available: true as const, destination: known.label, level, headline: weatherCodeLabel(code), detail: `${weatherCodeLabel(code)} now, with ${rainChance}% rain chance today.`, temperatureC: Math.round(temp), feelsLikeC: Math.round(Number(current.apparent_temperature)), humidity: Number(current.relative_humidity_2m), windKph: Math.round(wind), gustKph: Math.round(gust), precipitationMm: Number(current.precipitation), weatherCode: code, timezone: data.timezone, updatedAt: new Date().toISOString(), action: "Refresh live weather", daily: [0, 1, 2].map(index => ({ date: String(daily.time?.[index] ?? ""), minC: Math.round(Number(daily.temperature_2m_min?.[index] ?? 0)), maxC: Math.round(Number(daily.temperature_2m_max?.[index] ?? 0)), rainChance: Number(daily.precipitation_probability_max?.[index] ?? 0), summary: weatherCodeLabel(Number(daily.weather_code?.[index] ?? 0)) })) };
}

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
    latest: publicProcedure.query(() => latestDestinations),
    weatherAlert: publicProcedure.input(weatherInput).query(async ({ input }) => {
      try {
        return await getLiveWeather(input.destination);
      } catch (error) {
        console.warn("[Weather] Live provider unavailable:", error);
        return { available: false as const, destination: input.destination, level: "error" as const, headline: "Live weather unavailable", detail: "The live weather provider did not respond. Check again before departure and verify local advisories.", updatedAt: new Date().toISOString(), action: "Retry live weather", daily: [] };
      }
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
