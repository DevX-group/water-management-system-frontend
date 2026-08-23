import React, { useEffect, useState } from 'react';
import { getDashboardConfig } from '@/services/dashboardService';
import type { DashboardConfig } from '@/types/dashboard';
import { WidgetContainer } from './WidgetContainer';
import { WidgetRenderer } from './WidgetRenderer';
import { Loader2, LayoutDashboard, Gauge, Droplets, Wifi, MapPin, Shield, Activity, Zap, BarChart3 } from 'lucide-react';

interface DashboardGridProps {
  greeting?: string;
  subtitle?: string;
  role?: string;
}

/* ── theme config per role ── */
const getTheme = (role?: string) => {
  if (role === 'METER_READER') {
    return {
      from: 'from-teal-50/80',
      via: 'via-cyan-50/50',
      to: 'to-slate-50/80',
      blob1: 'bg-teal-400/10',
      blob2: 'bg-cyan-400/10',
      blob3: 'bg-emerald-400/10',
      accent: 'text-teal-600',
      pillBg: 'bg-teal-100/50 border-teal-200 text-teal-700',
      featureTitle: 'text-teal-600',
      sectionTitle: 'Built for Meter Readers in the Field',
      sectionSub: 'Smart tools designed to make your daily reading operations faster and more accurate.',
      sectionLabel: 'Field Operations Suite',
      badgeText: 'Water Management — Field Staff',
      badgeIcon: <Droplets className="w-3.5 h-3.5" />,
      rightBadges: true,
      textMain: 'text-slate-900',
      textSub: 'text-slate-600',
      cardBg: 'bg-white/60 hover:bg-white',
    };
  }
  return {
    from: 'from-blue-50/80',
    via: 'via-indigo-50/50',
    to: 'to-slate-50/80',
    blob1: 'bg-blue-400/10',
    blob2: 'bg-indigo-400/10',
    blob3: 'bg-violet-400/10',
    accent: 'text-blue-600',
    pillBg: 'bg-blue-100/50 border-blue-200 text-blue-700',
    featureTitle: 'text-blue-600',
    sectionTitle: 'Everything you need, in one place',
    sectionSub: 'A powerful management workspace with real-time insights and quick access to all modules.',
    sectionLabel: 'Platform Highlights',
    badgeText: 'System Active',
    badgeIcon: <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />,
    rightBadges: false,
    textMain: 'text-slate-900',
    textSub: 'text-slate-600',
    cardBg: 'bg-white/60 hover:bg-white',
  };
};

const getFeatures = (role?: string) =>
  role === 'METER_READER'
    ? [
        { icon: Gauge,    title: 'AI-Powered OCR',   desc: 'Camera scans meter digits automatically using Python OCR', colorIcon: 'text-teal-400', colorBg: 'bg-teal-500/15 border-teal-500/20' },
        { icon: Wifi,     title: 'Offline Mode',      desc: 'Readings saved locally and synced when internet returns',  colorIcon: 'text-cyan-400',  colorBg: 'bg-cyan-500/15  border-cyan-500/20'  },
        { icon: Activity, title: 'Live Tracking',     desc: 'All readings captured today are visible in real time',     colorIcon: 'text-blue-400',  colorBg: 'bg-blue-500/15  border-blue-500/20'  },
        { icon: Shield,   title: 'Secure & Accurate', desc: 'Every reading is validated and stored securely',           colorIcon: 'text-emerald-400',colorBg: 'bg-emerald-500/15 border-emerald-500/20' },
      ]
    : [
        { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live system data updated every session',            colorIcon: 'text-blue-400',   colorBg: 'bg-blue-500/15   border-blue-500/20'   },
        { icon: Zap,       title: 'Instant Actions',     desc: 'Navigate to any module with a single click',        colorIcon: 'text-violet-400', colorBg: 'bg-violet-500/15 border-violet-500/20' },
        { icon: Shield,    title: 'Role-Based Access',   desc: 'You only see what your role needs',                 colorIcon: 'text-indigo-400', colorBg: 'bg-indigo-500/15 border-indigo-500/20' },
        { icon: Activity,  title: 'System Health',       desc: 'All services running normally',                     colorIcon: 'text-sky-400',    colorBg: 'bg-sky-500/15    border-sky-500/20'    },
      ];

export const DashboardGrid: React.FC<DashboardGridProps> = ({ greeting, subtitle, role }) => {
  const [config, setConfig] = useState<DashboardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardConfig()
      .then(setConfig)
      .catch(() => setError('Failed to load dashboard configuration. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
        <p className="text-sm font-medium tracking-wide text-muted-foreground animate-pulse">Initializing workspace...</p>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-muted-foreground">
        <LayoutDashboard className="w-12 h-12 opacity-20 mb-2" />
        <p className="text-sm font-medium">{error ?? 'No dashboard configuration found.'}</p>
      </div>
    );
  }

  const title = greeting ?? config.name;
  const theme = getTheme(role);
  const features = getFeatures(role);

  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">

      {/* ── ONE continuous dark background from top to bottom ── */}
      <div className={
        'relative w-full bg-gradient-to-b ' + theme.from + ' ' + theme.via + ' ' + theme.to
      }>
        {/* Global blobs */}
        <div className={'absolute top-0 left-0 w-80 h-80 rounded-full blur-[120px] opacity-30 pointer-events-none ' + theme.blob1} />
        <div className={'absolute top-20 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none ' + theme.blob2} />
        <div className={'absolute bottom-40 left-1/3 w-96 h-64 rounded-full blur-[100px] opacity-15 pointer-events-none ' + theme.blob3} />
        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* ── HERO ── */}
        <div className="relative px-6 sm:px-10 lg:px-16 pt-14 pb-36">
          {/* Right floating badges — meter reader only */}
          {role === 'METER_READER' && (
            <div className="absolute top-8 right-8 hidden lg:flex flex-col gap-3">
              {[
                { icon: <Gauge className="w-4 h-4 text-teal-600" />, label: 'Live Meter Sync', extra: <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse ml-1" /> },
                { icon: <Wifi className="w-4 h-4 text-cyan-600" />, label: 'Offline Ready' },
                { icon: <MapPin className="w-4 h-4 text-blue-600" />, label: 'Field Operations' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-2.5 shadow-sm">
                  {b.icon}
                  <span className={'text-xs font-bold ' + theme.textMain}>{b.label}</span>
                  {b.extra}
                </div>
              ))}
            </div>
          )}

          {/* Pill badge */}
          <div className="flex justify-center mb-6">
            <span className={'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm border ' + theme.pillBg}>
              {theme.badgeIcon}{theme.badgeText}
            </span>
          </div>

          {/* Title */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className={'text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 ' + theme.textMain}>{title}</h1>
            {subtitle && <p className={'text-base font-medium ' + theme.textSub}>{subtitle}</p>}
          </div>

          {/* Wave at bottom of hero — seamlessly connects to widget area */}
          {role === 'METER_READER' && (
            <svg className="absolute bottom-0 left-0 w-full opacity-30" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
              <path d="M0 30 C360 55 720 5 1080 35 C1260 48 1380 20 1440 30 L1440 60 L0 60 Z" fill="#99f6e4" />
            </svg>
          )}
        </div>

        {/* ── WIDGETS (float on the same bg) ── */}
        <div className="relative px-4 sm:px-6 lg:px-10 -mt-24 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(130px,auto)]">
            {config.widgets.map((widget, index) => (
              <WidgetContainer
                key={widget.id}
                name={widget.name}
                colSpan={widget.colSpan}
                rowSpan={widget.rowSpan}
                className="animate-slide-up"
                style={{ animationDelay: (index * 80) + 'ms', animationFillMode: 'both' }}
              >
                <WidgetRenderer
                  componentKey={widget.componentKey}
                  name={widget.name}
                  configJson={widget.configJson}
                />
              </WidgetContainer>
            ))}
          </div>
        </div>

        {/* ── BELOW SECTION (same bg, seamless) ── */}
        <div className="relative px-4 sm:px-6 lg:px-10 pb-14">
          {/* thin separator line */}
          <div className={'h-px mb-10 bg-gradient-to-r from-transparent ' + (role === 'METER_READER' ? 'via-teal-500/30' : 'via-blue-500/30') + ' to-transparent'} />

          <div className="text-center mb-8">
            <p className={'text-xs font-bold uppercase tracking-[0.2em] mb-2 ' + theme.featureTitle}>{theme.sectionLabel}</p>
            <h2 className={'text-2xl sm:text-3xl font-extrabold ' + theme.textMain}>{theme.sectionTitle}</h2>
            <p className={'text-sm mt-2 max-w-lg mx-auto ' + theme.textSub}>{theme.sectionSub}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className={'flex flex-col gap-3 p-5 rounded-2xl border transition-colors shadow-sm ' + theme.cardBg + ' ' + f.colorBg}
              >
                <div className={'w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm'}>
                  <f.icon className={'w-5 h-5 ' + f.colorIcon} />
                </div>
                <div>
                  <p className={'text-sm font-bold ' + theme.textMain}>{f.title}</p>
                  <p className={'text-xs mt-1 leading-relaxed ' + theme.textSub}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
