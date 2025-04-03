import "../../style/DesignLayout.css";

const DesignLayout = () => {
  return (
    <main
      className="min-h-screen bg-linear-to-t from-orange-50 size-18 to-orange-600"
    >
      <section>
        <h1 className="text-8xl">I'm Hayden</h1>
        <h2 className="text-4xl">I'm a Software Developer</h2>
      </section>
      <section>
        <h2>
          I'm currently the Director of Engineering at Bits of Good, but I've
          also worked at these companies:
        </h2>
        <ul>
          <li>Georgia Tech Research Institute (GTRI)</li>
          <li>MaxRewards</li>
          <li>Axio Global Inc</li>
        </ul>
      </section>
    </main>
  );
};

export default DesignLayout;
