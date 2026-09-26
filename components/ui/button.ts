const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "bg-primary text-primary-foreground hover:opacity-90",
  secondary: "border border-border bg-card text-foreground hover:bg-primary-soft",
  ghost: "text-primary hover:bg-primary-soft",
};

export function buttonClass(variant: keyof typeof variants = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`.trim();
}
