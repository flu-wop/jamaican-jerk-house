import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Richard Rose and Jackie Diaz took Kingston jerk from a Kenner kitchen to two New Orleans-area restaurants.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-5 md:py-16">
        <div className="md:col-span-3">
          <h1 className="mb-6 font-display text-4xl font-semibold leading-tight md:text-5xl">
            One love, one <em className="font-medium text-green">sauce</em>, two dining rooms.
          </h1>
          <div className="space-y-4 leading-relaxed text-ink/80">
            <p>
              Richard Rose and Jackie Diaz started selling plates out of their home in Kenner. What began as word of
              mouth turned into a following, and by the end of 2021 the couple opened their first brick-and-mortar
              on St. Claude Avenue in the Upper Ninth Ward, painted in the yellow and green of the Jamaican flag.
            </p>
            <p>
              The dining room stayed small and personal: reggae in the air, regulars trading banter over oxtails and
              curry chicken. Then a viral review from food critic Keith Lee sent the following well past the
              neighborhood, and Jamaican Jerk House opened a second location in Metairie, with décor inspired by
              Kingston itself.
            </p>
            <p>
              Jerk Master Richard Rose is a Kingston 13 native spreading love through the art of authentic jerking.
              His jerk sauce, the one he&apos;s sold under his own name for years, is still the base of everything
              that comes out of the kitchen.
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://s3-media0.fl.yelpcdn.com/bphoto/a5yXEmjwZC-xHPvpq5XhXA/o.jpg"
              alt="Jerk plate with rice, cabbage and plantain"
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-green text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-10 text-center">
          <p className="font-display text-lg italic">Featured on Keith Lee</p>
          <span className="text-cream/40">•</span>
          <p className="font-display text-lg italic">EatOkra Black-Owned Business</p>
          <span className="text-cream/40">•</span>
          <p className="font-display text-lg italic">Covered by Axios New Orleans</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 text-center">
        <Link href="/menu" className="rounded-full bg-green px-8 py-3.5 font-medium text-cream hover:bg-ink">
          Taste it for yourself
        </Link>
      </section>
    </>
  );
}
