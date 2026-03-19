'use client';

import SettingContent from "../features/setting/settingsContent";
export function BoardSettingPage() {


    return (
        <div className="max-w-2xl mx-auto space-y-6">

            <div className='flex flex-col pt-8 pb-2 border-b'>
                <span className="text-3xl font-bold pb-2 pl-6">X Cài đặt</span>
                <span className="text-md text-gray-500 mt-0.5 pl-6 pb-6">Quản lý tài khoản và tùy chọn của bạn</span>
            </div>
            <SettingContent />
        </div>
    );
}
