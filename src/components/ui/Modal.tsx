// src/components/Modal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElementRef = useRef<Element | null>(null);

  // Mount effects: lock scroll, handle Escape and focus trap
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement;

    // Kick off enter animation
    setIsVisible(false);
    const raf = requestAnimationFrame(() => setIsVisible(true));

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (event.shiftKey) {
          if (!active || active === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (!active || active === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus the modal content
    const focusTimer = window.setTimeout(() => {
      contentRef.current?.focus();
    }, 0);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previouslyFocusedElementRef.current instanceof HTMLElement) {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-out',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        ref={contentRef}
        tabIndex={-1}
        className={twMerge(
          'relative w-[92vw] max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/30 dark:border-white/10 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] ring-1 ring-black/5 p-6 sm:p-8 transition duration-300 ease-out transform',
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 dark:bg-neutral-800/70 text-gray-700 dark:text-gray-300 shadow-md ring-1 ring-black/5 hover:bg-white hover:shadow-lg hover:scale-105 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;