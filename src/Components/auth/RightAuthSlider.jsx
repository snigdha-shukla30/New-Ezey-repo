import React, { useEffect, useState } from "react";

const RightAuthSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      text: "With Ezey, your timing manual timetable arrangement becomes fully automated!",
    },
    {
      text: "Collaborate seamlessly with your team",
    },
    {
      text: "Save time with automated scheduling",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full h-[630px] rounded-2xl overflow-hidden shadow-xl flex items-center justify-center"
      style={{
        backgroundImage: "url('/rightbg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="relative w-[360px] h-[400px] mb-8">
            {index === 0 && (
              <>
                <img
                  src="/spects.jpg"
                  className="absolute top-0 right-10 w-44 h-44 rounded-2xl border-8 border-[#599BAB]/50 object-cover"
                />

                <img
                  src="/watch.jpg"
                  className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-2xl border-8 border-[#599BAB]/50 object-cover"
                />

                <img
                  src="/copy.jpg"
                  className="absolute bottom-0 left-6 w-44 h-44 rounded-2xl border-8 border-[#599BAB]/50 object-cover"
                />
              </>
            )}

            {index !== 0 && (
              <img
                src={index === 1 ? "/ezeyteam.jpg" : "/timer.jpg"}
                className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-2xl border-8 border-[#599BAB]/50 object-cover"
              />
            )}
          </div>

          <p className="text-white text-xl text-center max-w-md px-6">
            "{slide.text}"
          </p>
        </div>
      ))}

      <div className="absolute bottom-6 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 rounded-full transition-all ${currentSlide === i ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RightAuthSlider;



