/**
 * @description 事件
 * */
import EventEmitter from 'eventemitter3';
// 创建一个事件对象
const emitter = new EventEmitter();
const eventName = 'local-cache';
/**
 * @description 发送消息
 * */
export function sendMessage(data: unknown) {
  // 发送消息
  emitter.emit(eventName, data);
}

export function onMessage(callback: (data: unknown) => void) {
  // 接收消息
  callback &&
    emitter.on(eventName, (data: unknown) => {
      callback?.(data);
    });
}
