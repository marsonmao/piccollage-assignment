export function exhaustiveCheck({
  message,
}: {
  value: never;
  message: string;
}) {
  throw new Error(message);
}
