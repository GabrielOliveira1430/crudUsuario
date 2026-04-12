import {redis} from '../config/redis';

const BLOCK_TIME = 60 * 10; // 10 min

// 🔥 KEYS
const IP_BLOCK = (ip: string) => `blocked:ip:${ip}`;
const USER_BLOCK = (id: number) => `blocked:user:${id}`;

const IP_WHITELIST = (ip: string) => `whitelist:ip:${ip}`;
const USER_WHITELIST = (id: number) => `whitelist:user:${id}`;

// 🚫 BLOQUEIO
export const blockIP = async (ip: string) => {
  const isWhite = await redis.get(IP_WHITELIST(ip));
  if (isWhite) return;

  await redis.set(IP_BLOCK(ip), '1', 'EX', BLOCK_TIME);
};

export const blockUser = async (userId: number) => {
  const isWhite = await redis.get(USER_WHITELIST(userId));
  if (isWhite) return;

  await redis.set(USER_BLOCK(userId), '1', 'EX', BLOCK_TIME);
};

// 🔍 VERIFICA BLOQUEIO
export const isBlocked = async (ip: string, userId?: number) => {
  if (await redis.get(IP_WHITELIST(ip))) return false;
  if (userId && (await redis.get(USER_WHITELIST(userId)))) return false;

  const ipBlocked = await redis.get(IP_BLOCK(ip));
  if (ipBlocked) return true;

  if (userId) {
    const userBlocked = await redis.get(USER_BLOCK(userId));
    if (userBlocked) return true;
  }

  return false;
};

// 🟢 WHITELIST
export const whitelistIP = async (ip: string) => {
  await redis.set(IP_WHITELIST(ip), '1');
};

export const whitelistUser = async (userId: number) => {
  await redis.set(USER_WHITELIST(userId), '1');
};

// 🔓 DESBLOQUEIO
export const unblockIP = async (ip: string) => {
  await redis.del(IP_BLOCK(ip));
};

export const unblockUser = async (userId: number) => {
  await redis.del(USER_BLOCK(userId));
};