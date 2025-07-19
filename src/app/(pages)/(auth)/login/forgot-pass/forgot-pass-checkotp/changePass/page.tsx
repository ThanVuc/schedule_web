import React from 'react'

export default function page() {
    return (
        <div className="flex relative h-screen w-screen items-center justify-center bg-gradient-to-r from-blue-100 to-pink-100">

            <div className="w-112 absolute z-2 rounded-3xl h-100 bg-cyan-200 p-10 ">
                <h2 className="text-3xl font-bold text-center mb-4">New Password</h2>
                <label htmlFor="" className="font-bold text-center ">Enter your new password.</label>
                 <div className="mb-6 pt-4">
                        <label htmlFor='pass' className="text-sm font-semibold">New Password</label>
                        <div className="flex items-center border-b border-black py-1">
                            <input
                                type="password"
                                id="pass"
                                placeholder="Enter new password"
                                className="bg-transparent outline-none w-full px-2 py-1"
                            />
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7V8a6 6 0 00-12 0v2H4v12h16V10h-2zM8 8a4 4 0 018 0v2H8V8z" />
                            </svg>
                        </div>
                    </div>
                 <div className="mb-6 ">
                        <label htmlFor='pass' className="text-sm font-semibold">Again New Password</label>
                        <div className="flex items-center border-b border-black py-1">
                            <input
                                type="password"
                                id="pass"
                                placeholder="Again New Password"
                                className="bg-transparent outline-none w-full px-2 py-1"
                            />
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7V8a6 6 0 00-12 0v2H4v12h16V10h-2zM8 8a4 4 0 018 0v2H8V8z" />
                            </svg>
                        </div>
                    </div>


                <div className='flex gap-5 float-end mt-7'>
                    <button className='h-10 px-6 rounded-2xl bg-gray-500 cursor-pointer text-white font-semibold hover:bg-blue-600 transition'>
                        Cancel
                    </button>
                    <button className="h-10 px-6 rounded-2xl bg-gray-500 cursor-pointer text-white font-semibold hover:bg-blue-600 transition">
                        Next
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
