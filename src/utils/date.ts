export const getPreviousWednesday = (start: number = 0, add: number = 0) => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - start);

  const dayOfWeek = baseDate.getDay();
  let diff = dayOfWeek - 3;

  if (diff < 0) diff += 7;
  baseDate.setDate(baseDate.getDate() - Math.abs(diff) + add);

  return baseDate.toISOString().split("T")[0];
};
