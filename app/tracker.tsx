"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Camera,
  Scan,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

interface DayData {
  date: string;
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snacks: FoodItem[];
  drinks: FoodItem[];
}

const BarcodeScanner = ({
  onScanSuccess,
}: {
  onScanSuccess: (barcode: string) => void;
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setScanError("");

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // In a real implementation, you would use a barcode scanning library here
      // For demo purposes, we'll simulate scanning after 3 seconds
      setTimeout(() => {
        // Simulate successful scan with a mock barcode
        const mockBarcode = "123456789012";
        onScanSuccess(mockBarcode);
        setIsScanning(false);

        // Stop camera stream
        stream.getTracks().forEach((track) => track.stop());
      }, 3000);
    } catch (error) {
      console.log(error)
      setScanError("Camera access denied or not available");
      setIsScanning(false);
    }
  };

  const handleManualBarcode = () => {
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
      setManualBarcode("");
    }
  };

  return (
    <div className="space-y-4 py-4">
      {!isScanning ? (
        <>
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <Scan className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">Scan Product Barcode</h3>
              <p className="text-sm text-muted-foreground">
                Point your camera at the product barcode
              </p>
            </div>
            <Button onClick={startScanning} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manual-barcode">Enter Barcode Manually</Label>
            <div className="flex gap-2">
              <Input
                id="manual-barcode"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                placeholder="Enter barcode number"
              />
              <Button onClick={handleManualBarcode} variant="outline">
                Lookup
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 bg-black rounded-lg flex items-center justify-center">
            <div className="w-24 h-24 border-2 border-white rounded animate-pulse">
              <div className="w-full h-full flex items-center justify-center">
                <Scan className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Scanning...</h3>
            <p className="text-sm text-muted-foreground">
              Position the barcode within the frame
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsScanning(false)}>
            Cancel
          </Button>
        </div>
      )}

      {scanError && (
        <div className="text-sm text-red-600 text-center">{scanError}</div>
      )}
    </div>
  );
};

export default function Component() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get date from URL or use today's date
  const getDateFromUrl = () => {
    const dateParam = searchParams.get("date");
    if (dateParam) {
      const date = new Date(dateParam);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState<Date>(getDateFromUrl);
  const [dayData, setDayData] = useState<DayData>({
    date: currentDate.toISOString().split("T")[0],
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    drinks: [],
  });

  const [selectedMeal, setSelectedMeal] =
    useState<keyof Omit<DayData, "date">>("breakfast");
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    quantity: "1",
    unit: "serving",
  });

  const [, setIsLoadingProduct] = useState(false);
  const [, setScanError] = useState("");

  // Update date when URL changes
  useEffect(() => {
    const urlDate = getDateFromUrl();
    const urlDateString = urlDate.toISOString().split("T")[0];
    const currentDateString = currentDate.toISOString().split("T")[0];

    if (urlDateString !== currentDateString) {
      setCurrentDate(urlDate);
      setDayData({
        date: urlDateString,
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
        drinks: [],
      });
    }
  }, [searchParams]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    const dateString = newDate.toISOString().split("T")[0];
    router.push(`?date=${dateString}`);
  };

  const addFood = () => {
    if (!newFood.name || !newFood.calories) return;

    const foodItem: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: Number.parseFloat(newFood.calories) || 0,
      protein: Number.parseFloat(newFood.protein) || 0,
      carbs: Number.parseFloat(newFood.carbs) || 0,
      fat: Number.parseFloat(newFood.fat) || 0,
      quantity: Number.parseFloat(newFood.quantity) || 1,
      unit: newFood.unit,
    };

    setDayData((prev) => ({
      ...prev,
      [selectedMeal]: [...prev[selectedMeal], foodItem],
    }));

    // Reset form but don't close dialog automatically
    setNewFood({
      name: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      quantity: "1",
      unit: "serving",
    });
  };

  const removeFood = (
    mealType: keyof Omit<DayData, "date">,
    foodId: string,
  ) => {
    setDayData((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((food) => food.id !== foodId),
    }));
  };

  const calculateMealTotals = (foods: FoodItem[]) => {
    return foods.reduce(
      (totals, food) => ({
        calories: totals.calories + food.calories * food.quantity,
        protein: totals.protein + food.protein * food.quantity,
        carbs: totals.carbs + food.carbs * food.quantity,
        fat: totals.fat + food.fat * food.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  };

  const calculateDayTotals = () => {
    const allMeals = [
      ...dayData.breakfast,
      ...dayData.lunch,
      ...dayData.dinner,
      ...dayData.snacks,
      ...dayData.drinks,
    ];
    return calculateMealTotals(allMeals);
  };

  const dayTotals = calculateDayTotals();

  const handleBarcodeSuccess = async (barcode: string) => {
    setIsLoadingProduct(true);
    setScanError("");

    try {
      // Mock API call - replace with actual food database API
      const productData = await fetchProductByBarcode(barcode);

      if (productData) {
        setNewFood({
          name: productData.name,
          calories: productData.calories.toString(),
          protein: productData.protein.toString(),
          carbs: productData.carbs.toString(),
          fat: productData.fat.toString(),
          quantity: "1",
          unit: "serving",
        });
      } else {
        setScanError("Product not found. Please try manual entry.");
      }
    } catch (error) {
      console.log(error);
      setScanError("Failed to fetch product data. Please try again.");
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const fetchProductByBarcode = async (barcode: string): Promise<any> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock product database - replace with actual API call
    const mockProducts: Record<string, any> = {
      "123456789012": {
        name: "Organic Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        fat: 0.4,
      },
      "987654321098": {
        name: "Greek Yogurt",
        calories: 130,
        protein: 15,
        carbs: 9,
        fat: 5,
      },
      "456789123456": {
        name: "Whole Wheat Bread",
        calories: 80,
        protein: 4,
        carbs: 14,
        fat: 1,
      },
    };

    return mockProducts[barcode] || null;
  };

  const MealCard = ({
    title,
    mealType,
    foods,
  }: {
    title: string;
    mealType: keyof Omit<DayData, "date">;
    foods: FoodItem[];
  }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const mealTotals = calculateMealTotals(foods);

    const handleOpenDialog = () => {
      setSelectedMeal(mealType);
      setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setIsDialogOpen(false);
      // Reset form when closing
      setNewFood({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        quantity: "1",
        unit: "serving",
      });
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleOpenDialog}>
                <Plus className="h-4 w-4 mr-1" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Food to {title}</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="barcode">Scan Barcode</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="food-name">Food Name</Label>
                      <Input
                        id="food-name"
                        value={newFood.name}
                        onChange={(e) =>
                          setNewFood((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="e.g., Chicken breast"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newFood.quantity}
                          onChange={(e) =>
                            setNewFood((prev) => ({
                              ...prev,
                              quantity: e.target.value,
                            }))
                          }
                          placeholder="1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Select
                          value={newFood.unit}
                          onValueChange={(value) =>
                            setNewFood((prev) => ({ ...prev, unit: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="serving">serving</SelectItem>
                            <SelectItem value="cup">cup</SelectItem>
                            <SelectItem value="oz">oz</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="piece">piece</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="calories">Calories</Label>
                        <Input
                          id="calories"
                          type="number"
                          value={newFood.calories}
                          onChange={(e) =>
                            setNewFood((prev) => ({
                              ...prev,
                              calories: e.target.value,
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input
                          id="protein"
                          type="number"
                          value={newFood.protein}
                          onChange={(e) =>
                            setNewFood((prev) => ({
                              ...prev,
                              protein: e.target.value,
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input
                          id="carbs"
                          type="number"
                          value={newFood.carbs}
                          onChange={(e) =>
                            setNewFood((prev) => ({
                              ...prev,
                              carbs: e.target.value,
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input
                          id="fat"
                          type="number"
                          value={newFood.fat}
                          onChange={(e) =>
                            setNewFood((prev) => ({
                              ...prev,
                              fat: e.target.value,
                            }))
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        addFood();
                        handleCloseDialog();
                      }}
                      className="w-full"
                    >
                      Add Food
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="barcode" className="space-y-4">
                  <BarcodeScanner onScanSuccess={handleBarcodeSuccess} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {foods.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No foods added yet
              </p>
            ) : (
              foods.map((food) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {food.quantity} {food.unit} •{" "}
                      {Math.round(food.calories * food.quantity)} cal
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFood(mealType, food.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
            {foods.length > 0 && (
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total:</span>
                  <span>{Math.round(mealTotals.calories)} cal</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>P: {Math.round(mealTotals.protein)}g</span>
                  <span>C: {Math.round(mealTotals.carbs)}g</span>
                  <span>F: {Math.round(mealTotals.fat)}g</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calorie Tracker</h1>
          <p className="text-muted-foreground">{formatDate(currentDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDay("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDay("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Daily Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.round(dayTotals.calories)}
              </div>
              <div className="text-sm text-muted-foreground">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(dayTotals.protein)}g
              </div>
              <div className="text-sm text-muted-foreground">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(dayTotals.carbs)}g
              </div>
              <div className="text-sm text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(dayTotals.fat)}g
              </div>
              <div className="text-sm text-muted-foreground">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MealCard
          title="Breakfast"
          mealType="breakfast"
          foods={dayData.breakfast}
        />
        <MealCard title="Lunch" mealType="lunch" foods={dayData.lunch} />
        <MealCard title="Dinner" mealType="dinner" foods={dayData.dinner} />
        <MealCard title="Snacks" mealType="snacks" foods={dayData.snacks} />
        <MealCard title="Drinks" mealType="drinks" foods={dayData.drinks} />
      </div>
    </div>
  );
}
