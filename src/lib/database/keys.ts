import { Key } from '#lib/types';

export const baseCacheKey = (): string => `scc.event`;

export const globalCacheKey = (): Key => `${baseCacheKey()}:global` as Key;
export const globalBoostCacheKey = (): Key => `${globalCacheKey()}:boost` as Key;
