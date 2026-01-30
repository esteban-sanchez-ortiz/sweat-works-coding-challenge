import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';
import type { Member } from '../types';

interface MemberListProps {
  onSelectMember: (member: Member) => void;
}

export function MemberList({ onSelectMember }: MemberListProps) {
  const [search, setSearch] = useState('');
  const { data: members, isLoading, error } = useMembers(search);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent transition-all text-sm"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm font-medium">Error: {(error as Error).message}</p>
        </div>
      )}

      {/* Members List */}
      {!isLoading && !error && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {members?.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="group p-3 hover:bg-gradient-to-r hover:from-brand-primary-50 hover:to-transparent cursor-pointer rounded-lg transition-all duration-200 border border-transparent hover:border-brand-primary-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent-400 to-brand-accent-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-brand-primary-600 transition-colors truncate">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{member.email}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-brand-primary-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
          {members?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No members found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
