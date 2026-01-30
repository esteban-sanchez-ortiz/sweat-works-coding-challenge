import { useState } from 'react';
import { usePlans, useAssignPlan } from '../hooks/useMemberships';
import { getPlanTierStyle } from '../utils/planUtils';

interface AssignPlanFormProps {
  memberId: string;
}

export function AssignPlanForm({ memberId }: AssignPlanFormProps) {
  const { data: plans, isLoading } = usePlans();
  const assignMutation = useAssignPlan();
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!planId) return;
    assignMutation.mutate({ memberId, planId, startDate });
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Plan
        </label>
        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all bg-white"
          required
        >
          <option value="">Choose a plan...</option>
          {plans?.map((plan) => {
            const tierStyle = getPlanTierStyle(plan.name);
            return (
              <option key={plan.id} value={plan.id}>
                {tierStyle.emoji} {plan.name} - {formatPrice(plan.priceInCents)}/month [{tierStyle.label}]
              </option>
            );
          })}
        </select>
      </div>

      {/* Plan Cards Preview */}
      {plans && plans.length > 0 && (
        <div className="grid grid-cols-1 gap-3 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Available Plans</p>
          {plans.map((plan) => {
            const tierStyle = getPlanTierStyle(plan.name);
            const isSelected = planId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setPlanId(plan.id)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? `${tierStyle.card.border} bg-gradient-to-r ${tierStyle.card.bg} shadow-md`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tierStyle.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-900">{plan.name}</span>
                      <span className={`px-2 py-0.5 ${tierStyle.badge.bg} ${tierStyle.badge.text} text-xs font-bold rounded-full`}>
                        {tierStyle.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">
                      {formatPrice(plan.priceInCents)}/month
                    </p>
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-brand-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all"
          required
        />
      </div>

      {assignMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm font-medium">{(assignMutation.error as Error).message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={assignMutation.isPending || !planId}
        className="w-full btn-primary flex items-center justify-center gap-2"
      >
        {assignMutation.isPending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Assigning...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Assign Plan
          </>
        )}
      </button>
    </form>
  );
}
