'use client';

import { Input } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { useEffect, useMemo, useState } from 'react';
import { useAxios, useAxiosMutation, useToastState } from '@/hooks';
import { teSettingApiUrl } from '@/api/teSetting.api';

type UserSettingModel = {
    email?: string;
    status?: boolean;
    time_zone?: string;
    use_email_notification?: boolean;
    use_app_notification?: boolean;
    created_at?: string;
};

type ApiErrorResponse = {
    detail?: string;
    message?: string;
    error?: string;
};

const NOTIFICATION_SETTINGS_KEY = 'te_notification_settings';

const getPersistedNotificationSettings = (): { email: boolean; app: boolean } | null => {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { email?: unknown; app?: unknown };
        if (typeof parsed.email !== 'boolean' || typeof parsed.app !== 'boolean') return null;
        return { email: parsed.email, app: parsed.app };
    } catch {
        return null;
    }
};

const persistNotificationSettings = (email: boolean, app: boolean) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify({ email, app }));
};

const formatCreatedAt = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('vi-VN');
};

const SettingContent = () => {
    const { setToast } = useToastState();
    const {
        data: userInfoRaw,
        loading,
        refetch,
    } = useAxios<unknown>({
        method: 'GET',
        url: teSettingApiUrl.getUserInfo,
    });
    const { sendRequest: updateConfiguration } = useAxiosMutation({
        method: 'PATCH',
        url: teSettingApiUrl.updateNotificationConfig,
    });

    const parseUserInfo = (source: unknown): UserSettingModel | null => {
        const raw = source as any;
        if (!raw) return null;
        if (raw.email || raw.created_at || raw.time_zone) return raw as UserSettingModel;
        if (raw.data && (raw.data.email || raw.data.created_at)) return raw.data as UserSettingModel;
        if (raw.item && (raw.item.email || raw.item.created_at)) return raw.item as UserSettingModel;
        if (raw.user && (raw.user.email || raw.user.created_at)) return raw.user as UserSettingModel;
        return raw as UserSettingModel;
    };

    const userInfo = useMemo(() => parseUserInfo(userInfoRaw), [userInfoRaw]);

    const [emailNotif, setEmailNotif] = useState(false);
    const [activityNotif, setActivityNotif] = useState(true);
    const [isEmailUpdating, setIsEmailUpdating] = useState(false);
    const [isAppUpdating, setIsAppUpdating] = useState(false);
    const [hasHydratedLocalSetting, setHasHydratedLocalSetting] = useState(false);

    useEffect(() => {
        const persisted = getPersistedNotificationSettings();
        if (!persisted) return;
        setEmailNotif(persisted.email);
        setActivityNotif(persisted.app);
        setHasHydratedLocalSetting(true);
    }, []);

    useEffect(() => {
        if (!userInfo) return;
        if (hasHydratedLocalSetting) return;
        const serverEmail = Boolean(userInfo.use_email_notification);
        const serverApp =
            userInfo.use_app_notification === undefined
                ? true
                : Boolean(userInfo.use_app_notification);
        setEmailNotif(serverEmail);
        setActivityNotif(serverApp);
        persistNotificationSettings(serverEmail, serverApp);
    }, [userInfo, hasHydratedLocalSetting]);

    const email = userInfo?.email || '-';

    const submitNotificationConfig = async (
        nextEmail: boolean,
        nextApp: boolean,
        changedType: 'email' | 'app',
    ) => {
        if (changedType === 'email') {
            setIsEmailUpdating(true);
        } else {
            setIsAppUpdating(true);
        }
        const payload = {
            use_email_notification: nextEmail,
            use_app_notification: nextApp,
        };

        const result = await updateConfiguration(payload);
        if (changedType === 'email') {
            setIsEmailUpdating(false);
        } else {
            setIsAppUpdating(false);
        }

        if (result.error) {
            const errorBody = result.error.response?.data as ApiErrorResponse | undefined;
            setToast({
                title: 'Cập nhật thất bại',
                message:
                    errorBody?.detail ||
                    errorBody?.message ||
                    errorBody?.error ||
                    'Không thể lưu cấu hình thông báo.',
                variant: 'error',
            });
            return false;
        }
        setToast({
            title: 'Đã cập nhật',
            message:
                changedType === 'email'
                    ? `Email: ${nextEmail ? 'Bật' : 'Tắt'}`
                    : `Hoạt động nhóm: ${nextApp ? 'Bật' : 'Tắt'}`,
            variant: 'success',
        });
        refetch?.();
        return true;
    };

    const onToggleEmail = async (checked: boolean) => {
        const ok = await submitNotificationConfig(checked, activityNotif, 'email');
        if (ok) {
            setEmailNotif(checked);
            persistNotificationSettings(checked, activityNotif);
        }
    };

    const onToggleApp = async (checked: boolean) => {
        const ok = await submitNotificationConfig(emailNotif, checked, 'app');
        if (ok) {
            setActivityNotif(checked);
            persistNotificationSettings(emailNotif, checked);
        }
    };

    return (
        <div className='px-6'>
            <section className=" pt-2 space-y-4">
                <h2 className="text-xl font-semibold ">Thông tin cá nhân</h2>

                <div className="space-y-1 pb-8">
                    <label className="block text-sm font-medium">Địa chỉ email</label>
                    <Input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-800 text-gray-400"
                    />
                </div>
            </section>

            <section className="border-t space-y-4 pt-8 pb-7">
                <h2 className="text-xl font-semibold">Thông báo</h2>

                <div className="flex items-center rounded-lg border justify-between gap-4 p-4 bg-[#1a2332]">
                    <div>
                        <p className="text-md font-medium ">Thông báo email</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Nhận thông báo qua email về các nhóm và nhiệm vụ của bạn.
                        </p>
                    </div>
                    <Switch
                    className='data-[state=checked]:bg-blue-400'
                        checked={emailNotif}
                        onCheckedChange={onToggleEmail}
                        disabled={isEmailUpdating || loading}
                    />
                </div>

                <div className="flex rounded-lg border justify-between gap-4 p-4 items-center bg-[#1a2332]">
                    <div>
                        <p className="text-md font-medium">Thông báo hoạt động nhóm</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Nhận thông báo khi các thành viên hoạt động trong nhóm của bạn.
                        </p>
                    </div>
                    <Switch
                    className='data-[state=checked]:bg-blue-400'
                        checked={activityNotif}
                        onCheckedChange={onToggleApp}
                        disabled={isAppUpdating || loading}
                    />
                </div>
            </section>
            <section className="flex flex-col space-y-3 pb-8">
                <h2 className=" border-t pt-8 text-xl font-semibold ">Tài khoản</h2>
                <div className="flex flex-col rounded-lg border justify-between gap-1 p-4 bg-[#1a2332]">
                    <span className="text-md">Múi giờ</span>
                    <span className="text-sm font-medium text-gray-500">{userInfo?.time_zone || 'Asia/Ho_Chi_Minh'}</span>
                </div>
                <div className="flex flex-col rounded-lg border justify-between gap-1 p-4 bg-[#1a2332]">
                    <span className="text-md">Ngày tạo</span>
                    <span className="text-sm font-medium text-gray-500">{formatCreatedAt(userInfo?.created_at)}</span>
                </div>
                <div className="flex flex-col rounded-lg border justify-between gap-1 p-4 bg-[#1a2332]">
                    <span className="text-md ">Trạng thái</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-300">
                        {userInfo?.status === false ? 'Đã khóa' : 'Đang hoạt động'}
                    </span>
                </div>
            </section>
        </div>
    );
}

export default SettingContent;