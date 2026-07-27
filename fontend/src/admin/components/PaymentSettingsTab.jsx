import React, { useState } from 'react';
import { ShieldCheck, Save, Key, Lock } from 'lucide-react';

export default function PaymentSettingsTab({
  settings,
  onSaveSettings,
  saving
}) {
  const [formData, setFormData] = useState({
    cashfreeAppId: settings?.cashfreeAppId || '',
    cashfreeSecretKey: settings?.cashfreeSecretKey || '',
    cashfreeMode: settings?.cashfreeMode || 'SANDBOX',
    enableCashfree: settings?.enableCashfree ?? true,
    // Preserve default values for removed legacy methods
    enableUpi: false,
    enableCod: false,
    enableStripe: false,
    upiId: settings?.upiId || '',
    merchantName: settings?.merchantName || 'Synergy Medical Yoga',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#005550] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sansita text-2xl font-bold text-gray-900">
              Cashfree Payments Gateway Configuration
            </h3>
            <p className="text-xs text-gray-500">
              Configure your official Cashfree API credentials and environment mode for processing customer checkout sessions
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* 1. Cashfree PG API Credentials Section */}
          <div className="bg-gradient-to-r from-teal-900 via-[#005550] to-teal-800 text-white p-6 rounded-2xl space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-sm text-white">Cashfree Payments PG Credentials (API v3)</h4>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Encrypted &amp; HMAC Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-teal-100 font-semibold mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-300" /> Cashfree Client App ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TEST10091827... or PROD_APP_ID"
                  value={formData.cashfreeAppId}
                  onChange={(e) => setFormData({ ...formData, cashfreeAppId: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-teal-200/50 font-mono focus:outline-none focus:bg-white/20"
                />
              </div>

              <div>
                <label className="block text-teal-100 font-semibold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-300" /> Cashfree Client Secret Key *
                </label>
                <input
                  type="password"
                  placeholder="Enter Cashfree Secret Key..."
                  value={formData.cashfreeSecretKey}
                  onChange={(e) => setFormData({ ...formData, cashfreeSecretKey: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-teal-200/50 font-mono focus:outline-none focus:bg-white/20"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-teal-200 text-xs font-semibold">Gateway Mode:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cashfreeMode: 'SANDBOX' })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      formData.cashfreeMode === 'SANDBOX'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    SANDBOX (Testing)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, cashfreeMode: 'PRODUCTION' })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      formData.cashfreeMode === 'PRODUCTION'
                        ? 'bg-emerald-400 text-slate-950 shadow-xs'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    PRODUCTION (Live)
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-teal-200/80">
                Webhooks HMAC verification is automatically enforced on all incoming PG notifications.
              </p>
            </div>
          </div>

          {/* Payment Method Toggle */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm">Active Payment Gateway</h4>

            <div className="max-w-sm">
              <label className="flex items-center gap-3 p-4 bg-[#f8fbfa] rounded-2xl border border-[#005550] cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  checked={formData.enableCashfree}
                  onChange={(e) => setFormData({ ...formData, enableCashfree: e.target.checked })}
                  className="w-4 h-4 text-[#005550] focus:ring-[#005550] rounded cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Cashfree Payments PG</p>
                  <p className="text-[10px] text-gray-500">All Indian Cards, Netbanking, Wallets &amp; UPI</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Primary Gateway
                </span>
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
              <span>{saving ? 'Saving Settings...' : 'Save Cashfree Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
