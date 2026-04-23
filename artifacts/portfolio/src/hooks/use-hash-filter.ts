import { useEffect, useState } from "react";

function readHash(): string {
  if (typeof window === "undefined") return "All";
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return "All";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function useHashFilter(validValues: string[]): [string, (next: string) => void] {
  const [filter, setFilter] = useState<string>(() => {
    const h = readHash();
    return validValues.includes(h) ? h : "All";
  });

  useEffect(() => {
    const onHash = () => {
      const h = readHash();
      setFilter(validValues.includes(h) ? h : "All");
    };
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, [validValues.join("|")]);

  const update = (next: string) => {
    setFilter(next);
    if (next === "All") {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    } else {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${encodeURIComponent(next)}`);
    }
  };

  return [filter, update];
}
