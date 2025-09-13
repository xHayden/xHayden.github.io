import React from 'react';
import { twMerge } from 'tailwind-merge';

const ProjectCard = ({ project, onClick, className, isCompact = false }) => {
  return (
    <div
      className={twMerge(
        "bg-white overflow-hidden border-gray-600 transition-shadow duration-300 cursor-pointer group",
        "flex flex-col justify-between",
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className={twMerge(
        isCompact ? "flex flex-col gap-1 mb-2" : "flex flex-col md:flex-row md:gap-3 items-start justify-between mb-4"
      )}>
        <p className={twMerge(
          isCompact ? "text-sm font-semibold text-black/90 leading-snug" : "text-base md:text-lg font-semibold text-black/90 w-full leading-snug"
        )}>{project.name}</p>
        <p className={twMerge(
          isCompact ? "text-[10px] uppercase tracking-wider text-black/60 truncate" : "text-[11px] md:text-xs uppercase tracking-wider text-black/60 w-full leading-relaxed"
        )}>{project.description}</p>
      </div>

      <div className="">
        <div className={twMerge(isCompact ? "aspect-[4/3]" : "aspect-square", "w-full overflow-hidden rounded-md border border-black/2")}>
            <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;