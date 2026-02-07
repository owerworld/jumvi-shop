"use client";

import { t } from "@/lib/i18n";

type CheckoutModalProps = {
  open: boolean;
  status: "idle" | "redirecting" | "error";
  onClose: () => void;
};

export default function CheckoutModal({ open, status, onClose }: CheckoutModalProps) {
  if (!open) return null;

  const title = status === "error" ? t.checkout.errorTitle : t.checkout.title;
  const body = status === "error" ? t.checkout.errorBody : t.checkout.redirecting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/60" onClick={onClose} aria-label={t.checkout.close} />
      <div className="surface relative w-[min(90vw,420px)] rounded-3xl border border-black/10 p-6 text-center">
        <h3 className="text-lg font-semibold text-[color:var(--text)]">{title}</h3>
        <p className="body-sm mt-3">{body}</p>
        {status === "error" ? (
          <button type="button" className="btn-primary mt-6 rounded-[18px] px-6 py-2 text-sm" onClick={onClose}>
            {t.checkout.close}
          </button>
        ) : null}
      </div>
    </div>
  );
}
