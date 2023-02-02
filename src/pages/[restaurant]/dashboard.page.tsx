import { prisma } from "@/src/lib/prisma";
import { GetStaticPaths, GetStaticProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth].api";

interface RestaurantProps {
  restaurant: {
    id: string;
    name: string;
    restaurant_owner: {
      userId: string;
    };
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default function Dashboard({ restaurant }: RestaurantProps) {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (status === "loading") {
    return "loading";
  }

  if (restaurant.restaurant_owner.userId !== data?.user.id) {
    return <h1>Muito diferente fi</h1>;
  }

  return <h1>Você está logado no restaurante {restaurant.name}</h1>;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const restaurant_id = String(params?.restaurant);

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurant_id,
    },
  });

  const restaurant_owner = await prisma.restaurant.findUnique({
    where: {
      id: restaurant_id,
    },
    select: {
      userId: true,
    },
  });

  if (!restaurant) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      restaurant: {
        id: restaurant?.id || null,
        name: restaurant?.name || null,
        restaurant_owner,
      },
    },
    revalidate: 60 * 60 * 24,
  };
};
