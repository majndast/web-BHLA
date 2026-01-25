"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsAdminPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    // Check MFA status
    const { data: factors } = await supabase.auth.mfa.listFactors();
    setMfaEnabled(factors?.totp && factors.totp.length > 0 || false);

    setLoading(false);
  };

  const setupMfa = async () => {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'BHLA Admin'
    });

    if (error) {
      alert("Chyba při nastavování 2FA: " + error.message);
      return;
    }

    if (data?.totp?.qr_code) {
      // Show QR code in a new window/modal
      const win = window.open('', '_blank', 'width=400,height=500');
      if (win) {
        win.document.write(`
          <html>
            <head><title>Nastavení 2FA</title></head>
            <body style="font-family: sans-serif; text-align: center; padding: 20px;">
              <h2>Naskenujte QR kód</h2>
              <p>Použijte aplikaci Google Authenticator nebo podobnou</p>
              <img src="${data.totp.qr_code}" alt="QR Code" style="margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">
                Nebo zadejte kód ručně:<br/>
                <code style="background: #f0f0f0; padding: 5px;">${data.totp.secret}</code>
              </p>
              <p>Po naskenování zavřete toto okno a zadejte ověřovací kód.</p>
            </body>
          </html>
        `);
      }

      // Prompt for verification code
      const code = prompt("Zadejte 6místný kód z authenticator aplikace:");
      if (code) {
        const { error: challengeError } = await supabase.auth.mfa.challengeAndVerify({
          factorId: data.id,
          code,
        });

        if (challengeError) {
          alert("Chyba při ověřování: " + challengeError.message);
        } else {
          alert("2FA bylo úspěšně aktivováno!");
          setMfaEnabled(true);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <svg className="animate-spin w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-primary">Nastavení</h1>
        <p className="text-secondary">Správa účtu a zabezpečení</p>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-primary">Účet</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-primary">{user?.email}</div>
              <div className="text-sm text-secondary">Administrátor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-primary">Zabezpečení</h2>
        </div>
        <div className="p-4 space-y-4">
          {/* 2FA Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mfaEnabled ? "bg-green-100" : "bg-yellow-100"}`}>
                <svg className={`w-5 h-5 ${mfaEnabled ? "text-green-600" : "text-yellow-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-primary">Dvoufaktorové ověření (2FA)</div>
                <div className="text-sm text-secondary">
                  {mfaEnabled ? "Aktivní - váš účet je chráněn" : "Neaktivní - doporučujeme aktivovat"}
                </div>
              </div>
            </div>
            {!mfaEnabled && (
              <button
                onClick={setupMfa}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
              >
                Aktivovat
              </button>
            )}
            {mfaEnabled && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Aktivní
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Backups info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-primary">Zálohy</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <div className="font-medium text-green-800">Automatické zálohy jsou aktivní</div>
              <div className="text-sm text-green-600">
                Supabase provádí denní zálohy. Každá změna je také zaznamenána v historii.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
