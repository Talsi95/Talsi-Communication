import React, { useState, useEffect, useMemo } from 'react';
import QuestionStep from '../components/QuestionStep';
import api from '../api/axios';

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
                        setCurrentLine(prev => ({ ...prev, package: fullPkg }));
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

    const totalPrice = useMemo(() => {
        const linesTotal = lines.reduce((acc, curr) => acc + (Number(curr.package?.price) || 0), 0);
        const currentTotal = Number(currentLine.package?.price) || 0;
        return linesTotal + currentTotal;
    }, [lines, currentLine.package]);

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
                return !!data.type;
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

    const handleNext = (nextStep) => {
        if (currentLine.type === 'port' && (!currentLine.phoneNumber || currentLine.phoneNumber.length < 9)) {
            setShowErrors(true);
            return;
        }
        setStep(nextStep);
        setShowErrors(false);
    };


    const refreshNumbers = () => {
        setTempNumbers(generateRandomNumbers());
    };

    const addLineAndContinue = (choice) => {
        const updatedLines = [...lines, { ...currentLine }];
        setLines(updatedLines);

        setCurrentLine({ package: null, type: null, phoneNumber: '' });

        if (choice === 'more') {
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

    const CartSummary = () => (
        <div className="space-y-3">
            {lines.map((l, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <div className="flex justify-between text-[10px] mb-1">
                        <span className="font-bold text-blue-600">קו {idx + 1}</span>
                        <span className="font-bold">{l.package?.price} ₪</span>
                    </div>
                    <p className="text-xs font-mono">{l.phoneNumber}</p>
                    <p className="text-[10px] text-gray-500">{l.package?.name}</p>
                </div>
            ))}

            {currentLine.package && (
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 border-dashed">
                    <div className="flex justify-between text-[10px] mb-1">
                        <span className="font-bold text-orange-600">בתהליך...</span>
                        <span className="font-bold">{currentLine.package?.price || 0} ₪</span>
                    </div>
                    <p className="text-xs font-mono">{currentLine.phoneNumber || 'ממתין למספר'}</p>
                    <p className="text-[10px] text-gray-500">{currentLine.package?.name}</p>
                </div>
            )}

            <div className="pt-3 border-t-2 border-dashed mt-4">
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700">סה"כ לתשלום:</span>
                    <span className="text-xl font-black text-blue-600">{totalPrice} ₪</span>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-10 text-center">טוען חבילות...</div>;

    return (
        <div className="bg-gray-50 min-h-screen p-4" dir="rtl">

            {/* Sidebar למובייל - מופיע למעלה רק אם יש קווים */}
            {lines.length > 0 && (
                <div className="md:hidden bg-white p-3 shadow-md sticky top-0 z-50 border-b border-blue-100">
                    <details className="outline-none">
                        <summary className="list-none flex justify-between items-center cursor-pointer">
                            <span className="font-bold text-blue-600">הסל שלי ({lines.length} קווים) 🛒</span>
                            <span className="text-blue-700 font-black">{lines.reduce((acc, curr) => acc + (curr.package?.price || 0), 0)} ₪ ▾</span>
                        </summary>
                        <div className="mt-3 max-h-40 overflow-y-auto">
                            <CartSummary />
                        </div>
                    </details>
                </div>
            )}

            {/* שלב 0: בחירת חבילה */}
            {step === 'PACKAGES' && (
                <QuestionStep question="בוא נבחר חבילה לקו" description="בחר אחת מהחבילות המשתלמות שלנו">
                    <div className="grid grid-cols-1 gap-3">
                        {packages.map(pkg => (
                            <button
                                key={pkg._id}
                                onClick={() => {
                                    setCurrentLine({ ...currentLine, package: pkg });
                                    setStep('TYPE');
                                }}
                                className={`p-4 bg-white border-2 rounded-xl transition ${currentLine.package?._id === pkg._id ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">{pkg.name}</span>
                                    <span className="text-blue-600 font-black">{pkg.price} ₪</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </QuestionStep>
            )}

            {/* שלב 1: סוג פעולה */}
            {step === 'TYPE' && (
                <QuestionStep question="היי! מה אנחנו עושים היום?">
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                setCurrentLine({ ...currentLine, type: 'new' });
                                setStep('NUMBER_PICK');
                            }}
                            className="w-full p-4 text-lg font-bold border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition"
                        >
                            קו חדש ומדליק
                        </button>
                        <button
                            onClick={() => {
                                setCurrentLine({ ...currentLine, type: 'port' });
                                setStep('NUMBER_PICK');
                            }}
                            className="w-full p-4 text-lg font-bold border-2 border-gray-200 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition"
                        >
                            ניוד מספר קיים
                        </button>
                    </div>
                </QuestionStep>
            )}

            {/* שלב 2: בחירת מספר */}
            {step === 'NUMBER_PICK' && (
                <QuestionStep question="איזה מספר נשייך לחבילה?" description={currentLine.type === 'new' ? "בחר מספר מהרשימה" : "הכנס את המספר לניוד"}>
                    {currentLine.type === 'new' ? (
                        <div className="grid grid-cols-1 gap-3">
                            {tempNumbers.map(num => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        setCurrentLine({ ...currentLine, phoneNumber: num });
                                        setStep('ADD_MORE');
                                    }}
                                    className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 font-mono text-xl text-center transition"
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
                                onClick={() => handleNext('ADD_MORE')}
                                className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold"
                            >
                                המשך
                            </button>
                        </div>
                    )}
                </QuestionStep>
            )}

            {/* שלב ביניים: האם יש קווים נוספים? */}
            {step === 'ADD_MORE' && (
                <QuestionStep question="הקו נוסף בהצלחה!" description="האם תרצה להוסיף קווים נוספים להזמנה זו?">
                    <div className="space-y-3">
                        <button
                            onClick={() => addLineAndContinue('more')}
                            className="w-full p-4 text-lg font-bold border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition"
                        >
                            כן, יש לי עוד קו להוסיף ➕
                        </button>
                        <button
                            onClick={() => addLineAndContinue('personal')}
                            className="w-full p-4 text-lg font-bold bg-blue-600 text-white rounded-xl shadow-lg transition"
                        >
                            לא תודה, המשך למילוי פרטים
                        </button>
                    </div>
                </QuestionStep>
            )}

            {/* שלב 3: פרטים אישיים */}
            {step === 'PERSONAL' && (
                <QuestionStep question="כמעט סיימנו, רק פרטי זיהוי">
                    <div className="space-y-4">
                        {/* שם מלא */}
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

                        {/* תעודת זהות עם בדיקת חוקיות */}
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

                        {/* אימייל */}
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


                        {/* כתובת מגורים - חיבור ל-Google Maps API */}
                        <div className="space-y-4">
                            {/* עיר */}
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
                                {/* רחוב */}
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

                                {/* מספר בית */}
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

                        <button onClick={() => handleNext('SUMMARY')} className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold mt-4">לסיכום ההזמנה</button>
                    </div>
                </QuestionStep>
            )}

            {/* שלב אחרון: סיכום */}
            {step === 'SUMMARY' && (
                <QuestionStep question="מעולה, סיימנו!" description="בדוק שהכל תקין לפני השליחה:">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-4 text-right">
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
                    <button onClick={finalSubmit} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xl mt-6 shadow-lg">שלח הזמנה 🚀</button>
                    <button onClick={() => setStep('PERSONAL')} className="w-full text-gray-400 text-sm underline mt-4">
                        חזור לעריכת פרטים
                    </button>
                </QuestionStep>
            )}

            {/* Sidebar לדסקטופ */}
            <div className="hidden md:block w-80 bg-white border-r p-6 shadow-xl top-0">
                <h3 className="text-xl font-bold text-blue-600 mb-4 border-b pb-2">הסל שלי 🛒</h3>
                {lines.length === 0 ? <p className="text-gray-400 italic">הסל ריק</p> : <CartSummary />}
            </div>
        </div>
    );
};

export default SalesWizard;