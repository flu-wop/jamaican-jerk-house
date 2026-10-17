"use client";

import { useEffect, useState } from "react";
import type { Location } from "@/lib/site";

function nowInChicago() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};

function fmt(s: string) {
  const [h, m] = s.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, "0")}${suffix}` : `${hh}${suffix}`;
}

export default function OpenBadge({ location, className = "" }: { location: Location; className?: string }) {
  const [label, setLabel] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const { day, minutes } = nowInChicago();
    const today = location.schedule[day];
    if (today && minutes >= toMin(today[0]) && minutes < toMin(today[1])) {
      setLabel({ open: true, text: `Open now · until ${fmt(today[1])}` });
      return;
    }
    if (today && minutes < toMin(today[0])) {
      setLabel({ open: false, text: `Opens today at ${fmt(today[0])}` });
      return;
    }
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      const s = location.schedule[d];
      if (s) {
        const name = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];
        setLabel({ open: false, text: `Closed · opens ${i === 1 ? "tomorrow" : name} at ${fmt(s[0])}` });
        return;
      }
    }
  }, [location]);

  if (!label) return <span className={`inline-block h-5 ${className}`} aria-hidden />;
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <span className={`h-2 w-2 rounded-full ${label.open ? "bg-green" : "bg-ember"}`} aria-hidden />
      {label.text}
    </span>
  );
}
