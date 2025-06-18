"use client";

import { useState, useEffect } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const ScanMeal = () => {
  const [data, setData] = useState("Scanning");
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="border rounded-md text-sm inline-flex border-zinc-200 text-zinc-700 px-4 py-2 h-9 items-center justify-center shadow-xs">
          Scan
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Scan barcode</DialogTitle>

        <BarcodeScanner
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) {
              // @ts-expect-error skfddpsknfdkf
              setData(result.text);
              // @ts-expect-error skfddpsknfdkf
              setBarcode(result.text);
            } else setData("Not Found");
          }}
          onError={(err) => {
            console.log(err);
            setData(err.toString());
          }}
        />

        {data}

        {barcode}

        {product && (
          <div style={{ marginTop: "20px" }}>
            <h3>{product.product_name}</h3>
            <p>Calories: {product.nutriments["energy-kcal"]} kcal</p>
            <p>Quantity: {product.quantity}</p>
            <img
              src={product.image_url}
              alt={product.product_name}
              width="150"
            />
          </div>
        )}

        {error}
      </DialogContent>
    </Dialog>
  );
};

export default ScanMeal;
