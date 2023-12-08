import cat from "../assets/cat.png";
import hayden from "../assets/hayden.jpg"
import southface from "../assets/southface.png"
import physarum from "../assets/physarum.png"
import hayden2 from "../assets/hayden2.jpg"

function Project(props) {
    return <div className="w-full flex justify-start items-end shadow-lg shadow-slate-700">
        <a className={`w-full transition h-full ease-in-out flex items-end justify-start bg-cover pt-32 ${props.center ? "bg-center" : "bg-left-top"} hover:skew-x-0 rounded-md vignette hover:scale-105`} href={props.href} target={props.local ? "_self" : "_blank"} style={{backgroundImage: `url(${props.imgSrc})`}}>
            <div className="px-6 py-4 flex gap-1 flex-col">
                <h4 className="text-xl text-white font-bold opacity-100">{props.name}</h4>
                <h5 className="text-md text-primarytext font-normal opacity-100">{props.description}</h5>
            </div>
        </a>
    </div>
}

export default function Projects(props) {
    return <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 3xl:grid-cols-6">
            <Project name="Physarum Simulation" description="Research using a modified WebGL simulation of a slime mold to demonstrate evolutionary pathfinding." imgSrc={physarum} href="https://hayden.gg/physarum/"/>
            <Project name="SweatStake" description="An iOS fitness app that with syncs with your Apple Health data to charge you money if you skip too many workouts." imgSrc={"https://img.hayden.gg/VgJW8uDdGX.png"} href="https://github.com/xHayden/sweat-stake"/>
            <Project name="Mochi Cards Pro" description="A lightweight Obsidian.md plugin for quickly creating flashcards in Mochi.cards with the Mochi.cards premium API." imgSrc={"https://img.hayden.gg/da52643715b696660983da81b9acac7c.gif"} href="https://obsidian.md/plugins?id=mochi-cards-pro"/>
            <Project name="Gearbox" description="An all-in-one live-updating data collection and analysis tool for FRC Robotics teams built by Team 4026." imgSrc="gearbox.png" href="https://4026.org"/>
            <Project name="Juno" description="A developer toolkit similar to Firebase for Bits Of Good infrastructure." imgSrc={"https://img.hayden.gg/FFCz31KoMT.png"} href="https://github.com/GTBitsOfGood/juno"/>
            <Project name="Earthcraft" description="An environmentally sustainable building standard planning tool for Southface." imgSrc={southface} href="https://github.com/GTBitsOfGood/southface"/>
            <Project name="StorkRace.com" description="Creating systems for Fantasy Stork League, a Fantasy Football-style stork migration draft at Georgia Tech." imgSrc={"https://img.hayden.gg/g4IaXzugKT.png"} href="https://storkrace.com"/>
            <Project name="Other Projects..." description="See more on my Github." imgSrc={hayden2} href="https://github.com/xHayden/" center={true}/>
        </div>
    </>
}