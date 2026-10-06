export function dateFromStoredValue(raw) {
  if (raw == null || raw === "" || typeof raw === "boolean") return null;
  try {
    let date;
    if (typeof raw.toDate === "function") date = raw.toDate();
    else if (typeof raw === "object" && !(raw instanceof Date)) {
      const seconds = raw.seconds ?? raw._seconds;
      const nanoseconds = raw.nanoseconds ?? raw._nanoseconds ?? 0;
      if (!Number.isFinite(seconds) || !Number.isFinite(nanoseconds)
          || nanoseconds < 0 || nanoseconds >= 1e9) return null;
      date = new Date(seconds * 1000 + Math.floor(nanoseconds / 1e6));
    } else date = new Date(raw);
    return date instanceof Date && Number.isFinite(date.getTime()) ? date : null;
  } catch {
    return null;
  }
}
