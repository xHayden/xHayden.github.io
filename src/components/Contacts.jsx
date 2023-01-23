import { SiGithub, SiLinkedin } from "react-icons/si";
import { IoMdMailOpen } from "react-icons/io"

export default function(props) {
    return <div className="bottom-0 float-right flex p-8 fixed inane-block right-0">
        <div className="flex gap-4">
            <a href="https://github.com/xHayden" target="_blank"><SiGithub size={"2em"}/></a>
            <a href="https://www.linkedin.com/in/haydencarpenter/" target="_blank"><SiLinkedin size={"2em"}/></a>
            <a href="mailto:haydenc@gatech.edu" target="_blank"><IoMdMailOpen size={"2em"}/></a>
        </div>
    </div>
}