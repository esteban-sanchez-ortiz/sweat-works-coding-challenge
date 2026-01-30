import { useState } from 'react';
import { MemberList } from './components/MemberList';
import { CreateMemberForm } from './components/CreateMemberForm';
import { MemberDetail } from './components/MemberDetail';
import type { Member } from './types';

function App() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [activeView, setActiveView] = useState<'create' | 'details'>('create');

  // When a member is selected, automatically switch to details view
  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setActiveView('details');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-primary-600 to-brand-primary-500 bg-clip-text text-transparent">
                  SweatWorks
                </h1>
                <p className="text-xs text-gray-500 font-medium">Member Management</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                ● Live
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Members List Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Members</h2>
                <span className="text-xs bg-brand-secondary-100 text-brand-secondary-700 px-2 py-1 rounded-full font-semibold">
                  Directory
                </span>
              </div>
              <MemberList onSelectMember={handleMemberSelect} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-gray-50/50">
                <nav className="flex">
                  <button
                    onClick={() => setActiveView('create')}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative group ${
                      activeView === 'create'
                        ? 'text-brand-primary-600 bg-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span>Add New Member</span>
                    </div>
                    {activeView === 'create' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveView('details')}
                    disabled={!selectedMember}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative group ${
                      activeView === 'details'
                        ? 'text-brand-primary-600 bg-white'
                        : selectedMember
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Member Details</span>
                      {selectedMember && (
                        <span className="ml-1 px-2 py-0.5 bg-brand-primary-100 text-brand-primary-700 text-xs font-bold rounded-full">
                          {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                        </span>
                      )}
                    </div>
                    {activeView === 'details' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary-500 to-brand-primary-600"></div>
                    )}
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {activeView === 'create' ? (
                  <div className="animate-in fade-in duration-300">
                    <CreateMemberForm />
                  </div>
                ) : selectedMember ? (
                  <div className="animate-in fade-in duration-300">
                    <MemberDetail memberId={selectedMember.id} />
                  </div>
                ) : (
                  <div className="py-12 text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Member Selected
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Select a member from the list to view their details
                    </p>
                    <button
                      onClick={() => setActiveView('create')}
                      className="inline-flex items-center gap-2 text-brand-primary-600 hover:text-brand-primary-700 font-semibold text-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create a new member instead
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
