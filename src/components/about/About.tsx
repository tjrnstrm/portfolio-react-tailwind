import { EDUCATION, EXPERIENCE } from "../../data/about";
import { PAGE_HEADING } from "../../lib/type";
import { Eyebrow } from "../ui/Eyebrow";
import { AboutIntro } from "./AboutIntro";
import { Skills } from "./Skills";
import { Timeline } from "./Timeline";

export function About() {
  return (
    <section className="py-14 flex flex-col w-full">
      <div className="border-b border-zinc-300 dark:border-zinc-200/10 pb-5 mb-8 sm:mb-12">
        <Eyebrow>Who am I?</Eyebrow>
        <h2 className={PAGE_HEADING}>About.</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <AboutIntro />
        <div className="space-y-16 mt-14 sm:space-y-8 sm:mt-0 sm:ml-20">
          <Skills />
          <Timeline label="Experience" items={EXPERIENCE} />
          <Timeline label="Education" items={EDUCATION} />
        </div>
      </div>
    </section>
  );
}
