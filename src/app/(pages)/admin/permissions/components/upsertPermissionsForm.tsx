import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Checkbox, Input, Textarea } from "@/components/ui";
import { AppSearchSimple, H4, AppComboBox } from "@/components/common";
import { UseFormReturn } from "react-hook-form";
import { permissionApiUrl } from "@/api";
import { useAxios, useHasPermission } from "@/hooks";
import { UpsertPermissionSchema } from "../models";
import { z } from "zod";
import { useModalParams } from "../hooks";
import APP_RESOURCES from "@/constant/resourceACL";
import { APP_ACTIONS } from "@/constant";




type AddPermissionForm = z.infer<typeof UpsertPermissionSchema>;

interface AddPermissionFormProps {
  form: UseFormReturn<AddPermissionForm>;
  isDisabled?: boolean;
  onActionsLoaded?: (id: string[]) => void
}

export const UpsertPermissionForm = ({
  form,
  isDisabled = false,
  onActionsLoaded,
}: AddPermissionFormProps) => {

  const {
    data: resourcesData,
    loading: resourcesLoading,
  } = useAxios<{ id: string; name: string }[]>(
    { url: permissionApiUrl.getResource, method: "GET" },
    []
  );

  const resourceOptions = resourcesData?.map((r) => ({ value: r.id, label: r.name })) ?? [];
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const { mode, id } = useModalParams();

  const [canReadResources, canReadActions] = useHasPermission([
    { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_RESOURCES },
    { resource: APP_RESOURCES.PERMISSION, action: APP_ACTIONS.READ_ACTIONS },
  ]);

  const {
    data: actionsMeta,
    loading: actionsLoading,
  } = useAxios<{ actions: { id: string; name: string }[] }>(
    {
      url: permissionApiUrl.getActions,
      method: "GET",
      params: { resource_id: selectedResourceId },
    },
    [selectedResourceId],
    !selectedResourceId
  );

  const actionOptions = actionsMeta?.actions.map((a) => ({ value: a.id, label: a.name })) ?? [];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredActions = actionOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (id !== null && mode !== "create") {
      setSelectedResourceId(form.getValues("resource_id") || null);
    }
  }, [form.getValues("resource_id")])

  useEffect(() => {
    if (actionsMeta?.actions && onActionsLoaded) {
      onActionsLoaded(actionsMeta.actions.map(a => a.id));
    }
  }, [actionsMeta, onActionsLoaded]);

  useEffect(() => {
    if (mode === "create") {
      form.reset({
        name: "",
        description: "",
        resource_id: "",
        actions_ids: [],
      });
    }
  }, [mode]);;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="flex flex-col gap-4 w-full lg:w-2/5">
        <H4>Thông tin quyền</H4>
        {canReadResources && (
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
                    onChange={(value) => {
                      field.onChange(value);
                      setSelectedResourceId(value);
                      console.log(value);
                    }}
                    placeholder={
                      resourcesLoading
                        ? "Đang tải..."
                        : "Chọn resource..."
                    }
                    emptyText="Không tìm thấy resource"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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


      <div className="flex flex-col gap-4 w-full lg:w-3/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <H4 className="text-base sm:text-lg">Hành động</H4>
          <AppSearchSimple
            placeholder={
              actionsLoading
                ? "Đang tải..."
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
        {canReadActions && (
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
        )}
      </div>
    </div>
  );
};
