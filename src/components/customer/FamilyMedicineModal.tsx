import React, { useState } from 'react';
import {
  X,
  Users,
  Plus,
  HeartPulse,
  FileText,
  UserCheck,
  Trash2,
  Sparkles
} from 'lucide-react';
import { FamilyMember } from '../../types';

interface FamilyMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers?: FamilyMember[];
  onAddMember?: (member: FamilyMember) => void;
  onUpdateMember?: (member: FamilyMember) => void;
  onDeleteMember?: (id: string) => void;
  onSelectMemberFilter?: (member: FamilyMember) => void;
}

export const FamilyMedicineModal: React.FC<FamilyMedicineModalProps> = ({
  isOpen,
  onClose,
  familyMembers = [],
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onSelectMemberFilter,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const memberList = familyMembers || [];
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(memberList[0] || null);

  const activeMember = selectedMember && memberList.some((m) => m.id === selectedMember.id)
    ? selectedMember
    : memberList[0] || null;

  // Form states
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Spouse');
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [conditionInput, setConditionInput] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddCondition = () => {
    if (conditionInput.trim() && !conditions.includes(conditionInput.trim())) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput('');
    }
  };

  const handleSubmitNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ['bg-emerald-500', 'bg-blue-600', 'bg-purple-600', 'bg-amber-500', 'bg-rose-500'];
    const newEntry: FamilyMember = {
      id: `fam-${Date.now()}`,
      name: name.trim(),
      relation,
      age,
      gender,
      medicalConditions: conditions.length > 0 ? conditions : ['General Health Check'],
      prescriptionsCount: 0,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };

    if (onAddMember) onAddMember(newEntry);
    setSelectedMember(newEntry);
    setShowAddForm(false);
    setName('');
    setConditions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Family Medicine Vault</h2>
              <p className="text-xs text-slate-300">
                Manage member health profiles, conditions, and personalized prescriptions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50 text-xs">
          
          {/* Member Avatars Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                Family Members ({memberList.length})
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Family Member
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {memberList.map((member) => {
                const isSelected = activeMember?.id === member.id;
                return (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member);
                      if (onSelectMemberFilter) onSelectMemberFilter(member);
                    }}
                    className={`p-3 rounded-2xl border text-left shrink-0 w-44 transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-400'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${member.avatarColor} text-white font-bold flex items-center justify-center shrink-0`}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 text-xs truncate">{member.name}</div>
                      <div className="text-[10px] text-slate-500">{member.relation} • {member.age} yrs</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Existing Member Form Drawer */}
          {editingMember && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name.trim()) return;
                const updated: FamilyMember = {
                  ...editingMember,
                  name: name.trim(),
                  relation,
                  age,
                  gender,
                  medicalConditions: conditions,
                };
                if (onUpdateMember) onUpdateMember(updated);
                setSelectedMember(updated);
                setEditingMember(null);
              }}
              className="p-5 bg-white border border-blue-300 rounded-2xl shadow-sm space-y-4"
            >
              <div className="font-bold text-slate-900 text-sm">Edit Family Member Profile</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Relationship</label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Medical Conditions / Allergies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    placeholder="Add condition or allergy tag"
                    className="flex-1 p-2.5 bg-slate-50 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {conditions.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[10px] flex items-center gap-1">
                      {c}
                      <button
                        type="button"
                        onClick={() => setConditions(conditions.filter((_, idx) => idx !== i))}
                        className="text-emerald-900 font-bold ml-1 hover:text-rose-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
                >
                  Update Profile
                </button>
              </div>
            </form>
          )}
          {showAddForm && (
            <form onSubmit={handleSubmitNewMember} className="p-5 bg-white border border-emerald-200 rounded-2xl shadow-sm space-y-4">
              <div className="font-bold text-emerald-950 text-sm">Add New Family Member</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anitha Sharma"
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Relationship</label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              {/* Conditions Input */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Medical Conditions / Allergies</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conditionInput}
                    onChange={(e) => setConditionInput(e.target.value)}
                    placeholder="e.g. Asthma, Hypertension, Diabetes, Peanut Allergy"
                    className="flex-1 p-2.5 bg-slate-50 border rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {conditions.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl"
                >
                  Save Member Profile
                </button>
              </div>
            </form>
          )}

          {/* Active Member Details Card */}
          {activeMember && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${activeMember.avatarColor} text-white font-extrabold text-xl flex items-center justify-center shadow-md`}>
                    {activeMember.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{activeMember.name}</h3>
                    <p className="text-slate-500 text-xs">
                      Relation: {activeMember.relation} • Age: {activeMember.age} yrs • Gender: {activeMember.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingMember(activeMember);
                      setName(activeMember.name);
                      setRelation(activeMember.relation);
                      setAge(activeMember.age);
                      setGender(activeMember.gender);
                      setConditions(activeMember.medicalConditions || []);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1 border border-slate-200"
                  >
                    Edit Profile
                  </button>

                  {activeMember.relation !== 'Self' && onDeleteMember && (
                    <button
                      onClick={() => onDeleteMember(activeMember.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Medical Conditions */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
                  <HeartPulse className="w-4 h-4 text-rose-500" /> Recorded Medical Conditions & Allergies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(activeMember.medicalConditions || []).map((cond, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs"
                    >
                      • {cond}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prescriptions Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <div>
                    <span className="block font-bold text-slate-900 text-xs">
                      {selectedMember.prescriptionsCount} Stored Prescriptions
                    </span>
                    <span className="text-[11px] text-slate-500">
                      View and upload digital prescription slips for {selectedMember.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                >
                  Open Vault
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
