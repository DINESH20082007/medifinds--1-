import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  MapPin,
  CreditCard,
  Moon,
  Lock,
  Plus,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { CustomerProfile, Address } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  onUpdateProfile?: (updated: CustomerProfile) => void;
  onSaveProfile?: (updated: CustomerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onSaveProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'addresses' | 'payments' | 'security'>('details');
  const [formData, setFormData] = useState<CustomerProfile>({
    ...profile,
    addresses: profile?.addresses || [],
  });

  const notifyUpdate = (updated: CustomerProfile) => {
    if (onUpdateProfile) onUpdateProfile(updated);
    if (onSaveProfile) onSaveProfile(updated);
  };
  const [aadhaarInput, setAadhaarInput] = useState(profile.aadhaarNumber);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  
  // New address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, 'id'>>({
    type: 'Home',
    recipientName: profile.name,
    phone: profile.phone,
    street: '',
    area: '',
    city: 'Bengaluru',
    pincode: '',
    isDefault: false,
  });

  if (!isOpen) return null;

  const handleVerifyAadhaar = () => {
    setIsVerifyingAadhaar(true);
    setTimeout(() => {
      setIsVerifyingAadhaar(false);
      const updated = {
        ...formData,
        aadhaarNumber: aadhaarInput,
        isAadhaarVerified: true,
        isAgeVerified: formData.age >= 18,
      };
      setFormData(updated);
      notifyUpdate(updated);
    }, 1000);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    const updatedAddresses = (formData.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    const updated = { ...formData, addresses: updatedAddresses };
    setFormData(updated);
    notifyUpdate(updated);
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedAddresses = (formData.addresses || []).filter((a) => a.id !== addressId);
    const updated = { ...formData, addresses: updatedAddresses };
    setFormData(updated);
    notifyUpdate(updated);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.pincode) return;

    const currentAddresses = formData.addresses || [];
    const newEntry: Address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: currentAddresses.length === 0 || newAddr.isDefault,
    };

    let updatedAddresses = [...currentAddresses];
    if (newEntry.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(newEntry);

    const updated = { ...formData, addresses: updatedAddresses };
    setFormData(updated);
    notifyUpdate(updated);
    setShowAddAddress(false);
    setNewAddr({
      type: 'Home',
      recipientName: profile.name,
      phone: profile.phone,
      street: '',
      area: '',
      city: 'Bengaluru',
      pincode: '',
      isDefault: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{formData.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>{formData.phone}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  formData.isAadhaarVerified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {formData.isAadhaarVerified ? 'Govt Aadhaar Verified ✓' : 'Verification Needed'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> Personal Details & Govt ID
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" /> Address Book ({formData.addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Payment Methods
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" /> Privacy & Security
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          
          {/* TAB 1: Personal Details & Govt ID */}
          {activeTab === 'details' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-medium mb-1">
                    Age (Age Check for Schedule H/H1 Drugs)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap ${
                      formData.age >= 18 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {formData.age >= 18 ? 'Eligible 18+' : 'Under 18'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Govt Aadhaar Verification Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Government ID Verification (Aadhaar / Passport)
                </div>
                <p className="text-slate-500 text-xs">
                  Aadhaar integration ensures compliant ordering of restricted prescription drugs and age-controlled medicines across partner pharmacies.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="Enter 12-digit Aadhaar Number (XXXX-XXXX-XXXX)"
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyAadhaar}
                    disabled={isVerifyingAadhaar}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors text-xs flex items-center gap-1.5"
                  >
                    {isVerifyingAadhaar ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Verify
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Multi-Address Book */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Saved Delivery Addresses</span>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Address
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddressSubmit} className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="font-bold text-emerald-900 text-xs">New Delivery Address</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Recipient Name"
                      value={newAddr.recipientName}
                      onChange={(e) => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                      className="p-2 bg-white border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      className="p-2 bg-white border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Flat / Street / Building"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      className="col-span-2 p-2 bg-white border rounded-lg text-xs"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Area / Locality"
                      value={newAddr.area}
                      onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                      className="p-2 bg-white border rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      className="p-2 bg-white border rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAddr.isDefault}
                        onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                        className="rounded text-emerald-600"
                      />
                      <span>Set as Default Address</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-emerald-600 text-white font-semibold rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {formData.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      addr.isDefault
                        ? 'bg-emerald-50/30 border-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-800 text-xs">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-800 font-medium text-xs">{addr.recipientName} ({addr.phone})</p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-[11px]"
                        >
                          Make Default
                        </button>
                      )}
                      {formData.addresses.length > 1 && (
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Payment Methods */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-md">
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    Medifind Wallet Balance
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-400">
                    ₹ {formData.walletBalance.toFixed(2)}
                  </span>
                </div>
                <button className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-xl text-xs transition-colors">
                  Top Up Wallet
                </button>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800">Linked Payment Accounts</div>
                <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
                      UPI
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">PhonePe / GPay / Paytm</div>
                      <div className="text-[11px] text-slate-500">rajesh.sharma@ybl (Primary)</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">Connected ✓</span>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                      COD
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Cash on Delivery</div>
                      <div className="text-[11px] text-slate-500">Available on orders under ₹2,000</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Privacy & Security */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-600" /> Medical Data Privacy & Encryption
                </div>
                <p className="text-slate-500 text-xs">
                  Your uploaded prescription records and family health history are encrypted in compliant vault storage. Medifind never sells medical records to third parties.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-xl">
                <div>
                  <div className="font-semibold text-slate-800">Two-Factor OTP Verification</div>
                  <div className="text-slate-500 text-[11px]">Require SMS OTP when logging into new devices</div>
                </div>
                <input type="checkbox" defaultChecked className="toggle-checkbox" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 text-xs">
            Medifind Patient ID: <strong className="text-slate-800">{formData.id}</strong>
          </span>
          <button
            onClick={() => {
              notifyUpdate(formData);
              onClose();
            }}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
          >
            Save Profile Changes
          </button>
        </div>

      </div>
    </div>
  );
};
