export function exhaustiveCaseCheck({
  value,
  message,
}: {
  value: never;
  message?: string;
}) {
  throw new Error(
    message ??
      `${value} should be handled by corresponding "switch" statements`,
  );
}
