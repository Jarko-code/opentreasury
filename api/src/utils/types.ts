export type Unpack<T> = {
    [K in keyof T]: Unpack<T[K]>;
};
