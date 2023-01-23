import { useState, useEffect, useRef } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, GradientTexture, useCursor, Text, Center } from '@react-three/drei'
import * as THREE from 'three'

function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps);
    }
    prev.current = props;
  });
}

function RippleDivider(props) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(() => {
    ref.current.distort = .35; // THREE.MathUtils.lerp(ref.current.distort, 0.4, 0.1);
  })
  return (
    <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={[10, 3, 10]}>
      <planeGeometry args={[10, 1.5, 128, 128]} />
      <MeshDistortMaterial ref={ref} speed={6}>
        <GradientTexture stops={[0, 0.8, 1]} colors={['#f59e0b', '#fde68a', '#a8dadc']} size={100} />
      </MeshDistortMaterial>
    </mesh>
  );
}

// function ExperienceText(props) {
//   const ref = useRef();
//   const [hovered, setHovered] = useState(false);

//   return (
//     <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={[2, 2, 2]}>
//       <Center rotation={[0.1, 0, 0]}>
//         <Text3D font="/Noto Sans_Bold.json"
//         curveSegments={32}
//         bevelEnabled
//         bevelSize={0.04}
//         bevelThickness={0.1}
//         height={0.5}
//         lineHeight={0.5}
//         letterSpacing={-0.06}
//         size={1.5}>
//         Contact
//         {/* <meshPhongMaterial color="orange"/> */}
//         <meshBasicMaterial>
//           <GradientTexture
//             stops={[0, 1]}
//             colors={['#f59e0b', '#fde68a', '#a8dadc']}
//             size={1024}
//             />
//         </meshBasicMaterial>
//         </Text3D>
//       </Center>
//     </mesh>
//   );
// }

function Intro() {
  const [wordSpeaking, setWordSpeaking] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intro, setIntro] = useState();

  const introText = [
    {class: [], text: "Hi, I'm "},
    {class: ['text-amber-400'], text: "Hayden Carpenter"},
    {class: [], text: ". I'm a fullstack web developer studying "},
    {class: ['text-amber-400'], text: "Computer Science"},
    {class: [], text: " at "},
    {class: ['text-amber-400'], text: "Georgia Tech"},
    {class: [], text: "."},
  ];

  useEffect(() => {
    setIntro(generateIntro());
  }, [timer]);

  useEffect(() => {
    setWordSpeaking(0);
    setTextIndex(0);
    const timerInterval = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 100);
    return () => clearInterval(timerInterval);
  }, []);

  function generateHiddenIntroPreventCLS() {
    let textElements = introText.map((el, index) => {
      return <span className={el.class} key={index}>
        {el.text}
      </span>
    });
    textElements.push(<span key="|">|</span>);
    return <span>
      {textElements}
    </span>
  }

  function generateIntro() {
    let wordsToRender = [];
    for (let i = 0; i < introText.length; i++) {
      if (i < wordSpeaking) {
        wordsToRender.push(introText[i]);
      } else if (i == wordSpeaking) {
        let slicedText = { ...introText[i] };
        slicedText.text = slicedText.text.slice(0, textIndex);
        setTextIndex(textIndex + 1);
        if (textIndex == introText[i].text.length) {
          setWordSpeaking(wordSpeaking + 1);
          setTextIndex(0);
        }
        wordsToRender.push(slicedText);
      }
    }
    if (wordSpeaking == introText.length) {
      wordsToRender.push({ class: [], text: (timer % 16 > 8) ? "" : "|" });
    } else {
      wordsToRender.push({ class: [], text: "|" });
    }
    let textElements = wordsToRender.map((el, index) => {
      return <span className={el.class} key={index}>
        {el.text}
      </span>
    });
    return <span>
      {textElements}
    </span>
  }

    return <div className='md:p-32 sm:p-4'>
      <p className='text-3xl md:text-5xl xl:text-7xl font-bold py-4 absolute inline-block max-w-7xl'>{intro}</p>
      <p className='text-3xl md:text-5xl xl:text-7xl font-bold py-4 inline-block invisible max-w-7xl'>{generateHiddenIntroPreventCLS()}</p>
    </div>
}

function App() {
  

  function ExperienceObject(props) {
    const [toggled, setToggled] = useState(false);
    function handleClick() {
      console.log("triggered")
      setToggled(!toggled);
    };
    
    return (
      <div>
        <li className='text-zinc-300 hover:text-amber-400 hover:animate-pulse' onClick={handleClick}>{props.title}</li>
        <p className='text-3xl'>{toggled ? props.description : ""}</p>
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 text-zinc-300 min-h-screen p-4">
      <Navbar/>
      <div className=''>
        <Intro/>
      </div>
      <div className='h-16 md:h-32 lg:h-64'>
        <Canvas>
          <ambientLight />
          <RippleDivider/>
        </Canvas>
      </div>
      <div className='flex text-6xl font-bold p-16 flex-col gap-8'>
        <h2 className='text-8xl'>Experience</h2>
        <div className=''>
          <ul>
            <ExperienceObject title="BitsOfGood" description="Cool club"/>
            <li className='text-zinc-300 hover:text-amber-400 hover:animate-pulse'>GT WebDev</li>
            <li className='text-zinc-300 hover:text-amber-400 hover:animate-pulse'>Axio 360</li>
            <li className='text-zinc-300 hover:text-amber-400 hover:animate-pulse'>FRC Team 4026</li>
          </ul>
        </div>
      </div>
      <div>
      </div>
      
      <div className='md:p-16 sm:p-4'>
        <a className="text-4xl font-bold text-zinc-300 italic">{`--> my resume`}</a>
      </div>
    </div>
  )
}

export default App