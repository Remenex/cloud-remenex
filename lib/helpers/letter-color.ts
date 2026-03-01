const letterColors: Record<string, string> = {
  A: "#FF6B6B", // coral red
  B: "#4D96FF", // bright blue
  C: "#6BCB77", // fresh green
  D: "#FFD93D", // warm yellow
  E: "#B983FF", // soft purple
  F: "#FF8FAB", // pink
  G: "#2EC4B6", // mint teal
  H: "#F77F00", // vivid orange
  I: "#4895EF", // sky blue
  J: "#9D4EDD", // vibrant violet
  K: "#43AA8B", // emerald teal
  L: "#F94144", // modern red
  M: "#277DA1", // deep blue
  N: "#90BE6D", // soft green
  O: "#FFAFCC", // pastel pink
  P: "#3A86FF", // strong blue
  Q: "#FF006E", // hot pink
  R: "#8338EC", // rich purple
  S: "#06D6A0", // aqua green
  T: "#FFBE0B", // golden yellow
  U: "#FB5607", // bright orange
  V: "#118AB2", // ocean blue
  W: "#8AC926", // lime green
  X: "#C77DFF", // light violet
  Y: "#4361EE", // indigo blue
  Z: "#495057", // modern dark gray
};

export function getColorForLetter(letter: string): string {
  const upper = letter.toUpperCase();
  return letterColors[upper];
}
