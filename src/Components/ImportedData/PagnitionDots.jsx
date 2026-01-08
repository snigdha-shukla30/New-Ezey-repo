const PaginationDots = ({ total, current, onChange }) => {
  return (
    <div className="flex justify-center gap-2 pb-6">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            current === i ? "bg-cyan-600" : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
};

export default PaginationDots;
