export type ColorCount = {
  count: number;
  statuses: string[];
  color: string;
  umbrellaStatus: string;
};

export type GroupedResult = {
  stats: ColorCount[];
  max: number;
  total: number;
};
