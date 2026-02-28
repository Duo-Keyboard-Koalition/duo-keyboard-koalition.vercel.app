import WorkshopSlideshow from '@/components/WorkshopSlideshow'

function WorkshopIntro() {
  return (
    <div className="my-12 rounded-lg border border-gray-700 bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-8">
      <h3 className="mb-6 text-center text-2xl font-bold text-primary">
        Building Workshops
      </h3>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-1 rounded-lg bg-gradient-to-br from-primary/60 via-primary/40 to-primary/30 p-6 shadow-inner">
          <h4 className="mb-3 text-center text-xl font-semibold text-primary">
            Hands-On Learning
          </h4>
          <p className="text-gray-200">
            Learn keyboard building through practical workshops. Get hands-on
            experience with soldering, assembly, and firmware programming.
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-gradient-to-br from-primary/50 to-primary/30 p-6 shadow-inner">
          <h4 className="mb-3 text-center text-xl font-semibold text-primary">
            Expert Guidance
          </h4>
          <p className="text-gray-200">
            Learn from experienced builders who share their knowledge,
            techniques, and best practices in our community workshops.
          </p>
        </div>
      </div>
    </div>
  )
}

function WorkshopQuotes() {
  return (
    <div className="my-10 space-y-6">
      <blockquote className="rounded-lg border-l-4 border-primary bg-gradient-to-r from-primary/20 to-primary/10 p-6">
        <p className="italic text-gray-200">
          &quot;The best way to learn keyboard building is by doing. Our
          workshops provide the perfect environment to experiment, make
          mistakes, and grow.&quot;
        </p>
        <footer className="mt-2 text-primary">— Workshop Leader</footer>
      </blockquote>
      <blockquote className="rounded-lg border-l-4 border-primary/70 bg-gradient-to-r from-primary/10 to-primary/5 p-6">
        <p className="italic text-gray-200">
          &quot;Every builder started somewhere. Our workshops are designed to
          help you take that first step with confidence.&quot;
        </p>
        <footer className="mt-2 text-primary">— Community Mentor</footer>
      </blockquote>
    </div>
  )
}

export default function Workshop() {
  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-fixed px-4 pt-20 text-white">
      <div className="space-y-stars absolute bottom-0 left-0 right-0 top-0 -z-10"></div>
      <h1 className="mb-3 bg-gradient-to-r from-primary via-[#FFB84D] to-[#CC8400] bg-clip-text text-center text-4xl font-bold text-transparent">
        Builder Workshops
      </h1>
      <h2 className="mb-8 text-center text-xl text-primary">
        Learn, Build, and Grow Together
      </h2>
      <div className="prose lg:prose-xl mx-auto">
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          Join our community workshops designed to help you master keyboard
          building from the ground up. Whether you&apos;re a complete beginner
          or looking to refine your skills, our workshops cover everything from{' '}
          <span className="text-primary">hardware assembly</span> to{' '}
          <span className="text-[#FFB84D]">firmware programming</span>.
        </p>
        <p className="mb-6 text-lg leading-relaxed text-gray-300">
          Our workshops are hands-on, collaborative, and designed to help you
          build real projects while learning. You&apos;ll work alongside
          experienced builders, ask questions, and leave with both knowledge and
          a completed project.
        </p>
        <WorkshopIntro />
        <h3 className="mb-6 mt-12 text-center text-2xl font-bold text-primary">
          Workshop Topics
        </h3>
        <WorkshopSlideshow />
        <p className="mt-10 text-lg leading-relaxed text-gray-300">
          Our workshops cover a wide range of topics, from basic soldering
          techniques to advanced firmware customization. Each workshop is
          designed to be practical and immediately applicable to your building
          projects.
        </p>
        <WorkshopQuotes />
        <div className="mt-16 rounded-lg border border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <h3 className="mb-4 text-center text-2xl font-bold text-primary">
            Join a Workshop
          </h3>
          <p className="text-lg leading-relaxed text-gray-300">
            Ready to start building? Check our upcoming workshops and register
            to join. All skill levels are welcome, and we provide all the
            materials you&apos;ll need. Come learn, build, and connect with
            fellow keyboard enthusiasts.
          </p>
          <div className="mt-6 text-center">
            <button className="rounded-lg border border-primary/30 bg-primary/20 px-6 py-3 text-primary transition-colors hover:bg-primary/30">
              View Upcoming Workshops
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
