export default function Navbar() {
    return (
        <div className="flex flex-row text-xl gap-10 p-4 float-right md:visible invisible bg-primary w-full">
            {["About Me", "Experience", "Projects", "Contact"].map((name) => (
                <a href={`#${name.replace(" ", "")}`} className="text-primarytextdark font-normal hover:text-secondary transition hover:animate-pulse" key={name}>{name}</a>
            ))}
        </div>
    )
}