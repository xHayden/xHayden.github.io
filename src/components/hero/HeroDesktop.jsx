import React from "react";

const HeroDesktop = () => {
  return (
    <section className="hidden md:grid grid-cols-[2fr_1fr] text-left gap-6">
      <div className="md:py-12 pt-12 px-0">
        <div className="md:pb-10 pb-6">
          <div className="flex-wrap flex-col flex w-full gap-3">
            <div className="w-full relative">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl uppercase font-bold leading-[0.95]">
                Hayden Carpenter
              </h1>
            </div>
            <p className="text-xl leading-relaxed text-black/80">
              Software Developer in Atlanta, GA
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-sm uppercase tracking-wide">
                Georgia Tech Student
              </span>
              <span className="inline-flex items-center rounded-full border border-black/20 px-3 py-1 text-sm uppercase tracking-wide">
                Director of Engineering @ Bits of Good
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full justify-start gap-1">
          <p className="uppercase text-xs tracking-[0.2em] text-black/60">Previously</p>
          <p className="text-base text-black/70">
            <span>Georgia Tech Research Institute (GTRI)</span>
            <span className="px-2 text-black/30">•</span>
            <span>MaxRewards</span>
            <span className="px-2 text-black/30">•</span>
            <span>Axio Global Inc</span>
          </p>
        </div>
      </div>
      <div className="w-max justify-self-end">
        <img
          className="block h-auto md:max-h-[520px] w-auto max-w-full object-contain rounded"
          src="/photos/nJuWFumzv4.webp"
          alt="Hayden Carpenter profile photo"
        />
      </div>
    </section>
  );
};

export default HeroDesktop;


