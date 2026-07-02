import { StarIcon } from "./Icons";
import { cn } from "@/lib/utils";

/** Renders 5 stars with half-star support, in gold. */
export default function Stars({
  rating,
  className,
  size = 16,
}: {
  rating: number;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-0.5 text-gold", className)}
      aria-label={`${rating} de 5 estrellas`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)); // 0..1
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <StarIcon
              className="absolute inset-0"
              style={{ width: size, height: size }}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.2}
            />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <StarIcon
                style={{ width: size, height: size }}
                fill="currentColor"
                stroke="none"
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}
