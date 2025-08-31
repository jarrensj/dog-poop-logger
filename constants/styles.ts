// Common CSS class patterns used throughout the app

export const buttonStyles = {
  primary: "bg-[var(--accent-green)] hover:bg-[var(--accent-green-hover)] text-[var(--background)] font-noto font-light transition-all duration-300 ease-out rounded-xl relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-[var(--accent-green)]/20 flex items-center justify-center gap-2 border-0",
  secondary: "text-lighter hover:text-[var(--foreground)] font-light transition-all duration-300 ease-out border-[1.5px] border-[var(--border-soft)] rounded-sketch bg-[var(--background)] hover:bg-[var(--accent-lighter)] relative hover:transform hover:translate-y-[-0.5px] hover:shadow-[0_2px_4px_var(--shadow-soft)]",
  danger: "bg-red-500 hover:bg-red-600 text-white font-noto font-light rounded-lg transition-all duration-300 ease-out border-0 relative hover:transform hover:translate-y-[-1px] hover:shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
};

export const inputStyles = {
  base: "border-[1.5px] border-[var(--border-soft)] rounded-sketch focus:outline-none focus:border-[var(--accent-green)] bg-[var(--background)] text-[var(--foreground)] font-light transition-colors duration-300"
};

export const containerStyles = {
  card: "bg-[var(--background)] sketch-border soft-shadow",
  cardWithPadding: "bg-[var(--background)] sketch-border soft-shadow p-6 sm:p-8 md:p-12",
  lightCard: "bg-[var(--accent-light)] sketch-border softer-shadow",
  modal: "fixed inset-0 bg-[var(--background)] bg-opacity-85 flex items-center justify-center z-50 p-4"
};

export const textStyles = {
  title: "font-zen font-light tracking-wide",
  body: "font-noto font-light",
  lighter: "text-lighter",
  lightest: "text-lightest"
};
