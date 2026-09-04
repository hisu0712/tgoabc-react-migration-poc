export function formatBirthDateInput(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  return [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)]
    .filter(Boolean)
    .join("-");
}

export function formatPhoneInput(raw: string) {
  const digits = toPhoneDigits(raw);

  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)]
    .filter(Boolean)
    .join("-");
}
export function toPhoneDigits(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 11);
}
