import { format, subDays, addDays } from "date-fns";
import Link from "next/link";

const Navigator = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const currentDate = searchParams.date
    ? new Date(searchParams.date.toString())
    : new Date();

  return (
    <div className="fixed inset-x-0 top-16 standalone:top-[calc(4rem+var(--spacing-header-inset))] h-12 flex items-center justify-between border-b border-indigo-600/20 bg-indigo-50/50 backdrop-blur-md md:hidden">
      <Link
        href={`/dashboard?date=${format(
          subDays(currentDate, 1),
          "yyyy-MM-dd",
        )}`}
        className="flex items-center h-12 px-6 [&>svg]:h-5 [&>svg]:w-5"
      >
        <svg
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="rotate(0 0 0)"
        >
          <path
            d="M15.2335 5.21967C15.5263 5.51256 15.5263 5.98744 15.2335 6.28033L9.51379 12L15.2335 17.7197C15.5263 18.0126 15.5263 18.4874 15.2335 18.7803C14.9406 19.0732 14.4657 19.0732 14.1728 18.7803L7.92279 12.5303C7.6299 12.2374 7.6299 11.7626 7.92279 11.4697L14.1728 5.21967C14.4657 4.92678 14.9406 4.92678 15.2335 5.21967Z"
            fill="#343C54"
          />
        </svg>
      </Link>

      <span className="text-sm font-medium text-indigo-950">
        {format(currentDate, "EEEE, d LLLL")}
      </span>

      <Link
        href={`/dashboard?date=${format(
          addDays(currentDate, 1),
          "yyyy-MM-dd",
        )}`}
        className="flex items-center h-12 px-6 [&>svg]:h-5 [&>svg]:w-5"
      >
        <svg
          viewBox="0 0 25 24"
          className="rotate-180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="rotate(0 0 0)"
        >
          <path
            d="M15.2335 5.21967C15.5263 5.51256 15.5263 5.98744 15.2335 6.28033L9.51379 12L15.2335 17.7197C15.5263 18.0126 15.5263 18.4874 15.2335 18.7803C14.9406 19.0732 14.4657 19.0732 14.1728 18.7803L7.92279 12.5303C7.6299 12.2374 7.6299 11.7626 7.92279 11.4697L14.1728 5.21967C14.4657 4.92678 14.9406 4.92678 15.2335 5.21967Z"
            fill="#343C54"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Navigator;
