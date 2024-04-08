# local-cache

> ⚠️ 非 json 响应会异常

### 需求背景：
业务中需要用到 google workbox 来做数据资源本地缓存，但是需要支持http环境，你是知道的，workbox 是用 service woker 来做的劫持，但是 http 并不支持，需要另辟蹊径，因此做了这个产品，基础功能可以满足 http get 的缓存以及更新通知功能。

