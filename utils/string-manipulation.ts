
export const capitalizeFirstWord = (val: string) => {
  return val
    .split(" ")
    .map((word) => word[0].toUpperCase().concat(word.substring(1, word.length)))
    .join(" ");
};
