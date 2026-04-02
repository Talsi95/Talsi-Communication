const QuestionStep = ({ question, children, description }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-right" dir="rtl">
            <div className="max-w-xl w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{question}</h2>
                {description && <p className="text-gray-500 mb-6">{description}</p>}
                <div className="space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default QuestionStep;