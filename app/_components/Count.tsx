export function Count({
  className,
  prefix,
  count,
}: {
  className?: string;
  prefix: string;
  count: number;
}) {
  return (
    <div
      className={`text-center ${className}`}
    >{`[ ${prefix} = ${count} ]`}</div>
  );
}
