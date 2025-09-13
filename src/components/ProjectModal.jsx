import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-md border border-black/15 px-3 py-1 text-xs font-medium text-black hover:bg-black hover:text-white transition">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 opacity-70" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
    </svg>
    {children}
  </span>
);

const LinkPill = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer noopener"
    className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-2 text-sm text-black hover:bg-black hover:text-white transition"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 opacity-80" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18a2 2 0 012 2v4.5M10.5 17.999H6A2 2 0 014 16v-4.5M14 10l-4 4M10 10l4 4" />
    </svg>
    <span className="truncate max-w-[18ch]">{label}</span>
  </a>
);

const ProjectModal = ({ name, description, benefits, links = [], className }) => {
  return (
    <div className={twMerge("flex flex-col gap-5", className)}>
      <div>
        <h3 className="text-xl md:text-2xl font-semibold leading-tight text-black">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-black/70">{description}</p>
      </div>

      {Array.isArray(benefits) && benefits.length > 0 && (
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-black/60 mb-2">Highlights</div>
          <div className="flex flex-wrap gap-2">
            {benefits.map((b, i) => (
              <Badge key={i}>{b}</Badge>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(links) && links.length > 0 && (
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-black/60 mb-2">Links</div>
          <div className="flex flex-wrap gap-2">
            {links.map((l, i) => (
              <LinkPill key={i} href={l.href} label={l.label} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectModal;


