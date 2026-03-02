export const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  let i = 0;
  while (i < sizes.length - 1 && bytes >= k) {
    bytes = bytes / k;
    i++;
  }

  return `${parseFloat(bytes.toFixed(2))} ${sizes[i]}`;
};
