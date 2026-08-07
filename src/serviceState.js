export const emptyForm = {
  name: "",
  address: "",
  region: "Pardubický kraj",
  device: "",
  serial: "",
  contact: "",
  period: "6 měsíců",
  watched: "ano",
};

export function createPlaceFromForm(form, index) {
  const placeId = `manual-${Date.now()}`;
  return {
    placeId,
    name: form.name || "Nové servisní místo",
    address: form.address || "Adresa bude doplněna",
    gps: "49.8175, 15.4730",
    region: form.region,
    x: 42 + (index % 5) * 5,
    y: 42 + (index % 4) * 5,
    watched: form.watched === "ano",
    groupCount: 1,
    owner: form.name || "Nový provozovatel",
    updated: new Intl.DateTimeFormat("cs-CZ").format(new Date()),
    created: new Intl.DateTimeFormat("cs-CZ").format(new Date()),
    sources: [
      {
        sourceId: `${placeId}-source`,
        name: form.device || "Nový záložní zdroj",
        device: form.device || "Záložní zdroj",
        description: "Nově založený zdroj čeká na doplnění technických údajů",
        serial: form.serial || "-",
        contact: form.contact || "-",
        sourceLocation: "-",
        note: "Založeno z nové aplikace",
        period: form.period,
        contract: "-",
        price: "-",
        invoiceTo: form.name || "-",
        important: "",
        lastCheck: "-",
        nextCheck: "-",
        days: 0,
        status: "ok",
        watched: form.watched === "ano",
      },
    ],
    history: [],
  };
}

export function queueSummary(queue) {
  return queue.reduce((acc, item) => {
    acc.total += 1;
    acc[item.type] = (acc[item.type] || 0) + 1;
    acc[item.state] = (acc[item.state] || 0) + 1;
    return acc;
  }, { total: 0 });
}
