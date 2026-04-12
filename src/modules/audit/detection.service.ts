import {redis} from '../../shared/config/redis';

const WINDOW = 60; // segundos

export const detectSuspiciousActivity = async (data: {
  userId?: number;
  action: string;
  ip: string;
}) => {
  const { userId, action, ip } = data;

  const keyBase = userId ? `user:${userId}` : `ip:${ip}`;

  // 🔥 contador geral
  const activityKey = `${keyBase}:activity`;
  const total = await redis.incr(activityKey);
  if (total === 1) {
    await redis.expire(activityKey, WINDOW);
  }

  // 🔥 contador de DELETE
  const deleteKey = `${keyBase}:delete`;
  let deleteCount = 0;

  if (action === 'DELETE') {
    deleteCount = await redis.incr(deleteKey);
    if (deleteCount === 1) {
      await redis.expire(deleteKey, WINDOW);
    }
  }

  // 🚨 REGRAS

  // 1. muitos deletes
  if (deleteCount >= 5) {
    return {
      suspicious: true,
      reason: 'Muitos DELETE em pouco tempo'
    };
  }

  // 2. muita atividade geral
  if (total >= 20) {
    return {
      suspicious: true,
      reason: 'Muitas ações em pouco tempo'
    };
  }

  return {
    suspicious: false
  };
}; 