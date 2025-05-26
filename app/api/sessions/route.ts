import { cookies } from "next/headers";

export const DELETE = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("session_id");

  return Response.json({ message: "success" });
};
