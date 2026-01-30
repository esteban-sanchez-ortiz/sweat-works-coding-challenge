export type PlanTier = 'basic' | 'premium' | 'vip';

export interface PlanTierStyle {
  tier: PlanTier;
  badge: {
    bg: string;
    text: string;
    border: string;
  };
  card: {
    bg: string;
    border: string;
  };
  icon: {
    bg: string;
    text: string;
  };
  label: string;
  emoji: string;
}

export function getPlanTier(planName: string): PlanTier {
  const name = planName.toLowerCase();
  if (name.includes('vip')) return 'vip';
  if (name.includes('premium')) return 'premium';
  return 'basic';
}

export function getPlanTierStyle(planName: string): PlanTierStyle {
  const tier = getPlanTier(planName);

  const styles: Record<PlanTier, PlanTierStyle> = {
    basic: {
      tier: 'basic',
      badge: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
      },
      card: {
        bg: 'from-gray-50 to-gray-100/50',
        border: 'border-gray-200',
      },
      icon: {
        bg: 'bg-gray-500',
        text: 'text-gray-500',
      },
      label: 'BASIC',
      emoji: '🥉',
    },
    premium: {
      tier: 'premium',
      badge: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
      },
      card: {
        bg: 'from-blue-50 to-blue-100/50',
        border: 'border-blue-200',
      },
      icon: {
        bg: 'bg-blue-500',
        text: 'text-blue-500',
      },
      label: 'PREMIUM',
      emoji: '🥈',
    },
    vip: {
      tier: 'vip',
      badge: {
        bg: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        text: 'text-white',
        border: 'border-yellow-300',
      },
      card: {
        bg: 'from-yellow-50 to-amber-100/50',
        border: 'border-yellow-300',
      },
      icon: {
        bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
        text: 'text-yellow-500',
      },
      label: 'VIP',
      emoji: '👑',
    },
  };

  return styles[tier];
}
