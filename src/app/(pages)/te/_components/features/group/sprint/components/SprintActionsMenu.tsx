"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import type { Sprint } from "../sprintTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";

export default function SprintActionsMenu({
  sprint,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
}: {
  sprint: Sprint;
  onEdit: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-1.5 text-gray-500 hover:text-gray-200 hover:bg-[#F8AF18] transition-colors"
          aria-label="Sprint actions"
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="z-[200] bg-[#1A2332] w-35 border-gray-700">
        <DropdownMenuItem
          onSelect={() => onEdit()}
          className="z-[200] cursor-pointer hover:bg-[#F8AF18] hover:text-black data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-black"
        >
          Chỉnh sửa Sprint
        </DropdownMenuItem>

        {sprint.status !== "Completed" && sprint.status !== "Cancelled" && (
          <>
            <DropdownMenuItem
              onSelect={() => onComplete()}
              className="z-[200] cursor-pointer hover:bg-[#F8AF18] hover:text-black data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-black"
            >
              Hoàn thành Sprint
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => onCancel()}
              className="z-[200] cursor-pointer hover:bg-[#F8AF18] hover:text-black data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-black"
            >
              Hủy Sprint
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onSelect={() => onDelete()}
          className="z-[200] text-red-400 cursor-pointer hover:bg-[#F8AF18] hover:text-black data-[highlighted]:bg-[#F8AF18] data-[highlighted]:text-black"
        >
          Xóa Sprint
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

