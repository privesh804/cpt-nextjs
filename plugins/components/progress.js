import plugin from "tailwindcss/plugin";

export default plugin(({ addComponents, theme }) => {
  // Base Progress Bar
  addComponents({
    ".progress": {
      width: "100%",
      display: "flex",
      "min-height": "4px",
      overflow: "hidden",
      "background-color": "#00000014", // Primary (empty background)
      "border-radius": theme("custom.components.common.borderRadius.progress"),
    },
    ".progress-bar": {
      display: "flex",
      "flex-direction": "column",
      "justify-content": "center",
      overflow: "hidden",
      "text-align": "center",
      "white-space": "nowrap",
      "border-radius": theme("custom.components.common.borderRadius.progress"),
    },
  });

  // Define Custom Colors for Progress Bars
  addComponents({
    ".progress-secondary": {
      "background-color": "#00000014", // Keep background primary
      ".progress-bar": {
        "background-color": "#4CAD6D", // Secondary (main progress color)
      },
    },
    ".progress-truncate": {
      "background-color": "#00000014", // Keep background primary
      ".progress-bar": {
        "background-color": "#71D467", // Truncate (lighter progress color)
      },
    },
  });
});
