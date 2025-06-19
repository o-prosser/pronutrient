import Navigator from "./components/navigator";
import ScanMeal from "./components/scan-meal";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const awaitedSearchParams = await searchParams;
  const currentDate = awaitedSearchParams.date
    ? new Date(awaitedSearchParams.date.toString())
    : new Date();

  return (
    <>
      {/* <!-- Secondary tab bar for date selection --> */}
      <Navigator searchParams={awaitedSearchParams} />

      <section className="pt-16">
        <div className="flex px-4 gap-2">
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
          <h2 className="text-lg font-semibold px-4 capitalize">{category}</h2>

          <div className="bg-zinc-50 border-y mt-1 border-zinc-200 px-4 text-xs font-medium py-1 flex justify-between gap-3">
            <span className="flex-1"></span>
            <span>Kcal</span>
            <span>Prot (g)</span>
          </div>

          <div className="divide-y divide-zinc-200 mx-4">
            <div className="flex py-2 items-center">
              <div className="flex-1 pr-8">
                <p className="line-clamp-1">
                  Graham's The Family Dairy Cottage Cheese Natural
                </p>
                <p className="text-zinc-400 text-sm">60g serving</p>
              </div>
              <span className="text-sm">62</span>
              <span className="text-sm w-14 text-right">7.2</span>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default DashboardPage;
