export const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
        isActive
          ? 'border-teal-500 bg-teal-50 shadow-md scale-105'
          : 'border-gray-300 bg-white hover:border-teal-300 hover:shadow-sm'
      }`}
    >
      <Icon className={`w-7 h-7 mx-auto mb-2.5 transition-colors ${
        isActive ? 'text-teal-600' : 'text-gray-400'
      }`} />
      <span className={`text-sm font-medium transition-colors ${
        isActive ? 'text-teal-700' : 'text-gray-600'
      }`}>
        {label}
      </span>
    </button>
  );
};








