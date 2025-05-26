import { getSession } from "@/lib/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  return (
    <>
      {session.user.firstName}
      {children}
    </>
  );
}


export default Layout;