

export const CardContainer = ({ children, title }) => {
  return (
    <div className="relative px-8 py-4">
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl
          p-8
          border
          border-gray-100
          max-w-3xl 
        "
      >
        {title && (
          <p className="text-center text-teal-700 mb-10 text-xl leading-relaxed font-medium">
            {title}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};



