import { formatMessageDateSeparator } from "../utils/formatMessageDateSeparator";

export function MessageDateSeparator({ timestamp }) {
  let formattedDate = formatMessageDateSeparator(timestamp);

  return (
    <div className="flex justify-center">
      <span className="rounded-full app-chip px-4 py-2 text-xs font-semibold">
        {formattedDate}
      </span>
    </div>
  );
}
