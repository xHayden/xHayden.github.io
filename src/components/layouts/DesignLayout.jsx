import { twMerge } from "tailwind-merge";
import designStyles from "../../style/DesignLayout.module.css";
import ProjectGrid from "../projects/ProjectGrid";
import ProjectsMobile from "../projects/ProjectsMobile";
import HeroMobile from "../hero/HeroMobile";
import HeroDesktop from "../hero/HeroDesktop";
import { projects } from "../../data/projects";
// import TrailingCursor from "../ui/TrailingCursor";
import DonutScrollAnimation from "../animations/DonutScrollAnimation";
import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";

const DesignLayout = () => {
  return (
    <>
      {/* <TrailingCursor /> */}
      <div
        className={twMerge(
          "mb-12 scroll-smooth flex flex-col",
          designStyles.container
        )}
      >
        <div className="flex w-full md:justify-end sticky right-0 top-0 px-4 md:px-12 py-4 z-10 bg-white">
          <nav className="flex items-center w-full text-black justify-end gap-4">
            <div className="flex gap-4">
              <a href="/blog/" className="hover:opacity-50 transition-opacity">
                Blog
              </a>
              <a
                href="/blog/about/"
                className="hover:opacity-50 transition-opacity"
              >
                About
              </a>
              <a
                href="/blog/contact/"
                className="hover:opacity-50 transition-opacity"
              >
                Contact
              </a>
            </div>
            <div className="ml-auto md:ml-0">
              <DonutScrollAnimation />
            </div>
          </nav>
        </div>

        <main className="flex flex-col items-center">
          <div className="max-w-[1400px] w-full px-4 md:px-12 flex flex-col gap-12 md:gap-16">
            <HeroMobile />
            <HeroDesktop />
            {/* <div className="border-t-2 border-gray-600 hidden md:block"></div> */}
            {/* <section className="md:py-12">
              <h3 className="text-base md:text-2xl uppercase ">Skills</h3>
              <div className="flex text-base md:text-xl lg:text-3xl font-bold gap-2 flex-wrap">
                {[
                  "TypeScript",
                  "JavaScript",
                  "Python",
                  "Java",
                  "C",
                  "Swift",
                  "Go",
                  "Node.js",
                  "gRPC",
                  "React",
                  "Next.js",
                  "MongoDB",
                  "PostgreSQL",
                  "Docker",
                  "Figma",
                  "...and more",
                ].map((skill) => (
                  <div
                    className="border-2 border-gray-600 w-max p-2 md:p-4 font-bold"
                    key={skill}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section> */}
            <section id="projects" className="hidden md:flex flex-col gap-3">
              <h3 className="text-xl md:text-3xl font-semibold leading-tight">Projects</h3>
              <ProjectGrid projects={projects} />
            </section>
            <ProjectsMobile projects={projects} />
            {/* <section className="flex flex-col leading-loose">
              <h3 className="text-xl md:text-2xl uppercase border-b-2 border-gray-600">
                More about me
              </h3>
              <p className="leading-loose pt-2">
                I'm a fourth year Computer Science student at Georgia Tech. My
                threads (concentrations) are{" "}
                <a
                  className="underline"
                  href="https://www.cc.gatech.edu/academics/threads/systems-architecture"
                  target="_blank"
                >
                  Systems & Architecture
                </a>{" "}
                and{" "}
                <a
                  className="underline"
                  href="https://www.cc.gatech.edu/cybersecurity-and-privacy"
                  target="_blank"
                >
                  Cybersecurity & Privacy
                </a>
                . I've recently gotten into photography, but I spend most of my
                spare time working with project teams at Bits of Good. I have a{" "}
                <a href="/blog" className="underline">
                  blog
                </a>{" "}
                where I sometimes talk about what I'm working on.
              </p>

              <div className="pt-4">
                <PhotoGrid photos={photos} />
                <p className="uppercase text-sm float-end">
                  Shot on Fuji x100VI
                </p>
              </div>
            </section> */}
          </div>
        </main>
        <footer className="w-full bg-white flex flex-col items-center">
          <div className="w-full max-w-[1400px] px-4 md:px-12 pt-12 md:pt-10 gap-6 md:gap-8 text-sm md:text-sm justify-between flex items-center">
            <div className="flex flex-col gap-2">
              <p className="text-black/80">Hayden Carpenter © {new Date().getFullYear()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 md:gap-3">
                <a
                  href="https://github.com/xHayden"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub"
                  className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-black/15 hover:bg-black hover:text-white transition"
                >
                  <FiGithub className="text-base md:text-base" />
                </a>
                <a
                  href="https://www.linkedin.com/in/haydencarpenter/"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn"
                  className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-black/15 hover:bg-black hover:text-white transition"
                >
                  <FiLinkedin className="text-base md:text-base" />
                </a>
                <a
                  href="mailto:me@hayden.gg"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Email"
                  className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-black/15 hover:bg-black hover:text-white transition"
                >
                  <FiMail className="text-base md:text-base" />
                </a>
                <a
                  href="https://hayden.gg/resume/HaydenCarpenter_Resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Resume"
                  className="inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border border-black/15 hover:bg-black hover:text-white transition"
                >
                  <FiFileText className="text-base md:text-base" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DesignLayout;
