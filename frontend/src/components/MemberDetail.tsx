import { useState } from 'react';
import { useMember } from '../hooks/useMembers';
import { useCancelMembership } from '../hooks/useMemberships';
import { useCheckIn } from '../hooks/useCheckIn';
import { AssignPlanForm } from './AssignPlanForm';
import { getPlanTierStyle } from '../utils/planUtils';

interface MemberDetailProps {
  memberId: string;
}

export function MemberDetail({ memberId }: MemberDetailProps) {
  const { data: member, isLoading, error } = useMember(memberId);
  const cancelMutation = useCancelMembership();
  const checkInMutation = useCheckIn();
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelDate, setCancelDate] = useState('');
  const [showCheckInConfirm, setShowCheckInConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700 font-medium">Error loading member details</p>
      </div>
    );
  }

  if (!member) return null;

  const handleCancelClick = () => {
    setShowCancelForm(true);
    // Set default cancel date to today
    const today = new Date().toISOString().split('T')[0];
    setCancelDate(today);
  };

  const confirmCancel = () => {
    if (!member.activeMembership || !cancelDate) return;
    cancelMutation.mutate(
      { id: member.activeMembership.id, cancelledAt: cancelDate },
      {
        onSuccess: () => {
          setShowCancelForm(false);
          setCancelDate('');
        }
      }
    );
  };

  // Check if last check-in was today
  const isCheckedInToday = () => {
    if (!member?.lastCheckIn) return false;
    const lastCheckIn = new Date(member.lastCheckIn);
    const today = new Date();
    return (
      lastCheckIn.getDate() === today.getDate() &&
      lastCheckIn.getMonth() === today.getMonth() &&
      lastCheckIn.getFullYear() === today.getFullYear()
    );
  };

  const handleCheckInClick = () => {
    if (isCheckedInToday()) {
      setShowCheckInConfirm(true);
    } else {
      checkInMutation.mutate(memberId);
    }
  };

  const confirmCheckIn = () => {
    setShowCheckInConfirm(false);
    checkInMutation.mutate(memberId);
  };

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString() : 'Never';

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  // Get plan tier styling
  const planTierStyle = member?.activeMembership
    ? getPlanTierStyle(member.activeMembership.plan.name)
    : null;

  return (
    <div className="space-y-6">
      {/* Member Header */}
      <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
          {member.firstName[0]}{member.lastName[0]}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {member.firstName} {member.lastName}
          </h2>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            {member.email}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-brand-accent-50 to-brand-accent-100/50 p-5 rounded-xl border border-brand-accent-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-brand-accent-700">Last Check-in</p>
            <svg className="w-5 h-5 text-brand-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatDate(member.lastCheckIn)}</p>
        </div>
        <div className="bg-gradient-to-br from-brand-primary-50 to-brand-primary-100/50 p-5 rounded-xl border border-brand-primary-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-brand-primary-700">30-Day Check-ins</p>
            <svg className="w-5 h-5 text-brand-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{member.checkInCountLast30Days}</p>
        </div>
      </div>

      {/* Check In Button */}
      {member.activeMembership && (
        <>
          <button
            onClick={handleCheckInClick}
            disabled={checkInMutation.isPending}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-3"
          >
            {checkInMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Checking in...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Check In Now
                {isCheckedInToday() && (
                  <span className="ml-1 px-2 py-0.5 bg-green-700 text-white text-xs font-semibold rounded-full">
                    Already checked in today
                  </span>
                )}
              </>
            )}
          </button>

          {/* Check-in Confirmation Modal */}
          {showCheckInConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-300">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Already Checked In Today</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Last check-in: {formatDate(member.lastCheckIn)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6">
                    This member has already checked in today. Do you want to check in again?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCheckInConfirm(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmCheckIn}
                      className="flex-1 px-4 py-2.5 bg-brand-primary-500 text-white font-semibold rounded-lg hover:bg-brand-primary-600 transition-colors"
                    >
                      Yes, Check In Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Check In Error */}
      {checkInMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-700 text-sm font-medium">{(checkInMutation.error as Error).message}</p>
        </div>
      )}

      {/* Cancel Plan Confirmation Modal */}
      {showCancelForm && member.activeMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in fade-in duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">Cancel Membership Plan</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {member.activeMembership.plan.name} - {formatPrice(member.activeMembership.plan.priceInCents)}/month
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 text-sm font-medium mb-2">
                  ⚠️ This action will cancel the member's active plan
                </p>
                <ul className="text-red-700 text-sm space-y-1 ml-4 list-disc">
                  <li>Member will lose access on the cancellation date</li>
                  <li>This action cannot be easily undone</li>
                  <li>Member will need to be reassigned a new plan</li>
                </ul>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Effective Cancellation Date
                </label>
                <input
                  type="date"
                  value={cancelDate}
                  onChange={(e) => setCancelDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Member will retain access until this date
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelForm(false);
                    setCancelDate('');
                  }}
                  disabled={cancelMutation.isPending}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Keep Plan
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={!cancelDate || cancelMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cancelMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Membership Status */}
      {member.activeMembership && planTierStyle ? (
        <div className={`border-2 ${planTierStyle.card.border} bg-gradient-to-br ${planTierStyle.card.bg} p-6 rounded-xl`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${planTierStyle.icon.bg} rounded-lg flex items-center justify-center shadow-md text-2xl`}>
                {planTierStyle.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                    ACTIVE
                  </span>
                  <span className={`px-2 py-1 ${planTierStyle.badge.bg} ${planTierStyle.badge.text} text-xs font-bold rounded-full border ${planTierStyle.badge.border}`}>
                    {planTierStyle.label}
                  </span>
                </div>
                <p className="font-bold text-gray-900 text-lg">
                  {member.activeMembership.plan.name}
                </p>
                <p className="text-gray-700 font-semibold">
                  {formatPrice(member.activeMembership.plan.priceInCents)}/month
                </p>
              </div>
            </div>
            {!member.activeMembership.cancelledAt && (
              <button
                onClick={handleCancelClick}
                className="text-sm text-red-600 hover:text-red-800 font-semibold px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
              >
                Cancel Plan
              </button>
            )}
          </div>

          <div className="bg-white/60 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600">Started:</span>
              <span className="font-semibold text-gray-900">{formatDate(member.activeMembership.startDate)}</span>
            </div>
            {member.activeMembership.cancelledAt && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-orange-600">Cancels on:</span>
                <span className="font-semibold text-orange-900">{formatDate(member.activeMembership.cancelledAt)}</span>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 bg-gray-50/50 p-6 rounded-xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">No Active Membership</h3>
            <p className="text-gray-500 text-sm">Assign a plan to get this member started</p>
          </div>
          <AssignPlanForm memberId={memberId} />
        </div>
      )}
    </div>
  );
}
