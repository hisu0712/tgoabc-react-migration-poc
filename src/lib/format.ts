export function formatBirthDateInput(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join("-");
}
