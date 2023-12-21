import { Key } from '#lib/types';

export const baseCacheKey: string = `scc.event`;

export const globalCacheKey: Key = `${baseCacheKey}:global` as Key;
export const globalBoostCacheKey: Key = `${globalCacheKey}:boost` as Key;

export const factionCacheKey: Key = `${baseCacheKey}:faction` as Key;
export const factionListCacheKey: Key = `${factionCacheKey}:list.message` as Key;

export const leaderboardCacheKey = (page: number): Key => `${baseCacheKey}:page:${page}` as Key;
export const levelDataCacheKey = (userId: string): Key => `${baseCacheKey}:leveling:${userId}` as Key;
