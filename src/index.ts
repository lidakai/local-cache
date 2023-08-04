import { onMessage } from './modules/event';

import { watchFetch } from './modules/fetch';

import { updateConfig } from './modules/config';

export const onDataUpdate = onMessage;
export const watchInit = watchFetch;
export const hotUpdateConfig = updateConfig;
