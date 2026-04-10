
const CartSummary = ({ lines, currentLine, step }) => {
    const isEditing = !['PERSONAL', 'SUMMARY', 'SUCCESS'].includes(step);

    const totalPrice = lines.reduce((acc, curr) => acc + (Number(curr.package?.price) || 0), 0);

    return (
        <div className="space-y-4">
            {lines
                .filter(l => (isEditing ? l.id !== currentLine.id : true))
                .map((l, idx) => (
                    <div key={l.id || idx} className="bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden group transition-all">
                        <div className="absolute inset-y-0 right-0 w-1 bg-teal-500"></div>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">קו {idx + 1}</span>
                            <span className="font-bold text-white text-sm">₪{l.package?.price}</span>
                        </div>
                        <p className="text-lg font-mono text-white tracking-tighter">{l.phoneNumber}</p>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                {l.package?.dataGB}GB
                            </span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                {l.package?.minutes} דקות
                            </span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                {l.package?.sms} SMS
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">{l.package?.name}</p>
                    </div>
                ))}

            {currentLine.package && isEditing && (
                <div className="bg-white/[0.05] border-2 border-teal-500/30 border-dashed p-4 rounded-2xl animate-pulse relative overflow-hidden">
                    <div className="absolute inset-y-0 right-0 w-1 bg-teal-500/50"></div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-teal-400 italic tracking-widest">בעריכה...</span>
                        <span className="font-bold text-teal-400 text-sm">₪{currentLine.package?.price}</span>
                    </div>
                    <p className="text-lg font-mono text-white tracking-tighter">
                        {currentLine.phoneNumber || 'בחירת מספר...'}
                    </p>
                </div>
            )}

            <div className="pt-6 border-t border-white/10 mt-6">
                <div className="flex justify-between items-center px-1">
                    <span className="text-gray-400 font-medium italic">סה"כ לתשלום:</span>
                    <div className="text-right">
                        <span className="text-3xl font-black text-white tracking-tighter">₪{totalPrice}</span>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">כולל מע"מ</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSummary;