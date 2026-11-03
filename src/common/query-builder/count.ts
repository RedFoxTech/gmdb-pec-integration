export const queryCountBuilder = (query: string, key?: string) => {
  if (key) {
    return `SELECT COUNT(*) as count, COALESCE(MIN(${key}), 0) as min, COALESCE(MAX(${key}), 0) as max FROM (${query}) as count`;
  }
  return `SELECT COUNT(*) FROM (${query}) as count`;
};
