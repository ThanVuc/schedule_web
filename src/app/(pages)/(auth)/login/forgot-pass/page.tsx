import React from 'react'

export default function page() {
    return (
        <div className="flex relative h-screen w-screen items-center justify-center bg-gradient-to-r from-blue-100 to-pink-100">

            <div className="w-112 absolute z-2 rounded-3xl h-100 bg-cyan-200 p-10 ">
                <h2 className="text-3xl font-bold text-center mb-8">TÌm tài khoản của bạn</h2>
                <label htmlFor="" className="font-bold text-center">
                    Vui lòng nhập email của bạn để tìm kiếm tài khoản của bạn.</label>
                <div className="mb-4 pt-5">
                    <label htmlFor='mail' className="text-sm font-semibold ">Email</label>
                    <div className="flex items-center border-b border-black py-1 ">
                        <input
                            type="email"
                            id="mail"
                            placeholder="Enter email"
                            className="bg-transparent outline-none w-full px-2 py-1"
                        />
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M2 4h20v16H2z" fill="none" />
                            <path d="M22 4H2v16h20V4zm-2 2v.01L12 13 4 6.01V6h16zM4 18V8l8 5 8-5v10H4z" />
                        </svg>
                    </div>
                </div>


                <div className='flex gap-5 float-end mt-7'>
                    <button className='h-10 px-6 rounded-2xl bg-gray-500 cursor-pointer text-white font-semibold hover:bg-blue-600 transition'>
                        Thoát
                    </button>
                    <button className="h-10 px-6 rounded-2xl bg-gray-500 cursor-pointer text-white font-semibold hover:bg-blue-600 transition">
                        Tiếp tục
                    </button>
                </div>

                {/* Decorative Circles */}
                <div className="absolute z-100 top-[-50px] left-[-40px] w-24 h-24 bg-blue-400 rounded-full"></div>
                <div className="absolute z-100 top-[-20px] right-[-20px] w-12 h-12 bg-teal-400 rounded-full"></div>
                <div className="absolute z-100 bottom-[-20px] right-[-20px] w-16 h-16 bg-pink-400 rounded-full"></div>
            </div>

        </div>


    )
}
