import cat from "../assets/cat.png";

function Project(props) {
    return <div className="w-full h-64 flex justify-start items-end shadow-xl">
        <a className={`w-full transition h-full ease-in-out flex items-end justify-start bg-cover rounded-md vignette hover:scale-105`} href={props.href} target={props.local ? "_self" : "_blank"} style={{backgroundImage: `url(${props.imgSrc})`}}>
            <div className="px-6 py-4 flex gap-1 flex-col">
                <p className="text-2xl text-white font-bold opacity-100">{props.name}</p>
                <p className="text-lg text-zinc-300 font-normal opacity-100">{props.description}</p>
            </div>
        </a>
    </div>
}

export default function Projects(props) {
    return <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 3xl:grid-cols-6">
            <Project name="Physarum Simulation" description="A modified simulation of a slime mold in an attempt to demonstrate evolutionary pathfinding." imgSrc={cat} href="https://github.com/xHayden/physarum"/>
            <Project name="Code Per Week" description="New coding projects each week." imgSrc={cat} href="" local={true}/>
            <Project name="Gearbox" description="An all-in-one scouting solution for FRC Robotics teams built by Team 4026." imgSrc="gearbox.png" href="https://4026.org"/>
            <Project name="Stork.gt" description="Creating the foundation for The Great Stork Race, a Fantasy Football-style stork migration club." imgSrc={cat} href="https://stork.gt"/>
            <Project name="Connect @ GT" description="An interactive 3D model of Georgia Tech built at GT WebDev." imgSrc={cat} href="https://github.com/jamin-git/connect-at-georgia-tech"/>
        </div>
        <p className="my-4 underline">See more on <a href="https://github.com/xHayden">my GitHub</a></p>
    </>
}