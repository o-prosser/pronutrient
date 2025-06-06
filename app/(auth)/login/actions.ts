"use server";

import { createSession } from "@/lib/auth";
import { insertSession } from "@/models/session";
import { selectUserPassword } from "@/models/user";
import { isMatchingPassword } from "@/utils/auth";
import { addMonths } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(255),
});

export const loginAction = async (prevState: any, formData: FormData) => {
  const fields = schema.safeParse(Object.fromEntries(formData));

  if (!fields.success) {
    return {
      errors: fields.error.flatten().fieldErrors,
      returnedValues: {
        email: formData.get("email") as string,
      },
    };
  }

  try {
    const user = await selectUserPassword({
      email: fields.data.email,
    });
    if (!user) throw new Error();

    const correctPassword = await isMatchingPassword(
      fields.data.password,
      user.password,
    );
    if (!correctPassword) throw new Error();

    const session = await insertSession({
      userId: user.id,
      expiresAt: addMonths(new Date(), 1),
    });

    await createSession(session.id);
  } catch (error) {
    console.log(error)

    return {
      errors: {
        email: ["Incorrect email or password."],
      },
      returnedValues: {
        email: fields.data.email,
      },
    };
  }

  redirect("/dashboard");
};
