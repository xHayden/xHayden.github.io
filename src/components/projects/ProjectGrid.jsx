
import React, { useState, useEffect, useMemo } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import Pagination from '../ui/Pagination';
import { BREAKPOINTS } from "../../../portfolio.config";

const getItemsPerPage = (width) => {
  if (width >= BREAKPOINTS['2xl']) {
    return 4;
  } else if (width >= BREAKPOINTS.lg) {
    return 3;
  } else if (width >= BREAKPOINTS.sm) {
    return 2;
  } else {
    return 2;
  }
};

const ProjectGrid = ({ projects, isMobile = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (isMobile) {
      setItemsPerPage(2);
      return;
    }
    setItemsPerPage(getItemsPerPage(window.innerWidth));
    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage(window.innerWidth);
      if (newItemsPerPage !== itemsPerPage) {
         setItemsPerPage(newItemsPerPage);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerPage, isMobile]);


  const totalPages = Math.ceil(projects.length / itemsPerPage);

   // Reset to last page if current page becomes invalid after itemsPerPage changes
   useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
      }
      // Reset to page 1 if pagination disappears (totalPages becomes 1 or 0)
      // and we weren't already on page 1. Avoids unnecessary state updates.
      else if (totalPages <= 1 && currentPage !== 1) {
          setCurrentPage(1);
      }
   }, [currentPage, totalPages]);

  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return projects.slice(startIndex, endIndex);
  }, [projects, currentPage, itemsPerPage]);

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <div>
      <div
        className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8"}
      >
        {currentProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isCompact={isMobile}
            onClick={() => handleCardClick(project)}
          />
        ))}
      </div>
       {totalPages > 1 && (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      )}
      <ProjectModal isOpen={!!selectedProject} onClose={handleCloseModal}>
        {selectedProject?.modalContent}
      </ProjectModal>
    </div>
  );
};

export default ProjectGrid;