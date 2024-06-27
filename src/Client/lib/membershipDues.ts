export const membershipDuesMmb = (amount: string): string => {
  const amountInCents = Number.parseFloat(amount) * 100;

  if (amountInCents >= 10000) {
    return 'LM';
  } else if (amountInCents >= 2500) {
    return 'P';
  } else if (amountInCents >= 1000) {
    return 'F';
  } else if (amountInCents >= 500) {
    return 'I';
  } else if (amountInCents >= 200) {
    return 'S';
  }
  return 'VOL';
}