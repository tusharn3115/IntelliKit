import React from "react";

// 👤 Testimonial data
const cardsData = [
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    name: "Briar Martin",
    handle: "@neilstellar",
    date: "April 20, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    name: "Avery Johnson",
    handle: "@averywrites",
    date: "May 10, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    name: "Jordan Lee",
    handle: "@jordantalks",
    date: "June 5, 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    name: "Taylor Smith",
    handle: "@taywrites",
    date: "July 1, 2025",
  },
];

// ✅ Testimonial Card Component
const TestimonialCard = ({ card }) => (
  <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white">
    <div className="flex gap-2 items-center">
      <img className="size-11 rounded-full" src={card.image} alt={card.name} />
      <div>
        <div className="flex items-center gap-1 font-medium">
          <p>{card.name}</p>
          {/* Verified Icon */}
          <svg
            className="mt-0.5"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.555.72a4 4 0 0 1-.297.24c...Z"
              fill="#2196F3"
            />
          </svg>
        </div>
        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>
    <p className="text-sm py-4 text-gray-800">
      Radiant made undercutting all of our competitors an absolute breeze.
    </p>
    <div className="flex items-center justify-between text-slate-500 text-xs">
      <div className="flex items-center gap-1">
        <span>Posted on</span>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-sky-500"
        >
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
            <path d="m.027 0 4.247 5.516L0 10h..." fill="currentColor" />
          </svg>
        </a>
      </div>
      <p>{card.date}</p>
    </div>
  </div>
);

// ✅ Main Component
const Testimonial = () => {
  return (
    <div id="reviews" className="min-h-screen w-full pt-10">
      {/* 🔁 Custom Keyframe Animation */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .marquee-inner {
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-reverse {
          animation-direction: reverse;
        }
      `}</style>

      <div className="text-center">
        <h2 className="text-slate-700 text-[42px] font-semibold">
          Loved by Creators
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>

      {/* 🔁 Forward Scroll Row */}
      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <TestimonialCard key={`fwd-${index}`} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>

      {/* 🔁 Reverse Scroll Row */}
      <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
          {[...cardsData, ...cardsData].map((card, index) => (
            <TestimonialCard key={`rev-${index}`} card={card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
};

export default Testimonial;
