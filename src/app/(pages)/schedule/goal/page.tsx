"use client";

import { AddIcon, TargetIcon } from "@/components/icon";
import { Button } from "@/components/ui";


const TargetManagementPage = () => {


  return (
    <>
        <div className="flex justify-between text-white font-bold text-xl mb-3">
            <div className="flex items-center gap-3">
                <p>QUẢN LÝ MỤC TIÊU</p>
                <TargetIcon />
            </div>
            <div>
                <div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center">
                    <AddIcon className="!w-5 !h-5" />
                        Tạo mục tiêu
                    </Button>
                </div>
            </div>
        </div>
        <div className="p-2 flex flex-wrap gap-3 justify-center">
          
        </div>
    </>
  );
};

export default TargetManagementPage;
