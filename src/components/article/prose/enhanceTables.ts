// Wrap each table in a scroll-safe container, then style for readability
// with a narrow first column and a wrapping body column.
export function enhanceTables(article: HTMLElement) {
  const tables = article.querySelectorAll("table");
  tables.forEach((table) => {
    const parent = table.parentElement;
    if (!parent || parent.classList.contains("table-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper overflow-x-auto my-6 border border-neutral-200 shadow-sm bg-white";
    parent.insertBefore(wrapper, table);
    wrapper.appendChild(table);

    table.className = "w-full border-collapse text-sm";

    // Walk every row so we can give the first column its own treatment
    // (compact, bold, no-wrap) and let the rest wrap naturally.
    const allRows = table.querySelectorAll("tr");
    allRows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      cells.forEach((cell, idx) => {
        const isFirst = idx === 0;
        if (cell.tagName === "TH") {
          cell.className = [
            "bg-brand-50 border-b-2 border-brand-200",
            "px-4 py-3 text-left align-top",
            "text-[11px] font-semibold uppercase tracking-wider text-neutral-900",
            isFirst ? "w-1/3 md:w-1/4" : "",
          ].join(" ");
        } else {
          cell.className = [
            "border-b border-neutral-100 px-4 py-3 align-top text-sm",
            "leading-relaxed break-words",
            isFirst ? "w-1/3 md:w-1/4 font-medium text-neutral-900" : "text-neutral-700",
          ].join(" ");
        }
      });
    });

    // Zebra striping, use a real Tailwind utility (the old bg-gray-25 didn't exist)
    const bodyRows = table.querySelectorAll("tbody tr");
    bodyRows.forEach((row, index) => {
      row.classList.add("hover:bg-brand-50/40");
      if (index % 2 === 1) {
        row.classList.add("bg-neutral-50/60");
      }
    });
  });
}
