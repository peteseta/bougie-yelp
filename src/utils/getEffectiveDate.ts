/**
 * Returns the effective date for a post (modified date if it's newer, otherwise publication date)
 */
export default function getEffectiveDate(
  pubDatetime: string | Date,
  modDatetime: string | Date | undefined | null
): Date {
  if (modDatetime && new Date(modDatetime) > new Date(pubDatetime)) {
    return new Date(modDatetime);
  }
  return new Date(pubDatetime);
}
