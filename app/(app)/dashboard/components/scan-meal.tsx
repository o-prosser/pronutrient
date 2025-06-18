"use client"

import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";
import {Dialog, DialogTrigger, DialogContent, DialogTitle} from '@/components/ui/dialog'

const ScanMeal = () => {
  const [data, setData] = useState("Scanning")

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
            // @ts-expect-error skfddpsknfdkf
            if (result) setData(result.text);
            else setData("Not Found");
          }}
          onError={(err) => {
            console.log(err)
            setData(err.toString())
          }}
        />

        {data}
      </DialogContent>
    </Dialog>
  );
};

export default ScanMeal;
