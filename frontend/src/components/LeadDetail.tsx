import React, { useState } from 'react';
import type { Lead, Note } from '../types';
import { StatusBadge } from './StatusBadge';
import { Icon } from '@iconify/react';

interface LeadDetailProps {
  lead: Lead;
  notes: Note[];
  onBack: () => void;
  onAddNote: (content: string) => Promise<void>;
  onEditLead: () => void;
  onDeleteLead: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  notes,
  onBack,
  onAddNote,
  onEditLead,
  onDeleteLead,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteError, setNoteError] = useState('');

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setNoteError('Note content cannot be empty');
      return;
    }
    setNoteError('');
    setIsSubmitting(true);
    try {
      await onAddNote(newNote.trim());
      setNewNote('');
    } catch (err: any) {
      setNoteError(err.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border text-sm font-medium transition-colors"
        >
          <Icon icon="material-symbols:arrow-back-rounded" className="w-4 h-4" /> Back to Leads
        </button>

        <div className="flex gap-3">
          <button
            onClick={onEditLead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-md border border-blue-500/30 text-sm font-medium transition-colors"
          >
            <Icon icon="material-symbols:edit-outline-rounded" className="w-4 h-4" /> Edit Lead
          </button>
          <button
            onClick={onDeleteLead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-md border border-rose-500/30 text-sm font-medium transition-colors"
          >
            <Icon icon="material-symbols:delete-outline-rounded" className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Info */}
        <div className="glass-panel p-6 h-fit lg:col-span-1">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              <span className="text-xs text-gray-400">ID: #{lead.id}</span>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          <div className="flex flex-col gap-4 border-t border-brand-border pt-5">
            <div className="flex items-center gap-3">
              <Icon icon="material-symbols:mail-outline-rounded" className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm text-gray-100">{lead.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon="material-symbols:call-outline-rounded" className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Phone</p>
                <p className="text-sm text-gray-100">{lead.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Icon icon="material-symbols:schedule-outline-rounded" className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Created At</p>
                <p className="text-sm text-gray-100">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Activity */}
        <div className="glass-panel p-6 flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Icon icon="material-symbols:forum-outline-rounded" className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Notes & Activity Timeline</h3>
            <span className="ml-auto text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-gray-300">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleNoteSubmit} className="flex flex-col gap-3">
            {noteError && (
              <div className="text-xs text-rose-400 font-medium">{noteError}</div>
            )}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a detailed note or activity update..."
              rows={3}
              className="w-full p-3.5 bg-brand-secondary/80 border border-brand-border rounded-md text-white text-sm focus:border-cyan-500 transition-colors resize-y"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
              >
                <Icon icon="material-symbols:add-rounded" className="w-4 h-4" /> Add Note
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="flex flex-col gap-3.5 mt-2">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No notes added yet for this lead. Use the form above to add the first note!
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-brand-secondary/50 border border-brand-border rounded-md p-4 transition-colors"
                >
                  <p className="text-sm text-gray-200 mb-2 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Icon icon="material-symbols:schedule-outline-rounded" className="w-3.5 h-3.5" /> {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
