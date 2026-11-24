import { useState } from "react";
import {
  ShieldCheck,
  HeartPulse,
  AlertTriangle,
  Droplets,
  Syringe,
  Dog,
  Stethoscope,
  ChevronDown,
  ExternalLink,
  Phone,
  BookOpen,
  CheckCircle2,
  XCircle,
  Info,
  ArrowUpRight,
} from "lucide-react";

const sections = [
  { id: "understanding", label: "Understanding rabies" },
  { id: "symptoms", label: "Warning signs" },
  { id: "first-aid", label: "Dog bite first aid" },
  { id: "prevention", label: "Prevention" },
  { id: "myths", label: "Myths vs facts" },
];

const myths = [
  {
    question: "A dog that looks healthy cannot have rabies.",
    answer:
      "You cannot reliably determine rabies infection from appearance alone. Avoid handling unfamiliar animals and seek professional advice after a possible exposure.",
  },
  {
    question: "Only dog bites can transmit rabies.",
    answer:
      "Rabies can spread through infected saliva entering broken skin or mucous membranes, including scratches contaminated with saliva.",
  },
  {
    question: "A small scratch is nothing to worry about.",
    answer:
      "Even minor scratches can require medical assessment depending on the exposure. Wash the area immediately and seek medical advice.",
  },
  {
    question: "Vaccinating dogs helps protect people.",
    answer:
      "Yes. Mass dog vaccination is one of the most effective ways to prevent dog-mediated rabies and protect communities.",
  },
];

const symptoms = [
  {
    title: "Behaviour changes",
    description:
      "Unusual aggression, restlessness, fearfulness, or unexpected friendliness.",
    icon: Dog,
  },
  {
    title: "Excessive salivation",
    description: "Unusual drooling or difficulty swallowing.",
    icon: Droplets,
  },
  {
    title: "Movement difficulties",
    description: "Weakness, uncoordinated movement, or paralysis.",
    icon: HeartPulse,
  },
  {
    title: "Unusual vocalization",
    description: "Changes in barking or other unusual vocal behaviour.",
    icon: AlertTriangle,
  },
  {
    title: "Difficulty eating or drinking",
    description:
      "Abnormal swallowing behaviour or apparent difficulty drinking.",
    icon: Info,
  },
  {
    title: "Neurological changes",
    description:
      "Seizures, disorientation, or other unusual neurological signs.",
    icon: Stethoscope,
  },
];

const firstAidSteps = [
  {
    number: "01",
    title: "Wash immediately",
    description:
      "Wash and flush the wound thoroughly with soap and running water for at least 15 minutes.",
    icon: Droplets,
  },
  {
    number: "02",
    title: "Apply antiseptic",
    description:
      "After washing, apply an appropriate iodine-containing or other recommended antiseptic if available.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Seek medical attention",
    description:
      "Visit a healthcare facility immediately for wound assessment and rabies exposure management.",
    icon: Stethoscope,
  },
  {
    number: "04",
    title: "Follow treatment advice",
    description:
      "A healthcare professional will assess the exposure and determine whether rabies vaccine, immunoglobulin, and other treatment are needed.",
    icon: Syringe,
  },
];

const prevention = [
  {
    title: "Vaccinate dogs",
    description:
      "Support responsible vaccination programmes and ensure dogs receive veterinary care.",
    icon: Syringe,
  },
  {
    title: "Avoid risky contact",
    description:
      "Do not provoke, corner, or handle unfamiliar or sick animals.",
    icon: Dog,
  },
  {
    title: "Report concerns",
    description:
      "Report suspected rabies cases to appropriate veterinary or animal-control authorities.",
    icon: AlertTriangle,
  },
  {
    title: "Spread awareness",
    description:
      "Share reliable information about prevention, vaccination, and bite response.",
    icon: BookOpen,
  },
];

const resources = [
  {
    title: "World Health Organization",
    description: "Global rabies information and guidance",
    url: "https://www.who.int/news-room/fact-sheets/detail/rabies",
  },
  {
    title: "National Rabies Control Programme",
    description: "India's official rabies resources",
    url: "https://rabiesfreeindia.mohfw.gov.in/",
  },
  {
    title: "National Guidelines for Rabies Prophylaxis",
    description: "Government of India clinical guidelines",
    url: "https://ncdc.mohfw.gov.in/wp-content/uploads/2025/06/Rabies-Guidelines.pdf",
  },
  {
    title: "CDC Rabies Information",
    description: "Additional public-health information",
    url: "https://www.cdc.gov/rabies/",
  },
];

const faqs = [
  {
    question: "Can vaccinated dogs still get rabies?",
    answer:
      "No vaccine provides absolute protection. Keep vaccination records current and ask a veterinarian what to do after a possible exposure, even if a dog has been vaccinated.",
  },
  {
    question: "How often should dogs receive rabies vaccination?",
    answer:
      "Vaccination schedules depend on the vaccine, the dog's age and health, and local regulations. Follow the schedule recommended by a qualified veterinarian.",
  },
  {
    question: "Can rabies spread through a scratch?",
    answer:
      "A scratch can pose a risk if it breaks the skin and is contaminated with infected saliva. Wash the area immediately and seek medical assessment.",
  },
  {
    question: "What should I do if a street dog bites me?",
    answer:
      "Wash and flush the wound with soap and running water for at least 15 minutes, then seek medical care immediately. Do not wait for symptoms.",
  },
  {
    question: "Should I approach a dog showing unusual behaviour?",
    answer:
      "No. Keep a safe distance, do not touch or corner the animal, and contact trained veterinary or animal-welfare professionals.",
  },
  {
    question: "Why should street dogs be vaccinated?",
    answer:
      "Community dog vaccination helps reduce dog-mediated rabies and protects both animals and people. Programmes should be coordinated by trained teams.",
  },
  {
    question: "Can humans receive rabies vaccination before exposure?",
    answer:
      "Pre-exposure vaccination is recommended for certain people with increased occupational or other exposure risk. Ask a healthcare professional whether it is appropriate for you.",
  },
];

const emergencyContacts = [
  {
    title: "Emergency response",
    description:
      "Pan-India emergency response for police, fire, and health emergencies.",
    tag: "VERIFIED · INDIA",
    number: "112",
    availability: "Emergency service",
    type: "call",
  },
  {
    title: "Ambulance services",
    description:
      "Ambulance emergency number. Availability and response may vary by location.",
    tag: "INDIA · WHERE OPERATIONAL",
    number: "108",
    availability: "Where operational",
    type: "call",
  },
  {
    title: "Government veterinary services",
    description:
      "Contact your local government veterinary office for animal health guidance.",
    tag: "LOCAL CONTACT · CONFIGURE",
    number: "Local number to be added",
    availability: "Local details to be added",
    type: "local",
  },
  {
    title: "Municipal animal welfare",
    description: "For local animal-control and community dog support.",
    tag: "LOCAL CONTACT · CONFIGURE",
    number: "Local number to be added",
    availability: "Local details to be added",
    type: "local",
  },
  {
    title: "Animal welfare organisation",
    description: "For humane rescue advice and coordinated vaccination.",
    tag: "LOCAL CONTACT · CONFIGURE",
    number: "Local number to be added",
    availability: "Local details to be added",
    type: "local",
  },
  {
    title: "Animal rescue services",
    description: "For trained help with an animal in distress.",
    tag: "LOCAL CONTACT · CONFIGURE",
    number: "Local number to be added",
    availability: "Local details to be added",
    type: "local",
  },
];

const communitySteps = [
  {
    number: "01",
    title: "Notice",
    description: "Identify areas with unvaccinated community dogs.",
  },
  {
    number: "02",
    title: "Connect",
    description:
      "Contact local animal welfare organisations or veterinary authorities.",
  },
  {
    number: "03",
    title: "Coordinate",
    description: "Arrange vaccination by trained professionals.",
  },
  {
    number: "04",
    title: "Record",
    description: "Maintain vaccination records through the responsible team.",
  },
  {
    number: "05",
    title: "Follow up",
    description: "Follow veterinary recommendations for subsequent boosters.",
  },
];

const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="max-w-3xl">
    <p className="text-sm font-bold uppercase tracking-[0.14em] text-indigo-600">
      {eyebrow}
    </p>
    <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
      {title}
    </h2>
    <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
      {description}
    </p>
  </div>
);

export default function RabiesAwarenessPage() {
  const [expandedMyth, setExpandedMyth] = useState<number | null>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <div className="w-full min-w-0 bg-slate-50 px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111c43] text-white shadow-sm">
        <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative p-7 sm:p-10 lg:p-14">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-indigo-200">
              <ShieldCheck size={18} />
              Community awareness
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
              Together, we can
              <span className="block text-indigo-300">prevent rabies.</span>
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Awareness, responsible vaccination, and timely medical attention
              can save lives. Learn how to protect yourself, your community, and
              the animals around you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#first-aid"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-indigo-400"
              >
                Learn bite first aid
                <ArrowUpRight size={19} />
              </a>

              <a
                href="#understanding"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/20"
              >
                Explore awareness
              </a>
            </div>
          </div>

          {/* Hero highlights */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Preventable",
                text: "Rabies deaths can be prevented through timely care.",
              },
              {
                icon: Syringe,
                title: "Vaccination",
                text: "Responsible dog vaccination protects communities.",
              },
              {
                icon: HeartPulse,
                title: "Act immediately",
                text: "Prompt wound washing and medical care matter.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-6"
              >
                <item.icon size={29} className="text-indigo-300" />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-base leading-7 text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY NOTICE */}
      <section className="mt-7 rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={30} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Been bitten or scratched by an animal?
            </h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Wash the wound immediately with soap and running water for at
              least 15 minutes, then seek medical assessment as soon as
              possible. Do not wait for symptoms.
            </p>
          </div>

          <a
            href="#first-aid"
            className="inline-flex shrink-0 items-center gap-2 text-base font-bold text-red-600 hover:text-red-700"
          >
            What to do
            <ArrowUpRight size={19} />
          </a>
        </div>
      </section>

      {/* TABLE OF CONTENTS */}
      <section className="py-14">
        <div className="mb-7">
          <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Explore the guide
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Know what matters
          </h2>
        </div>

        <div className="grid gap-3">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-5 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm sm:px-7"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-base font-extrabold text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                0{index + 1}
              </span>
              <p className="flex-1 text-lg font-bold leading-7 text-slate-800 group-hover:text-indigo-700 sm:text-xl">
                {section.label}
              </p>
              <ArrowUpRight
                size={22}
                className="shrink-0 text-slate-400 group-hover:text-indigo-600"
              />
            </a>
          ))}
        </div>
      </section>

      {/* UNDERSTANDING RABIES */}
      <section
        id="understanding"
        className="scroll-mt-8 border-t border-slate-200 py-14"
      >
        <div className="grid items-center gap-10 xl:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="01 · Understanding rabies"
              title="What is rabies?"
              description="Understand how rabies affects animals and humans, how it spreads, and why timely prevention is so important."
            />

            <div className="mt-7 space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
              <p>
                Rabies is a viral disease that affects the central nervous
                system of mammals, including humans and dogs. It is commonly
                transmitted through the bite of an infected animal.
              </p>

              <p>
                Once clinical symptoms develop, rabies is virtually always
                fatal. However, prompt post-exposure treatment can prevent the
                disease from developing.
              </p>
            </div>

            <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
              <div className="flex gap-4">
                <Info className="shrink-0 text-indigo-600" size={25} />
                <p className="text-base leading-7 text-indigo-950">
                  Rabies affects both animals and humans. Protecting dogs
                  through vaccination is an important part of protecting public
                  health.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <HeartPulse size={34} />
            </div>

            <h3 className="mt-6 text-2xl font-extrabold text-slate-900">
              How does rabies spread?
            </h3>

            <p className="mt-2 text-base leading-7 text-slate-500">
              Infection can occur when infected saliva enters the body.
            </p>

            <div className="mt-7 space-y-6">
              {[
                "Bites from infected animals",
                "Scratches contaminated with infected saliva",
                "Saliva entering broken skin or mucous membranes",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <CheckCircle2
                    size={23}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <p className="text-base font-medium leading-7 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WARNING SIGNS */}
      <section
        id="symptoms"
        className="scroll-mt-8 border-t border-slate-200 py-14"
      >
        <SectionHeading
          eyebrow="02 · Identification"
          title="Possible warning signs in animals"
          description="Rabies can cause changes in behaviour and neurological symptoms. Signs vary, and no single sign confirms rabies."
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {symptoms.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-md sm:p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <item.icon size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle
              size={25}
              className="mt-0.5 shrink-0 text-amber-700"
            />
            <div>
              <h3 className="text-lg font-bold text-amber-950">
                Important safety information
              </h3>
              <p className="mt-2 text-base leading-7 text-amber-900">
                These signs are not exclusive to rabies. Never attempt to
                diagnose or handle a potentially infected animal yourself. Keep
                a safe distance and contact appropriate veterinary or
                animal-control authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FIRST AID */}
      <section
        id="first-aid"
        className="scroll-mt-8 border-t border-slate-200 py-14"
      >
        <div className="rounded-3xl bg-[#111c43] p-7 text-white sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-300">
              03 · Emergency response
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              What to do after a dog bite
            </h2>

            <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">
              Immediate wound care and professional medical assessment are
              essential after a possible rabies exposure.
            </p>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {firstAidSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-extrabold text-indigo-300">
                    {step.number}
                  </span>
                  <step.icon size={30} className="text-indigo-300" />
                </div>

                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-base leading-7 text-slate-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-red-300/20 bg-red-500/10 p-6">
            <h3 className="text-lg font-bold text-red-200">
              Never do these things
            </h3>

            <ul className="mt-4 space-y-3 text-base leading-7 text-slate-200">
              <li>• Do not apply chilli powder, acids, or irritants.</li>
              <li>• Do not ignore minor bites or scratches.</li>
              <li>• Do not wait for symptoms before seeking care.</li>
              <li>• Do not self-prescribe or skip recommended treatment.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PREVENTION */}
      <section
        id="prevention"
        className="scroll-mt-8 border-t border-slate-200 py-14"
      >
        <SectionHeading
          eyebrow="04 · Prevention"
          title="Prevention starts with us"
          description="Communities, volunteers, veterinarians, and authorities all have a role in preventing rabies."
        />

        <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {prevention.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md sm:p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <item.icon size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Vaccination highlight */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-indigo-100 bg-indigo-50">
          <div className="grid items-center gap-7 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:p-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600">
                  <Syringe size={27} />
                </div>
                <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                  A lifetime of care
                </p>
              </div>

              <h3 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Vaccination saves lives.
              </h3>

              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                Routine vaccination protects individual dogs and helps reduce
                rabies transmission across communities. Support responsible
                vaccination programmes and veterinary guidance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[390px] lg:grid-cols-1">
              <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                <p className="text-sm font-bold text-indigo-600">01</p>
                <h4 className="mt-2 text-base font-bold text-slate-900">
                  Start with veterinary guidance
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Follow an appropriate vaccination schedule.
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                <p className="text-sm font-bold text-indigo-600">02</p>
                <h4 className="mt-2 text-base font-bold text-slate-900">
                  Keep boosters up to date
                </h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Follow the veterinarian's recommended schedule.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COMMUNITY DOG VACCINATION PROCESS */}
        <div className="mt-10 rounded-3xl border border-emerald-100 bg-emerald-50/70 p-7 sm:p-9 lg:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
                04 · Community dogs
              </p>
              <h3 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                Safer streets, together
              </h3>
              <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                Community dog vaccination works best when animal welfare groups,
                veterinary teams, and neighbors coordinate.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 sm:max-w-xs">
              <p className="text-base font-bold text-slate-900">
                Humane, professional care
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Never attempt to vaccinate or restrain a dog yourself.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {communitySteps.map((step, index) => (
              <div
                key={step.number}
                className="flex items-start gap-5 rounded-2xl border border-emerald-100 bg-white p-5 sm:items-center sm:px-7 sm:py-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-base font-extrabold text-emerald-700">
                  {step.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-bold text-slate-900 sm:text-xl">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-base leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
                {index < communitySteps.length - 1 && (
                  <ArrowUpRight
                    size={21}
                    className="mt-1 hidden shrink-0 text-emerald-600 sm:block"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-emerald-200 pt-6">
            <p className="text-sm leading-7 text-slate-600 sm:text-base">
              <strong className="mr-2 uppercase tracking-wide text-emerald-800">
                Why community vaccination?
              </strong>
              It helps protect dogs and people, supports coordinated animal
              welfare work, and reduces the chance of rabies spreading through a
              community.
            </p>
          </div>
        </div>
      </section>

      {/* MYTHS */}
      <section
        id="myths"
        className="scroll-mt-8 border-t border-slate-200 py-14"
      >
        <SectionHeading
          eyebrow="05 · Education"
          title="Myths vs facts"
          description="Misinformation can delay lifesaving treatment. Understand the facts before making decisions."
        />

        <div className="mt-9 space-y-4">
          {myths.map((myth, index) => (
            <div
              key={myth.question}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedMyth(expandedMyth === index ? null : index)
                }
                aria-expanded={expandedMyth === index}
                className="flex w-full items-center justify-between gap-5 p-6 text-left transition hover:bg-slate-50 sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <XCircle className="mt-0.5 shrink-0 text-red-500" size={24} />
                  <span className="text-base font-bold leading-7 text-slate-900 sm:text-lg">
                    {myth.question}
                  </span>
                </div>

                <ChevronDown
                  className={`shrink-0 text-slate-400 transition-transform ${
                    expandedMyth === index ? "rotate-180" : ""
                  }`}
                  size={23}
                />
              </button>

              {expandedMyth === index && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-7">
                  <div className="flex items-start gap-4">
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-emerald-600"
                      size={24}
                    />
                    <p className="text-base leading-8 text-slate-600">
                      {myth.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY AND ANIMAL WELFARE CONTACTS */}
      <section
        className="border-t border-slate-200 py-14"
        id="emergency-contacts"
      >
        <SectionHeading
          eyebrow="06 · Help and support"
          title="Emergency and animal welfare contacts"
          description="Use the appropriate emergency service for immediate human medical needs. For animal-related concerns, contact trained local veterinary or animal-welfare teams."
        />

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {emergencyContacts.map((contact) => (
            <article
              key={contact.title}
              className="flex min-h-[250px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${contact.type === "call" ? "bg-emerald-50 text-emerald-700" : "bg-teal-50 text-teal-700"}`}
                >
                  {contact.type === "call" ? (
                    <Phone size={24} />
                  ) : (
                    <ShieldCheck size={24} />
                  )}
                </div>
                <span className="text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  {contact.tag}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                {contact.title}
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                {contact.description}
              </p>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-500">Emergency number</span>
                  <strong className="text-base text-slate-900">
                    {contact.number}
                  </strong>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-slate-500">Availability / details</span>
                  <strong className="text-right text-slate-700">
                    {contact.availability}
                  </strong>
                </div>
              </div>
              {contact.type === "call" ? (
                <a
                  href={`tel:${contact.number}`}
                  className={`mt-5 inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-base font-bold text-white transition ${contact.number === "112" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-sky-600 hover:bg-sky-700"}`}
                >
                  Call {contact.number}
                </a>
              ) : (
                <div className="mt-5 rounded-xl bg-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-500">
                  Local contact details to be added
                </div>
              )}
            </article>
          ))}
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Local veterinary, municipal, and animal-welfare contact details should
          be configured and verified for the service area before publication.
        </p>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="scroll-mt-8 border-t border-slate-200 py-14" id="faq">
        <SectionHeading
          eyebrow="07 · Quick answers"
          title="Frequently asked questions"
          description="Clear, responsible answers to common questions about rabies prevention."
        />

        <div className="mt-9 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="border-b border-slate-200 last:border-b-0"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                aria-expanded={expandedFaq === index}
                className="flex min-h-[76px] w-full items-center justify-between gap-5 px-6 py-6 text-left transition hover:bg-slate-50 sm:px-8 sm:py-7"
              >
                <span className="text-lg font-bold leading-7 text-slate-900 sm:text-xl">
                  {faq.question}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xl font-semibold text-indigo-600">
                  {expandedFaq === index ? "−" : "+"}
                </span>
              </button>
              {expandedFaq === index && (
                <div className="border-t border-slate-100 bg-slate-50 px-6 py-6 sm:px-8 sm:py-7">
                  <p className="max-w-5xl text-base leading-8 text-slate-600 sm:text-lg">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-indigo-50 px-6 py-5 sm:px-8">
          <p className="text-base leading-7 text-slate-700">
            Have a possible exposure?{" "}
            <a
              href="#first-aid"
              className="ml-1 font-bold text-indigo-700 underline-offset-4 hover:underline"
            >
              See urgent steps and seek medical care{" "}
              <ArrowUpRight className="inline" size={17} />
            </a>
          </p>
        </div>
      </section>

      {/* TRUSTED RESOURCES */}
      <section className="border-t border-slate-200 py-14">
        <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-7 sm:p-9 lg:p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600">
              <BookOpen size={29} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Learn from trusted sources
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Explore official guidelines and reliable information about
                rabies prevention and treatment.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white p-5 transition hover:border-indigo-300 hover:shadow-sm sm:p-6"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {resource.description}
                  </p>
                </div>

                <ExternalLink size={21} className="shrink-0 text-indigo-600" />
              </a>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-4 border-t border-indigo-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-bold text-slate-900">
                National Rabies Control Programme helpline
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Refer to official health authorities for emergency guidance.
              </p>
            </div>

            <a
              href="tel:01206025400"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white transition hover:bg-indigo-700"
            >
              <Phone size={19} />
              0120-6025400
            </a>
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
        <div className="flex items-start gap-4">
          <Info size={22} className="mt-0.5 shrink-0 text-slate-500" />
          <p className="text-sm leading-7 text-slate-500 sm:text-base">
            <strong className="text-slate-800">
              Health information disclaimer:
            </strong>{" "}
            This page is intended for general educational purposes. It does not
            replace professional medical or veterinary advice, diagnosis, or
            treatment. If a possible rabies exposure occurs, seek medical
            attention immediately. Follow current local health-authority
            guidance.
          </p>
        </div>
      </section>
    </div>
  );
}
