import Image from "next/image";

export default function BeforeAfterPair({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-brand/10 bg-white">
      <div className="grid grid-cols-2 gap-px bg-brand/10">
        <div className="relative aspect-[3/4] bg-cream">
          <Image src={before} alt="Antes" fill sizes="(min-width:768px) 22vw, 45vw" className="object-cover" />
          <span className="absolute left-2 top-2 bg-ink/75 px-2.5 py-1 text-[0.6rem] uppercase tracking-widest text-cream">
            Antes
          </span>
        </div>
        <div className="relative aspect-[3/4] bg-cream">
          <Image src={after} alt="Después" fill sizes="(min-width:768px) 22vw, 45vw" className="object-cover" />
          <span className="absolute right-2 top-2 bg-gold px-2.5 py-1 text-[0.6rem] uppercase tracking-widest text-brand-deep">
            Después
          </span>
        </div>
      </div>
      {label && (
        <figcaption className="px-4 py-3 text-center text-sm text-ink-soft">{label}</figcaption>
      )}
    </figure>
  );
}
