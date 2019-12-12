interface HeuristicParams {
  dx: number;
  dy: number;
}

export const Heuristic = {
  // Manhattan distance.
  manhattan: ({ dx, dy }: HeuristicParams): number => {
    return dx + dy;
  },
  // Euclidean distance.
  euclidean: ({ dx, dy }: HeuristicParams): number => {
    return Math.sqrt(dx * dx + dy * dy);
  },
  // Octile distance.
  octile: ({ dx, dy }: HeuristicParams): number => {
    const F = Math.SQRT2 - 1;
    return (dx < dy) ? F * dx + dy : F * dy + dx;
  },
  // Chebyshev distance.
  chebyshev: ({ dx, dy }: HeuristicParams): number => {
    return Math.max(dx, dy);
  }
};
