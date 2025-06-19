"use client";

import { useState, useEffect, useActionState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { addRecordAction } from "../actions";

const initialState = {
  errors: {
    barcode: [""],
    imageUrl: [""],
    carbohydrates: [""],
    energy: [""],
    fat: [""],
    fiber: [""],
    protein: [""],
    salt: [""],
    sugars: [""],
    saturatedFat: [""],
    date: [""],
    name: [""],
    servingSize: [""],
    servigs: [""],
    meal: [""],
  },
};

const ScanMeal = ({ date }: { date: Date }) => {
  const [barcode, setBarcode] = useState("");
  const [error, setError] = useState("");
  const [product, setProduct] = useState<null | {
    product_name: string;
    serving_quantity: string;
    image_url: string;
    nutriments: {
      carbohydrates: number;
      "energy-kcal": number;
      fat_serving: number;
      fiber_serving: number;
      proteins_serving: number;
      salt_serving: number;
      sugars_serving: number;
      "saturated-fat_serving": number;
    };
  }>(null);

  useEffect(() => {
    if (!barcode) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
        );
        const data = await response.json();

        if (data.status === 1) {
          setProduct(data.product);
          setError("");
        } else {
          setProduct(null);
          setError("Product not found.");
        }
      } catch (err) {
        setError("Error fetching product data.");
        console.error(err);
      }
    };

    fetchProduct();
  }, [barcode]);

  const [state, formAction] = useActionState(addRecordAction, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="border rounded-md text-sm inline-flex border-zinc-200 text-zinc-700 px-4 py-2 h-9 items-center justify-center shadow-xs">
          Scan
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Scan barcode</DialogTitle>

        {barcode !== undefined && barcode !== "" && product ? (
          <form action={formAction}>
            <input type="hidden" name="barcode" defaultValue={barcode} />
            <input
              type="hidden"
              name="imageUrl"
              defaultValue={product.image_url}
            />
            <input
              type="hidden"
              name="carbohydrates"
              defaultValue={product.nutriments.carbohydrates}
            />
            <input
              type="hidden"
              name="energy"
              defaultValue={product.nutriments["energy-kcal"]}
            />
            <input
              type="hidden"
              name="fat"
              defaultValue={product.nutriments.fat_serving}
            />
            <input
              type="hidden"
              name="fiber"
              defaultValue={product.nutriments.fiber_serving}
            />
            <input
              type="hidden"
              name="protein"
              defaultValue={product.nutriments.proteins_serving}
            />
            <input
              type="hidden"
              name="salt"
              defaultValue={product.nutriments.salt_serving}
            />
            <input
              type="hidden"
              name="sugars"
              defaultValue={product.nutriments.sugars_serving}
            />
            <input
              type="hidden"
              name="saturatedFat"
              defaultValue={product.nutriments["saturated-fat_serving"]}
            />
            <input
              type="hidden"
              name="date"
              defaultValue={format(date, "yyyy-MM-dd")}
            />

            <Label htmlFor="name" className="mb-1">
              Name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              required
              defaultValue={product.product_name}
              className="mb-6"
            />

            <Label htmlFor="servingSize" className="mb-1">
              Serving size (g)
            </Label>
            <Input
              type="text"
              id="servingSize"
              disabled
              defaultValue={product.serving_quantity + "(g)"}
              className="mb-6"
            />
            <input
              type="hidden"
              name="servingSize"
              defaultValue={product.serving_quantity}
            />

            <Label htmlFor="servings" className="mb-1">
              Servings
            </Label>
            <Input
              type="text"
              name="servings"
              id="servings"
              required
              defaultValue="1"
              className="mb-6"
            />

            <Label htmlFor="meal" className="mb-1">
              Meal
            </Label>
            <Select name="meal" required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select meal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Add meal</Button>
          </form>
        ) : (
          <BarcodeScanner
            width={500}
            height={500}
            onUpdate={(err, result) => {
              if (result) {
                setBarcode(result.getText());
              } else setBarcode("");
            }}
            onError={(err) => {
              console.log(err);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScanMeal;
