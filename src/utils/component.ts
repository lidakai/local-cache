import { isObject, isArrayBuffer } from 'lodash-es';

// json to arraybuffer
export function jsonToArraybuffer(data: unknown) {
  if (isObject(data)) {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const arrayBuffer = encoder.encode(jsonString).buffer;
    return arrayBuffer;
  }
  return data;
}

// arraybuffer to json
export function arraybufferToJSON(arrayBuffer: ArrayBuffer) {
  if (isArrayBuffer(arrayBuffer)) {
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(arrayBuffer);
    const data = JSON.parse(jsonString);
    return data;
  }
  return '';
}
