import { useState, useEffect, useRef } from 'react'
import useWindowSize from '../utils/useWindowSize';

function Tag(props) {
    return <div className='px-2 py-1 rounded-3xl w-max text-sm lg:text-base text-zinc-900 font-bold' style={{"backgroundColor": props.color}}>
        {props.label}
    </div>
}

export default function Experiences() {
    const experiences = {
        "Axio Global Inc": {role: "Software Development Intern", timeStarted:new Date("2021-04-01"), timeEnded:new Date("2022-04-02"), description: 
            <>
                <p>Worked closely with the software development team at Axio Global to develop the Axio 360 Cyber Risk Assessment web application from April 2021 to April 2022.</p>
                <div className='flex gap-2 whitespace-pre break-words flex-wrap'>
                    <Tag label="TypeScript" color="white"/>
                    <Tag label="JavaScript" color="white"/>
                    <Tag label="Python" color="white"/>
                    <Tag label="React" color="white"/>
                    <Tag label="GraphQL" color="white"/>
                    <Tag label="Cypress" color="white"/>
                    <Tag label="Playwright" color="white"/>
                    <Tag label="Azure DevOps" color="white"/>
                </div>
            </>
        },
        "BitsOfGood": {role: "Developer", timeStarted:new Date("2023-01-24"), timeEnded:new Date("2031-04-02"), description: 
            <>
                <p>Working on the <a className='font-bold' href="https://www.southface.org/">Southface</a> project team to create a building planner for <a className='font-bold' href="https://earthcraft.org/">Earthcraft</a>, a sustainable housing program.</p>
                <p>Southface has estimated the app should improve use of Earthcraft's resources by up to 50%.</p>
                <div className='flex gap-2 whitespace-pre break-words flex-wrap'>
                    <Tag label="JavaScript" color="white"/>
                    <Tag label="Next.js" color="white"/>
                    <Tag label="React" color="white"/>
                    <Tag label="MongoDB" color="white"/>
                </div>
            </>},
        "GT WebDev": {role: "Member", timeStarted:new Date("2022-09-01"), timeEnded:new Date("2022-12-15"), description:
            <>
                <p>Worked on the 3D Interactive Site project team in the fall semester of 2022 
                    to create an interactable 3D map of the Georgia Tech campus.</p>
                <div className='flex gap-2 whitespace-pre break-words flex-wrap'>
                    <Tag label="JavaScript" color="white"/>
                    <Tag label="React" color="white"/>
                    <Tag label="ThreeJS" color="white"/>
                    <Tag label="TailwindCSS" color="white"/>
                </div>
            </> 
            },
        // "Stork Race @ GT": {role: "Officer", timeStarted:new Date("2023-01-01"), timeEnded:new Date("2030-01-01"), description: 
        //     <>
        //         <p>
        //             Primary contributor to the UI interaces used to access stork tracking data and statistics.<br></br>
        //         </p>
        //         <p>
        //             Helps plan marketing meetings and materials, including events.
        //         </p>
        //         <div className='flex gap-2 whitespace-pre break-words flex-wrap'>
        //             <Tag label="JavaScript" color="white"/>
        //         </div>
        //     </>
        // },
        "FRC Team 4026": {role: "Programming/Scouting Lead", timeStarted:new Date("2019-08-01"), timeEnded:new Date("2022-04-01"), description: 
            <>
                <p>
                    Led the programming and scouting teams, 
                    overseeing the development of the robot code for the 2020 and 2021 seasons.
                </p>
                <p>
                    Oversaw the creation of <a className='font-bold' href="https://gearbox.gg" target="_blank">gearbox.gg</a>
                    , a revolutionary FRC robotics scouting platform, from 2019 to 2022.
                </p>
                <div className='flex gap-2 whitespace-pre break-words flex-wrap'>
                    <Tag label="JavaScript" color="white"/>
                    <Tag label="Python" color="white"/>
                    <Tag label="Next.js" color="white"/>
                    <Tag label="Django" color="white"/>
                    <Tag label="React" color="white"/>
                    <Tag label="MongoDB" color="white"/>
                    <Tag label="PostgreSQL" color="white"/>
                    <Tag label="SQLite" color="white"/>
                    <Tag label="TailwindCSS" color="white"/>
                    <Tag label="AWS EC2" color="white"/>
                </div>
            </>
        },
    }

    const size = useWindowSize();
    const [experienceArray, setExperienceArray] = useState(
        Object.keys(experiences).sort((a, b) => {
            return 0;
            // return experiences[a].timeEnded < experiences[b].timeEnded ? 1 : -1;
        })
    );
    const [selected, setSelected] = useState(experienceArray[0]);
    const [role, setRole] = useState(experiences[selected].role);
    const [description, setDescription] = useState(experiences[selected].description);
    const [timeStarted, setTimeStarted] = useState(experiences[selected].timeStarted);
    const [timeEnded, setTimeEnded] = useState(experiences[selected].timeEnded);
    const frameRef = useRef();
    const [frameHeight, setFrameHeight] = useState(0);
    const [frameWidth, setFrameWidth] = useState(0);
    const largestExperience = experiences["FRC Team 4026"]; // too lazy to not hard code this rn

    useEffect(() => {
        if (frameRef.current) {
            setFrameWidth(frameRef.current.clientWidth);
            setFrameHeight(frameRef.current.clientHeight);
        }
    }, [size, frameRef.current]);

    useEffect(() => {
        setRole(experiences[selected].role);
        setDescription(experiences[selected].description);
        setTimeStarted(experiences[selected].timeStarted);
        setTimeEnded(experiences[selected].timeEnded);
    }, [selected])

    return (size.width > 640 ? <div className='flex text-2xl xl:text-6xl flex-col gap-8 border-b-0' id="Experience">
        <div className='flex gap-6 flex-col sm:flex-row'>
        <div className='flex gap-6 flex-col'>
            <h2 className='text-4xl border-zinc-300 border-8 p-4 text-zinc-300 w-max xl:text-5xl 2xl:text-6xl px-2 font-bold' id="experience-title">Experience</h2>
            <ul className='w-full font-bold'>
            {experienceArray.map((key) => {
                return <ExperienceObject key={key} title={key} description={experiences[key]} setSelected={setSelected} selected={selected}/>
            })}
            </ul>
        </div>
        <div>
            <ExperienceFrame role={role} description={description} timeStarted={timeStarted} timeEnded={timeEnded} absolute={true} frameWidth={frameWidth} frameHeight={frameHeight}/>
            <ExperienceFrame role={largestExperience.role} description={largestExperience.description} timeStarted={largestExperience.timeStarted} timeEnded={largestExperience.timeEnded} frameRef={frameRef}/>
            {/* this is bad for SEO and should be improved at some point, same as the intro */}
        </div>
        </div>
    </div> : <MobileExperiences experiences={experiences}/>);
}

function ExperienceFrame(props) {
    return <div ref={props.frameRef ? props.frameRef : undefined} className={`w-full p-2 pt-0 lg:p-8 lg:pt-0 border-zinc-300 border-0 text-zinc-300 flex flex-col gap-2 lg:gap-4 ${props.absolute ? "absolute" : "inline-block invisible"}`} style={props.absolute ? {"width": props.frameWidth} : {}}>
        <div className='border-b-4 rounded-sm border-0 border-amber-400 px-0 pb-2 break-words w-full'>
            <h3 className='sm:text-2xl md:text-4xl xl:text-5xl font-bold'>{props.role}</h3>
            <h4 className='text-md sm:text-xl md:text-2xl xl:text-3xl font-normal'>{props.timeStarted.getUTCFullYear()} - {props.timeEnded < new Date() ? props.timeEnded.getUTCFullYear() : "Current"}</h4>
        </div>
        <div className="text-lg sm:text-2xl md:text-2xl xl:text-3xl leading-normal overscroll-contain overflow-x-auto overflow-y-auto gap-4 flex flex-col">{props.description}</div>
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
        <li className={`transform-gpu cursor-pointer ease-in-out transition text-xl sm:text-xl md:text-2xl 2xl:text-3xl hover:scale-105 ${props.selected == props.title ? "translate-x-4 md:translate-x-6 lg:translate-x-10 text-amber-400 list-disc" : "text-zinc-300"}`} onClick={handleClick}>{props.title}</li>
    </div>
    )
}

function MobileExperiences(props) {
    return <div className=''>
        <div className='flex flex-col items-center'>
            <h2 className='text-3xl bg-zinc-300 text-zinc-900 w-max py-2 my-2 px-4 font-bold' id="experience-title">Experience</h2>
        </div>
        { Object.keys(props.experiences).map((key) => {
            return <MobileExperienceObject key={key} title={key} role={props.experiences[key].role} description={props.experiences[key].description}/>
        })}
    </div>
}

function MobileExperienceObject(props) {
    return <div className='flex p-4 flex-col gap-2'>
        <div className='flex-col flex p-2 gap-2'>
            <h3 className='text-2xl sm:text-2xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold'><span className='text-amber-400'>{props.title}</span> - {props.role}</h3>
            <div className='flex flex-col gap-4'>{props.description}</div>
        </div>
    </div>
}