import React from "react";
import Image from "next/image";
import {EmailIcon ,LockIcon } from "@/components/icon";

export default function LoginPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-pink-100 px-4 overflow-hidden">
      {/* Chấm tròn */}
            <div className=" absolute top-4 left-4 w-20 h-20 sm:w-24 sm:h-24 bg-blue-400 rounded-full z-10"></div>
            <div className=" absolute top-4 right-4 w-15 h-15 sm:w-12 sm:h-12 bg-teal-400 rounded-full z-10"></div>
            <div className=" absolute bottom-4 right-4 w-14 h-14 sm:w-16 sm:h-16 bg-pink-400 rounded-full z-10"></div>

      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-[30px] overflow-hidden">
        {/* Ảnh */}
        <div className=" hidden sm:flex md:w-1/2 w-full bg-[#007A84] items-center justify-center p-6">
          <Image
            src="/image8.png"
            alt="Login Illustration"
            width={500}
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Form */}
        <div className="md:w-1/2 w-full bg-cyan-100 p-10 flex flex-col justify-center gap-6 relative">
          <h2 className="text-3xl font-bold text-center">Đăng nhập</h2>    
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

          <div>
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

      
          <button className="w-full bg-white py-2 rounded-full shadow-sm hover:bg-gray-100 font-semibold transition">
            Đăng nhâp
          </button>
          <button className="w-full bg-white py-2 rounded-full shadow-sm hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 transition">
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Google
          </button>

       
          <div className="flex justify-between text-sm font-medium mt-2">
            <a href="./signup" className="hover:underline">Bạn chưa có tài khoản?</a>
            <a href="login/forgot-pass" className="hover:underline">Quên mật khẩu?</a>
          </div>
        </div>
      </div>
    </div>
  );
}

