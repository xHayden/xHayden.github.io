import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
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
    <div className="">
      <div id="main-page" className='bg-primary text-primarytext min-h-screen sm:p-8 p-8 md:px-32 2xl:px-64 3xl:pt-6 3xl:px-96'>
        <Navbar/>
        <div className='pt-14 pb-24 md:pt-20 md:pb-12 sm:py-auto flex w-full gap-16 items-center'>
          <div className='w-full flex flex-col gap-2 md:gap-8'>
            <p className='text-3xl md:text-5xl xl:text-7xl font-bold'>I'm <span className='text-secondary'>Hayden Carpenter</span>.</p>
            <p className='text-2xl md:text-3xl xl:text-4xl font-thin'>
              I'm a fullstack web developer studying Computer Science at <span className="text-secondary">Georgia Tech</span>.
              I specialize in web app development, but I'm pursuing ways to make <span className="text-secondary">AI designed for humans</span>.
            </p>
          </div>
        </div>
        <div className="">
            <Experiences/>
        </div>
        <div ref={projectsTypeTextRef} className='pb-2'>
            <TypeText start={scrolledToProjects} text={[
              {class: [''], text: "Some of the projects I've worked on..."}
            ]} blinkingCursor={false}/>
        </div>
        <div className="">
            <Projects/>
        </div>
        <div className='flex mt-16 2xl:mt-32 font-thin text-sm'>
          <p>Hayden Carpenter © {new Date().getFullYear().toString()}</p>
        </div>
          <Contacts/>
      </div>
    </div>
  )
}

export default App