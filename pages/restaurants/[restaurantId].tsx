import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Card, Loader, Title, Container, Text, Badge } from "@mantine/core";
import { ErrorCard, AllImages } from "@/components";
import { getRestaurantById } from "@/utils";
import { GetRestaurant, GetRestaurantError } from "@/utils/types";

export const RestaurantProduct: React.FC = () => {
  const router = useRouter();
  const restaurant = router.query.restaurantId;
  const restaurantId = restaurant as string;
  const getRestaurant = useQuery(
    ["getRestaurantById", restaurantId],
    () => getRestaurantById(restaurantId),
    {
      enabled: restaurantId ? true : false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (getRestaurant.isLoading) return <Loader />;
  if (getRestaurant.isError)
    return <ErrorCard message="something went wrong please try again" />;
  const data = getRestaurant.data;
  if (data.hasOwnProperty("apiErrors")) {
    const errors = data as GetRestaurantError;
    if (errors.apiErrors?.validationErrors)
      return (
        <ErrorCard
          arrayOfErrors={errors.apiErrors?.validationErrors.restaurantId}
        />
      );
    if (errors.apiErrors?.generalError)
      <ErrorCard arrayOfErrors={errors.apiErrors?.generalError} />;
  }
  // it is safe to assume we have the restaurant data
  const restaurantData = data as GetRestaurant;
  return (
    <Container size="xl">
      <Card shadow="sm" radius="md" withBorder>
        <AllImages listImageUrls={restaurantData.imageUrl} />
        <Title>{restaurantData.restaurantName}</Title>
        <Text>{`adress: ${restaurantData.street}, ${restaurantData.city}, ${restaurantData.state}, ${restaurantData.zipcode}`}</Text>
        <Text>{`description: ${restaurantData.description}`}</Text>
        {restaurantData.FoodTag.map((tag) => (
          <Badge>{tag}</Badge>
        ))}
      </Card>
    </Container>
  );
};

export default RestaurantProduct;
