export type Event = {
  after?: Record<string, any>;
  before?: Record<string, any>;
  data?: Record<string, any>;
  timestamp: Date;
  user: string;
};

export type EventValue = boolean | string | Array<string | boolean | object>;

export type EventDiffLine = {
  key: string;
  before: EventValue;
  after: EventValue;
};
