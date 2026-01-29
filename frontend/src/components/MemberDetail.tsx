import { useMember } from '../hooks/useMembers';
import { AssignPlanForm } from './AssignPlanForm';
import { useCancelMembership } from '../hooks/useMemberships';
import { useState } from 'react';

interface MemberDetailProps {
  memberId: string;
}

export function MemberDetail({ memberId }: MemberDetailProps) {
  const { data: member, isLoading, error } = useMember(memberId);
  const cancelMutation = useCancelMembership();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelDate, setCancelDate] = useState('');

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error loading member</p>;
  if (!member) return null;

  const handleCancel = () => {
    if (!member.activeMembership || !cancelDate) return;
    cancelMutation.mutate(
      { id: member.activeMembership.id, cancelledAt: cancelDate },
      { onSuccess: () => setShowCancelForm(false) }
    );
  };

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString() : 'Never';

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          {member.firstName} {member.lastName}
        </h2>
        <p className="text-gray-600">{member.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-500">Last Check-in</p>
          <p className="font-medium">{formatDate(member.lastCheckIn)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-500">Check-ins (30 days)</p>
          <p className="font-medium">{member.checkInCountLast30Days}</p>
        </div>
      </div>

      {member.activeMembership ? (
        <div className="border border-green-200 bg-green-50 p-4 rounded">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-green-800">
                Active: {member.activeMembership.plan.name}
              </p>
              <p className="text-sm text-green-600">
                {formatPrice(member.activeMembership.plan.priceInCents)}/month
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Started: {formatDate(member.activeMembership.startDate)}
              </p>
              {member.activeMembership.cancelledAt && (
                <p className="text-xs text-orange-600 mt-1">
                  Cancels: {formatDate(member.activeMembership.cancelledAt)}
                </p>
              )}
            </div>
            {!member.activeMembership.cancelledAt && (
              <button
                onClick={() => setShowCancelForm(!showCancelForm)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cancel
              </button>
            )}
          </div>

          {showCancelForm && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <label className="block text-sm text-gray-700 mb-1">
                Effective cancellation date
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={cancelDate}
                  onChange={(e) => setCancelDate(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  onClick={handleCancel}
                  disabled={!cancelDate || cancelMutation.isPending}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 p-4 rounded">
          <p className="text-gray-500 mb-4">No active membership</p>
          <AssignPlanForm memberId={memberId} />
        </div>
      )}
    </div>
  );
}
