"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Dialog,
  DialogBody,
  DialogCancelButton,
  DialogContent,
  DialogDangerButton,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../common/TeamDialog";
import { Trash2 } from "lucide-react";

const BoardSettingPage = () => {
  // UI-only state to match the screenshot layout.
  const [groupName, setGroupName] = useState("Product Team");
  const [productItem, setProductItem] = useState("Product Item");
  const [description, setDescription] = useState("Core product development team");

  const groupInfo = useMemo(
    () => ({
      groupId: "abc123xyz",
      createdAt: "15/1/2024",
      members: 8,
      yourRole: "Owner",
    }),
    [],
  );

  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {/* Basic Settings */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Basic Settings
          </h3>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Group Name</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500">Product Item</label>
              <Input
                value={productItem}
                onChange={(e) => setProductItem(e.target.value)}
                className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-500">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-[#0D1520] border border-[#1E2A3A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#42A5F5]/60 focus:ring-1 focus:ring-[#42A5F5]/30"
              />
            </div>
          </div>
        </section>

        {/* Group Information */}
        <section className="pt-2 space-y-4 border-t border-[#1E2A3A]">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Group Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Group ID</label>
              <Input
                value={groupInfo.groupId}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Created at</label>
              <Input
                value={groupInfo.createdAt}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Members</label>
              <Input
                value={String(groupInfo.members)}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Your Role</label>
              <Input
                value={groupInfo.yourRole}
                disabled
                className="w-full bg-[#1a2332] border border-[#1E2A3A] text-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="bg-[#1565C0] hover:bg-[#1976D2] text-white px-4">
              Save Changes
            </Button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-6">
          <div className="rounded-lg border border-red-900/40 bg-red-950/10 p-4">
            <h3 className="text-sm font-semibold text-red-300">Danger Zone</h3>
            <p className="text-xs text-red-200/70 mt-1">
              These actions cannot be undone. Please be careful.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm text-gray-200 font-medium">
                  Delete Group
                </div>
                <div className="text-xs text-red-200/70">
                  Permanently delete this group and all associated data
                </div>
              </div>

              <Button
                className="bg-red-700 hover:bg-red-600 text-white px-4"
                onClick={() => setDeleteOpen(true)}
              >
                Delete Group
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent size="sm">
          <DialogHeader
            icon={<Trash2 size={18} className="text-red-400" />}
          >
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <p className="text-sm text-gray-300 leading-relaxed">
              Are you sure you want to delete this group?
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogCancelButton>Cancel</DialogCancelButton>
            <DialogDangerButton>Delete Group</DialogDangerButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardSettingPage;