import db from "@/lib/db";
import Navigator from "./components/navigator";
import ScanMeal from "./components/scan-meal";
import { getSession } from "@/lib/auth";
import { InstallPrompt } from "./components/install-prompt";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const awaitedSearchParams = await searchParams;
  const currentDate = awaitedSearchParams.date
    ? new Date(awaitedSearchParams.date.toString())
    : new Date();

  const session = await getSession();
  if (!session) throw new Error("Unauthenticated");

  const records = await db.query.recordsTable.findMany({
    where: (fields, { eq, and }) =>
      and(eq(fields.date, currentDate), eq(fields.userId, session.user.id)),
  });

  const cookieStore = await cookies();
  const installPromptCookie = cookieStore.get("installPrompt");
  return (
    <>
      {installPromptCookie?.value ? "" : <InstallPrompt />}

      {/* <!-- Secondary tab bar for date selection --> */}
      <Navigator searchParams={awaitedSearchParams} />

      <section className="pt-16 md:pt-6 standalone:mt-header-inset">
        <div className="flex px-4 md:px-0 gap-2">
          <ScanMeal date={currentDate} />
          <input
            type="text"
            className="flex h-9 flex-1 min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs border-zinc-200 placeholder:text-zinc-700"
            placeholder="Search food"
          />
          <button className="border rounded-md text-sm inline-flex border-zinc-200 text-zinc-700 px-4 py-2 h-9 items-center justify-center shadow-xs">
            Add
          </button>
        </div>
      </section>

      {["breakfast", "lunch", "dinner", "snacks"].map((category, idx) => (
        <section className="pt-8" key={idx}>
          <h2 className="text-lg font-semibold px-4 md:px-0 capitalize">
            {category}
          </h2>

          <div className="bg-zinc-50 border-y md:border md:rounded-md mt-1 border-zinc-200 px-4 md:px-1 text-xs font-medium py-1 flex justify-between gap-3">
            <span className="flex-1"></span>
            <span>Kcal</span>
            <span>Prot (g)</span>
          </div>

          <div className="divide-y divide-zinc-200 mx-4 md:mx-0">
            {records
              .filter((record) => record.meal === category)
              .map((record, key) => (
                <div key={key} className="py-1">
                  <Button
                    variant="ghost"
                    className="items-center flex w-full py-1 md:px-1 justify-start text-left"
                    size={null}
                  >
                    <div className="flex-1 pr-8">
                      <p className="line-clamp-1">{record.name}</p>
                      <p className="text-zinc-400 text-sm">
                        {parseFloat(record.servings)} &times;{" "}
                        {parseFloat(record.servingSize)}g serving
                      </p>
                    </div>
                    <span className="text-sm">
                      {record.energy !== null
                        ? parseFloat(record.energy) *
                          parseFloat(record.servings || "1")
                        : ""}
                    </span>
                    <span className="text-sm w-14 text-right">
                      {record.protein !== null
                        ? parseFloat(record.protein) *
                          parseFloat(record.servings || "1")
                        : ""}
                    </span>
                  </Button>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default DashboardPage;
