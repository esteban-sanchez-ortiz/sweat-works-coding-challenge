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
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading && <p className="text-gray-500">Loading members...</p>}
      {error && <p className="text-red-500">Error: {(error as Error).message}</p>}

      <ul className="divide-y divide-gray-200">
        {members?.map((member) => (
          <li
            key={member.id}
            onClick={() => onSelectMember(member)}
            className="py-3 px-2 hover:bg-gray-50 cursor-pointer rounded"
          >
            <p className="font-medium text-gray-900">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </li>
        ))}
        {members?.length === 0 && (
          <li className="py-3 text-gray-500">No members found</li>
        )}
      </ul>
    </div>
  );
}
