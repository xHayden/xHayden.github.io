import { useState, useEffect } from 'react'

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []); 
    return windowSize;
}

export default function Experiences() {
    const experiences = {
        "Axio 360": {role: "Software Development Intern", description: "Worked closely with the software development team at Axio Global to develop the Axio 360 Cyber Risk Assessment web application from April 2021 to April 2022."},
        "BitsOfGood": {role: "Developer", description: "Lol I just joined"},
        "GT WebDev": {role: "Member", description: <p>Worked on the 3D Interactive Site project team in the fall semester of 2022 to create an interactable 3D map of the Georgia Tech campus.</p>},
        "Stork Race @ GT": {role: "Officer", description: 
            <div className='flex flex-col gap-4 font-normal'><p>Led the programming and scouting teams, overseeing the development of the robot code for the 2020 and 2021 seasons.</p>
            <p>Oversaw the creation of <a className='font-bold' href="https://gearbox.gg" target="_blank">gearbox.gg</a>, a revolutionary FRC robotics scouting platform, from 2019 to 2022.</p></div>
        },
        "FRC Team 4026": {role: "Programming/Scouting Lead", description: 
            <div className='flex flex-col gap-4 font-normal'><p>Led the programming and scouting teams, overseeing the development of the robot code for the 2020 and 2021 seasons.</p>
            <p>Oversaw the creation of <a className='font-bold' href="https://gearbox.gg" target="_blank">gearbox.gg</a>, a revolutionary FRC robotics scouting platform, from 2019 to 2022.</p></div>
        },
    }

    const [selected, setSelected] = useState(Object.keys(experiences)[0]);
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const size = useWindowSize();

    useEffect(() => {
        setRole(experiences[selected].role);
        setDescription(experiences[selected].description);
    }, [selected])

    return (size.width > 640 ? <div className='flex text-2xl xl:text-6xl py-6 px-8 lg:p-16 flex-col gap-8' id="Experience">
        <div className='flex gap-6 flex-col sm:flex-row'>
        <div className='flex gap-6 flex-col'>
            <h2 className='text-4xl bg-zinc-300 text-zinc-900 w-max p-4 xl:text-6xl 2xl:text-7xl px-2 font-bold' id="experience-title">Experience</h2>
            <ul className='w-full font-bold'>
            {Object.keys(experiences).map((key) => {
                return <ExperienceObject key={key} title={key} description={experiences[key]} setSelected={setSelected} selected={selected}/>
            })}
            </ul>
        </div>
        <ExperienceFrame role={role} description={description}/>
        </div>
    </div> : <MobileExperiences experiences={experiences}/>);
}

function ExperienceFrame(props) {
    return <div className="w-full p-2 lg:p-8 bg-zinc-300 text-zinc-900 flex flex-col gap-2 lg:gap-4" style={{"height": "60vh"}}>
        <h3 className='border-b-8 border-0 border-amber-400 p-2 break-words w-full sm:text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold'>{props.role}</h3>
        <p className="text-lg sm:text-2xl md:text-2xl p-2 xl:text-4xl leading-normal overscroll-contain overflow-x-auto overflow-y-auto">{props.description}</p>
    </div>
}

function ExperienceObject(props) {
    const [toggled, setToggled] = useState(false);
    function handleClick() {
        props.setSelected(props.title);
        setToggled(!toggled);
    };
    useEffect(() => {

    }, [toggled]);
    
    return (
    <div>
        <li className={`transform-gpu cursor-pointer ease-in-out transition text-xl sm:text-2xl md:text-4xl 2xl:text-5xl ${props.selected == props.title ? "translate-x-4 md:translate-x-6 lg:translate-x-10 text-amber-400 list-disc" : "text-zinc-300"}`} onClick={handleClick}>{props.title}</li>
    </div>
    )
}

function MobileExperiences(props) {
    return <div className=''>
        <div className='flex flex-col items-center'>
            <h2 className='text-3xl bg-zinc-300 text-zinc-900 w-max py-2 my-6 px-4 font-bold' id="experience-title">Experience</h2>
        </div>
        { Object.keys(props.experiences).map((key) => {
            return <MobileExperienceObject key={key} title={key} role={props.experiences[key].role} description={props.experiences[key].description}/>
        })}
    </div>
}

function MobileExperienceObject(props) {
    return <div className='flex p-4 flex-col gap-2'>
        <div className='flex-col flex p-2'>
            <h3 className='text-2xl sm:text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold'><span className='text-amber-400'>{props.title}</span> - {props.role}</h3>
            <p className=''>{props.description}</p>
        </div>
    </div>
}