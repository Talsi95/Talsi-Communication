import React, { useState, useEffect, useMemo } from 'react';
import QuestionStep from '../components/QuestionStep';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import CartSummary from '../components/CartSummary';

const SalesWizard = () => {

    const getInitialPackage = () => {
        const saved = localStorage.getItem('selectedPackage');
        return saved ? JSON.parse(saved) : null;
    };

    const initialPackage = getInitialPackage();

    const generateRandomNumbers = () => {
        return Array.from({ length: 3 }, () => {
            const randomSuffix = Math.floor(1000000 + Math.random() * 9000000);
            return `057-${randomSuffix}`;
        });
    };

    const [step, setStep] = useState(initialPackage ? 'TYPE' : 'PACKAGES');
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [lines, setLines] = useState([]);
    const [packages, setPackages] = useState([]);
    const [currentLine, setCurrentLine] = useState({ package: null, type: null, phoneNumber: '' });
    const [personalData, setPersonalData] = useState({});
    const [tempNumbers, setTempNumbers] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const [stepHistory, setStepHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const token = localStorage.getItem('token');
                const endpoint = token ? '/packages' : '/packages/public';
                const { data } = await api.get(endpoint);
                setPackages(data);

                const savedPkg = localStorage.getItem('selectedPackage');
                if (savedPkg) {
                    const parsed = JSON.parse(savedPkg);
                    const fullPkg = data.find(p => p._id === parsed._id || p.name === parsed.name);
                    if (fullPkg) {
                        setCurrentLine(prev => ({
                            ...prev,
                            package: fullPkg,
                            id: Date.now()
                        }));
                        setStep('TYPE');
                    } else {
                        setStep('PACKAGES');
                    }
                } else {
                    setStep('PACKAGES');
                }
            } catch (err) {
                console.error("Fetch error", err);
                setStep('PACKAGES');
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        setCurrentLine(prev => ({ ...prev, phoneNumber: '' }));
    }, [currentLine.type]);

    useEffect(() => {
        setTempNumbers(generateRandomNumbers());
    }, []);

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidIsraeliID = (id) => {
        id = String(id).trim();
        if (id.length > 9 || id.length < 5 || isNaN(id)) return false;
        id = id.length < 9 ? ("00000000" + id).slice(-9) : id;
        return Array.from(id, Number).reduce((counter, digit, i) => {
            const step = digit * ((i % 2) + 1);
            return counter + (step > 9 ? step - 9 : step);
        }, 0) % 10 === 0;
    };

    const isStepValid = (data = formData) => {
        switch (step) {
            case 'PACKAGES':
                return !!currentLine.package;
            case 'TYPE':
                return !!currentLine.type;
            case 'NUMBER_PICK':
                return currentLine.phoneNumber && currentLine.phoneNumber.replace(/-/g, '').length >= 9;
            case 'PERSONAL':
                return (
                    data.fullName?.trim().split(' ').length >= 2 &&
                    isEmailValid(data.email) &&
                    isValidIsraeliID(data.idNumber) &&
                    formData.city?.trim() &&
                    formData.street?.trim() &&
                    formData.houseNumber?.trim());
            default:
                return true;
        }
    };

    const handleBack = () => {
        if (stepHistory.length > 0) {
            const prevHistory = [...stepHistory];
            const lastStep = prevHistory.pop();
            setStepHistory(prevHistory);
            setStep(lastStep);
        } else {
            navigate('/');
        }
    };

    const handleNext = (nextStep) => {
        if (!isStepValid(formData)) {
            setShowErrors(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setShowErrors(false);

        setStepHistory(prev => [...prev, step]);

        setStep(nextStep);
    };

    const refreshNumbers = () => {
        setTempNumbers(generateRandomNumbers());
    };

    const addLineAndContinue = (choice) => {
        setLines(prevLines => {
            const lineIndex = prevLines.findIndex(l => l.id === currentLine.id);

            if (lineIndex !== -1) {
                const updated = [...prevLines];
                updated[lineIndex] = { ...currentLine };
                return updated;
            } else {
                return [...prevLines, { ...currentLine }];
            }
        });

        if (choice === 'more') {
            setCurrentLine({ id: null, package: null, type: null, phoneNumber: '' });
            setStep('PACKAGES');
        } else {
            setStep('PERSONAL');
        }
    };

    const finalSubmit = async () => {
        try {
            const payload = {
                ...personalData,
                lines: lines,
            };
            await api.post('/applications/save-step', payload);
            alert("ההזמנה נשלחה בהצלחה!");
        } catch (err) {
            console.error(err);
            alert("שגיאה בשליחת ההזמנה");
        }
    };


    if (loading) return <div className="p-10 text-center">טוען חבילות...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans text-slate-100 p-4 md:p-12 relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] -z-10"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-center gap-12 relative z-10">

                {lines.length > 0 && (
                    <div className="md:hidden sticky top-[72px] z-40 px-4 py-2">
                        <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
                            <details className="group outline-none">
                                <summary className="list-none flex justify-between items-center p-4 cursor-pointer select-none">
                                    <div className="flex items-center gap-2">
                                        <span className="text-teal-400 text-lg">🛒</span>
                                        <span className="font-black text-white text-sm tracking-wide">
                                            הסל שלי ({lines.length})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-left">
                                            <span className="text-teal-400 font-black text-lg leading-none">
                                                {lines.reduce((acc, curr) => acc + (Number(curr.package?.price) || 0), 0)} ₪
                                            </span>
                                        </div>
                                        <span className="text-gray-500 transition-transform duration-300 group-open:rotate-180">
                                            ▼
                                        </span>
                                    </div>
                                </summary>

                                <div className="px-4 pb-4 max-h-60 overflow-y-auto border-t border-white/5 bg-black/20">
                                    <div className="py-2">
                                        <CartSummary
                                            lines={lines}
                                            currentLine={currentLine}
                                            step={step}
                                        />
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                )}

                <div className="sticky top-[145px] md:top-6 z-50 h-10 flex items-center">
                    {(stepHistory.length > 0 || step !== 'PACKAGES') && (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-500 hover:text-teal-400 transition-colors mr-2 group bg-[#0f172a]/80 backdrop-blur-sm pr-4 py-1 rounded-full border border-white/5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-bold text-sm">חזרה</span>
                        </button>
                    )}
                </div>

                <div className="w-full lg:max-w-[800px] space-y-8">

                    {step === 'PACKAGES' && (
                        <QuestionStep question="בוא נבחר חבילה לקו" description="בחר אחת מהחבילות המשתלמות שלנו">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {packages.map(pkg => (
                                    <button
                                        key={pkg._id}
                                        onClick={() => {
                                            setStepHistory([...stepHistory, step]);
                                            setCurrentLine({ ...currentLine, package: pkg, id: Date.now() });
                                            setStep('TYPE');
                                        }}
                                        className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-teal-500/50 hover:bg-white/10 transition-all text-right group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-black text-white group-hover:text-teal-400 transition-colors">{pkg.name}</span>
                                            <span className="text-2xl font-black text-white">{pkg.price} ₪</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </QuestionStep>
                    )}

                    {step === 'TYPE' && (
                        <QuestionStep question="היי! מה אנחנו עושים היום?">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setStepHistory([...stepHistory, step]);
                                        setCurrentLine({ ...currentLine, type: 'new' });
                                        setStep('NUMBER_PICK');
                                    }}
                                    className="p-8 bg-teal-500 text-slate-900 rounded-[2.5rem] font-black text-xl shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform"
                                >
                                    קו חדש ומדליק
                                </button>
                                <button
                                    onClick={() => {
                                        setStepHistory([...stepHistory, step]);
                                        setCurrentLine({ ...currentLine, type: 'port' });
                                        setStep('NUMBER_PICK');
                                    }}
                                    className="p-8 bg-white/5 border border-white/10 text-white rounded-[2.5rem] font-black text-xl hover:bg-white/10 transition-all"
                                >
                                    ניוד מספר קיים
                                </button>
                            </div>
                        </QuestionStep>
                    )}

                    {step === 'NUMBER_PICK' && (
                        <QuestionStep question="איזה מספר נשייך לחבילה?" description={currentLine.type === 'new' ? "בחר מספר מהרשימה" : "הכנס את המספר לניוד"}>
                            {currentLine.type === 'new' ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {tempNumbers.map(num => (
                                        <button
                                            key={num}
                                            onClick={() => {
                                                setStepHistory([...stepHistory, step]);
                                                setCurrentLine({ ...currentLine, phoneNumber: num });
                                                setStep('ADD_MORE');
                                            }}
                                            className="p-5 bg-white/5 border border-white/10 rounded-2xl text-2xl font-mono tracking-widest hover:border-teal-400 hover:text-teal-400 transition-all"
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button onClick={refreshNumbers} className="text-blue-500 underline text-sm w-full text-center mt-4">
                                        🔄 לא אהבתי, תראה לי עוד מספרים
                                    </button>
                                </div>

                            ) : (
                                <div className="space-y-4">
                                    <input
                                        type="tel"
                                        placeholder="05X-XXXXXXX"
                                        className="w-full p-4 border rounded-xl text-center font-mono text-xl"
                                        onChange={(e) => setCurrentLine({ ...currentLine, phoneNumber: e.target.value })}
                                        value={currentLine.phoneNumber}
                                    />
                                    {showErrors && <p className="text-red-500 text-sm text-center font-bold">⚠️ נא להזין מספר טלפון תקין</p>}
                                    <button
                                        onClick={() => {
                                            if (!currentLine.phoneNumber || currentLine.phoneNumber.length < 9) {
                                                setShowErrors(true);
                                                return;
                                            }
                                            setStepHistory([...stepHistory, step]);
                                            setStep('ADD_MORE');
                                            setShowErrors(false);
                                        }}
                                        className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-xl shadow-lg shadow-teal-500/20"
                                    >
                                        המשך
                                    </button>
                                </div>
                            )}
                        </QuestionStep>
                    )}

                    {step === 'ADD_MORE' && (
                        <QuestionStep question="הקו נוסף בהצלחה!" description="האם תרצה להוסיף קווים נוספים להזמנה זו?">
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <button
                                    onClick={() => {
                                        setStepHistory([...stepHistory, step]);
                                        addLineAndContinue('more');
                                        setTempNumbers(generateRandomNumbers());
                                    }}
                                    className="w-full py-6 px-4 bg-white/5 border-2 border-white/10 text-white rounded-[2rem] font-black text-xl hover:bg-white/10 hover:border-teal-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                                >
                                    כן, יש לי עוד קו להוסיף ➕
                                </button>
                                <button
                                    onClick={() => {
                                        setStepHistory([...stepHistory, step]);
                                        addLineAndContinue('personal');
                                    }}
                                    className="w-full py-6 px-4 bg-teal-500 text-slate-900 rounded-[2rem] font-black text-xl shadow-xl shadow-teal-500/20 hover:bg-teal-400 transform hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    לא תודה, המשך למילוי פרטים
                                </button>
                            </div>
                        </QuestionStep>
                    )}

                    {step === 'PERSONAL' && (
                        <QuestionStep question="כמעט סיימנו, רק פרטי זיהוי">
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="שם מלא"
                                        className={`w-full p-4 border rounded-xl outline-none focus:ring-2 transition-all ${showErrors && (!formData.fullName || formData.fullName.trim().split(' ').length < 2)
                                            ? 'border-red-500'
                                            : 'border-gray-200'
                                            }`}
                                        onChange={(e) => {
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }}
                                        value={formData.fullName || ''}
                                    />

                                    {showErrors && (!formData.fullName || formData.fullName.trim().split(' ').length < 2) && (
                                        <p className="text-red-500 text-xs mt-1 font-bold">⚠️ יש להזין שם פרטי ומשפחה</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="מספר תעודת זהות"
                                        maxLength="9"
                                        className={`w-full p-4 border rounded-xl outline-none focus:ring-2 ${showErrors && !isValidIsraeliID(formData.idNumber) ? 'border-red-500' : 'border-gray-200'}`}
                                        onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                                        value={formData.idNumber || ''}
                                    />
                                    {showErrors && !isValidIsraeliID(formData.idNumber) && (
                                        <p className="text-red-500 text-xs mt-1 font-bold">⚠️ מספר תעודת זהות לא תקין</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="כתובת אימייל"
                                        className={`w-full p-4 border rounded-xl outline-none focus:ring-2 ${showErrors && !isEmailValid(formData.email) ? 'border-red-500' : 'border-gray-200'}`}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        value={formData.email || ''}
                                    />
                                    {showErrors && !isEmailValid(formData.email) && (
                                        <p className="text-red-500 text-xs mt-1 font-bold">⚠️ יש להזין כתובת אימייל תקינה</p>
                                    )}
                                </div>


                                <div className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="עיר"
                                            className={`w-full p-4 border rounded-xl outline-none focus:ring-2 transition-all ${showErrors && !formData.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'
                                                }`}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            value={formData.city || ''}
                                        />
                                    </div>

                                    <div className="flex gap-2">
                                        <div className="flex-[3]">
                                            <input
                                                type="text"
                                                placeholder="רחוב"
                                                className={`w-full p-4 border rounded-xl outline-none focus:ring-2 transition-all ${showErrors && !formData.street ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'
                                                    }`}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                value={formData.street || ''}
                                            />
                                        </div>

                                        <div className="flex-[1]">
                                            <input
                                                type="text"
                                                placeholder="בית"
                                                className={`w-full p-4 border rounded-xl outline-none focus:ring-2 transition-all ${showErrors && !formData.houseNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'
                                                    }`}
                                                onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                                                value={formData.houseNumber || ''}
                                            />
                                        </div>
                                    </div>

                                    {showErrors && (!formData.city || !formData.street || !formData.houseNumber) && (
                                        <p className="text-red-500 text-xs mt-1 mr-2 font-bold animate-pulse">
                                            ⚠️ נא למלא כתובת מלאה (עיר, רחוב ומספר)
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleNext('SUMMARY')}
                                    className="w-full py-5 bg-teal-500 text-slate-900 rounded-3xl font-black text-xl mt-6 shadow-xl shadow-teal-500/20"
                                >
                                    לסיכום ההזמנה
                                </button>
                            </div>
                        </QuestionStep>
                    )}

                    {step === 'SUMMARY' && (
                        <QuestionStep question="מעולה, סיימנו!" description="בדוק שהכל תקין לפני השליחה:">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-4">
                                <p><strong>לקוח:</strong> {formData.fullName} ({formData.idNumber})</p>
                                <p><strong>כתובת:</strong> {formData.street} {formData.houseNumber}, {formData.city}</p>
                                <div className="border-t pt-2">
                                    <p className="font-bold mb-2">קווים שנבחרו:</p>
                                    {lines.map((l, i) => (
                                        <p key={i} className="text-sm">{l.phoneNumber} - {l.package?.name} ({l.package?.price}₪)</p>
                                    ))}
                                </div>
                                <p className="text-xl font-black text-blue-600 border-t pt-2">סה"כ: {lines.reduce((acc, curr) => acc + (curr.package?.price || 0), 0)} ₪</p>
                            </div>
                            <button onClick={finalSubmit} className="w-full py-6 bg-gradient-to-r from-teal-500 to-blue-500 text-slate-900 rounded-[2rem] font-black text-2xl shadow-2xl shadow-teal-500/20 mt-8 transform hover:scale-[1.02] transition-all">שלח הזמנה 🚀</button>
                            <button onClick={() => setStep('PERSONAL')} className="w-full text-gray-400 text-sm underline mt-4">
                                חזור לעריכת פרטים
                            </button>
                        </QuestionStep>
                    )}

                    <div className="hidden lg:block lg:col-span-4">
                        <div className="sticky top-12 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                הסל שלי
                                <span className="text-sm bg-teal-500 text-slate-900 px-2 py-1 rounded-lg">{lines.length}</span>
                            </h3>
                            <CartSummary
                                lines={lines}
                                currentLine={currentLine}
                                step={step}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >


    );
};

export default SalesWizard;