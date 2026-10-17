import Image from "next/image";
import Link from "next/link";
import { findByName, hasRange, money } from "@/lib/menu";
import { locationList } from "@/lib/site";
import LocationCard from "@/components/sections/LocationCard";

const HERO =
  "https://0c5bb43d305fed74f010.cdn6.editmysite.com/uploads/b/0c5bb43d305fed74f010be4cef9ec539d24182cb2cc4e24edf96f3f409b93825/2024-10-06_12-40-53_1728236477.jpg?width=1200";
const STORY =
  "https://s3-media0.fl.yelpcdn.com/bphoto/a5yXEmjwZC-xHPvpq5XhXA/ls.jpg";

const GROUPS: { title: string; names: string[] }[] = [
  { title: "Jerk & Mains", names: ["Authentic Jerk Chicken", "Pork Rib", "Jerk Shrimp Plate", "Oxtails", "Curry Chicken", "Curry Goat"] },
  { title: "Tacos & Handhelds", names: ["3 Jerk Chicken Tacos", "3 Ox Taco's", "Jerk Burger", "Oxtail Burger"] },
  { title: "Sides & Sweets", names: ["Rice & Peas", "Mac", "Sweet Plantains", "Jerk Brussels", "Chocolate Rum Cake"] },
];

export default function Home() {
  const groups = GROUPS.map((g) => ({
    title: g.title,
    items: g.names
      .map((n) => findByName("metairie", n))
      .filter((i): i is NonNullable<typeof i> => !!i),
  }));

  return (
    <>
      {/* HERO */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-14 pt-10 md:grid-cols-2 md:pt-16">
        <div>
          <p className="mb-4 font-medium tracking-wide text-green">
            Feeding our community fresh food daily. One love.
          </p>
          <h1 className="mb-6 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
            Kingston jerk,
            <br /> built from home
            <br /> in New Orleans.
          </h1>
          <p className="mb-8 max-w-md text-lg leading-relaxed text-ink/80">
            Jerk Master Richard Rose is a Kingston 13 native spreading love through the art of authentic
            jerking, from a home kitchen in Kenner to two dining rooms filling up on both sides of the river.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/menu" className="rounded-full bg-green px-7 py-3.5 font-medium text-cream transition-colors hover:bg-ink">
              Order Online
            </Link>
            <Link href="/locations" className="rounded-full border border-ink/30 px-7 py-3.5 font-medium transition-colors hover:border-ink">
              Find a Location
            </Link>
          </div>
          <p className="mt-3 text-sm text-ink/55">Pickup at either location. No account needed.</p>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
            <Image src={HERO} alt="Braised oxtail plate from Jamaican Jerk House" fill priority sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* PICK A LOCATION */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h2 className="mb-2 font-display text-3xl font-semibold md:text-4xl">Pick up in <em className="font-medium">minutes</em>, not miles</h2>
        <p className="mb-10 text-ink/65">Two kitchens, two menus. Choose yours and order for pickup.</p>
        <div className="grid gap-8 md:grid-cols-2">
          {locationList.map((l) => (
            <LocationCard key={l.slug} l={l} />
          ))}
        </div>
      </section>

      <div className="rule" />

      {/* STORY */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-5 md:py-20">
        <div className="order-2 md:order-1 md:col-span-2">
          <div className="relative mx-auto aspect-[3/4] max-w-xs overflow-hidden rounded-2xl shadow-lg md:mx-0">
            <Image src={STORY} alt="Jerk plate with rice, cabbage and plantain" fill sizes="320px" className="object-cover" />
          </div>
        </div>
        <div className="order-1 md:order-2 md:col-span-3">
          <h2 className="mb-5 font-display text-3xl font-semibold md:text-4xl">
            From a Kenner kitchen to <em className="font-medium">two</em> dining rooms
          </h2>
          <div className="space-y-4 leading-relaxed text-ink/80">
            <p>
              Richard Rose and Jackie Diaz started selling plates out of their home in Kenner. What began as word
              of mouth turned into a following, and by the end of 2021 the couple opened their first
              brick-and-mortar on St. Claude Avenue in the Upper Ninth Ward, painted in the yellow and green of
              the Jamaican flag.
            </p>
            <p>
              A viral review from food critic Keith Lee sent the following well past the neighborhood, and
              Jamaican Jerk House opened a second location in Metairie, with décor inspired by Kingston itself.
            </p>
          </div>
          <Link href="/about" className="mt-6 inline-block font-medium text-green underline underline-offset-4 hover:text-ink">
            Read the full story
          </Link>
        </div>
      </section>

      {/* SIGNATURE PLATES */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Plates worth the <em className="font-medium text-gold">drive</em>
            </h2>
            <Link href="/menu" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-cream">
              See the full menu
            </Link>
          </div>
          <div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title}>
                <h3 className="mb-4 font-display text-lg text-gold">{g.title}</h3>
                <ul className="space-y-3 text-cream/90">
                  {g.items.map((i) => (
                    <li key={i.id} className="flex items-baseline">
                      <span>{i.name}</span>
                      <span className="menu-dots" />
                      <span className="text-gold">{hasRange(i) ? `from ${money(i.price)}` : money(i.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-cream/50">Metairie pricing shown. Each location&apos;s menu is on its order page.</p>
        </div>
      </section>

      <div className="rule" />

      {/* CATERING */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid items-center gap-8 rounded-3xl bg-green p-8 text-cream md:grid-cols-3 md:p-12">
          <div className="md:col-span-2">
            <h2 className="mb-3 font-display text-3xl font-semibold md:text-4xl">
              Feeding a crowd? Bring the <em className="font-medium text-gold">jerk</em>.
            </h2>
            <p className="max-w-xl text-cream/85">
              Large pans of jerk chicken, curry, goat and sides for parties, offices and family gatherings.
              Tell us the date and headcount and we&apos;ll take it from there.
            </p>
          </div>
          <div className="md:text-right">
            <Link href="/catering" className="inline-block rounded-full bg-gold px-7 py-3.5 font-semibold text-ink hover:bg-cream">
              Plan your catering
            </Link>
            <p className="mt-2 text-xs text-cream/70">No obligation. Just tell us the date and headcount.</p>
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="bg-green text-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 py-10 text-center">
          <p className="font-display text-lg italic">Featured on Keith Lee</p>
          <span className="text-cream/40">•</span>
          <p className="font-display text-lg italic">EatOkra Black-Owned Business</p>
          <span className="text-cream/40">•</span>
          <p className="font-display text-lg italic">Covered by Axios New Orleans</p>
        </div>
      </section>
    </>
  );
}
