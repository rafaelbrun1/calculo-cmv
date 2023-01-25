import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth].api";
import { LoginContainer, Button } from "./styles";

export default function Login() {
  const session = useSession();

  const isSignedIn = session.status === "authenticated";

  async function handleConnectGoogle() {
    await signIn("google");
  }

  if (isSignedIn) {
    console.log("certo");
  }

  return (
    <>
      <LoginContainer>
        <Button disabled={isSignedIn} onClick={handleConnectGoogle}>
          Entrar
        </Button>
      </LoginContainer>
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
