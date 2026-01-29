import { useState } from 'react';
import { usePlans, useAssignPlan } from '../hooks/useMemberships';

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

  if (isLoading) return <p className="text-sm text-gray-500">Loading plans...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan</label>
        <select
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          required
        >
          <option value="">Choose a plan...</option>
          {plans?.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {formatPrice(plan.priceInCents)}/mo
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          required
        />
      </div>

      {assignMutation.error && (
        <p className="text-red-500 text-sm">{(assignMutation.error as Error).message}</p>
      )}

      <button
        type="submit"
        disabled={assignMutation.isPending || !planId}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {assignMutation.isPending ? 'Assigning...' : 'Assign Plan'}
      </button>
    </form>
  );
}
