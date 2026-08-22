import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Camera,
  Edit2,
  CheckCircle2,
  Shield,
  Download,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';

export const EmployeeProfile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { showToast } = useHRMS();

  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98450 12345');
  const [address, setAddress] = useState(
    currentUser?.address || '42 Lotus Boulevard, Indiranagar, Bengaluru, Karnataka 560038'
  );
  const [bio, setBio] = useState(
    currentUser?.bio ||
      'Passionate full-stack developer specializing in scalable distributed architectures, TypeScript and React ecosystem.'
  );
  const [avatar, setAvatar] = useState(
    currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240'
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    currentUser?.emergencyContact?.phone || '+91 98450 99887'
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
        showToast('Photo Preview Ready', 'Click "Save Profile Changes" to finalize your new photo.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = updateProfile({
      phone,
      address,
      bio,
      avatar,
      emergencyContact: {
        name: currentUser?.emergencyContact?.name || 'Emergency Contact',
        relationship: currentUser?.emergencyContact?.relationship || 'Family',
        phone: emergencyPhone
      }
    });

    if (success) {
      setIsEditing(false);
      showToast('Profile Saved', 'Your personal details have been updated successfully.', 'success');
    }
  };

  const handleDownloadDoc = (title: string) => {
    showToast('Downloading Document', `${title} is downloading.`, 'success');
  };

  const salary = currentUser?.salary || {
    basic: 48000,
    hra: 18000,
    allowances: 12000,
    taxDeduction: 5200,
    providentFund: 4800,
    otherDeductions: 1000,
    netSalary: 67000,
    currency: '₹'
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-32 sm:h-40 bg-linear-to-r from-indigo-800 via-indigo-600 to-sky-600 relative" />

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar with upload trigger */}
            <div className="relative inline-block">
              <img
                src={avatar}
                alt={currentUser?.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer transition-colors"
                title="Change profile picture"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name & Basic Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-display">
                {currentUser?.name || 'Arun Kumar'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentUser?.department || 'Engineering'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {currentUser?.empId || 'EMP001'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {currentUser?.position || 'Senior Full Stack Engineer'}
            </p>
          </div>
        </div>
      </div>

      {/* Permission scope helper notice */}
      <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-slate-600 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Employee Profile Policy:</strong> You have permission to update your phone number,
            residential address, emergency contact, bio, and profile photo. Job title, salary, and
            documents are managed by HR.
          </span>
        </div>
      </div>

      {/* Main Grid: Personal Info, Job Info, Salary, Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Information & Bio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Form / View */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                Personal Information
              </h2>
              {isEditing && (
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Editing Allowed Fields
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name (Read-Only) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Full Name (Official)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Arun Kumar'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-not-allowed font-medium"
                  />
                </div>

                {/* Email (Read-Only) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || 'employee@dayflow.com'}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-not-allowed font-medium"
                  />
                </div>

                {/* Phone (Editable) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isEditing
                        ? 'bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Emergency Contact Phone (Editable) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isEditing
                        ? 'bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Residential Address (Editable) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address
                </label>
                <textarea
                  rows={2}
                  disabled={!isEditing}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isEditing
                      ? 'bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed'
                  }`}
                />
              </div>

              {/* Bio (Editable) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={3}
                  disabled={!isEditing}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isEditing
                      ? 'bg-white border-indigo-300 focus:ring-2 focus:ring-indigo-500/20 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Verified Employment Documents
              </h2>
              <span className="text-xs text-slate-400 font-medium">4 Verified Documents</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentUser?.documents || []).length > 0 ? (
                currentUser?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 font-bold text-[10px]">
                        {doc.type}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{doc.title}</p>
                        <p className="text-[10px] text-slate-500">
                          {doc.size} • Uploaded {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc(doc.title)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No documents on file.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Job Information & Salary Summary */}
        <div className="space-y-6">
          {/* Job Information */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Job & Organization Details
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Employee ID</span>
                <p className="font-bold text-slate-900 font-mono mt-0.5">
                  {currentUser?.empId || 'EMP001'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Department</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {currentUser?.department || 'Engineering'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Designation</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {currentUser?.position || 'Senior Full Stack Engineer'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Date of Joining</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {currentUser?.joiningDate || '2023-03-15'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Employment Status</span>
                <p className="font-semibold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Full-Time Regular
                </p>
              </div>
            </div>
          </div>

          {/* Salary Information (Read-Only for Employee) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                Salary Structure (Read-Only)
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Basic Pay</span>
                <span className="font-semibold text-slate-900">
                  ₹{salary.basic.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">HRA Allowance</span>
                <span className="font-semibold text-slate-900">
                  ₹{salary.hra.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Special Allowances</span>
                <span className="font-semibold text-slate-900">
                  ₹{salary.allowances.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 text-rose-600">
                <span>Deductions (PF + TDS)</span>
                <span className="font-semibold">
                  -₹{(salary.taxDeduction + salary.providentFund + salary.otherDeductions).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm font-bold text-indigo-950">
                <span>Net Monthly Payout</span>
                <span className="text-base text-emerald-700 font-display">
                  ₹{salary.netSalary.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
