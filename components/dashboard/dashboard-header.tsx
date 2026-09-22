export function DashboardHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-4 sm:px-6">
      <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
      {action}
    </div>
  );
}
