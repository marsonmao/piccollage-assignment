export function MineCount({
  className,
  count,
}: {
  className?: string;
  count: number;
}) {
  return (
    <div className={`text-center ${className}`}>{`[ 💣 = ${count} ]`}</div>
  );
}
