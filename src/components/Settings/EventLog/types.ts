export type EventValue =
  | boolean
  | string
  | object
  | Array<string | boolean | object>;

export type Event = {
  after?: Record<string, EventValue>;
  before?: Record<string, EventValue>;
  data?: Record<string, EventValue>;
  timestamp: Date;
  user: string;
};

export type EventDiffLine = {
  key: string;
  before: EventValue;
  after: EventValue;
};
