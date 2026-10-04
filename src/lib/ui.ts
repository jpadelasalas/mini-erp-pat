export const LOW_STOCK = 10;

export const peso = (n: number) =>
  n.toLocaleString("en-PH", { style: "currency", currency: "PHP" });

export const compact = (n: number) =>
  n.toLocaleString("en-PH", { notation: "compact", maximumFractionDigits: 1 });

export const initials = (name: string) =>
  name
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const inputClass = (error?: string) =>
  `h-[42px] w-full rounded-[9px] border bg-white px-3 text-sm outline-none transition-colors focus:border-ink read-only:cursor-not-allowed read-only:bg-sheet read-only:font-mono ${
    error ? "border-[1.5px] border-neg" : "border-line"
  }`;
