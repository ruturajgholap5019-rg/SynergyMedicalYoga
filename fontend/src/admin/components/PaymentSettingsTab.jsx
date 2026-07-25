import React, { useState, useRef } from 'react';
import { QrCode, Save, CheckCircle2, ShieldCheck, Copy, Check, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function PaymentSettingsTab({
  settings,
  onSaveSettings,
  saving
}) {
  const [formData, setFormData] = useState({
    upiId: settings?.upiId || 'synergymedical@upi',
    merchantName: settings?.merchantName || 'Synergy Medical Yoga',
    customQrUrl: settings?.customQrUrl || '',
    enableUpi: settings?.enableUpi ?? true,
    enableCod: settings?.enableCod ?? true,
    enableStripe: settings?.enableStripe ?? true,
  });

  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formData.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle direct QR photo file upload from computer
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Limit size to 3MB for clean Base64 storage
    if (file.size > 3 * 1024 * 1024) {
      alert('Image size is too large. Please select a photo under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        customQrUrl: event.target?.result || '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearQrPhoto = () => {
    setFormData((prev) => ({ ...prev, customQrUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const autoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `upi://pay?pa=${formData.upiId}&pn=${encodeURIComponent(formData.merchantName)}`
  )}`;

  const activeQrDisplay = formData.customQrUrl || autoQrUrl;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#005550] flex items-center justify-center font-bold">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sansita text-2xl font-bold text-gray-900">
              Payment Gateway &amp; UPI QR Scanner Configuration
            </h3>
            <p className="text-xs text-gray-500">
              Upload your official QR Scanner photo or configure your merchant UPI ID
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Live Scanner Preview */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img
                src={activeQrDisplay}
                alt="Merchant UPI QR Code Preview"
                className="w-40 h-40 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs object-contain"
              />
              {formData.customQrUrl && (
                <button
                  type="button"
                  onClick={clearQrPhoto}
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                  title="Remove uploaded QR photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-2 text-slate-700 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Live Checkout Preview
                </span>
                {formData.customQrUrl ? (
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
                    Custom Photo Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                    Auto-Generated QR
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-1">{formData.merchantName}</h4>
              
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs w-fit">
                <span className="font-bold text-[#005550]">{formData.upiId}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-gray-400 hover:text-[#005550] cursor-pointer"
                  title="Copy UPI ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                This exact scanner image will render in the customer checkout modal for direct scanning with GPay, PhonePe, and Paytm.
              </p>
            </div>
          </div>

          {/* Direct QR Scanner Photo File Upload */}
          <div className="bg-gradient-to-br from-teal-50/50 to-emerald-50/30 p-5 rounded-2xl border border-teal-100 space-y-3">
            <label className="block font-bold text-gray-900 text-xs flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#005550]" /> Direct QR Scanner Photo Upload
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-file-upload"
              />

              <label
                htmlFor="qr-file-upload"
                className="bg-[#005550] hover:bg-[#003d39] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-[#005550]/20 cursor-pointer transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload QR Photo from Computer</span>
              </label>

              <span className="text-gray-500 text-[11px]">Supports PNG, JPG, WEBP (Max 3MB)</span>
            </div>

            <div className="pt-2">
              <label className="block font-semibold text-gray-700 mb-1">Or Paste Direct Image URL</label>
              <input
                type="url"
                placeholder="https://... (Or upload image file above)"
                value={formData.customQrUrl.startsWith('data:') ? 'Local Image File Selected (Base64)' : formData.customQrUrl}
                onChange={(e) => setFormData({ ...formData, customQrUrl: e.target.value })}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#005550]"
              />
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Official Merchant UPI ID *</label>
              <input
                type="text"
                required
                placeholder="synergymedical@upi"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Merchant / Clinic Name *</label>
              <input
                type="text"
                required
                placeholder="Synergy Medical Yoga"
                value={formData.merchantName}
                onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005550]"
              />
            </div>
          </div>

          {/* Payment Toggles */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Enabled Payment Gateways &amp; Methods</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.enableUpi}
                  onChange={(e) => setFormData({ ...formData, enableUpi: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <div>
                  <p className="font-bold text-gray-900">UPI &amp; QR Code</p>
                  <p className="text-[10px] text-gray-500">GPay, PhonePe, Paytm</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.enableCod}
                  onChange={(e) => setFormData({ ...formData, enableCod: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <div>
                  <p className="font-bold text-gray-900">Cash on Delivery</p>
                  <p className="text-[10px] text-gray-500">Pay on doorstep delivery</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-200 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.enableStripe}
                  onChange={(e) => setFormData({ ...formData, enableStripe: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <div>
                  <p className="font-bold text-gray-900">Stripe Card Gateway</p>
                  <p className="text-[10px] text-gray-500">Credit / Debit Cards</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#005550] hover:bg-[#003d39] text-white px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md shadow-[#005550]/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save Payment Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
