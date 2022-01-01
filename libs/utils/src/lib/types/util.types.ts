export type uuid = string;

export type AnyObject = Record<string | number, any>;

export type KeyValue<K = string, V = string> = {
  key: K;
  value: V;
};
