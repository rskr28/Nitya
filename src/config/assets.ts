import type { LotusStage } from '../types';

export const assets = {
  brand: {
    logo: '/images/brand/nitya-logo-lockup.png',
    symbol: '/images/brand/nitya-symbol.png',
    favicon: '/images/brand/favicon.png',
  },
  landscapes: {
    morning: '/images/landscapes/morning.webp',
    afternoon: '/images/landscapes/afternoon.webp',
    evening: '/images/landscapes/evening.webp',
    night: '/images/landscapes/night.webp',
  },
  wisdom: {
    lotus: '/images/lessons/wisdom-lotus.webp',
  },
  lotus: {
    seed: '/images/lotus/seed.webp',
    sprout: '/images/lotus/sprout.webp',
    'early-bloom': '/images/lotus/early-bloom.webp',
    'full-bloom': '/images/lotus/full-bloom.webp',
    'radiant-bloom': '/images/lotus/radiant-bloom.webp',
  } satisfies Record<LotusStage, string>,
} as const;
