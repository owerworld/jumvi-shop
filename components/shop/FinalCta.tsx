type FinalCtaProps = {
  price: number;
  onAddToCart: () => void;
};

export default function FinalCta({ price, onAddToCart }: FinalCtaProps) {
  return (
    <section className="section-pad pt-12">
      <div className="surface mx-auto max-w-6xl rounded-3xl border border-black/5 p-8 text-center">
        <h2 className="title-md text-[color:var(--text)]">Hazır mısınız?</h2>
        <p className="body-sm mt-2">Çocuğunuzun enerjisini oyuna dönüştürün.</p>
        <button type="button" className="btn-primary mt-6 rounded-[18px] px-8 py-3 text-sm" onClick={onAddToCart}>
          Sepete Ekle
        </button>
      </div>
      <div className="surface fixed inset-x-0 bottom-0 z-20 border-t border-black/5 px-5 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="text-sm font-semibold text-[color:var(--text)]">${price} • Sepete Ekle</div>
          <button type="button" className="btn-primary rounded-[16px] px-4 py-2 text-xs" onClick={onAddToCart}>
            Sepete Ekle
          </button>
        </div>
      </div>
    </section>
  );
}
