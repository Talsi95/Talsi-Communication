import React from 'react';

const PackageCard = ({ pkg, onSelect }) => {
    // הגנה למקרה ש-pkg לא הגיע כראוי מהשרת
    if (!pkg) return null;

    return (
        <div
            dir="rtl"
            className={`relative p-6 rounded-3xl border-2 transition-all text-right ${pkg.isPrivate
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'
                }`}
        >
            {/* תגית חבילה פרטית */}
            {pkg.isPrivate && (
                <span className="absolute -top-3 right-6 px-3 py-1 bg-purple-600 text-white text-xs font-black rounded-full shadow-lg z-10">
                    🌟 חבילת סוכן בלעדית
                </span>
            )}

            <h3 className="text-xl font-bold text-gray-800 mb-1">{pkg.name}</h3>

            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-gray-900">{pkg.dataGB}</span>
                <span className="text-xl font-bold text-gray-700">GB</span>
            </div>

            <div className="text-2xl font-bold text-blue-600 mb-6">
                <span className="ml-1">₪</span>
                {pkg.price}
                <span className="text-sm font-normal text-gray-400 mr-2">/ לחודש</span>
            </div>

            <button
                onClick={() => onSelect(pkg)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${pkg.isPrivate
                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200 shadow-lg'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 shadow-lg'
                    }`}
            >
                בחירה והמשך
            </button>
        </div>
    );
};

export default PackageCard;