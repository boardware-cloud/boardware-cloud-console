export function onEnter(
  callback: (e?: React.KeyboardEvent<HTMLDivElement>) => void
) {
  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      callback(event);
    }
  };
}
