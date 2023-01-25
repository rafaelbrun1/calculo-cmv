import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth].api";

export default function Dashboard() {
  const session = useSession();

  if (session) {
    return <div>Hello {session.data?.user?.name}</div>;
  }

  return <div>Not logged in</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  return {
    props: {
      session,
    },
  };
};
