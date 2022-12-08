import { signOut, useSession } from "next-auth/react";

const T = () => {
  const { data: session, status } = useSession();
  console.log(session);
  const getRes = async () => {
    const res = await fetch("http://localhost:3000/api/hello");
    console.log(await res.text());
  };
  getRes();
  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {session?.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <a href="/api/auth/signin">Sign in</a>;
};

export default T;
