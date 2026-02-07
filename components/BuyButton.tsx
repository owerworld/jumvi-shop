export default function BuyButton() {
  return (
    <div className="space-y-2">
      <button
        type="button"
        className="btn-primary w-full cursor-not-allowed opacity-60"
        disabled
        aria-disabled="true"
      >
        Satin al
      </button>
      <p className="text-xs text-brand-ink/60">Satin alma yakinda acilacak.</p>
    </div>
  );
}
