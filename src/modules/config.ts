import { merge } from 'lodash-es';
import { deaultConfig, DeaultConfig } from '../constants/defaultConfig';

let config = {};

export function mergeConfig(config: Partial<DeaultConfig> = {}) {
  return merge(deaultConfig, config);
}

export function getConfig(): DeaultConfig {
  return config as DeaultConfig;
}

/**
 * 热插拔式更新
 * */
export function updateConfig(c: Partial<DeaultConfig> = {}) {
  config = merge(config, c);
}
