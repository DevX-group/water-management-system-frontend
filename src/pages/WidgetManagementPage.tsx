import '@/index.css';
import React, { useEffect, useState, useCallback } from 'react';
import { getWidgetCatalog, deactivateWidget, updateDashboardLayout } from '@/services/dashboardService';
import { getDashboardConfig } from '@/services/dashboardService';
import type { WidgetDefinition, DashboardConfig, DashboardWidgetConfig } from '@/types/dashboard';
import {
  LayoutGrid, Eye, EyeOff, Trash2, RefreshCw, ChevronUp, ChevronDown,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Widget Management page — Super Admin only.
 *
 * Allows the Super Admin to:
 * 1. View the full widget catalog with active/inactive status.
 * 2. Deactivate widgets (soft-delete — marks them inactive).
 * 3. View and reorder widget placements on each role dashboard.
 * 4. Toggle widget visibility per dashboard.
 */
export const WidgetManagementPage: React.FC = () => {
  const { toast } = useToast();

  // ── Catalog state ─────────────────────────────────────────────────────────
  const [catalog, setCatalog] = useState<WidgetDefinition[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // ── Dashboard config state (own role = SUPER_ADMIN dashboard) ─────────────
  const [dashConfig, setDashConfig] = useState<DashboardConfig | null>(null);
  const [placements, setPlacements] = useState<DashboardWidgetConfig[]>([]);
  const [dashLoading, setDashLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Load catalog ─────────────────────────────────────────────────────────
  const loadCatalog = useCallback(() => {
    setCatalogLoading(true);
    getWidgetCatalog()
      .then(setCatalog)
      .catch(() => toast({ title: 'Failed to load widget catalog', variant: 'destructive' }))
      .finally(() => setCatalogLoading(false));
  }, [toast]);

  // ── Load dashboard config ─────────────────────────────────────────────────
  const loadDashboard = useCallback(() => {
    setDashLoading(true);
    getDashboardConfig()
      .then((cfg) => {
        setDashConfig(cfg);
        setPlacements([...cfg.widgets].sort((a, b) => a.position - b.position));
      })
      .catch(() => toast({ title: 'Failed to load dashboard config', variant: 'destructive' }))
      .finally(() => setDashLoading(false));
  }, [toast]);

  useEffect(() => {
    loadCatalog();
    loadDashboard();
  }, [loadCatalog, loadDashboard]);

  // ── Deactivate widget ─────────────────────────────────────────────────────
  const handleDeactivate = async (id: number, name: string) => {
    if (!confirm(`Deactivate widget "${name}"? It will no longer render on any dashboard.`)) return;
    try {
      await deactivateWidget(id);
      toast({ title: `Widget "${name}" deactivated.` });
      loadCatalog();
    } catch {
      toast({ title: 'Failed to deactivate widget', variant: 'destructive' });
    }
  };

  // ── Toggle visibility in placement list ──────────────────────────────────
  const toggleVisibility = (idx: number) => {
    setPlacements((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, visible: !p.visible } : p))
    );
  };

  // ── Reorder ───────────────────────────────────────────────────────────────
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setPlacements((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    setPlacements((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  // ── Save layout ───────────────────────────────────────────────────────────
  const saveLayout = async () => {
    if (!dashConfig) return;
    setSaving(true);
    try {
      const payload = placements.map((p, idx) => ({
        widgetId: p.id,
        colSpan: p.colSpan,
        rowSpan: p.rowSpan,
        visible: p.visible,
        configJson: p.configJson ?? undefined,
        position: idx,
      }));
      await updateDashboardLayout(dashConfig.dashboardId, payload as any);
      toast({ title: 'Dashboard layout saved successfully.' });
      loadDashboard();
    } catch {
      toast({ title: 'Failed to save layout', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="animate-slide-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gradient">Widget Management</h1>
            <p className="text-sm text-muted-foreground">
              Configure and manage dashboard widgets across all roles.
            </p>
          </div>
        </div>
      </div>

      {/* ── Widget Catalog ───────────────────────────────────────── */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Widget Catalog</h2>
          <button
            onClick={loadCatalog}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {catalogLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading catalog…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left py-2 pr-4 font-medium">Widget</th>
                  <th className="text-left py-2 pr-4 font-medium">Type</th>
                  <th className="text-left py-2 pr-4 font-medium">Component Key</th>
                  <th className="text-left py-2 pr-4 font-medium">Roles</th>
                  <th className="text-center py-2 pr-4 font-medium">Status</th>
                  <th className="text-right py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((w) => (
                  <tr
                    key={w.id}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <div>
                        <p className="font-medium text-foreground">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.description}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {w.widgetType}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                        {w.componentKey}
                      </code>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {(w.allowedRoles ?? []).map((r) => (
                          <span
                            key={r}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-center">
                      {w.active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-success">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <AlertCircle className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {w.active && (
                        <button
                          onClick={() => handleDeactivate(w.id, w.name)}
                          className="inline-flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                          title="Deactivate widget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Dashboard Layout Editor ──────────────────────────────── */}
      <section className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Super Admin Dashboard Layout
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reorder widgets and toggle visibility. Changes apply to your dashboard only.
            </p>
          </div>
          <button
            onClick={saveLayout}
            disabled={saving || dashLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium
                       hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Saving…' : 'Save Layout'}
          </button>
        </div>

        {dashLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading layout…</span>
          </div>
        ) : (
          <div className="space-y-2">
            {placements.map((p, idx) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  p.visible
                    ? 'border-border bg-card hover:bg-muted/20'
                    : 'border-border/40 bg-muted/10 opacity-60'
                }`}
              >
                {/* Position badge */}
                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                  {idx + 1}
                </span>

                {/* Widget info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.widgetType} · {p.colSpan}×{p.rowSpan} cols
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === placements.length - 1}
                    className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => toggleVisibility(idx)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    title={p.visible ? 'Hide widget' : 'Show widget'}
                  >
                    {p.visible ? (
                      <Eye className="w-4 h-4 text-primary" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {placements.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No widgets configured on this dashboard.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
