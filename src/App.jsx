import React, { useEffect, useState, useRef, Suspense } from 'react';
import './App.css';
const Experiences = React.lazy(() => import('./components/Experiences'));
const Contacts = React.lazy(() => import('./components/Contacts'));
const TypeText = React.lazy(() => import("./components/TypeText"));
const Projects = React.lazy(() => import('./components/Projects'));
import hayden2 from "./assets/hayden2.jpg"

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
        <div className='py-32 sm:py-auto flex w-full gap-16 items-center'>
          <div className='w-full flex flex-col gap-8'>
            <p className='text-3xl md:text-5xl xl:text-8xl font-bold'>I'm <span className='text-secondary'>Hayden Carpenter</span>.</p>
            <p className='text-3xl md:text-5xl xl:text-4xl font-thin'>
              I'm a fullstack web developer studying Computer Science at <span className="text-secondary">Georgia Tech</span>.
              I specialize in web app development, but I'm pursuing ways to make <span className="text-secondary">AI designed for humans</span>.
            </p>
            {/* <div className='border-2 bg-primary px-8 py-8 font-thin'>
              <TypeText text={[
                {class: [], text: "> I'm a fullstack web developer studying "},
                {class: ['text-secondary'], text: "Computer Science"},
                {class: [], text: " at "},
                {class: ['text-secondary'], text: "Georgia Tech"},
                {class: [], text: "."},
              ]}/>
            </div> */}
          </div>
          {/* <div className=''>
            <img src={hayden2} width={"400"} className='rounded-xl'></img>
          </div> */}
        </div>
        <div className="">
            <Experiences/>
        </div>
        {/* <div className="">
            <div className='border-2 bg-primary px-8 py-8 font-thin'>
              <TypeText text={[
                {class: [], text: "> python requirements.txt"},
                {class: [], text: "\ntest"},
              ]}/>
            </div>
        </div> */}
        <div ref={projectsTypeTextRef} className='pb-4 pt-16'>
            <TypeText start={scrolledToProjects} text={[
              {class: [''], text: "Some of the projects I've worked on..."}
            ]} blinkingCursor={false}/>
        </div>
        <div className="">
            <Projects/>
        </div>
        <div className='flex mt-8 2xl:mt-32 font-thin text-xl'>
          <a>Hayden Carpenter © {new Date().getFullYear().toString()}</a>
        </div>
          <Contacts/>
      </div>
    </div>
  )
}

export default App