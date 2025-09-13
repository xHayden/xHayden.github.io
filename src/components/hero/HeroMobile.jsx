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
      <div className="mt-2 flex flex-col items-center gap-3">
        <img
          className="w-14 h-14 rounded-full object-cover object-[0%_20%] border border-black/10 shadow-sm"
          src="/photos/nJuWFumzv4.webp"
          alt="Hayden Carpenter profile photo"
        />
        <div className="w-full max-w-[520px] text-center">
          <h1 className="text-[28px] uppercase font-semibold tracking-tight leading-tight">
            Hayden Carpenter
          </h1>
          <p className="text-[15px] leading-snug text-black/70 mt-1">
            Software Developer in Atlanta, GA
          </p>
          <div className="flex justify-center gap-1.5 pt-1 flex-col items-center">
            <span className="items-center rounded-full border border-black/15 px-2 py-0.5 text-[12px] uppercase tracking-wide w-max">
              Georgia Tech Student
            </span>
            <span className="items-center rounded-full border border-black/15 px-2 py-0.5 text-[12px] uppercase tracking-wide w-max">
              Director of Engineering @ Bits of Good
            </span>
          </div>
          <div className="flex flex-col w-full items-center gap-1 mt-1">
            <p className="uppercase text-[12px] tracking-[0.2em] text-black/60">
              Previously
            </p>
            <p className="text-[13px] leading-snug text-black/60">
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
