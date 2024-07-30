export const parseFoodTypeFilter = (tags: any) => {
  //no tags set
  if ((tags || []).length === 0) return;

  const tagFilters = tags.map((tag: string) => ["in", tag, ["get", "FoodTag"]]);

  return ["any"].concat(tagFilters);
};
