import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { categories } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const collections = [
  {
    href: "/street",
    label: "Street Photography",
    description:
      "Candid stories from the streets of Pune, Talegaon and Vadgaon — strangers, chai stalls, fleeting glances.",
    items: ["Pune", "Talegaon", "Vadgaon"],
    photos: categories.street,
  },
  {
    href: "/cultural",
    label: "Cultural Events",
    description:
      "The pulse of Maharashtra's traditions — Ganpati visarjan, Gudi Padwa processions, and Diwali nights.",
    items: ["Ganpati", "Gudi Padwa", "Diwali"],
    photos: categories.cultural,
  },
  {
    href: "/events",
    label: "Events",
    description:
      "Live moments where rhythm and movement take over — dance stages and the grit of kushti akhadas.",
    items: ["Live Dance Show", "Wrestling"],
    photos: categories.events,
  },
];

export default function Portraits() {
  return (
    <Layout>
      <div className="pt-32 pb-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">
            Collections
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Portraits
          </h1>
          <p className="text-muted-foreground font-light text-lg">
            A body of work organised by the moments that make it. Choose a
            collection below to step into the frames.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-24">
          {collections.map((c, idx) => {
            const cover = c.photos[0];
            const secondary = c.photos[1] ?? c.photos[0];
            const isReverse = idx % 2 === 1;
            return (
              <motion.div
                key={c.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center ${
                  isReverse ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* Image collage */}
                <Link
                  href={c.href}
                  className="col-span-1 md:col-span-7 group block [direction:ltr]"
                >
                  <div className="relative grid grid-cols-5 grid-rows-6 gap-3 h-[60vh] md:h-[72vh]">
                    {cover && (
                      <div className="col-span-5 md:col-span-4 row-span-5 overflow-hidden bg-muted">
                        <img
                          src={cover.src}
                          alt={cover.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    )}
                    {secondary && (
                      <div className="hidden md:block col-span-2 col-start-4 row-start-5 row-span-2 overflow-hidden bg-muted shadow-2xl">
                        <img
                          src={secondary.src}
                          alt={secondary.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Text */}
                <div className="col-span-1 md:col-span-5 [direction:ltr]">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                    0{idx + 1} — Collection
                  </p>
                  <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
                    {c.label}
                  </h2>
                  <p className="text-muted-foreground font-light text-lg leading-relaxed mb-8">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-10">
                    {c.items.map((item) => (
                      <Link
                        key={item}
                        href={`${c.href}#${encodeURIComponent(item)}`}
                        className="px-4 py-1.5 text-xs uppercase tracking-wide border border-border text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-foreground border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
                  >
                    View Collection
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
