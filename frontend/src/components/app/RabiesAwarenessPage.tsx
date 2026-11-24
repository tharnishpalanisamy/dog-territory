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
      "Rabies can spread through infected saliva entering broken skin or mucous membranes, including through scratches contaminated with saliva.",
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

export default function RabiesAwarenessPage() {
  const [expandedMyth, setExpandedMyth] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#111c43] text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-indigo-200">
              <ShieldCheck size={15} />
              Community awareness
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Together, we can
              <span className="block text-indigo-300">prevent rabies.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Awareness, responsible vaccination, and timely medical attention
              can save lives. Learn how to protect yourself, your community, and
              the animals around you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#first-aid"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white transition hover:bg-indigo-400"
              >
                Learn bite first aid
                <ArrowUpRight size={18} />
              </a>

              <a
                href="#understanding"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                Explore awareness
              </a>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
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
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <item.icon className="text-indigo-300" size={25} />
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Emergency warning */}
        <section className="relative -mt-6 rounded-2xl border border-red-200 bg-white p-5 shadow-lg sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle size={26} />
            </div>

            <div className="flex-1">
              <h2 className="font-bold text-slate-900">
                Been bitten or scratched by an animal?
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Wash the wound immediately with soap and running water for at
                least 15 minutes, then seek medical assessment as soon as
                possible. Do not wait for symptoms.
              </p>
            </div>

            <a
              href="#first-aid"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-red-600 hover:text-red-700"
            >
              What to do <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        {/* Table of contents */}
        <section className="py-12">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Explore the guide
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Know what matters
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
              >
                <span className="text-xs font-bold text-indigo-500">
                  0{index + 1}
                </span>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {section.label}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Understanding rabies */}
        <section id="understanding" className="scroll-mt-8 py-10">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                01 · Understanding rabies
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
                What is rabies?
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Rabies is a viral disease that affects the central nervous
                system of mammals, including humans and dogs. It is commonly
                transmitted through the bite of an infected animal.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Once clinical symptoms develop, rabies is virtually always
                fatal. However, prompt post-exposure treatment can prevent the
                disease from developing.
              </p>

              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="flex gap-3">
                  <Info className="shrink-0 text-indigo-600" size={21} />
                  <p className="text-sm leading-6 text-indigo-900">
                    Rabies affects both animals and humans. Protecting dogs
                    through vaccination is an important part of protecting
                    public health.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
                <HeartPulse size={48} />
              </div>

              <h3 className="mt-6 text-center text-xl font-bold text-slate-900">
                How does rabies spread?
              </h3>

              <div className="mt-6 space-y-4">
                {[
                  "Bites from infected animals",
                  "Scratches contaminated with infected saliva",
                  "Saliva entering broken skin or mucous membranes",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-emerald-600"
                    />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Warning signs */}
        <section id="symptoms" className="scroll-mt-8 py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              02 · Identification
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Warning signs in animals
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Rabies can cause changes in behaviour and neurological symptoms.
              Signs vary, and no single sign confirms rabies.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
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
                description:
                  "Changes in barking or other unusual vocal behaviour.",
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
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-200 hover:shadow-sm"
              >
                <item.icon className="text-indigo-600" size={25} />
                <h3 className="mt-4 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <strong>Important:</strong> These signs are not exclusive to rabies.
            Never attempt to diagnose or handle a potentially infected animal
            yourself. Keep a safe distance and contact appropriate veterinary or
            animal-control authorities.
          </div>
        </section>

        {/* Bite first aid */}
        <section id="first-aid" className="scroll-mt-8 py-12">
          <div className="rounded-3xl bg-[#111c43] p-6 text-white sm:p-10">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                03 · Emergency response
              </p>

              <h2 className="mt-3 text-3xl font-extrabold">
                What to do after a dog bite
              </h2>

              <p className="mt-4 leading-7 text-slate-300">
                Immediate wound care and professional medical assessment are
                essential after a possible rabies exposure.
              </p>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {[
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
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-indigo-300">
                      {step.number}
                    </span>
                    <step.icon className="text-indigo-300" size={25} />
                  </div>

                  <h3 className="mt-5 font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-red-300/20 bg-red-500/10 p-5">
              <p className="font-bold text-red-200">Never do these things:</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                <li>• Do not apply chilli powder, acids, or irritants.</li>
                <li>• Do not ignore minor bites or scratches.</li>
                <li>• Do not wait for symptoms before seeking care.</li>
                <li>• Do not self-prescribe or skip recommended treatment.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Prevention */}
        <section id="prevention" className="scroll-mt-8 py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              04 · Prevention
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
              Prevention starts with us
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Communities, volunteers, veterinarians, and authorities all have a
              role in preventing rabies.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Vaccinate dogs",
                text: "Support responsible vaccination programmes and ensure dogs receive veterinary care.",
                icon: Syringe,
              },
              {
                title: "Avoid risky contact",
                text: "Do not provoke, corner, or handle unfamiliar or sick animals.",
                icon: Dog,
              },
              {
                title: "Report concerns",
                text: "Report suspected rabies cases to appropriate veterinary or animal-control authorities.",
                icon: AlertTriangle,
              },
              {
                title: "Spread awareness",
                text: "Share reliable information about prevention, vaccination, and bite response.",
                icon: BookOpen,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <item.icon size={24} />
                </div>
                <h3 className="mt-5 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Myths and facts */}
        <section id="myths" className="scroll-mt-8 py-12">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            05 · Education
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">
            Myths vs facts
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Misinformation can delay lifesaving treatment. Understand the facts
            before making decisions.
          </p>

          <div className="mt-8 space-y-3">
            {myths.map((myth, index) => (
              <div
                key={myth.question}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedMyth(expandedMyth === index ? null : index)
                  }
                  aria-expanded={expandedMyth === index}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <XCircle
                      className="mt-0.5 shrink-0 text-red-500"
                      size={19}
                    />
                    <span className="font-semibold text-slate-900">
                      {myth.question}
                    </span>
                  </div>

                  <ChevronDown
                    className={`shrink-0 text-slate-400 transition-transform ${
                      expandedMyth === index ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>

                {expandedMyth === index && (
                  <div className="border-t border-slate-100 bg-slate-50 p-5">
                    <div className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-emerald-600"
                        size={20}
                      />
                      <p className="text-sm leading-7 text-slate-600">
                        {myth.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="py-12">
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-6 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600">
                <BookOpen size={25} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Learn from trusted sources
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Explore official guidelines and reliable information about
                  rabies prevention and treatment.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
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
              ].map((resource) => (
                <a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {resource.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {resource.description}
                    </p>
                  </div>
                  <ExternalLink
                    size={17}
                    className="shrink-0 text-indigo-600"
                  />
                </a>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-200 pt-5">
              <p className="text-xs leading-5 text-slate-500">
                For emergencies in India, contact the National Rabies Control
                Programme helpline.
              </p>
              <a
                href="tel:01206025400"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Phone size={16} />
                0120-6025400
              </a>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-xs leading-6 text-slate-500">
            <strong className="text-slate-700">
              Health information disclaimer:
            </strong>{" "}
            This page is intended for general educational purposes. It does not
            replace professional medical or veterinary advice, diagnosis, or
            treatment. If a possible rabies exposure occurs, seek medical
            attention immediately. Follow current local health-authority
            guidance.
          </p>
        </section>
      </main>
    </div>
  );
}
