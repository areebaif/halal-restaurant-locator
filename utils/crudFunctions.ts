export const postAddFoodTag = async (data: { foodTag: string }) => {
  const { foodTag } = data;
  const response = await fetch(`/api/restaurant/add-tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ foodTag: foodTag }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const res = await response.json();
  return res;
};
