"use server";

import { recordsTable } from "@/drizzle/schema/records";
import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  barcode: z.string(),
  imageUrl: z.string(),
  carbohydrates: z.string(),
  energy: z.string(),
  fat: z.string(),
  fiber: z.string(),
  protein: z.string(),
  salt: z.string(),
  sugars: z.string(),
  saturatedFat: z.string(),
  date: z.string(),
  name: z.string(),
  servingSize: z.string(),
  servings: z.string(),
  meal: z.string(),
});

export const addRecordAction = async (prevState: any, formData: FormData) => {
  const fields = schema.safeParse(Object.fromEntries(formData));

  console.log("Errors:", fields.error);
  console.log("Data:", fields.data);

  if (!fields.success) return { errors: fields.error.flatten().fieldErrors };

  const session = await getSession();
  if (!session) throw new Error("Unauthenticated");

  try {
    const insertData: typeof recordsTable.$inferInsert = {
      barcode: fields.data.barcode,
      name: fields.data.name,
      imageUrl: fields.data.imageUrl,
      servingSize: parseFloat(fields.data.servingSize).toString(),
      servings: parseFloat(fields.data.servings).toString(),
      carbohydrates: parseFloat(fields.data.carbohydrates).toString(),
      energy: parseFloat(fields.data.energy).toString(),
      fat: parseFloat(fields.data.fat).toString(),
      fiber: parseFloat(fields.data.fiber).toString(),
      protein: parseFloat(fields.data.protein).toString(),
      salt: parseFloat(fields.data.salt).toString(),
      sugars: parseFloat(fields.data.sugars).toString(),
      saturatedFat: parseFloat(fields.data.saturatedFat).toString(),
      date: new Date(fields.data.date),
      meal: fields.data.meal,
      userId: session.user.id,
    };

    const record = await db.insert(recordsTable).values(insertData);

    if (!record) throw new Error();
  } catch (error) {
    console.error(error);

    return {
      errors: {
        name: ["Error"],
      },
    };
  }

  redirect("/dashboard");
};

export const setInstallPromptAction = async () => {
  const cookieStore = await cookies();

  cookieStore.set("installPrompt", "shown");

  redirect("/dashboard");
};
