export default function Navbar() {
    return (
        <div className="flex flex-row text-base md:text-xl gap-4 md:gap-10 bg-primary w-full justify-end pb-8">
            <a href="/blog/" className="">blog</a>
            <a href="/blog/contact/" className="">contact</a>
        </div>
    )
}