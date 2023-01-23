import { useState, useEffect } from 'react'

export default function Experiences() {
    const experiences = {
        "Axio 360": {role: "Software Development Intern", description: "Worked closely with the software development team at Axio Global to develop the Axio 360 Cyber Risk Assessment web application from April 2021 to April 2022."},
        "BitsOfGood": {role: "Developer", description: "Lol I just joined"},
        "GT WebDev": {role: "Member", description: <p>Worked on the 3D Interactive Site project team in the fall semester of 2022 to create an interactable 3D map of the Georgia Tech campus.</p>},
        "FRC Team 4026": {role: "Programming/Scouting Lead", description: 
            <div className='flex flex-col gap-4'><p>Led the programming and scouting teams, overseeing the development of the robot code for the 2020 and 2021 seasons.</p>
            <p>Oversaw the creation of <a className='text-amber-400 bg-zinc-900 px-2 py-1' href="https://gearbox.gg" target="_blank">gearbox.gg</a>, a revolutionary FRC robotics scouting platform, from 2019 to 2022.</p></div>
        },
    }

    const [selected, setSelected] = useState(Object.keys(experiences)[0]);
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setRole(experiences[selected].role);
        setDescription(experiences[selected].description);
    }, [selected])

    return (<div className='flex text-2xl lg:text-6xl font-bold py-6 px-4 lg:p-16 flex-col gap-8' id="Experience">
        <div className='flex gap-6'>
        <div className='flex gap-6 flex-col'>
            <h2 className='text-4xl bg-zinc-300 text-zinc-900 w-max p-4 lg:text-8xl px-2' id="experience-title">Experience</h2>
            <ul className='w-full'>
            {Object.keys(experiences).map((key) => {
                return <ExperienceObject key={key} title={key} description={experiences[key]} setSelected={setSelected} selected={selected}/>
            })}
            </ul>
        </div>
        <ExperienceFrame role={role} description={description}/>
        </div>
    </div>);
}

function ExperienceFrame(props) {
    return <div className="w-full p-8 bg-zinc-300 text-zinc-900 flex flex-col gap-4">
        <h3 className='border border-b-8 border-0 border-amber-400 w-max p-2'>{props.role}</h3>
        <p className="text-4xl leading-normal">{props.description}</p>
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
        <li className={`transform-gpu cursor-pointer ease-in-out transition ${props.selected == props.title ? "translate-x-12 text-amber-400" : "text-zinc-300"}`} onClick={handleClick}>{props.title}</li>
    </div>
    )
}