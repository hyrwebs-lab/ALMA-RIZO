import Reveal from "@/components/ui/Reveal";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-brand pt-32 pb-16 text-cream md:pt-36 md:pb-20">
      <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
        {eyebrow && (
          <Reveal>
            <p className="gold-rule eyebrow mb-5 justify-center text-gold">
              {eyebrow}
            </p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/75">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
