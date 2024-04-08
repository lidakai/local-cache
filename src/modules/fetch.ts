import { head, isFunction, last, sortBy } from 'lodash-es';
import { DeaultConfig, Method } from '../constants/defaultConfig';
import { getConfig, mergeConfig, updateConfig } from './config';
import {
  deleteMany,
  getApiRes,
  getKeys,
  setApiRes,
  setCustomStore,
} from './storage';
import { sendMessage } from './event';

type FetchHandler = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type BodyInit = ArrayBuffer | Blob | string;

export interface FetchOptions extends RequestInit {
  body?: BodyInit;
}

const originFetch = window.fetch;
/**
 * @description 创建proxy
 * */
function createFetchProxy(): FetchHandler {
  const proxy = new Proxy(window, {
    get(target, prop) {
      if (prop === 'fetch') {
        return async (url: RequestInfo, init: FetchOptions) => {
          const config = getConfig();
          const { open } = config;
          if (typeof url === 'string' && open) {
            const dbResult = await getApiRes(url);
            if (dbResult) {
              // 本地数据存在，先返回
              const mockResponse = new Response(JSON.stringify(dbResult), {
                status: 200,
                headers: { 'Content-type': 'application/json' },
              });
              // 使用 Promise.resolve 包装响应以模拟异步请求
              const mockFetchPromise = Promise.resolve(mockResponse);

              // 服务端更新
              updateCache({ url, init }).then(async res => {
                const result = await getResult(res);
                // 更新通知
                sendMessage({ url, options: init, result });
              });
              return mockFetchPromise;
            }
            // 服务端请求
            return updateCache({ url, init });
          }
          return originFetch(url, init);
        };
      }

      return target[prop as unknown as number];
    },
  });

  return proxy.fetch;
}

/**
 * @description main
 * */
export function watchFetch(config: Partial<DeaultConfig> = {}): void {
  const c = mergeConfig(config);
  updateConfig(c); // config 更新
  setCustomStore(c); // 初始化并冻结config
  const fetchProxy = createFetchProxy();
  window.fetch = fetchProxy;
  const { fetchFreeze } = c;
  fetchFreeze && Object.freeze(window.fetch); // 冻结fetch 防止被覆盖
}

/**
 * @description get response
 * */
async function getResult(res: Response): Promise<unknown> {
  return await res.json().then(res => res);
}

/**
 * @description 更新缓存
 * @param url string
 * @param init 参数
 * @returns Response
 * */
async function updateCache({
  url,
  init = {},
}: {
  url: RequestInfo;
  init: FetchOptions;
}) {
  const res = await originFetch(url, init);
  const cloneRes = res.clone();
  const { method = 'GET' } = init;
  const isSet = checkRules({
    method,
    url,
    status: cloneRes.status,
  });
  if (isSet) {
    // 处理api
    const result = await getResult(cloneRes);
    await setResult(url as string, result);
  }
  return res;
}

function checkRules({
  method,
  url,
  status,
}: {
  method: string;
  url: RequestInfo;
  status: number;
}) {
  const config = getConfig();
  const { rules } = config;
  if (isFunction(rules)) {
    return rules?.({ method, url, status });
  } else {
    const {
      statuses = [],
      method: methodRule,
      filters,
    } = rules as {
      statuses: [number, number];
      method: Method;
      filters: RegExp | RegExp[];
    };

    let isFilterResult = false;
    if (filters) {
      const newFilters = Array.isArray(filters) ? filters : [filters];
      isFilterResult = newFilters.some(f => f.test(url as string));
    }

    let isStatusResult = false;
    if (Array.isArray(statuses)) {
      const statusesSort = sortBy(statuses);
      const firstStatus = head(statusesSort) as number;
      const lastStatus = last(statusesSort) as number;

      if (statusesSort.length) {
        isStatusResult = status >= firstStatus && status <= lastStatus;
      }
    } else {
      // 不是数组，不校验
      isStatusResult = true;
    }

    if (method === methodRule && isFilterResult && isStatusResult) {
      return true;
    }
  }

  return false;
}

// 写入管道
async function setResult(key: string, value: unknown) {
  const { expiration } = getConfig();
  const { maxEntries, overrideRetain } = expiration;
  const keys = await getKeys();
  if (keys.length >= maxEntries) {
    if (overrideRetain) {
      // 覆盖
      const difference = keys.length - maxEntries;
      const splcedKeys = keys.filter((d, i) => i <= difference);
      await deleteMany(splcedKeys);
      await setApiRes(key, value);
    }
  } else {
    await setApiRes(key, value);
  }
}
