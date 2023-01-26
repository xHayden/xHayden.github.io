import React, { useEffect, useState, useRef, Suspense } from 'react';
import './App.css';
const Experiences = React.lazy(() => import('./components/Experiences'));
const Contacts = React.lazy(() => import('./components/Contacts'));
const TypeText = React.lazy(() => import("./components/TypeText"));
const Projects = React.lazy(() => import('./components/Projects'));

function App() {
  const projectsTypeTextRef = useRef();
  const [scrolledToProjects, setScrolledToProjects] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((el, observer) => {
        if (!scrolledToProjects) setScrolledToProjects(el[0].isIntersecting);
    });
    observer.observe(projectsTypeTextRef.current);
  }, []);


  return (
    <div className="bg-zinc-900 text-zinc-300 min-h-screen">
      {/* <Navbar/> */}
      <div id="main-page">
        <div className='md:p-36 sm:p-8 p-8 py-32 sm:py-auto'>
            <TypeText text={[
              {class: [], text: "Hi, I'm "},
              {class: ['text-amber-400'], text: "Hayden Carpenter"},
              {class: [], text: ". I'm a fullstack web developer studying "},
              {class: ['text-amber-400'], text: "Computer Science"},
              {class: [], text: " at "},
              {class: ['text-amber-400'], text: "Georgia Tech"},
              {class: [], text: "."},
            ]}/>
        </div>
        <div className="">
            <Experiences/>
        </div>
        <div ref={projectsTypeTextRef} className='px-32 py-8'>
            <TypeText start={scrolledToProjects} text={[
              {class: [], text: "Some of the projects I've worked on..."}
            ]}/>
        </div>
        <div className="">
            <Experiences/>
        </div>
        <div>
            <Projects/>
        </div>
          <Contacts/>
      </div>
    </div>
  )
}

export default App