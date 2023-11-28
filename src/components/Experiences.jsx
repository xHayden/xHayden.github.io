import { useState, useEffect, useRef } from "react";
import useWindowSize from "../utils/useWindowSize";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function Tag(props) {
  return (
    <div className="px-2 py-1 rounded-3xl w-max text-xs lg:text-base text-primarytext font-semibold border-2 border-buttonborder">
      {props.label}
    </div>
  );
}

function Tags(props) {
  if (!props?.tags) {
    return <></>;
  }
  return (
    <div className="flex gap-2 whitespace-pre break-words flex-wrap">
      {props.tags.map((tag) => {
        return <Tag label={tag} key={tag} color="white"></Tag>;
      })}
    </div>
  );
}

export default function Experiences() {
  const experiences = {
    MaxRewards: {
      role: "Software Development Intern",
      timeStarted: new Date("2023-08-01"),
      description: (
        <>
          <p>
            I'm working at <a className="font-bold text-secondary" href="https://maxrewards.com">MaxRewards</a> to create their main marketing site <a className="font-bold text-secondary" href="https://maxrewards.com">MaxRewards.com</a> and am also developing infrastructure for automatic web content
            generation.
          </p>
          <Tags
            tags={[
              "Typescript",
              "JavaScript",
              "React",
              "MongoDB",
              "PostgreSQL",
              "AWS",
            ]}
          />
        </>
      ),
    },
    "Bits Of Good (Hack4Impact)": {
      role: "Senior Developer",
      timeStarted: new Date("2023-01-24"),
      timeEnded: new Date("2031-04-02"),
      description: (
        <>
          <p>
            I worked on the{" "}
            <a className="font-bold text-secondary" href="https://www.southface.org/">
              Southface
            </a>{" "}
            project team to create a building planner for{" "}
            <a className="font-bold text-secondary" href="https://earthcraft.org/">
              Earthcraft
            </a>
            , a sustainable housing program. Southface has estimated the app
            should improve the use of Earthcraft's resources by up to 50%.
            I'm now working on{" "}
            <a
              className="font-bold text-secondary"
              href="https://github.com/GTBitsOfGood/juno"
            >
              Juno
            </a>
            , Bits of Good's infrastructure API to accelerate developer
            workflows. It's kind of like Firebase, but for keeping an integrated structure across all of BoG's nonprofit projects. It has a microservice architecture designed for
            redundancy and predictability.
          </p>
          <Tags
            tags={[
              "JavaScript",
              "Next.js",
              "React",
              "MongoDB",
              "Nest.js",
              "gRPC",
              "Protobuf",
              "Prisma",
              "Postgres",
              "Docker",
            ]}
          />
        </>
      ),
    },
    "Axio Global Inc": {
      role: "Software Development Intern",
      timeStarted: new Date("2021-04-01"),
      timeEnded: new Date("2022-04-02"),
      description: (
        <>
          <p>
            I worked closely with the software development team at Axio Global to
            develop the Axio 360 Cyber Risk Assessment web application.
          </p>
          <Tags
            tags={[
              "Typescript",
              "JavaScript",
              "Python",
              "React",
              "MongoDB",
              "GraphQL",
              "Cypress",
              "Playwright",
              "Azure DevOps",
            ]}
          />
        </>
      ),
    },
    // "Fantasy Stork League": {role: "Officer", timeStarted:new Date("2023-01-01"), timeEnded:new Date("2030-01-01"), description:
    //     <>
    //         <p>
    //             Primary contributor building the <a href="https://storkrace.com">StorkRace.com</a> website for team creation/management and monitoring Fantasy Football-inspired drafts.<br></br>
    //         </p>
    //         <Tags tags={["JavaScript", "React", "TailwindCSS", "MongoDB"]} />
    //     </>
    // },
    // "GT WebDev": {role: "Member", timeStarted:new Date("2022-09-01"), timeEnded:new Date("2022-12-15"), description:
    //     <>
    //         <p>Worked on the 3D Interactive Site project team in the fall semester of 2022
    //             to create an interactable 3D map of the Georgia Tech campus.</p>
    //         <Tags tags={["JavaScript", "React", "ThreeJS", "TailwindCSS"]} />
    //     </>
    // },
    // "FRC Team 4026": {role: "Programming/Scouting Lead", timeStarted:new Date("2019-08-01"), timeEnded:new Date("2022-04-01"), description:
    //     <>
    //         <p>
    //             Led the programming and scouting teams,
    //             overseeing the development of the robot code for the 2020 and 2021 seasons.
    //         </p>
    //         <p>
    //             Oversaw the creation of <a className='font-bold' href="https://gearbox.gg" target="_blank">gearbox.gg</a>
    //             , a revolutionary FRC robotics scouting platform, from 2019 to 2022.
    //         </p>
    //         <Tags
    //         tags={[
    //             "JavaScript",
    //             "Python",
    //             "Next.js",
    //             "Django",
    //             "React",
    //             "MongoDB",
    //             "PostgreSQL",
    //             "SQLite",
    //             "TailwindCSS",
    //             "AWS EC2"
    //         ]}
    //     />
    //     </>
    // },
  };

  const size = useWindowSize();
  const [experienceArray, setExperienceArray] = useState(
    Object.keys(experiences).sort((a, b) => {
      return 0;
      // return experiences[a].timeEnded < experiences[b].timeEnded ? 1 : -1;
    })
  );
  const [selected, setSelected] = useState(experienceArray[0]);
  const [role, setRole] = useState(experiences[selected].role);
  const [description, setDescription] = useState(
    experiences[selected].description
  );
  const [timeStarted, setTimeStarted] = useState(
    experiences[selected].timeStarted
  );
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
  }, [selected]);

  // return (size.width > 640 ? <div className='flex text-2xl md:text-3xl xl:text-6xl flex-col gap-8 border-b-0' id="Experience">
  //     <div className='flex gap-6 flex-col sm:flex-row'>
  //     <div className='flex gap-2 flex-col'>
  //         <h2 className='text-2xl border-primarytext text-primarytext w-max xl:text-3xl 2xl:text-4xl border-b-2' id="experience-title">Work Experience</h2>
  //         <ul className='w-full font-normal'>
  //         {experienceArray.map((key) => {
  //             return <ExperienceObject key={key} title={key} description={experiences[key]} setSelected={setSelected} selected={selected}/>
  //         })}
  //         </ul>
  //     </div>
  //     <div>
  //         <ExperienceFrame role={role} description={description} timeStarted={timeStarted} timeEnded={timeEnded} absolute={true} frameWidth={frameWidth} frameHeight={frameHeight}/>
  //         <ExperienceFrame role={largestExperience.role} description={largestExperience.description} timeStarted={largestExperience.timeStarted} timeEnded={largestExperience.timeEnded} frameRef={frameRef}/>
  //         {/* this is bad for SEO and should be improved at some point, same as the intro */}
  //     </div>
  //     </div>
  // </div> : <MobileExperiences experiences={experiences}/>);
  return <MobileExperiences experiences={experiences} />;
}

function ExperienceFrame(props) {
  return (
    <div
      ref={props.frameRef ? props.frameRef : undefined}
      className={`w-full p-2 pt-0 lg:p-8 lg:pt-0 border-primarytext border-0 text-primarytext flex flex-col gap-2 lg:gap-4 ${
        props.absolute ? "absolute" : "inline-block invisible"
      }`}
      style={props.absolute ? { width: props.frameWidth } : {}}
    >
      <div className="border-b-4 rounded-sm border-0 border-secondary px-0 pb-2 break-words w-full">
        <h3 className="sm:text-2xl md:text-3xl xl:text-4xl textSlightlyLarger">
          {props.role}
        </h3>
        <h4 className="text-md sm:text-xl md:text-xl xl:text-3xl font-thin">
          {months[props.timeStarted.getUTCMonth()]}{" "}
          {props.timeStarted.getUTCFullYear()} -{" "}
          {props.timeEnded < new Date()
            ? String(months[props.timeEnded.getUTCMonth()]) +
              " " +
              String(props.timeEnded.getUTCFullYear())
            : "Present"}
        </h4>
      </div>
      <div className="text-lg sm:text-2xl md:text-xl xl:text-3xl leading-normal font-thin overscroll-contain overflow-x-auto overflow-y-auto gap-4 flex flex-col">
        {props.description}
      </div>
    </div>
  );
}

function ExperienceObject(props) {
  const [toggled, setToggled] = useState(false);
  function handleClick() {
    props.setSelected(props.title);
    setToggled(!toggled);
  }
  useEffect(() => {}, [toggled]);

  return (
    <div>
      <li
        className={`transform-gpu cursor-pointer ease-in-out transition text-xl sm:text-xl md:text-xl 2xl:text2xl font-normal hover:scale-105 ${
          props.selected == props.title
            ? "translate-x-4 md:translate-x-6 lg:translate-x-10 text-secondary list-disc"
            : "text-primarytext"
        }`}
        onClick={handleClick}
      >
        {props.title}
      </li>
    </div>
  );
}

function MobileExperiences(props) {
  return (
    <div className="flex flex-col gap-12 pb-24 md:pb-12">
      {Object.keys(props.experiences).map((key) => {
        return (
          <MobileExperienceObject
            key={key}
            title={key}
            role={props.experiences[key].role}
            description={props.experiences[key].description}
            timeStarted={props.experiences[key].timeStarted}
            timeEnded={props.experiences[key].timeEnded}
          />
        );
      })}
    </div>
  );
}

function MobileExperienceObject(props) {
  return (
    <div className="flex flex-col">
      <div className="flex-col flex gap-1">
        <div className="flex flex-col">
          <h3 className="text-2xl sm:text-2xl md:text-2xl xl:text-2xl 2xl:text-3xl font-bold">
            <span className="text-secondary">{props.title}</span> - {props.role}
          </h3>
          <h4 className="text-lg -mt-1 opacity-50">
            {months[props.timeStarted.getUTCMonth()]}{" "}
            {props.timeStarted.getUTCFullYear()} -{" "}
            {props.timeEnded < new Date()
              ? String(months[props.timeEnded.getUTCMonth()]) +
                " " +
                String(props.timeEnded.getUTCFullYear())
              : "Present"}
          </h4>
        </div>

        <div className="flex flex-col gap-2">{props.description}</div>
      </div>
    </div>
  );
}
