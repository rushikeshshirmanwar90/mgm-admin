import React from "react";
import "react-toastify/dist/ReactToastify.css";

export default function BeautifulSpinner() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-blue-200 border-b-transparent animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border-4 border-blue-100 border-l-transparent animate-spin-reverse"></div>
            </div>
            <span className="mt-6 text-blue-600 font-bold text-xl animate-pulse">Loading...</span>
        </div>
    );
}
