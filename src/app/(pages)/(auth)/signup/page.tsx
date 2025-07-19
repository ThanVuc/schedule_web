import React from 'react'
import Image from 'next/image';
import { EmailIcon, LockIcon } from "@/components/icon";

export default function page() {
    return (
        <div className="flex relative h-screen w-screen items-center justify-center bg-gradient-to-r from-blue-100 to-pink-100 overflow-hidden px-4 sm:px-6 md:px-8">
            {/* chấm*/}
            <div className=" absolute top-4 left-4 w-20 h-20 sm:w-24 sm:h-24 bg-blue-400 rounded-full z-10"></div>
            <div className=" absolute top-4 right-4 w-15 h-15 sm:w-12 sm:h-12 bg-teal-400 rounded-full z-10"></div>
            <div className=" absolute bottom-4 right-4 w-14 h-14 sm:w-16 sm:h-16 bg-pink-400 rounded-full z-10"></div>


            <div className='relative flex flex-col md:flex-row rounded-3xl shadow-2xl bg-white w-full max-w-5xl overflow-hidden'>
                {/*Form */}
                <div className="md:w-1/2 w-full bg-cyan-100 p-6 sm:p-8 md:p-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Đăng ký</h2>
                    <div>
                        <label htmlFor="email" className="text-sm font-semibold block mb-1">
                            Email
                        </label>
                        <div className="flex items-center border-b border-gray-700">
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                className="w-full bg-transparent px-2 py-2 outline-none"
                            />
                            <EmailIcon className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="text-sm font-semibold block mb-1">
                            Mật khẩu
                        </label>
                        <div className="flex items-center border-b border-gray-700">
                            <input
                                type="password"
                                id="password"
                                placeholder="Mật khẩu"
                                className="w-full bg-transparent px-2 py-2 outline-none"
                            />
                            <LockIcon className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    <div className="mt-4 mb-4">
                        <label htmlFor="password" className="text-sm font-semibold block mb-1">
                            Nhập lại mật khẩu
                        </label>
                        <div className="flex items-center border-b border-gray-700">
                            <input
                                type="password"
                                id="password"
                                placeholder="Nhập lại mật khẩu"
                                className="w-full bg-transparent px-2 py-2 outline-none"
                            />
                            <LockIcon className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    <button className="mt-4 w-full bg-white sm:py-3 rounded-full shadow hover:bg-gray-100 font-semibold text-sm sm:text-base mb-4">
                        Đăng ký
                    </button>

                    <button className="w-full bg-white sm:py-3 rounded-full shadow hover:bg-gray-100 flex items-center justify-center gap-2 font-semibold text-sm sm:text-base">
                        <Image
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                        />
                        Google
                    </button>

                    <div className="mt-4 text-sm font-semibold text-right">
                        <a href="/login" className="hover:underline">
                            Bạn đã có tài khoản?
                        </a>
                    </div>
                </div>

                {/* Ảnhn */}
                <div className='hidden md:flex md:w-1/2 items-center justify-center p-4 sm:p-8 md:p-10 bg-[#007A84]'>
                    <Image
                        src="/image8.png"
                        alt="Login Illustration"
                        width={560}
                        height={580}
                        className="w-full h-full object-cover rounded-3xl"
                    />
                </div>
            </div>
        </div>
    )
}
