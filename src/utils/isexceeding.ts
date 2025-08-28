export const isExceeding = (
  value: number | undefined,
  thresholdValue: number | undefined,
) => {
  if (value == null || thresholdValue == null) return false;
  return value > thresholdValue;
};
