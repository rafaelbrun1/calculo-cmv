import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authOptions } from "../api/auth/[...nextauth].api";
import { api } from "@/src/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface RestaurantProps {
  id: string;
  name: String;
}
interface RestaurantObject {
  restaurants: RestaurantProps[];
}
const createRestaurantSchema = z.object({
  name: z.string(),
  address: z.string(),
  cnpj: z.string(),
});

type CreateRestaurantData = z.infer<typeof createRestaurantSchema>;

export default function Dashboard() {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [restaurantsList, setRestaurantsList] = useState<RestaurantObject>();

  const { data: restaurants } = useQuery<RestaurantObject>(
    ["restaurants"],
    async () => {
      const response = await api.get("/dashboard/get-all-restaurants");
      setRestaurantsList(response.data);
      return response.data;
    }
  );

  const handleCreateRestaurant = (data: CreateRestaurantData) => {
    try {
      api
        .post("/dashboard/create-restaurant", {
          name: data.name,
          address: data.address,
          cnpj: data.cnpj,
          userId,
        })
        .then((res) =>
          setRestaurantsList((prev) => ({
            ...prev,
            restaurants: [
              ...prev!.restaurants,
              {
                id: res.data.createRestaraunt.id,
                name: res.data.createRestaraunt.name,
              },
            ],
          }))
        );
    } catch (error) {
      console.log(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateRestaurantData>({
    resolver: zodResolver(createRestaurantSchema),
  });

  console.log(restaurants);

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateRestaurant)}>
        <input
          type="text"
          {...register("name")}
          placeholder="Nome do restaurante"
        />
        <input type="text" {...register("address")} placeholder="Endereço" />
        <input type="text" {...register("cnpj")} placeholder="CNPJ" />

        <button type="submit" disabled={isSubmitting}>
          criar
        </button>
      </form>

      {restaurantsList !== undefined &&
      restaurantsList.restaurants.length > 0 ? (
        <select name="restaurants">
          {restaurantsList.restaurants.map((restaurant) => {
            return (
              <option key={restaurant.id}>
                {restaurant.name}
              </option>
            );
          })}
        </select>
      ) : (
        <h1> você ainda não possui nenhum restaurante cadastrado </h1>
      )}
    </>
  );
}

/* export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  return {
    props: {
      session,
    },
  };
}; */
