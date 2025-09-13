import React from "react";
import ProjectGrid from "./ProjectGrid";

const ProjectsMobile = ({ projects }) => {
  return (
    <section className="md:hidden flex flex-col gap-2">
      <p className="uppercase text-[12px] tracking-[0.2em] text-black/60">Projects</p>
      <ProjectGrid projects={projects} isMobile={true} />
    </section>
  );
};

export default ProjectsMobile;


