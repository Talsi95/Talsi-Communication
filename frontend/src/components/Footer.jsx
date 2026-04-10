import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 border-t border-white/10 bg-slate-950/50 backdrop-blur-xl" dir='rtl'>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                                <span className="text-slate-900 font-black">T</span>
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter">TALSI COMMUNICATION</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            הדור הבא של התקשורת בישראל. הצטרפו למהפכת השירות והמהירות עם חבילות גלישה ללא תחרות.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">ניווט מהיר</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">חבילות גלישה</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">בדיקת כיסוי 5G</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">ניוד מספרים</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">שירות לקוחות</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">צור קשר</h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="tel:*5432"
                                    className="flex items-center gap-3 text-gray-400 text-sm hover:text-teal-400 transition-colors group"
                                >
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                                        <Phone size={16} className="text-teal-400" />
                                    </div>
                                    <span className="font-mono">*5432</span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href="mailto:support@talsicom.co.il"
                                    className="flex items-center gap-3 text-gray-400 text-sm hover:text-teal-400 transition-colors group"
                                >
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                                        <Mail size={16} className="text-teal-400" />
                                    </div>
                                    <span className="truncate">support@talsicom.co.il</span>
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=הרוקמים+26+חולון"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-400 text-sm hover:text-teal-400 transition-colors group"
                                >
                                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-teal-500/10 transition-colors">
                                        <MapPin size={16} className="text-teal-400" />
                                    </div>
                                    <span>הרוקמים 26, חולון</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">אבטחה ואמון</h4>
                        <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl mb-6">
                            <ShieldCheck className="text-teal-400" size={20} />
                            <span className="text-xs text-gray-300 font-medium">תשלום מאובטח בתקן PCI</span>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#1877F2]/20 hover:text-[#1877F2] transition-all border border-white/5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>

                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#E4405F]/20 hover:text-[#E4405F] transition-all border border-white/5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs font-medium">
                        © {currentYear} טלסי תקשורת בע"מ. כל הזכויות שמורות.
                    </p>
                    <div className="flex gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <a href="#" className="hover:text-white transition-colors">תקנון האתר</a>
                        <a href="#" className="hover:text-white transition-colors">מדיניות פרטיות</a>
                        <a href="#" className="hover:text-white transition-colors">הצהרת נגישות</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;