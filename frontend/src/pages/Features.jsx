import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bg from "../assets/images/bg3.jpeg";

gsap.registerPlugin(ScrollTrigger);

import {
  FiBarChart2,
  FiShield,
  FiLock,
  FiRefreshCw,
  FiPieChart,
  FiBell,
  FiCloud,
} from "react-icons/fi";

export default function FeaturesBento() {
  const sectionRef = useRef(null);
  const bigRef = useRef([]);
  const mediumRef = useRef([]);
  const smallRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
        defaults: { ease: "power3.out", duration: 0.7 },
      });

      tl.set([...bigRef.current, ...mediumRef.current, ...smallRef.current], {
        opacity: 0,
        y: 60,
      });

      tl.to(bigRef.current, { opacity: 1, y: 0, stagger: 0.25 })
        .to(mediumRef.current, { opacity: 1, y: 0, stagger: 0.18 }, "-=0.45")
        .to(smallRef.current, { opacity: 1, y: 0, stagger: 0.14 }, "-=0.35");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl audiowide-regular md:text-5xl font-bold text-white">
            Everything You Need to
            <span className="lava-text"> Control Your Money</span>
          </h2>
          <p className="mt-5 text-gray-400 max-w-2xl mx-auto text-lg">
            Built with clarity, security and blazing fast insights.
          </p>
        </div>

        <div
          style={{ backgroundImage: `url(${bg})` }}
          className="
            relative
            bg-cover bg-center bg-no-repeat
            rounded-[36px]
            p-6 md:p-8
          "
        >
          
          <div className="absolute inset-0 rounded-[36px] bg-black/20" />

          <div className="relative  grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="grid grid-rows-[auto_1fr_1fr] gap-6">
              <BentoBig
                refEl={(el) => bigRef.current.push(el)}
                title="Real-Time Expense Insights"
                desc="Live tracking with blazing fast visual analytics."
                icon={<FiBarChart2 />}
              />

              <div className="grid audiowide-regular grid-cols-2 gap-6">
                <BentoSmall
                  refEl={(el) => mediumRef.current.push(el)}
                  title="Smart Budgets"
                  icon={<FiPieChart />}
                />
                <BentoSmall
                  refEl={(el) => mediumRef.current.push(el)}
                  title="Auto Sync"
                  icon={<FiRefreshCw />}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <BentoSmall
                  refEl={(el) => smallRef.current.push(el)}
                  title="Cloud Backup"
                  icon={<FiCloud />}
                />
                <BentoSmall
                  refEl={(el) => smallRef.current.push(el)}
                  title="Instant Alerts"
                  icon={<FiBell />}
                />
              </div>
            </div>
            <div className="grid grid-rows-[1fr_auto_1fr] gap-6">
              <div className="grid grid-cols-2 gap-6">
                <BentoSmall
                  refEl={(el) => mediumRef.current.push(el)}
                  title="Secure Auth"
                  icon={<FiShield />}
                />
                <BentoSmall
                  refEl={(el) => mediumRef.current.push(el)}
                  title="Private Data"
                  icon={<FiLock />}
                />
              </div>

              <BentoBig
                refEl={(el) => bigRef.current.push(el)}
                title="Visual Financial Reports"
                desc="Readable charts that actually help decision making."
                icon={<FiBarChart2 />}
              />

              <div className="grid grid-cols-2 gap-6">
                <BentoSmall
                  refEl={(el) => smallRef.current.push(el)}
                  title="Categories"
                  icon={<FiPieChart />}
                />
                <BentoSmall
                  refEl={(el) => smallRef.current.push(el)}
                  title="Recurring"
                  icon={<FiRefreshCw />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function BentoBig({ title, desc, icon, refEl }) {
  return (
    <div ref={refEl} className="lava-card lava-big">
      <div className="lava-icon">{icon}</div>
      <h3 className="lava-title">{title}</h3>
      <p className="lava-desc">{desc}</p>
    </div>
  );
}

function BentoSmall({ title, icon, refEl }) {
  return (
    <div ref={refEl} className="lava-card lava-small">
      <div className="lava-icon">{icon}</div>
      <span className="lava-small-title">{title}</span>
    </div>
  );
}
