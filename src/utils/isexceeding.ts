// Additional utility function to check if value is greater than threshold
export const isExceeding = (
  value: number | undefined,
  thresholdValue: number | undefined,
) => {
  if (value == null || thresholdValue == null) return false;
  return value > thresholdValue;
};

// Additional utility function to check if value is less than threshold
export const isLessThan = (
  value: number | undefined,
  thresholdValue: number | undefined,
) => {
  if (value == null || thresholdValue == null) return false;
  return value < thresholdValue;
};
