
import { Input } from '@/components/ui';
import { useState } from 'react';

const SettingContent = () => {
    const [fullName] = useState('Bố tuấn');
    const [email] = useState('tuandad@gmail.com');
    const [emailNotif, setEmailNotif] = useState(true);
    const [activityNotif, setActivityNotif] = useState(false);
    return (
        <div className='px-6'>
            <section className=" pt-2 space-y-4">
                <h2 className="text-xl font-semibold ">Thông tin cá nhân</h2>

                <div className="space-y-1">
                    <label className="block text-sm font-medium ">Họ và tên</label>
                    <Input
                        type="text"
                        disabled
                        value={fullName}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-800 text-gray-400"
                    />
                </div>

                <div className="space-y-1 pb-8">
                    <label className="block text-sm font-medium">Địa chỉ email</label>
                    <Input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-800 text-gray-400"
                    />
                </div>
            </section>

            <section className="border-t space-y-4 pt-8 pb-7">
                <h2 className="text-xl font-semibold">Thông báo</h2>

                <div className="flex items-center rounded-lg border justify-between gap-4 p-4 bg-[#1a2332]">
                    <div>
                        <p className="text-md font-medium ">Thông báo email</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Nhận thông báo qua email về các nhóm và nhiệm vụ của bạn.
                        </p>
                    </div>
                    <button
                        role="switch"
                        aria-checked={emailNotif}
                        onClick={() => setEmailNotif((v) => !v)}
                        className={`relative flex-shrink-0 mt-0.5 w-8 h-5 rounded-full transition-colors duration-200 focus:outline-none
                ${emailNotif ? 'bg-[#2a97ea]' : 'bg-gray-600'}`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                  ${emailNotif ? 'translate-x-3' : 'translate-x-0'}`}
                        />
                    </button>
                </div>

                <div className="flex rounded-lg border justify-between gap-4 p-4 items-center bg-[#1a2332]">
                    <div>
                        <p className="text-md font-medium">Thông báo hoạt động nhóm</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Nhận thông báo khi các thành viên hoạt động trong nhóm của bạn.
                        </p>
                    </div>
                    <button
                        role="switch"
                        aria-checked={activityNotif}
                        onClick={() => setActivityNotif((v) => !v)}
                        className={`relative flex-shrink-0 mt-0.5 w-8 h-5 rounded-full transition-colors duration-200 focus:outline-none
                ${activityNotif ? 'bg-[#2a97ea]' : 'bg-gray-600'}`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                  ${activityNotif ? 'translate-x-3' : 'translate-x-0'}`}
                        />
                    </button>
                </div>
            </section>
            <section className="flex flex-col space-y-3 pb-8">
                <h2 className=" border-t pt-8 text-xl font-semibold ">Tài khoản</h2>
                <div className="flex flex-col rounded-lg border justify-between gap-1 p-4 bg-[#1a2332]">
                    <span className="text-md">Ngày tạo</span>
                    <span className="text-sm font-medium text-gray-500">12 tháng 3, 2026</span>
                </div>
                <div className="flex flex-col rounded-lg border justify-between gap-1 p-4 bg-[#1a2332]">
                    <span className="text-md ">Trạng thái</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-300">
                        Active
                    </span>
                </div>
            </section>
        </div>
    );
}

export default SettingContent;