function getDateRange(period) {
  const now = new Date();
  let start;
  switch (period) {
    case 'daily':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      const day = now.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start = new Date(now);
    start.setDate(now.getDate() + mondayOffset);
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