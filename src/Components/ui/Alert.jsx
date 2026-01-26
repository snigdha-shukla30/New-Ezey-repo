import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, XCircle } from "lucide-react";

const Alert = ({ message, type = "error", onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const variants = {
        success: {
            bg: "bg-[#E6F6F4]",
            border: "border-[#265768]",
            text: "text-[#265768]",
            icon: <CheckCircle className="w-5 h-5 text-[#265768]" />,
        },
        error: {
            bg: "bg-[#FFF5F5]",
            border: "border-[#E53E3E]",
            text: "text-[#E53E3E]",
            icon: <XCircle className="w-5 h-5 text-[#E53E3E]" />,
        },
        warning: {
            bg: "bg-[#FFFFF0]",
            border: "border-[#D69E2E]",
            text: "text-[#D69E2E]",
            icon: <AlertCircle className="w-5 h-5 text-[#D69E2E]" />,
        },
    };

    const style = variants[type] || variants.error;

    return (
        <div
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-[8px] border ${style.bg} ${style.border} shadow-lg min-w-[300px] max-w-[90%] animate-in fade-in slide-in-from-top-4 duration-300`}
        >
            <div className="flex-shrink-0">{style.icon}</div>
            <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
            <button
                onClick={onClose}
                className={`p-1 hover:bg-black/5 rounded-full transition-colors ${style.text}`}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Alert;
