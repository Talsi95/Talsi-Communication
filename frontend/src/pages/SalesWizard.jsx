import React, { useState } from 'react';
import QuestionStep from '../components/QuestionStep';
import api from '../api/axios';

const SalesWizard = () => {
    const [step, setStep] = useState('TYPE'); // TYPE, NUMBER_PICK, PORTING, PERSONAL, SUMMARY
    const [formData, setFormData] = useState({});
    const [tempNumbers, setTempNumbers] = useState(['057-1234567', '057-9876543', '057-5556667']);
    const [showErrors, setShowErrors] = useState(false);

    // פונקציית עזר לבדיקת אימייל
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
            case 'TYPE':
                return !!data.type;
            case 'NUMBER_PICK':
                return !!data.phoneNumber;
            case 'PERSONAL':
                return (
                    data.fullName?.trim().split(' ').length >= 2 &&
                    isEmailValid(data.email) &&
                    isValidIsraeliID(data.idNumber) &&
                    formData.city?.trim() &&   // בדיקה שהעיר קיימת
                    formData.street?.trim() && // בדיקה שהרחוב קיים
                    formData.houseNumber?.trim());
            default:
                return true;
        }
    };

    const handleNext = (field = null, value = null, nextStep) => {
        // יוצרים אובייקט נתונים מעודכן לבדיקה מיידית
        const updatedData = field ? { ...formData, [field]: value } : formData;

        if (isStepValid(updatedData)) {
            setFormData(updatedData);
            setStep(nextStep);
            setShowErrors(false);
        } else {
            setShowErrors(true);
        }
    };

    const refreshNumbers = () => {
        setTempNumbers(['057-1111111', '057-2222222', '057-3333333']);
    };

    const finalSubmit = async () => {
        try {
            const selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));
            const payload = {
                ...formData,
                packageId: selectedPackage?._id,
            };
            await api.post('/applications/save-step', payload);
            alert("ההזמנה נשלחה בהצלחה!");
        } catch (err) {
            console.error(err);
            alert("שגיאה בשליחת ההזמנה");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4" dir="rtl">
            {/* שלב 1: סוג פעולה */}
            {step === 'TYPE' && (
                <QuestionStep question="היי! מה אנחנו עושים היום?">
                    <div className="space-y-3">
                        <button
                            onClick={() => handleNext('type', 'new', 'NUMBER_PICK')}
                            className="w-full p-4 text-lg font-bold border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition"
                        >
                            קו חדש ומדליק
                        </button>
                        <button
                            onClick={() => handleNext('type', 'port', 'SUMMARY')} // כרגע נשלח לסיכום לצורך הדוגמה
                            className="w-full p-4 text-lg font-bold border-2 border-gray-200 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition"
                        >
                            ניוד מספר קיים
                        </button>
                    </div>
                </QuestionStep>
            )}

            {/* שלב 2: בחירת מספר */}
            {step === 'NUMBER_PICK' && (
                <QuestionStep question="איזה מספר הכי זורם לך?" description="בחר אחד מהרשימה">
                    <div className="grid grid-cols-1 gap-3">
                        {tempNumbers.map(num => (
                            <button
                                key={num}
                                onClick={() => handleNext('phoneNumber', num, 'PERSONAL')}
                                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 font-mono text-xl text-center transition"
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    <button onClick={refreshNumbers} className="text-blue-500 underline text-sm w-full text-center mt-4">
                        לא אהבתי, תראה לי עוד מספרים
                    </button>
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

                        <button
                            onClick={() => handleNext(null, null, 'SUMMARY')}
                            className="w-full p-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all mt-4"
                        >
                            אישור והצגת סיכום
                        </button>
                    </div>
                </QuestionStep>
            )}

            {/* שלב אחרון: סיכום */}
            {step === 'SUMMARY' && (
                <QuestionStep question="מעולה, סיימנו!" description="בדוק שהכל תקין לפני השליחה:">
                    <div className="bg-white border border-gray-100 p-4 rounded-2xl text-right space-y-2 mb-6 shadow-sm">
                        <p><strong>חבילה:</strong> {JSON.parse(localStorage.getItem('selectedPackage'))?.name}</p>
                        <p><strong>סוג פעולה:</strong> {formData.type === 'new' ? 'קו חדש' : 'ניוד מספר'}</p>
                        {formData.phoneNumber && <p><strong>מספר שנבחר:</strong> {formData.phoneNumber}</p>}
                        <p><strong>שם לקוח:</strong> {formData.fullName}</p>
                        <p><strong>אימייל:</strong> {formData.email}</p>
                        <p><strong>כתובת למשלוח:</strong> {formData.street} {formData.houseNumber}, {formData.city}</p>
                    </div>

                    <button
                        onClick={finalSubmit}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xl shadow-lg hover:bg-green-700 transition-all"
                    >
                        אישור ושליחת הזמנה 🚀
                    </button>

                    <button onClick={() => setStep('PERSONAL')} className="w-full text-gray-400 text-sm underline mt-4">
                        חזור לעריכת פרטים
                    </button>
                </QuestionStep>
            )}
        </div>
    );
};

export default SalesWizard;