import { getSession } from "@/lib/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session || !session.user) throw new Error();

  return (
    <>
      {session.user.firstName}
      {children}
    </>
  );
}


export default Layout;