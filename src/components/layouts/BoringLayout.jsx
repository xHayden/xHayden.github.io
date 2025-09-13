import Navbar from "../Navbar";
import boringStyles from "../../style/BoringLayout.module.css";

const BoringLayout = (styles) => {
  console.log(boringStyles.container)
    return <main className={boringStyles.container}>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
        rel="stylesheet"
      ></link>
      <div className="">
        <div
          id="main-page"
          className="bg-primary text-primarytext min-h-screen px-8 pt-8 pb-12 sm:px-24 md:px-52 2xl:px-96 3xl:pt-6 3xl:px-96"
        >
          <Navbar />
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-2xl font-mono">
              👋, I'm <span className="">Hayden Carpenter</span>.
            </h1>
            <hr></hr>
            <p className="">
              There's been this trend over the past few years in portfolio
              design to give your basic info with no cool frontend tricks,
              simplifying everything.
            </p>
            <p>So simply,</p>
            <div className="flex flex-col gap-6">
              <div className="">
                <ul className="list-disc-fix">
                  <li>I'm an Undergraduate Student at Georgia Tech.</li>
                  <li>I'm a Computer Science Major with a Psychology Minor.</li>
                  <li>
                    My concentrations are in{" "}
                    <a
                      href="https://www.cc.gatech.edu/academics/threads/systems-architecture"
                      className="text-yellow-500"
                      target="_blank"
                    >
                      Systems & Architecture
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.cc.gatech.edu/cybersecurity-and-privacy"
                      className="text-yellow-500"
                      target="_blank"
                    >
                      Cybersecurity & Privacy
                    </a>
                    .
                  </li>
                  <li>
                    I'm the Director of Engineering at{" "}
                    <a
                      href="https://bitsofgood.org/"
                      className="text-yellow-500"
                      target="_blank"
                    >
                      Bits of Good
                    </a>
                    , a chapter of Hack4Impact (501(c)(3) non-profit).
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="">👨‍💻 Work Experience</h2>
                <ul className="list-disc-fix gap-1 flex flex-col">
                  <li>
                    <span className="font-semibold">Bits of Good</span> -
                    Director of Engineering (January 2023 - Present)
                    <ul className="list-disc-fix">
                      <li>
                        I'm leading efforts to restructure our infrastructure team and organizing the Engineering Department for Fall 2025.
                      </li>
                      <li>
                        I'm leading recruitment efforts for Engineering positions and Bits of Good's Developer Bootcamp.
                      </li>
                      <li>
                        I led the development effort of a game gallery for{" "}
                        <a
                          href="https://github.com/GTBitsOfGood/jennifer-anns-group"
                          target="_blank"
                        >
                          Jennifer Ann's Group
                        </a>
                        , a non-profit working to prevent teen dating violence.
                      </li>
                      <li>
                        Worked on{" "}
                        <a
                          href="https://github.com/GTBitsOfGood/juno"
                          target="_blank"
                        >
                          Juno
                        </a>
                        , Bits of Good's infrastructure API built in Nest.js to
                        accelerate scalable development workflows internally.{" "}
                      </li>
                      <li>
                        Worked on the Southface project team to create and
                        deploy a building planner for{" "}
                        <a href="https://earthcraft.org/" target="_blank">
                          Earthcraft
                        </a>
                        , a sustainable housing program. Southface has estimated
                        the app should improve the use of Earthcraft's resources
                        by up to 50%.
                      </li>
                    </ul>
                  </li>
                  <li className="">
                    <span className="font-semibold">Georgia Tech Research Institute</span> - Student Research Assistant (January 2025 - May 2025)
                    <ul className="list-disc-fix">
                      <li>
                        Created tooling for static analysis of Ada projects.
                      </li>
                      <li>
                        Created tooling for static analysis of binaries in Ghidra.
                      </li>
                      <li>
                        Leveraged ML models for static analysis efforts and developed pipelines for integrating into existing toolchains.
                      </li>
                    </ul>
                  </li>
                  <li className="">
                    <span className="font-semibold">MaxRewards</span> - Software
                    Development Intern (August 2023 - February 2024)
                    <ul className="list-disc-fix">
                      <li>
                        Developed{" "}
                        <a href="https://maxrewards.com" target="_blank">
                          MaxRewards.com
                        </a>
                        , the main marketing site for MaxRewards.
                      </li>
                      <li>
                        Developed internal CMS and syncing systems for a new
                        blog and card comparison tool. In this effort, I
                        improved complex queries from hours down to seconds.
                      </li>
                    </ul>
                  </li>
                  <li className="">
                    <span className="font-semibold">Axio Global Inc</span> -
                    Software Development Intern (April 2021 - April 2022)
                    <ul className="list-disc-fix">
                      <li>
                        I worked closely with the software development team at
                        Axio Global to develop the Axio 360 Cyber Risk
                        Assessment web application.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div>
                <h2>🎨 Projects</h2>
                <ul className="list-disc-fix">
                  <li>
                    <a href="https://hayden.gg/physarum/" target="_blank">
                      Physarum Simulation
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        Research using a modified WebGL simulation of a slime
                        mold to demonstrate evolutionary pathfinding.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="https://github.com/xHayden/sweat-stake"
                      target="_blank"
                    >
                      SweatStake
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        An iOS fitness app that syncs with your Apple Health
                        data to charge you money if you skip too many workouts.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="https://github.com/xHayden/health-sync"
                      target="_blank"
                    >
                      Health Dashboard
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        An interactive health dashboard for creating "widget" components that sync with Apple Health through an iOS app.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="https://github.com/xHayden/unified-health-api"
                      target="_blank"
                    >
                      Unified Health API
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        Microservice-based unified API for accessing data from a variety of health providers. Written in Go and standardized with FHIR.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="https://github.com/GTBitsOfGood/juno"
                      target="_blank"
                    >
                      Juno (Bits of Good)
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        A developer toolkit similar to Firebase for Bits Of Good
                        infrastructure.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="https://github.com/GTBitsOfGood/southface"
                      target="_blank"
                    >
                      Earthcraft (Bits of Good)
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        An environmentally sustainable building standard
                        planning tool for Southface.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="https://github.com/GTBitsOfGood/jennifer-anns-group"
                      target="_blank"
                    >
                      Jennifer Ann's Group (Bits of Good)
                    </a>
                    <ul className="list-disc-fix">
                      <li>
                        A game gallery for a non-profit preventing teen dating
                        violence.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div>
                <h2>🔗 Links</h2>
                <ul className="list-disc-fix">
                  <li>
                    <a href="https://hayden.gg/resume/HaydenCarpenter_Resume.pdf">
                      Resume
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/xHayden">GitHub</a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/haydencarpenter/">
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a href="https://notes.hayden.gg">Notes</a>
                  </li>
                  <li>
                    <a href="https://img.hayden.gg">Image Hosting</a>
                  </li>
                </ul>
              </div>
            </div>

            <p className="hover:animate-pulse text-yellow-500 hidden">
              <button onClick={() => setDesign(1)}>
                {">"} Click here if you embrace complexity.
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
}

export default BoringLayout;