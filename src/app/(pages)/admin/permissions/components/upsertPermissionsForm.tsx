import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Checkbox, Input, Textarea } from "@/components/ui";
import { AppSearchSimple, H4, AppComboBox } from "@/components/common";
import { UseFormReturn } from "react-hook-form";
import { permissionApiUrl } from "@/api";
import { useAxios } from "@/hooks";
import { UpsertPermissionSchema } from "../models";
import { z } from "zod";

interface UpsertPermissionFormProps {
  form: UseFormReturn<UpsertPermissionInput>;
  isDisabled?: boolean;
}

type UpsertPermissionInput = z.infer<typeof UpsertPermissionSchema>;
export const UpsertPermissionForm: React.FC<UpsertPermissionFormProps> = ({
  form,
  isDisabled = false,
}) => {
  const {
    data: resourcesData,
    loading: resourcesLoading,
    error: resourcesError ,
  } = useAxios<{ id: string; name: string }[]>(
    { url: permissionApiUrl.getResource, method: "GET" },
    []
  );

  const resourceOptions =
    resourcesData?.map((r) => ({ value: r.id, label: r.name })) ?? [];

  const selectedResourceId = form.watch("resource_id");
  const {
    data: actionsMeta,
    loading: actionsLoading,
    error: actionsError,
  } = useAxios<{ actions: { id: string; name: string }[] }>(
    {
      url: `${permissionApiUrl.getActions}?resource_id=${selectedResourceId}`,
      method: "GET",
      params: { resource_id: selectedResourceId },
    },
    [selectedResourceId]
  );

  const actionOptions =
    actionsMeta?.actions.map((a) => ({ value: a.id, label: a.name })) ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const filteredActions = actionOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    form.setValue("actions_ids", []);
    setSearchQuery("");
  }, [selectedResourceId, form]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="flex flex-col gap-4 w-full lg:w-2/5">
        <H4>Thông tin quyền</H4>
        <FormField
          control={form.control}
          name="resource_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource</FormLabel>
              <FormControl>
                <AppComboBox
                  items={resourceOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={
                    resourcesLoading
                      ? "Đang tải..."
                      : resourcesError
                        ? "Lỗi khi tải resource"
                        : "Chọn resource..."
                  }
                  emptyText="Không tìm thấy resource"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên quyền</FormLabel>
              <FormControl>
                <Input disabled={isDisabled} placeholder="Tên quyền" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea disabled={isDisabled} placeholder="Ghi chú" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col gap-4 w-full lg:w-3/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <H4 className="text-base sm:text-lg">Hành động</H4>
          <AppSearchSimple
            placeholder={
              actionsLoading
                ? "Đang tải..."
                : actionsError
                  ? "Lỗi khi tải actions"
                  : "Tìm hành động..."
            }
            className="w-full sm:max-w-[15rem]"
            onSearch={setSearchQuery}
          />
        </div>

        {form.formState.errors.actions_ids?.message && (
          <p className="text-sm text-destructive">
            {form.formState.errors.actions_ids.message}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b pb-4 max-h-64 overflow-y-auto">
          {filteredActions.map((opt) => (
            <FormField
              key={opt.value}
              control={form.control}
              name="actions_ids"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      disabled={isDisabled}
                      className="h-5 w-5 border-gray-300"
                      checked={field.value.includes(opt.value)}
                      onCheckedChange={(checked) =>
                        field.onChange(
                          checked
                            ? [...field.value, opt.value]
                            : field.value.filter((v) => v !== opt.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormLabel className="!mb-0">{opt.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
