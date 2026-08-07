export const STATUS_META = {
  repair: {
    label: "Objednaná oprava",
    legend: "Objednaná oprava",
    color: "#2f6fec",
    priority: 1,
  },
  ordered: {
    label: "Kontrola objednána",
    legend: "Kontrola objednaná",
    color: "#f6c342",
    priority: 2,
  },
  stop: {
    label: "Stop Stav",
    legend: "Stop Stav",
    color: "#7c8490",
    priority: 3,
  },
  overdue: {
    label: "Propadlá kontrola",
    legend: "Propadlá kontrola",
    color: "#ef3d3d",
    priority: 4,
  },
  soon: {
    label: "1-30 dní k termínu",
    legend: "1-30 dní k termínu",
    color: "#ff7a1a",
    priority: 5,
  },
  ok: {
    label: "OK / ostatní",
    legend: "OK / ostatní",
    color: "#3fa857",
    priority: 6,
  },
};

export const REGIONS = [
  "Hlavní město Praha",
  "Středočeský kraj",
  "Jihočeský kraj",
  "Plzeňský kraj",
  "Karlovarský kraj",
  "Ústecký kraj",
  "Liberecký kraj",
  "Královéhradecký kraj",
  "Pardubický kraj",
  "Kraj Vysočina",
  "Jihomoravský kraj",
  "Olomoucký kraj",
  "Zlínský kraj",
  "Moravskoslezský kraj",
  "Bratislavský kraj",
];

export const QUEUE_TEMPLATE = [
  { id: "q-001", type: "misto", label: "Nové GPS u Nemocnice Třebíč", state: "pending" },
  { id: "q-002", type: "protokol", label: "Protokol UPS Eaton 9SX 3000", state: "syncing" },
  { id: "q-003", type: "foto", label: "5 fotografií serverovny", state: "pending" },
];

export const PLACES = [
  {
    placeId: "pce-astip",
    name: "ASTIP a.s. - Pardubice",
    address: "Teplého 2014, 530 02 Pardubice",
    gps: "50.037216, 15.781349",
    region: "Pardubický kraj",
    x: 52.5,
    y: 29.5,
    watched: true,
    groupCount: 2,
    owner: "ASTIP a.s.",
    updated: "30.07.2026",
    created: "12.01.2024",
    sources: [
      {
        sourceId: "fz1",
        name: "FZ1 - UPS 40 kVA",
        device: "UPS 40 kVA",
        description: "Záložní UPS pro serverovnu",
        serial: "SN123456789",
        contact: "Jan Dvořák, 602 123 456",
        sourceLocation: "1. patro, serverovna",
        note: "Výměna baterií 2024",
        period: "6 měsíců",
        contract: "SML-2023-0178 (platná)",
        price: "15 480 Kč / rok",
        invoiceTo: "ASTIP a.s., Teplého 2014, 530 02 Pardubice",
        important: "UPOZORNĚNÍ: Omezený přístup mimo pracovní dobu.",
        lastCheck: "23.03.2026",
        nextCheck: "22.09.2026",
        days: 49,
        status: "repair",
        watched: true,
      },
      {
        sourceId: "fz2",
        name: "FZ2 - UPS 20 kVA",
        device: "UPS 20 kVA",
        description: "Záloha dispečinku",
        serial: "SN998877665",
        contact: "Jan Dvořák, 602 123 456",
        sourceLocation: "2. patro, technologie",
        note: "Kontrola objednána u provozovatele",
        period: "12 měsíců",
        contract: "SML-2023-0178 (platná)",
        price: "9 900 Kč / rok",
        invoiceTo: "ASTIP a.s., Teplého 2014, 530 02 Pardubice",
        important: "",
        lastCheck: "18.02.2026",
        nextCheck: "18.08.2026",
        days: 14,
        status: "ordered",
        watched: false,
      },
    ],
    history: [
      { date: "23.03.2026", title: "Pravidelná kontrola", technician: "Petr Novák" },
      { date: "16.09.2025", title: "Výměna baterií", technician: "Jan Dvořák" },
    ],
  },
  {
    placeId: "praha-datacentrum",
    name: "Datové centrum Fenix",
    address: "Na Strži 1702/65, 140 00 Praha 4",
    gps: "50.0412, 14.4421",
    region: "Hlavní město Praha",
    x: 36.5,
    y: 31.5,
    watched: false,
    groupCount: 6,
    owner: "Fenix DC s.r.o.",
    updated: "01.08.2026",
    created: "08.03.2023",
    sources: [
      {
        sourceId: "fenix-01",
        name: "UPS Galaxy VS 80 kVA",
        device: "UPS 80 kVA",
        description: "Hlavní záloha sálu A",
        serial: "GV80-2021-PA4",
        contact: "Lucie Hrubá, 777 201 480",
        sourceLocation: "Sál A, rack 01",
        note: "Nutné hlásit vstup 24 h předem",
        period: "6 měsíců",
        contract: "SML-2024-0042",
        price: "28 400 Kč / rok",
        invoiceTo: "Fenix DC s.r.o.",
        important: "Přístup pouze s doprovodem bezpečnostní služby.",
        lastCheck: "02.02.2026",
        nextCheck: "05.08.2026",
        days: 1,
        status: "overdue",
        watched: true,
      },
    ],
    history: [
      { date: "02.02.2026", title: "Pravidelná kontrola", technician: "Petr Novák" },
      { date: "11.09.2025", title: "Test baterií", technician: "Karel Pejlo" },
    ],
  },
  {
    placeId: "ostrava-hala",
    name: "Výrobní hala Ostrava",
    address: "Ruská 3077/135, 700 30 Ostrava",
    gps: "49.8024, 18.2480",
    region: "Moravskoslezský kraj",
    x: 77,
    y: 35,
    watched: false,
    groupCount: 3,
    owner: "Ostrava Tech",
    updated: "28.07.2026",
    created: "14.10.2022",
    sources: [
      {
        sourceId: "ost-01",
        name: "Diesel FZ 60 kVA",
        device: "Diesel 60 kVA",
        description: "Záložní zdroj pro výrobní linku",
        serial: "FZ60D-2020-884",
        contact: "Milan Tichý, 734 456 100",
        sourceLocation: "Strojovna jih",
        note: "Objednaná kontrola po odstávce",
        period: "12 měsíců",
        contract: "SML-2022-0120",
        price: "12 600 Kč / rok",
        invoiceTo: "Ostrava Tech a.s.",
        important: "",
        lastCheck: "14.09.2025",
        nextCheck: "16.08.2026",
        days: 12,
        status: "ordered",
        watched: false,
      },
    ],
    history: [{ date: "14.09.2025", title: "Pravidelná kontrola", technician: "Jan Novák" }],
  },
  {
    placeId: "brno-centrum",
    name: "Obchodní dům Centrum",
    address: "nám. Republiky 1, 602 00 Brno",
    gps: "49.1951, 16.6068",
    region: "Jihomoravský kraj",
    x: 71,
    y: 58,
    watched: true,
    groupCount: 4,
    owner: "Centrum Brno",
    updated: "20.07.2026",
    created: "03.11.2021",
    sources: [
      {
        sourceId: "brno-01",
        name: "UPS Eaton 9SX 3000",
        device: "UPS online, 3000 VA / 2700 W",
        description: "Záloha pokladen a EPS",
        serial: "9SX3KI/22100145",
        contact: "Jan Kovář, 602 123 456",
        sourceLocation: "Technická místnost 2. patro",
        note: "Přístup přes recepci",
        period: "6 měsíců",
        contract: "SML/2024/0158",
        price: "6 500 Kč",
        invoiceTo: "Centrum Brno s.r.o.",
        important: "Zálohovat konfiguraci po každé výměně baterií.",
        lastCheck: "15.06.2026",
        nextCheck: "18.09.2026",
        days: 45,
        status: "soon",
        watched: true,
      },
    ],
    history: [{ date: "15.06.2026", title: "Pravidelná kontrola", technician: "Jan Novák" }],
  },
  {
    placeId: "liberec-nemocnice",
    name: "Krajská nemocnice Liberec",
    address: "Husova 10, 460 63 Liberec",
    gps: "50.7671, 15.0562",
    region: "Liberecký kraj",
    x: 44,
    y: 19,
    watched: false,
    groupCount: 2,
    owner: "KNL",
    updated: "03.08.2026",
    created: "05.05.2022",
    sources: [
      {
        sourceId: "knl-01",
        name: "FZ 60 kVA - Diesel",
        device: "FZ 60 kVA",
        description: "Záložní zdroj pro pavilon B",
        serial: "FZ60D-2018-1421",
        contact: "Petr Malý, 777 123 456",
        sourceLocation: "Technický dvůr",
        note: "Výměna baterií do 30.09.2026",
        period: "12 měsíců",
        contract: "SM-2024-0178",
        price: "3 450 Kč",
        invoiceTo: "Krajská nemocnice Liberec",
        important: "",
        lastCheck: "20.07.2025",
        nextCheck: "05.08.2026",
        days: -1,
        status: "overdue",
        watched: true,
      },
    ],
    history: [{ date: "20.07.2025", title: "Pravidelná prohlídka", technician: "Jan Novák" }],
  },
  {
    placeId: "plzen-skola",
    name: "Škola Komenského",
    address: "Komenského 2, 301 00 Plzeň",
    gps: "49.7475, 13.3776",
    region: "Plzeňský kraj",
    x: 28,
    y: 45,
    watched: true,
    groupCount: 1,
    owner: "Město Plzeň",
    updated: "27.07.2026",
    created: "12.09.2023",
    sources: [
      {
        sourceId: "plz-01",
        name: "UPS 10 kVA",
        device: "UPS 10 kVA",
        description: "Serverovna školy",
        serial: "PLZ-UPS-1001",
        contact: "Ivana Šebková, 608 112 980",
        sourceLocation: "Kabinet IT",
        note: "Hlídáme termín sami",
        period: "12 měsíců",
        contract: "bez smlouvy",
        price: "4 100 Kč",
        invoiceTo: "ZŠ Komenského",
        important: "",
        lastCheck: "12.08.2025",
        nextCheck: "12.08.2026",
        days: 8,
        status: "soon",
        watched: true,
      },
    ],
    history: [{ date: "12.08.2025", title: "Roční kontrola", technician: "Petr Novák" }],
  },
  {
    placeId: "olomouc-urad",
    name: "Městský úřad Olomouc",
    address: "Hynaisova 10, 779 11 Olomouc",
    gps: "49.5938, 17.2509",
    region: "Olomoucký kraj",
    x: 70,
    y: 43,
    watched: false,
    groupCount: 1,
    owner: "Město Olomouc",
    updated: "22.07.2026",
    created: "18.02.2024",
    sources: [
      {
        sourceId: "olo-01",
        name: "UPS 15 kVA",
        device: "UPS 15 kVA",
        description: "Záloha podatelny",
        serial: "OLO-2024-15",
        contact: "Radek Vlk, 725 000 111",
        sourceLocation: "Přízemí, rozvaděč",
        note: "Po opravě čeká na ověření",
        period: "6 měsíců",
        contract: "SML-2024-070",
        price: "5 900 Kč",
        invoiceTo: "Statutární město Olomouc",
        important: "",
        lastCheck: "18.02.2026",
        nextCheck: "18.08.2026",
        days: 14,
        status: "repair",
        watched: false,
      },
    ],
    history: [{ date: "18.02.2026", title: "Pravidelná kontrola", technician: "Karel Pejlo" }],
  },
  {
    placeId: "trencin-zavod",
    name: "Logistické centrum Trenčín",
    address: "Priemyselná 12, 911 01 Trenčín",
    gps: "48.8945, 18.0444",
    region: "Bratislavský kraj",
    x: 72,
    y: 72,
    watched: false,
    groupCount: 1,
    owner: "Logis SK",
    updated: "18.07.2026",
    created: "23.06.2023",
    sources: [
      {
        sourceId: "sk-01",
        name: "FZ 30 kVA",
        device: "FZ 30 kVA",
        description: "Záloha skladu",
        serial: "SK-FZ-3010",
        contact: "Martin Benda, +421 902 111 222",
        sourceLocation: "Sklad C",
        note: "Provoz odstaven",
        period: "12 měsíců",
        contract: "SML-SK-09",
        price: "480 EUR",
        invoiceTo: "Logis SK",
        important: "Stop Stav do výměny stykače.",
        lastCheck: "10.04.2026",
        nextCheck: "10.10.2026",
        days: 67,
        status: "stop",
        watched: false,
      },
    ],
    history: [{ date: "10.04.2026", title: "Stop Stav", technician: "Petr Novák" }],
  },
];

export function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getPlacePriority(place) {
  return place.sources.reduce((best, source) => {
    const current = STATUS_META[source.status]?.priority ?? 99;
    return current < best.priority ? { source, priority: current } : best;
  }, { source: place.sources[0], priority: 99 }).source;
}

export function buildSearchText(place) {
  const sourceText = place.sources
    .map((source) => [
      source.name,
      source.device,
      source.description,
      source.serial,
      source.contact,
      source.sourceLocation,
      source.note,
    ].join(" "))
    .join(" ");

  return normalizeText([
    place.name,
    place.address,
    place.region,
    place.gps,
    place.owner,
    sourceText,
  ].join(" "));
}

export function matchesFilters(place, filters) {
  const searchText = buildSearchText(place);
  const queryOk = !filters.query || searchText.includes(normalizeText(filters.query));
  const regionOk = filters.region === "all" || place.region === filters.region;
  const watchedOk = filters.watched === "all"
    || (filters.watched === "yes" ? place.sources.some((source) => source.watched) : !place.sources.some((source) => source.watched));
  const statusOk = filters.status === "all" || place.sources.some((source) => source.status === filters.status);

  return queryOk && regionOk && watchedOk && statusOk;
}

export function countByStatus(places) {
  return places.reduce((acc, place) => {
    place.sources.forEach((source) => {
      acc[source.status] = (acc[source.status] || 0) + 1;
      if (source.watched) acc.watched = (acc.watched || 0) + 1;
    });
    return acc;
  }, {});
}
