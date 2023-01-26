import { useEffect, useState, useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Experiences from './components/Experiences';
import Contacts from './components/Contacts';
import { Canvas } from '@react-three/fiber';
import RippleDivider from "./components/RippleDivider";
import TypeText from "./components/TypeText";

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
        <div className='md:p-8 sm:p-8 p-8 py-32 sm:py-auto'>
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
        <div className='h-16 md:h-32 lg:h-64'>
          <Canvas>
            <ambientLight />
            <RippleDivider/>
          </Canvas>
        </div>
        <div className="">
          <Experiences/>
        </div>
        <div ref={projectsTypeTextRef} className='p-6'>
          <TypeText start={scrolledToProjects} text={[
            {class: [], text: "Some of the projects I've worked on..."}
          ]}/>
        </div>  
        <Contacts/>
      </div>
    </div>
  )
}

export default App