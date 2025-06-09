function getDateRange(period) {
  const now = new Date();
  let start;
  switch (period) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      const day = now.getDay(); // Sunday = 0
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Get Monday
      start = new Date(now.setDate(diff));
      start.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'all':
    default:
      return {};
  }
  return { $gte: start, $lte: now };
}

export {getDateRange}