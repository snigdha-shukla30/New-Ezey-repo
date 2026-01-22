import { Eye, EyeOff } from "lucide-react";

export const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  width = "300px",
  height = "40px"
}) => {
  return (
    <div>
      {label && (
        <label className="block text-[#265768] font-medium mb-2 text-sm">
          {label}
        </label>
      )}

      <div
        className="relative"
        style={{ width }}
      >
        {Icon && (
          <>
            {/* icon */}
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            {/* ✅ icon ke baad bar */}
            <span className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-300 text-lg select-none">
              |
            </span>
          </>
        )}

        <input
          type={showPasswordToggle && !showPassword ? "password" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ height }}
          className="
            w-full
            pl-16
            pr-10
            bg-white
            border
            border-2
            border-gray-300
            rounded-md
            text-sm
            text-gray-900
            placeholder:text-gray-400
            outline-none
            focus:border-gray-300
            focus:ring-0
          "
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};







