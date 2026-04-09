const QuestionStep = ({ question, children, description }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-right" dir="rtl">
            <div className="w-full p-8 bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{question}</h2>
                {description && <p className="text-gray-500 mb-6">{description}</p>}
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default QuestionStep;