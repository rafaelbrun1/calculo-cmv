import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/src/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const session = useSession();
  const userId = session.data?.user?.id;
  const [restaurantsList, setRestaurantsList] = useState<RestaurantObject>();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>();

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
    formState: { isSubmitting },
  } = useForm<CreateRestaurantData>({
    resolver: zodResolver(createRestaurantSchema),
  });

  async function goToRestaurant() {
    await router.push(`/${selectedRestaurant}/dashboard`);
  }

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
        <select
        defaultValue='default'
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option value='default' disabled>
            escolha um restaurante
          </option>
          {restaurantsList.restaurants.map((restaurant) => {
            return (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            );
          })}
        </select>
      ) : (
        <h1> você ainda não possui nenhum restaurante cadastrado </h1>
      )}

      <button onClick={goToRestaurant} disabled={!selectedRestaurant}>
        Ir para esse restaurante
      </button>
      <h1> {selectedRestaurant}</h1>
    </>
  );
}
