export function Avatar({ label, gradient = "avatar-primary", online = false, size = "md" }) {
  const sizes = {
    sm: "size-9 text-xs",
    md: "size-11 text-sm",
    lg: "size-14 text-base",
  };

  return (
    <div className="relative shrink-0">
      <div
        className={`${sizes[size]} grid place-items-center rounded-xl ${gradient} font-bold shadow-lg`}
        style={{ color: "var(--avatar-text)", boxShadow: "var(--shadow-tight)" }}
      >
        {label}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 app-online-dot" />
      )}
    </div>
  );
}
