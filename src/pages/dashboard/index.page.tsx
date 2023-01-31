import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authOptions } from "../api/auth/[...nextauth].api";
import { api } from "@/src/lib/axios";

const createRestaurantSchema = z.object({
  name: z.string(),
  address: z.string(),
  cnpj: z.string(),
});

type CreateRestaurantData = z.infer<typeof createRestaurantSchema>;

export default function Dashboard() {
  const session = useSession();
  const userId = session.data?.user?.id;

  const handleCreateRestaurant = (data: CreateRestaurantData) => {
    try {
      api
        .post("/dashboard/create-restaurant", {
          name: data.name,
          address: data.address,
          cnpj: data.cnpj,
          userId,
        })
        .then((res) => console.log(res));
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

  console.log(errors);

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

      <select name="restaurants">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>

      Agora você está no restaurant X
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  return {
    props: {
      session,
    },
  };
};
