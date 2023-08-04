/**
 * @description indexdDB本地存储
 * @link https://www.npmjs.com/package/idb-keyval
 * 第三方库 npm i idb-keyval
 * */
import {
  get,
  set,
  createStore,
  keys,
  UseStore,
  del,
  delMany,
} from 'idb-keyval';
import {
  defaultStoreVersion,
  defaultDbVersion,
  defaultStoreName,
  defaultDbName,
  DB,
  DeaultConfig,
} from '@/constants/index';

let customStore: UseStore | undefined;

export function setCustomStore(config: DeaultConfig) {
  const { db = {} } = config;
  const {
    storeVersion = defaultStoreVersion,
    dbVersion = defaultDbVersion,
    storeName = defaultStoreName,
    dbName = defaultDbName,
  } = db as DB;
  customStore = createStore(
    `${dbName}_${dbVersion}`,
    `${storeName}_${storeVersion}`,
  );
}

/**
 * @description 判断键是否存在
 * @param {string} key
 * */
async function hasKey(key: string) {
  const value = await get(key, customStore);
  return value !== undefined;
}

/**
 * @description api数据写入本地
 * @param  {string} key
 * @param  {unknown} value
 * */
export async function setApiRes(key: string, value: unknown): Promise<void> {
  // if (checkMaxLength()) {
  // }
  const isHasKey = await hasKey(key);
  if (isHasKey) {
    // 当前存在
    await del(key, customStore);
    await set(key, value, customStore);
    // console.info(`${key} 更新完毕`);
  } else {
    await set(key, value, customStore);
    // console.info(`${key} 初次写入完毕`);
  }
}

/**
 * @description 读取本地数据
 * @param  {string} key
 * @returns {unknown}
 * */
export async function getApiRes(key: string): Promise<unknown> {
  const result = await get(key, customStore);
  return result;
}

/**
 * @description getKeys
 * */
export function getKeys(): Promise<string[]> {
  return keys(customStore);
}

/**
 * @description 删除指定条数
 * */
export async function deleteMany(keys: string[]) {
  await delMany(keys, customStore);
}
