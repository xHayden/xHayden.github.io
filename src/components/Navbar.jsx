export default function Navbar() {
    return (
        <div className="flex flex-row text-xl gap-10 p-4 float-right md:visible invisible">
            {["About Me", "Experience", "Projects", "Contact"].map((name) => (
                <a href={`#${name.replace(" ", "")}`} className="text-zinc-400 hover:text-amber-400 transition hover:animate-pulse" key={name}>{name}</a>
            ))}
        </div>
    )
}