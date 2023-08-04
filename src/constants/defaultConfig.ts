export const defaultStoreVersion = '1.0.0';
export const defaultDbVersion = '1.0.0';
export const defaultDbName = 'easyv_db';
export const defaultStoreName = 'easyv_store';

export type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'PATCH';

export interface DB {
  dbName: string;
  storeName: string;
  dbVersion: string;
  storeVersion: string;
}

export interface DeaultConfig {
  open: true;
  fetchFreeze: boolean;
  expiration: {
    maxEntries: number;
    overrideRetain: boolean;
  };
  db: DB;
  rules:
    | {
        statuses: [number, number];
        method: Method;
        filters: RegExp[] | RegExp;
      }
    | ((x: unknown) => boolean);
}

export const deaultConfig: DeaultConfig = {
  open: true,
  fetchFreeze: false, // 是否冻结window.fetch 防止被覆盖，默认false
  expiration: {
    maxEntries: 200, // 最多缓存X条数据
    overrideRetain: true, // 超限制后处理策略，true覆盖 false停止工作
  },
  db: {
    dbName: defaultDbName,
    dbVersion: defaultDbVersion,
    storeName: defaultStoreName,
    storeVersion: defaultStoreVersion,
  },
  rules: {
    statuses: [0, 200], // 缓存的状态码
    method: 'GET',
    filters: [/\/api\//],
  },
};
