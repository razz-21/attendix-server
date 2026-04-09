export function getExpirationTimestamp(minutesFromNow: number): number {
  return Math.floor(Date.now() / 1000) + minutesFromNow * 60;
}