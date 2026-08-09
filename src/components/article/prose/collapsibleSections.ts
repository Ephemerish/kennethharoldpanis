// Adds a floating "collapse all" button, plus click-to-collapse on every
// h2/h3 in the article. Mirrors the section under each header until the
// next header of the same or higher level.
export function initCollapsibleSections(article: HTMLElement) {
  // Check if button already exists to prevent duplicates
  if (document.querySelector("[data-collapse-button]")) return;

  // Create collapse button with improved icons
  const collapseBtn = document.createElement("button");
  collapseBtn.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path>
    </svg>
  `;
  collapseBtn.className = "fixed top-20 right-2 sm:right-4 z-50 w-11 h-11 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200 hover:border-slate-300 shadow-lg flex items-center justify-center";
  collapseBtn.setAttribute("data-collapse-button", "true");

  // Create tooltip with improved wording
  const tooltip = document.createElement("div");
  tooltip.innerHTML = "Hide All Sections";
  tooltip.className = "fixed top-20 right-14 sm:right-16 z-50 bg-slate-800 text-white px-3 py-1.5 text-xs sm:text-sm font-medium shadow-lg opacity-0 pointer-events-none whitespace-nowrap";
  tooltip.setAttribute("data-collapse-tooltip", "true");

  // Add hover events for tooltip
  collapseBtn.addEventListener("mouseenter", () => {
    tooltip.style.opacity = "1";
    tooltip.style.transform = "translateX(-4px)";
  });

  collapseBtn.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateX(0)";
  });

  let sectionsCollapsed = false;

  function initializeCollapsible() {
    if (!article) return;

    const headers = article.querySelectorAll("h2, h3");

    headers.forEach((header) => {
      // Make the whole header read as a button: pointer cursor, hover wash,
      // visible chevron on the right that swaps icon with state.
      header.classList.add(
        "group",
        "relative",
        "cursor-pointer",
        "select-none",
        "pr-10",
        "hover:text-brand-700"
      );

      const indicator = document.createElement("span");
      indicator.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
        </svg>
      `;
      indicator.className = "absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 text-brand-500 group-hover:text-brand-700 group-hover:bg-brand-50 pointer-events-none";
      header.appendChild(indicator);

      // Find content until next header of same/higher level
      const contentElements: Element[] = [];
      let sibling = header.nextElementSibling;
      const headerLevel = parseInt(header.tagName.charAt(1));

      while (sibling) {
        const siblingLevel = sibling.tagName.match(/^H[1-6]$/)
          ? parseInt(sibling.tagName.charAt(1))
          : null;

        if (siblingLevel && siblingLevel <= headerLevel) {
          break;
        }

        contentElements.push(sibling);
        sibling = sibling.nextElementSibling;
      }

      if (contentElements.length > 0) {
        // Store original styles and add data attributes for tracking
        header.setAttribute("data-collapsible", "true");

        contentElements.forEach((el) => {
          el.setAttribute("data-section-content", header.tagName.toLowerCase() + "-" + Array.from(article.children).indexOf(header));
          el.setAttribute("data-original-display", window.getComputedStyle(el).display);
        });

        // Add click handler
        header.addEventListener("click", () => {
          const isCollapsed = header.getAttribute("data-collapsed") === "true";

          if (isCollapsed) {
            // Expand
            contentElements.forEach((el) => {
              (el as HTMLElement).style.display = el.getAttribute("data-original-display") || "block";
              (el as HTMLElement).style.opacity = "1";
              (el as HTMLElement).style.transform = "translateY(0)";
            });
            header.setAttribute("data-collapsed", "false");
            indicator.innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            `;
          } else {
            // Collapse
            contentElements.forEach((el) => {
              (el as HTMLElement).style.display = "none";
              (el as HTMLElement).style.opacity = "0";
              (el as HTMLElement).style.transform = "translateY(-10px)";
            });
            header.setAttribute("data-collapsed", "true");
            indicator.innerHTML = `
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
              </svg>
            `;
          }
        });
      }
    });
  }

  collapseBtn.addEventListener("click", () => {
    if (!article) return;

    const collapsibleHeaders = article.querySelectorAll('[data-collapsible="true"]');

    if (sectionsCollapsed) {
      // Expand all
      collapsibleHeaders.forEach((header) => {
        const indicator = header.querySelector("span");
        const sectionId = header.tagName.toLowerCase() + "-" + Array.from(article.children).indexOf(header);
        const contentElements = article.querySelectorAll('[data-section-content="' + sectionId + '"]');

        contentElements.forEach((el) => {
          (el as HTMLElement).style.display = el.getAttribute("data-original-display") || "block";
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "translateY(0)";
        });
        header.setAttribute("data-collapsed", "false");
        if (indicator) indicator.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
          </svg>
        `;
      });
      collapseBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"></path>
        </svg>
      `;
      tooltip.innerHTML = "Hide All Sections";
    } else {
      // Collapse all
      collapsibleHeaders.forEach((header) => {
        const indicator = header.querySelector("span");
        const sectionId = header.tagName.toLowerCase() + "-" + Array.from(article.children).indexOf(header);
        const contentElements = article.querySelectorAll('[data-section-content="' + sectionId + '"]');

        contentElements.forEach((el) => {
          (el as HTMLElement).style.display = "none";
          (el as HTMLElement).style.opacity = "0";
          (el as HTMLElement).style.transform = "translateY(-10px)";
        });
        header.setAttribute("data-collapsed", "true");
        if (indicator) indicator.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
          </svg>
        `;
      });
      collapseBtn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      `;
      tooltip.innerHTML = "Show All Sections";
    }

    sectionsCollapsed = !sectionsCollapsed;
  });

  // Clean up any existing buttons/tooltips before adding new ones
  const existingButton = document.querySelector("[data-collapse-button]");
  const existingTooltip = document.querySelector("[data-collapse-tooltip]");
  if (existingButton) existingButton.remove();
  if (existingTooltip) existingTooltip.remove();

  // Add floating button and tooltip to body
  document.body.appendChild(collapseBtn);
  document.body.appendChild(tooltip);

  // Initialize
  initializeCollapsible();
}
