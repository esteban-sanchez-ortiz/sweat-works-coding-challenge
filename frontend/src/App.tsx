import { useState } from 'react';
import { MemberList } from './components/MemberList';
import { CreateMemberForm } from './components/CreateMemberForm';
import { MemberDetail } from './components/MemberDetail';
import type { Member } from './types';

function App() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Fitness Member Management</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Members</h2>
            <MemberList onSelectMember={setSelectedMember} />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <CreateMemberForm />
            </div>

            {selectedMember && (
              <div className="bg-white p-6 rounded-lg shadow">
                <MemberDetail memberId={selectedMember.id} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
