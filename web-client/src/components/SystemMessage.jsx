export function SystemMessage({ message, children }) {
  const content = message?.content;

  if (!content) {
    return null;
  }

  return (
    <div className="flex justify-center py-1" role="status">
      <p className="max-w-[min(34rem,90%)] rounded-2xl bg-slate-700/70 px-3 py-2 text-center text-sm leading-5 text-slate-200">
        {content}
      </p>
    </div>
  );
}
