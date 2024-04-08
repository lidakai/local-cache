/**
 * @description 事件
 * */
import EventEmitter from 'eventemitter3';
import { FetchOptions } from './fetch';
// 创建一个事件对象
const emitter = new EventEmitter();
const eventName = 'local-cache';
/**
 * @description 发送消息
 * */
export function sendMessage(data: DataType) {
  // 发送消息
  emitter.emit(eventName, data);
}

export function onMessage(callback: (data: DataType) => void, url: string) {
  // 接收消息
  callback &&
    emitter.on(eventName, (data: DataType) => {
      if (url && url === data.url) {
        callback?.(data);
      } else if (!url) {
        callback?.(data);
      }
    });
}

interface DataType {
  url: string;
  options: FetchOptions;
  result: unknown;
}
