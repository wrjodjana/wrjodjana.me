import Image from "next/image";
import profile from "../public/profile.jpg";

export default function Home() {
  return (
    <>
      <header className="page-header home-header">
        <div>
          <h1>Warren Jodjana</h1>
        </div>
        <Image className="home-profile-photo" src={profile} alt="Portrait of Warren Jodjana" width={144} height={144} priority />
      </header>

      <section id="about">
        <h2>About me</h2>
        <p>I work full-time in Seattle but I’m also focused on Agentic Engine Optimization, specifically researching which sources agents pick dependencies from.</p>

        <p>
          I studied Computer Science and Statistics at UIUC. During my time at Illinois, I was part of the <a href="https://uq.cee.illinois.edu/">Uncertainty Quantification Group</a> and{" "}
          <a href="https://giesgroups.illinois.edu/disruptionlab/home/">Disruption Lab</a>.
        </p>
        <p>
          I first became interested in technology and startups after reading <a href="https://en.wikipedia.org/wiki/Delivering_Happiness">Delivering Happiness</a> by Tony Hsieh when I was 13.
        </p>
        <p>I am originally from Jakarta and Surabaya, Indonesia.</p>
      </section>

      <footer>
        <p>
          Inspired by <a href="https://sigilwen.ca/">sigilwen.ca</a>
        </p>
      </footer>
    </>
  );
}
