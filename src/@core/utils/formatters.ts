// TODO: Try to implement this: https://twitter.com/fireship_dev/status/1565424801216311297
export const kFormatter = (num: number) => {
  const regex = /\B(?=(\d{3})+(?!\d))/g

  return Math.abs(num) > 9999 ? `${Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1))}k` : Math.abs(num).toFixed(0).replace(regex, ',')
}
export function formatPhoneWithoutPrefix(phone: string): string {
  let cleaned = ('' + phone).replace(/\D/g, '');

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }

  return cleaned
}
