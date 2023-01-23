export default function Navbar() {
    return (
        <div className="flex flex-row text-xl gap-10 float-right md:visible invisible">
            {["Home", "Projects", "Contact"].map((name) => (
                <p className="text-zinc-400 hover:text-amber-300 transition" key={name}>{name}</p>
            ))}
        </div>
    )
}