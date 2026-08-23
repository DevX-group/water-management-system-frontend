import React, { useEffect, useState } from 'react';
import {
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    Save,
    Ban,
    CalendarDays,
    CalendarRange,
    CalendarClock,
    Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { backupScheduleService } from '@/services/backupScheduleService';
import type {
    BackupFrequency,
    BackupScheduleResponse,
    DayOfWeek,
} from '@/types/backup';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

const DAYS_OF_WEEK: { labelKey: string; defaultLabel: string; value: DayOfWeek }[] = [
    { labelKey: 'days.MONDAY', defaultLabel: 'Monday', value: 'MONDAY' },
    { labelKey: 'days.TUESDAY', defaultLabel: 'Tuesday', value: 'TUESDAY' },
    { labelKey: 'days.WEDNESDAY', defaultLabel: 'Wednesday', value: 'WEDNESDAY' },
    { labelKey: 'days.THURSDAY', defaultLabel: 'Thursday', value: 'THURSDAY' },
    { labelKey: 'days.FRIDAY', defaultLabel: 'Friday', value: 'FRIDAY' },
    { labelKey: 'days.SATURDAY', defaultLabel: 'Saturday', value: 'SATURDAY' },
    { labelKey: 'days.SUNDAY', defaultLabel: 'Sunday', value: 'SUNDAY' },
];

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

export const BackupScheduleSettings: React.FC = () => {
    const { t } = useTranslation('systemSettings');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    // Form state
    const [frequency, setFrequency] = useState<BackupFrequency>('DISABLE');
    const [time, setTime] = useState<string>('02:00');
    const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('MONDAY');
    const [dayOfMonth, setDayOfMonth] = useState<number>(1);

    // Derived hour, minute, period from time string (HH:mm)
    const { hourStr: currentHour, minuteStr: currentMinute, period: currentPeriod } = React.useMemo(() => {
        const [hStr, mStr] = (time || '02:00').split(':');
        let h = parseInt(hStr || '0', 10);
        const m = mStr ? mStr.substring(0, 2).padStart(2, '0') : '00';
        const period = h >= 12 ? 'PM' : 'AM';
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        const hourStr = h12.toString().padStart(2, '0');
        return { hourStr, minuteStr: m, period };
    }, [time]);

    const updateTimePart = (newHourStr: string, newMinuteStr: string, newPeriod: string) => {
        let h = parseInt(newHourStr, 10);
        if (newPeriod === 'PM' && h < 12) h += 12;
        if (newPeriod === 'AM' && h === 12) h = 0;
        const hh = h.toString().padStart(2, '0');
        setTime(`${hh}:${newMinuteStr}`);
    };

    // Current schedule state
    const [currentSchedule, setCurrentSchedule] = useState<BackupScheduleResponse | null>(null);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const data = await backupScheduleService.getScheduleSettings();
            setCurrentSchedule(data);
            setFrequency(data.frequency || 'DISABLE');
            if (data.time) setTime(data.time.substring(0, 5)); // HH:mm format
            if (data.dayOfWeek) setDayOfWeek(data.dayOfWeek);
            if (data.dayOfMonth) setDayOfMonth(data.dayOfMonth);
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                t('schedule.loadFailed', { defaultValue: 'Failed to load backup schedule settings' });
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validations
        if (frequency === 'DAILY' && !time) {
            toast.error(t('schedule.selectTimeError', { defaultValue: 'Please select a backup execution time' }));
            return;
        }
        if (frequency === 'WEEKLY') {
            if (!time) {
                toast.error(t('schedule.selectTimeError', { defaultValue: 'Please select a backup execution time' }));
                return;
            }
            if (!dayOfWeek) {
                toast.error(t('schedule.selectDayOfWeekError', { defaultValue: 'Please select a day of the week' }));
                return;
            }
        }
        if (frequency === 'MONTHLY') {
            if (!time) {
                toast.error(t('schedule.selectTimeError', { defaultValue: 'Please select a backup execution time' }));
                return;
            }
            if (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31) {
                toast.error(t('schedule.selectDayOfMonthError', { defaultValue: 'Please select a valid day of the month (1-31)' }));
                return;
            }
        }

        try {
            setSaving(true);
            const payload = {
                frequency,
                time: frequency !== 'DISABLE' ? time : null,
                dayOfWeek: frequency === 'WEEKLY' ? dayOfWeek : null,
                dayOfMonth: frequency === 'MONTHLY' ? dayOfMonth : null,
            };

            const updated = await backupScheduleService.updateScheduleSettings(payload);
            setCurrentSchedule(updated);
            toast.success(t('schedule.updateSuccess', { defaultValue: 'Backup schedule configuration updated successfully' }));
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                t('schedule.updateFailed', { defaultValue: 'Failed to update backup schedule settings' });
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm">{t('schedule.loading', { defaultValue: 'Loading backup schedule configuration...' })}</span>
            </div>
        );
    }

    const renderStatusBadge = () => {
        if (!currentSchedule?.lastBackupStatus) return null;
        const status = currentSchedule.lastBackupStatus;

        if (status === 'SUCCESS') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {t('schedule.status.success')}
                </span>
            );
        }
        if (status === 'FAILED') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    {t('schedule.status.failed')}
                </span>
            );
        }
        if (status === 'RUNNING') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600 dark:text-sky-400" />
                    {t('schedule.status.running')}
                </span>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Subheader and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" />
                        {t('schedule.title')}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {t('schedule.subtitle')}
                    </p>
                </div>

                {renderStatusBadge()}
            </div>

            {/* Frequency Cards */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/90">
                    {t('schedule.frequencyLabel')}
                </Label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Disabled Card */}
                    <button
                        type="button"
                        onClick={() => setFrequency('DISABLE')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center ${frequency === 'DISABLE'
                            ? 'border-destructive/50 bg-destructive/10 text-destructive shadow-sm ring-2 ring-destructive/20'
                            : 'border-border/60 hover:border-border bg-background/60 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${frequency === 'DISABLE' ? 'bg-destructive/20' : 'bg-secondary'}`}>
                            <Ban className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{t('schedule.frequencies.DISABLE')}</span>
                    </button>

                    {/* Daily Card */}
                    <button
                        type="button"
                        onClick={() => setFrequency('DAILY')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center ${frequency === 'DAILY'
                            ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20 font-bold'
                            : 'border-border/60 hover:border-border bg-background/60 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${frequency === 'DAILY' ? 'bg-primary/20' : 'bg-secondary'}`}>
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{t('schedule.frequencies.DAILY')}</span>
                    </button>

                    {/* Weekly Card */}
                    <button
                        type="button"
                        onClick={() => setFrequency('WEEKLY')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center ${frequency === 'WEEKLY'
                            ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20 font-bold'
                            : 'border-border/60 hover:border-border bg-background/60 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${frequency === 'WEEKLY' ? 'bg-primary/20' : 'bg-secondary'}`}>
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{t('schedule.frequencies.WEEKLY')}</span>
                    </button>

                    {/* Monthly Card */}
                    <button
                        type="button"
                        onClick={() => setFrequency('MONTHLY')}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 transition-all text-center ${frequency === 'MONTHLY'
                            ? 'border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20 font-bold'
                            : 'border-border/60 hover:border-border bg-background/60 text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${frequency === 'MONTHLY' ? 'bg-primary/20' : 'bg-secondary'}`}>
                            <CalendarRange className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{t('schedule.frequencies.MONTHLY')}</span>
                    </button>
                </div>
            </div>

            {/* Dynamic Timing Details */}
            {frequency !== 'DISABLE' && (
                <div className="p-5 rounded-2xl border border-primary/15 bg-primary/[0.02] backdrop-blur-sm space-y-4 animate-in fade-in-50 duration-300">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="w-1.5 h-4 rounded-full gradient-primary inline-block"></span>
                        {t('schedule.timingTitle')}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Execution Time with 3 separate custom Selects */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-foreground/80">
                                {t('schedule.executionTime')}
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {/* Hour Select */}
                                <Select
                                    value={currentHour}
                                    onValueChange={(val) => updateTimePart(val, currentMinute, currentPeriod)}
                                >
                                    <SelectTrigger className="rounded-xl border-primary/20 focus:ring-primary/30 h-10 bg-background">
                                        <SelectValue placeholder="HH" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-60 overflow-y-auto">
                                        {HOURS.map((h) => (
                                            <SelectItem key={h} value={h}>
                                                {h}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Minute Select */}
                                <Select
                                    value={currentMinute}
                                    onValueChange={(val) => updateTimePart(currentHour, val, currentPeriod)}
                                >
                                    <SelectTrigger className="rounded-xl border-primary/20 focus:ring-primary/30 h-10 bg-background">
                                        <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-60 overflow-y-auto">
                                        {MINUTES.map((m) => (
                                            <SelectItem key={m} value={m}>
                                                {m}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* AM/PM Select */}
                                <Select
                                    value={currentPeriod}
                                    onValueChange={(val) => updateTimePart(currentHour, currentMinute, val)}
                                >
                                    <SelectTrigger className="rounded-xl border-primary/20 focus:ring-primary/30 h-10 bg-background font-semibold">
                                        <SelectValue placeholder="AM/PM" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {PERIODS.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Day of Week for WEEKLY using Custom Select */}
                        {frequency === 'WEEKLY' && (
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground/80">
                                    {t('schedule.dayOfWeek')}
                                </Label>
                                <Select
                                    value={dayOfWeek}
                                    onValueChange={(val) => setDayOfWeek(val as DayOfWeek)}
                                >
                                    <SelectTrigger className="rounded-xl border-primary/20 focus:ring-primary/30 h-10 bg-background">
                                        <SelectValue placeholder="Select day of week" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {DAYS_OF_WEEK.map((d) => (
                                            <SelectItem key={d.value} value={d.value}>
                                                {t(d.labelKey, { defaultValue: d.defaultLabel })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Day of Month for MONTHLY using Custom Select */}
                        {frequency === 'MONTHLY' && (
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-foreground/80">
                                    {t('schedule.dayOfMonth')}
                                </Label>
                                <Select
                                    value={String(dayOfMonth)}
                                    onValueChange={(val) => setDayOfMonth(Number(val))}
                                >
                                    <SelectTrigger className="rounded-xl border-primary/20 focus:ring-primary/30 h-10 bg-background">
                                        <SelectValue placeholder="Select day of month" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl max-h-60 overflow-y-auto">
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                            <SelectItem key={day} value={String(day)}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Active Schedule Info Banner */}
            {currentSchedule?.cronExpression && frequency !== 'DISABLE' && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground bg-secondary/50 p-3.5 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Info className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-foreground">{t('schedule.cronLabel')}</span>
                        <code className="bg-background text-primary px-2.5 py-1 rounded-md font-mono font-bold border border-primary/20">
                            {currentSchedule.cronExpression}
                        </code>
                    </div>

                    {currentSchedule.lastSuccessfulBackupDate && (
                        <div className="text-xs text-muted-foreground">
                            <span>{t('schedule.lastBackupLabel')}</span>
                            <span className="font-medium text-foreground">
                                {new Date(currentSchedule.lastSuccessfulBackupDate).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-2">
                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-11 px-6 rounded-xl gradient-primary text-white shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all gap-2 btn-shine"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    <span>{t('schedule.saveButton')}</span>
                </Button>
            </div>
        </div>
    );
};
