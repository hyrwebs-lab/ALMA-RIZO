export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-cream-soft py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-6 sm:px-8 [&_a]:text-brand [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-brand [&_h2:first-child]:mt-0 [&_li]:mt-1.5 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:text-ink-soft">
      {children}
      </div>
    </section>
  );
}
