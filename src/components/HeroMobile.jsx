import React from "react";

const HeroMobile = () => {
  return (
    <section className="md:hidden">
      {/* <div className="flex gap-3">
        <img
          className="w-12 h-12 rounded-full object-cover object-[0%_20%] border border-black/10 shrink-0"
          src="https://img.hayden.gg/nJuWFumzv4.jpeg"
          alt="Hayden Carpenter avatar"
        />
      </div> */}
      <div className="mt-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-nowrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl uppercase font-semibold tracking-tight leading-tight truncate">
                Hayden Carpenter
              </h1>
            </div>
          </div>
          <p className="text-[13px] leading-snug text-black/70 mt-1">
            Software Developer in Atlanta, GA
          </p>
          <div className="flex flex-wrap gap-1.5 pt-2">
            <span className="inline-flex items-center rounded-full border border-black/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Georgia Tech Student
            </span>
            <span className="inline-flex items-center rounded-full border border-black/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              Director of Engineering @ Bits of Good
            </span>
          </div>
          <div className="flex flex-col w-full justify-start gap-1 mt-2">
            <p className="uppercase text-[10px] tracking-[0.2em] text-black/60">
              Previously
            </p>
            <p className="text-[11px] leading-snug text-black/60">
              <span>Georgia Tech Research Institute (GTRI)</span>
              <span className="px-2 text-black/30">•</span>
              <span>MaxRewards</span>
              <span className="px-2 text-black/30">•</span>
              <span>Axio Global Inc</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMobile;
