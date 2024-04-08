# local-cache

> ⚠️ 非 json 响应会异常

### 需求背景：
业务中需要用到 google workbox 来做数据资源本地缓存，但是需要支持http环境，你是知道的，workbox 是用 service woker 来做的劫持，但是 http 并不支持，需要另辟蹊径，因此做了这个产品，基础功能可以满足 http get 的缓存以及更新通知功能。


### default config
```
// export const defaultStoreVersion = '1.0.0';
// export const defaultDbVersion = '1.0.0';
// export const defaultDbName = 'easyv_db';
// export const defaultStoreName = 'easyv_store';

export const deaultConfig: DeaultConfig = {
  open: true, // 开关
  fetchFreeze: false, // 是否冻结window.fetch 防止被覆盖，默认false
  expiration: {
    maxEntries: 200, // 最多缓存X条数据
    overrideRetain: true, // 超限制后处理策略，true覆盖 false停止工作
  },
  db: {
    dbName: defaultDbName, // 本地数据库名字
    dbVersion: defaultDbVersion, // 本地数据库版本
    storeName: defaultStoreName, // 表名
    storeVersion: defaultStoreVersion, // 表版本
  },
  rules: {
    // 自定义规则
    statuses: [0, 200], // 缓存的状态码
    method: 'GET',
    filters: [/\/api\//],
  },
};

```


### 使用方式
```
import { watchInit } from '@lidakai/local-cache';

watchInit() // 创建监听



// 需要更新数据处
import { onDataUpdate } from "@lidakai/local-cache";
   /*
    *  url 就是 api 的 相对地址
    *  例如： https://www.baidu.com/user/info?id=123 =>  /user/info?id=123
    */
    onDataUpdate((data) => {
      if (data.result && data.url === url) {
        // 设置更新后的数据
        console.log(data.result)
      }
    });
```


### 示例
<img width="1216" alt="Snipaste_2024-04-08_11-07-09" src="https://github.com/lidakai/local-cache/assets/23355645/fec84ff2-2def-4ae8-beb7-eecd37df9d2b">




