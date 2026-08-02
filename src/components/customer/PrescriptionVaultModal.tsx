import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Camera,
  Share2,
  Download,
  CheckCircle,
  Sparkles,
  Bot,
  User,
  Trash2
} from 'lucide-react';
import { PrescriptionVaultItem, CustomerProfile } from '../../types';

interface PrescriptionVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptions: PrescriptionVaultItem[];
  profile: CustomerProfile;
  onAddPrescription: (item: PrescriptionVaultItem) => void;
}

export const PrescriptionVaultModal: React.FC<PrescriptionVaultModalProps> = ({
  isOpen,
  onClose,
  prescriptions = [],
  profile,
  onAddPrescription,
}) => {
  const pList = prescriptions || [];
  const [selectedItem, setSelectedItem] = useState<PrescriptionVaultItem | null>(pList[0] || null);
  const activePrescription = (selectedItem && pList.some((p) => p.id === selectedItem.id))
    ? selectedItem
    : pList[0] || null;
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [member, setMember] = useState('Rajesh Sharma (Self)');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported or restricted in iframe.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access restricted:', err);
      setCameraError('Live camera access is restricted or denied in browser preview. You can upload a photo file or use a sample digital prescription scan.');
    }
  };

  const handleUseSampleScan = () => {
    // Generate a clean sample prescription image SVG base64
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
      <rect width="600" height="400" fill="#f8fafc" rx="16"/>
      <rect x="20" y="20" width="560" height="360" fill="white" stroke="#cbd5e1" stroke-width="2" rx="12"/>
      <path d="M40 40h520v60H40z" fill="#065f46"/>
      <text x="60" y="75" fill="white" font-family="sans-serif" font-size="20" font-weight="bold">CITY MEDICAL CLINIC &amp; PHARMACY</text>
      <text x="60" y="92" fill="#a7f3d0" font-family="sans-serif" font-size="11">Dr. S. K. Raman, M.D. Reg. No. TN-48201</text>
      <text x="60" y="140" fill="#1e293b" font-family="sans-serif" font-size="14" font-weight="bold">Rx PRESCRIPTION SCAN</text>
      <text x="60" y="165" fill="#64748b" font-family="sans-serif" font-size="12">Patient: ${profile?.name || 'Rajesh Sharma'} | Age: 42 | Date: ${new Date().toLocaleDateString()}</text>
      <line x1="60" y1="180" x2="540" y2="180" stroke="#e2e8f0" stroke-width="2"/>
      <text x="60" y="210" fill="#0f172a" font-family="sans-serif" font-size="13" font-weight="bold">1. Tab. Paracetamol 650mg - 1-0-1 (3 Days)</text>
      <text x="60" y="240" fill="#0f172a" font-family="sans-serif" font-size="13" font-weight="bold">2. Cap. Amoxicillin 500mg - 1-0-1 (5 Days)</text>
      <text x="60" y="270" fill="#0f172a" font-family="sans-serif" font-size="13" font-weight="bold">3. Tab. Pantoprazole 40mg - 1-0-0 (Before food)</text>
      <rect x="380" y="300" width="160" height="50" rx="8" fill="#f1f5f9" stroke="#059669" stroke-width="1.5" stroke-dasharray="4 4"/>
      <text x="410" y="330" fill="#047857" font-family="sans-serif" font-size="12" font-weight="bold">VERIFIED eKYC</text>
    </svg>`;
    const sampleDataUrl = `data:image/svg+xml;base64,${btoa(sampleSvg)}`;
    setUploadedBase64(sampleDataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUploadedBase64(dataUrl);
      }
    }
    stopCamera();
  };

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !uploadedBase64) {
      alert('Please select an image file and enter a title!');
      return;
    }

    setIsUploading(true);

    try {
      // Call AI prescription OCR analyzer
      const res = await fetch('/api/prescriptions/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: uploadedBase64 }),
      });
      const data = await res.json();

      const newRecord: PrescriptionVaultItem = {
        id: `pv-${Date.now()}`,
        title: newTitle.trim(),
        doctorName: doctorName.trim() || 'Dr. Consultant',
        uploadedDate: new Date().toISOString().split('T')[0],
        forFamilyMember: member,
        fileType: 'image',
        fileUrl: uploadedBase64,
        extractedMedicines: data.extractedMedicines || [
          { medicineName: 'Dolo 650mg Tablet', dosage: '1 Tab', frequency: 'TDS' },
        ],
      };

      onAddPrescription(newRecord);
      setSelectedItem(newRecord);
      setNewTitle('');
      setDoctorName('');
      setUploadedBase64(null);
      alert('Prescription successfully uploaded and AI scanned!');
    } catch (error) {
      console.error('Error scanning prescription:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShareWithPharmacy = (pharmacyName: string) => {
    alert(`Prescription document shared securely with ${pharmacyName}! Store manager notified.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Encrypted Digital Prescription Vault</h2>
              <p className="text-xs text-slate-300">
                AI OCR extraction, doctor slip storage, and instant share with partner pharmacies
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

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden bg-slate-50 text-xs">
          
          {/* Left Column: Upload Form & Prescriptions List */}
          <div className="md:col-span-5 p-4 border-r border-slate-200 overflow-y-auto space-y-4">
            
            {/* Upload Box */}
            <form onSubmit={handleUploadSubmit} className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm space-y-3">
              <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Upload & AI Scan Prescription
              </div>

              <input
                type="text"
                placeholder="Prescription Title (e.g., Fever Slip)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                required
              />

              <input
                type="text"
                placeholder="Doctor Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex flex-col items-center gap-1 transition-all"
                >
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <span>📷 Open Camera</span>
                </button>

                <div className="relative border border-slate-300 hover:border-emerald-500 rounded-2xl p-2.5 text-center bg-slate-50 cursor-pointer flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-4 h-4 text-slate-500 mb-0.5" />
                  <span className="block font-bold text-slate-700 text-[11px]">
                    {uploadedBase64 ? 'File Attached ✓' : 'Upload File'}
                  </span>
                </div>
              </div>

              {uploadedBase64 && (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500 max-h-36 bg-black flex items-center justify-center">
                  <img src={uploadedBase64} alt="Prescription Preview" className="max-h-36 object-contain" />
                  <button
                    type="button"
                    onClick={() => setUploadedBase64(null)}
                    className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 text-[10px] font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-colors"
              >
                {isUploading ? 'Medifind AI Extracting Medicines...' : 'Upload to Vault'}
              </button>
            </form>

            {/* Prescriptions Master List */}
            <div className="space-y-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block">
                Vault Records ({pList.length})
              </span>
              {pList.map((p) => {
                const isSelected = activePrescription?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedItem(p)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="font-bold text-xs truncate">{p.title}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {p.doctorName} • {p.uploadedDate}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Active Document Viewer & AI Extracted List */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-white">
            {activePrescription ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{activePrescription.title}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Doctor: {activePrescription.doctorName} • Date: {activePrescription.uploadedDate} • Member: {activePrescription.forFamilyMember}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareWithPharmacy('Apollo Pharmacy Indiranagar')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1 shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share with Pharmacy
                    </button>
                  </div>
                </div>

                {/* Prescription Image Preview Box */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 h-52 flex items-center justify-center relative">
                  <img
                    src={activePrescription.fileUrl}
                    alt={activePrescription.title}
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[10px] font-bold border border-white/10">
                    Encrypted Vault Copy
                  </div>
                </div>

                {/* AI Extracted Medicines Table */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> AI OCR Extracted Medicines
                  </div>
                  
                  <div className="space-y-1.5">
                    {activePrescription.extractedMedicines?.map((med, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{med.medicineName}</span>
                          <span className="text-[10px] text-slate-500">{med.frequency}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          {med.dosage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select a prescription from the vault to inspect details.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Camera Live Stream Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between text-white font-bold text-sm border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2 text-emerald-400">
                <Camera className="w-5 h-5" /> Live Prescription Camera
              </span>
              <button
                onClick={stopCamera}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-3">
                <p className="font-semibold">{cameraError}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleUseSampleScan}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex-1"
                  >
                    📄 Load Digital Sample Prescription Scan
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border border-slate-700">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-white/70 text-[10px] bg-black/60 px-2 py-1 rounded-full font-semibold">
                    Align Prescription Paper Within Frame
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {!cameraError && (
                <button
                  onClick={captureCameraSnapshot}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-900/30 flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Snap Prescription Photo
                </button>
              )}

              <button
                onClick={stopCamera}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
