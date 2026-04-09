const PackageCard = ({ pkg, onSelect }) => {
    if (!pkg) return null;

    return (
        <div
            dir="rtl"
            className={`relative p-8 rounded-[2.5rem] border backdrop-blur-md transition-all duration-300 text-right group
                ${pkg.isPrivate
                    ? 'border-purple-500/30 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.1)]'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 shadow-xl'
                }`}
        >
            {pkg.isPrivate && (
                <span className="absolute -top-3 right-8 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-purple-500/40 z-10 uppercase tracking-wider">
                    ✨ Exclusive Agent
                </span>
            )}

            <h3 className="text-xl font-bold text-gray-400 mb-2 group-hover:text-white transition-colors">
                {pkg.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-6">
                <span className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                    {pkg.dataGB}
                </span>
                <span className="text-2xl font-bold text-teal-400 uppercase tracking-widest">GB</span>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-white font-black text-lg">{pkg.minutes?.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs font-bold uppercase">דקות</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <span className="text-white font-black text-lg">{pkg.sms?.toLocaleString()}</span>
                    <span className="text-gray-500 text-xs font-bold uppercase">SMS</span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">₪{pkg.price}</span>
                    <span className="text-gray-500 text-xs font-medium">/ חודש</span>
                </div>

                <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-1 rounded-md font-black tracking-tighter">
                    FULL SPEED
                </span>
            </div>

            <button
                onClick={() => onSelect(pkg)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                    ${pkg.isPrivate
                        ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/25'
                        : 'bg-teal-500 text-slate-900 hover:bg-teal-400 shadow-lg shadow-teal-500/20'
                    }`}
            >
                בחירה והמשך
                <span className="text-xl">←</span>
            </button>
        </div>
    );
};

export default PackageCard;