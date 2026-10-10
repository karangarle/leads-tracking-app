import React, { useState } from 'react';
import type { Lead, Note } from '../types';
import { ArrowLeft, Mail, Phone, Clock, Plus, Trash2, Edit3, MessageSquare } from 'lucide-react';

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'qualified': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'lost': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default: return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Navigation & Action Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-800 text-gray-300 rounded-lg border border-gray-700/80 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} /> Back to Leads
        </button>

        <div className="flex gap-3">
          <button
            onClick={onEditLead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-lg border border-blue-500/30 text-sm font-medium transition-colors"
          >
            <Edit3 size={15} /> Edit Lead
          </button>
          <button
            onClick={onDeleteLead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-lg border border-rose-500/30 text-sm font-medium transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lead Info */}
        <div className="glass-panel rounded-xl p-6 h-fit lg:col-span-1">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              <span className="text-xs text-gray-400">ID: #{lead.id}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusBadgeClass(lead.status)}`}>
              {lead.status}
            </span>
          </div>

          <div className="flex flex-col gap-4 border-t border-gray-700/80 pt-5">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-cyan-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm text-gray-100">{lead.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-purple-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Phone</p>
                <p className="text-sm text-gray-100">{lead.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} className="text-blue-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Created At</p>
                <p className="text-sm text-gray-100">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Activity Timeline */}
        <div className="glass-panel rounded-xl p-6 flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-cyan-400" />
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
              className="w-full p-3.5 bg-gray-900/80 border border-gray-700/80 rounded-lg text-white text-sm focus:border-cyan-500 transition-colors resize-y"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-md shadow-cyan-600/20 disabled:opacity-50"
              >
                <Plus size={16} /> Add Note
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
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 transition-colors"
                >
                  <p className="text-sm text-gray-200 mb-2 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(note.createdAt).toLocaleString()}
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
