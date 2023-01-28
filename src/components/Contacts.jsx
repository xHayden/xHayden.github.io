import { SiGithub, SiLinkedin } from "react-icons/si";
import { IoMdMailOpen } from "react-icons/io";
import { FaFileAlt } from "react-icons/fa";

export default function(props) {
    return <div className="bottom-0 float-right md:flex p-8 fixed inane-block right-0 hidden">
        <div className="flex gap-4 bg-zinc-900 p-4">
            <a href="https://github.com/xHayden" target="_blank" className="transform-gpu hover:scale-125 transition ease-in-out"><SiGithub size={"2em"}/></a>
            <a href="https://www.linkedin.com/in/haydencarpenter/" target="_blank" className="transform-gpu hover:scale-125 transition ease-in-out"><SiLinkedin size={"2em"}/></a>
            <a href="mailto:haydenc@gatech.edu" target="_blank" className="transform-gpu hover:scale-125 transition ease-in-out"><IoMdMailOpen size={"2em"}/></a>
            <a href="" target="_blank" className="transform-gpu hover:scale-125 transition ease-in-out"><FaFileAlt size={"2em"}/></a>
        </div>
    </div>
}