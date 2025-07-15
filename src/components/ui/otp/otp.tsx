"use client";

import { useRef, useState, useCallback } from 'react';

export default function OTPInput() {
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [otp, setOtp] = useState(Array(6).fill(''));

    const setInputRef = useCallback((el: HTMLInputElement | null, idx: number) => {
        inputRefs.current[idx] = el;
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (!val) return;
        const newOtp = [...otp];
        newOtp[idx] = val.slice(-1);
        setOtp(newOtp);
        if (idx < 5 && val) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === 'Backspace') {
            if (otp[idx]) {
                const newOtp = [...otp];
                newOtp[idx] = '';
                setOtp(newOtp);
            } else if (idx > 0) {
                inputRefs.current[idx - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        if (paste) {
            const pasteArr = paste.split('');
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pasteArr[i] || '';
            }
            setOtp(newOtp);
            const nextIdx = pasteArr.length < 6 ? pasteArr.length : 5;
            inputRefs.current[nextIdx]?.focus();
            e.preventDefault();
        }
    };

    return (
        <div className="flex justify-center gap-3 mt-8">
            {otp.map((digit, idx) => (
                <input
                    key={idx}
                    ref={el => setInputRef(el, idx)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(e, idx)}
                    onKeyDown={e => handleKeyDown(e, idx)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-black rounded-md bg-cyan-400  caret-black text-2xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                    autoFocus={idx === 0}
                />
            ))}
        </div>
    );
}
