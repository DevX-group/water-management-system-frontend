import '@/index.css';
import React, { useEffect, useState, useCallback } from 'react';
import { getWidgetCatalog, updateWidget, getDashboardConfigByRole, updateDashboardLayout, addWidgetToRole, removeWidgetFromRole } from '@/services/dashboardService';
import type { WidgetDefinition, DashboardConfig, DashboardWidgetConfig } from '@/types/dashboard';
import { WidgetContainer } from '@/components/dashboard/WidgetContainer';
import { WidgetRenderer } from '@/components/dashboard/WidgetRenderer';
import { LayoutGrid, RefreshCw, Loader2, Save, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

const ALL_ROLES = ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'CUSTOMER_HANDLER', 'METER_READER', 'CUSTOMER'];



const WidgetCatalogCard: React.FC<{
  widget: WidgetDefinition;
  initialAssignedRoles: string[];
  onSaved: () => void;
}> = ({ widget, initialAssignedRoles, onSaved }) => {
  const { toast } = useToast();
  const { t } = useTranslation('widgetManagement');
  const [name, setName] = useState(widget.name);
  const [active, setActive] = useState(widget.active);
  const [assignedRoles, setAssignedRoles] = useState<Set<string>>(new Set(initialAssignedRoles));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAssignedRoles(new Set(initialAssignedRoles));
    setName(widget.name);
    setActive(widget.active);
  }, [initialAssignedRoles, widget]);

  const availableRoles = widget.allowedRoles || ALL_ROLES;

  const hasChanges = 
    name !== widget.name || 
    active !== widget.active ||
    assignedRoles.size !== initialAssignedRoles.length ||
    ![...assignedRoles].every(r => initialAssignedRoles.includes(r));

  const toggleRole = (role: string) => {
    const next = new Set(assignedRoles);
    if (next.has(role)) next.delete(role);
    else next.add(role);
    setAssignedRoles(next);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update Widget Definition (Name & Active status)
      if (name !== widget.name || active !== widget.active) {
        const payload = {
          widgetKey: widget.widgetKey,
          name: name,
          description: widget.description,
          widgetType: widget.widgetType,
          componentKey: widget.componentKey,
          active: active,
          allowedRoles: widget.allowedRoles, // Preserve existing allowed roles
          defaultColSpan: widget.defaultColSpan,
          defaultRowSpan: widget.defaultRowSpan
        };
        await updateWidget(widget.id, payload as any);
      }

      // 2. Add/Remove from role dashboards
      const addedRoles = [...assignedRoles].filter(r => !initialAssignedRoles.includes(r));
      const removedRoles = initialAssignedRoles.filter(r => !assignedRoles.has(r));

      for (const role of addedRoles) {
        await addWidgetToRole(role, widget.id).catch(() => {});
      }
      for (const role of removedRoles) {
        await removeWidgetFromRole(role, widget.id).catch(() => {});
      }

      toast({ title: t('card.saveSuccess') });
      onSaved();
    } catch (err: any) {
      toast({ title: t('card.saveError'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`bg-card border rounded-xl flex flex-col transition-all shadow-sm ${!active ? 'opacity-70' : ''}`}>
      {/* Visual Preview */}
      <div className="bg-muted/30 p-4 flex justify-center items-center border-b min-h-[160px] pointer-events-none transform scale-90 origin-center">
        <WidgetContainer name={name} className="w-full max-w-sm m-0 shadow-lg bg-card">
          <WidgetRenderer componentKey={widget.componentKey} name={name} />
        </WidgetContainer>
      </div>
      
      <div className="p-4 space-y-4 flex-1 flex flex-col relative">
        <div className="absolute top-2 right-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider border border-primary/20">
            {widget.widgetType}
          </span>
        </div>

        {/* Name Edit */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">{t('card.widgetName')}</label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="h-8 font-medium"
          />
        </div>
        
        {/* Role Assignment */}
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">{t('card.assignedRoles')}</label>
          <div className="flex flex-wrap gap-2">
            {availableRoles.map(role => {
              const isAssigned = assignedRoles.has(role);
              return (
                <div 
                  key={role} 
                  onClick={() => toggleRole(role)}
                  className={`text-[10px] px-2 py-1 rounded-full cursor-pointer transition-colors border ${
                    isAssigned ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground hover:bg-muted border-border'
                  }`}
                >
                  {role.replace('_', ' ')}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">{active ? t('card.active') : t('card.deactivated')}</span>
          <Switch 
            checked={active} 
            onCheckedChange={setActive}
          />
        </div>

        {/* Save Button */}
        <div className={`transition-all duration-300 overflow-hidden ${hasChanges ? 'max-h-12 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
          <Button onClick={handleSave} disabled={saving} className="w-full h-9 text-sm">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {t('card.saveChanges')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const WidgetManagementPage: React.FC = () => {
  const { toast } = useToast();
  const { t } = useTranslation('widgetManagement');

  const [catalog, setCatalog] = useState<WidgetDefinition[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  
  // Track all roles' dashboard layouts to know which widgets are currently assigned
  const [allDashboards, setAllDashboards] = useState<Record<string, DashboardConfig>>({});
  
  const [selectedRole, setSelectedRole] = useState<string>('SUPER_ADMIN');
  const [dashConfig, setDashConfig] = useState<DashboardConfig | null>(null);
  const [placements, setPlacements] = useState<DashboardWidgetConfig[]>([]);
  const [dashLoading, setDashLoading] = useState(false);
  const [savingDash, setSavingDash] = useState(false);

  const loadAllDashboards = useCallback(async () => {
    try {
      const results = await Promise.allSettled(
        ALL_ROLES.map(role => getDashboardConfigByRole(role))
      );
      const newDashboards: Record<string, DashboardConfig> = {};
      results.forEach((res, idx) => {
        if (res.status === 'fulfilled') {
          newDashboards[ALL_ROLES[idx]] = res.value;
        }
      });
      setAllDashboards(newDashboards);
    } catch {
      // ignore
    }
  }, []);

  const loadCatalog = useCallback(() => {
    setCatalogLoading(true);
    getWidgetCatalog()
      .then((data) => {
        // Sort by ID to ensure position stability
        setCatalog(data.sort((a, b) => a.id - b.id));
      })
      .catch(() => toast({ title: t('loadError'), variant: 'destructive' }))
      .finally(() => setCatalogLoading(false));
  }, [toast, t]);

  const loadDashboard = useCallback((role: string) => {
    setDashLoading(true);
    getDashboardConfigByRole(role)
      .then((cfg) => {
        setDashConfig(cfg);
        setPlacements([...cfg.widgets].sort((a, b) => a.position - b.position));
      })
      .catch(() => {
        setDashConfig(null);
        setPlacements([]);
      })
      .finally(() => setDashLoading(false));
  }, []);

  const refreshAll = useCallback(() => {
    loadCatalog();
    loadAllDashboards();
    loadDashboard(selectedRole);
  }, [loadCatalog, loadAllDashboards, loadDashboard, selectedRole]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Dashboard Layout Updates
  const saveLayout = async () => {
    if (!dashConfig) return;
    setSavingDash(true);
    try {
      const payload = placements.map((p, idx) => {
        // Fallback: If widgetId is missing, resolve it by componentKey
        const resolvedWidgetId = p.widgetId || catalog.find(c => c.componentKey === p.componentKey)?.id;
        if (!resolvedWidgetId) throw new Error("Missing widgetId for " + p.componentKey);

        return {
          widgetId: resolvedWidgetId,
          colSpan: p.colSpan,
          rowSpan: p.rowSpan,
          visible: true,
          position: idx,
        };
      });
      await updateDashboardLayout(dashConfig.dashboardId, payload as any);
      toast({ title: t('dashboard.saveSuccess') });
      refreshAll();
    } catch (err: any) {
      toast({ title: t('dashboard.saveError') + ' ' + (err.message || ''), variant: 'destructive' });
    } finally {
      setSavingDash(false);
    }
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setPlacements((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (idx === placements.length - 1) return;
    setPlacements((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const changeSpan = (idx: number, field: 'colSpan' | 'rowSpan', delta: number) => {
    setPlacements((prev) => {
      const next = [...prev];
      const val = next[idx][field] + delta;
      if (val >= 1 && val <= 4) {
        next[idx] = { ...next[idx], [field]: val };
      }
      return next;
    });
  };

  const removeWidgetFromDash = (idx: number) => {
    setPlacements((prev) => prev.filter((_, i) => i !== idx));
  };

  const addWidgetToDash = (widget: WidgetDefinition) => {
    setPlacements((prev) => [
      ...prev,
      {
        id: Date.now(),
        widgetId: widget.id,
        componentKey: widget.componentKey,
        name: widget.name,
        colSpan: widget.defaultColSpan || 1,
        rowSpan: widget.defaultRowSpan || 1,
        position: prev.length,
        visible: true,
        widgetType: widget.widgetType,
        configJson: null,
      } as DashboardWidgetConfig
    ]);
  };

  const availableWidgetsForRole = catalog.filter(w => 
    w.active && 
    (w.allowedRoles || ALL_ROLES).includes(selectedRole) && 
    !placements.some(p => (p.widgetId === w.id || p.componentKey === w.componentKey))
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('page.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('page.subtitle')}</p>
        </div>
      </div>

      {/* Widget Catalog Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('catalog.title')}</h2>
          <Button variant="outline" size="sm" onClick={refreshAll}>
            <RefreshCw className={`w-4 h-4 mr-2 ${catalogLoading ? 'animate-spin' : ''}`} /> {t('catalog.refresh')}
          </Button>
        </div>
        
        {catalogLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalog.map(w => {
              // Determine which roles currently have this widget in their dashboard layout
              const rolesWithWidget = ALL_ROLES.filter(r => {
                const dash = allDashboards[r];
                return dash && dash.widgets.some(dw => dw.componentKey === w.componentKey || dw.widgetId === w.id);
              });

              return (
                <WidgetCatalogCard 
                  key={w.id} 
                  widget={w} 
                  initialAssignedRoles={rolesWithWidget}
                  onSaved={refreshAll} 
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Dashboard Configuration Section */}
      <section className="space-y-4 pt-8 border-t">
        <h2 className="text-xl font-semibold">{t('dashboard.title')}</h2>
        <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
          <TabsList className="mb-6 flex flex-wrap h-auto">
            {ALL_ROLES.map(role => (
              <TabsTrigger key={role} value={role} className="flex-1 min-w-[120px] py-2">
                {role.replace('_', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedRole} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{t('dashboard.roleTitle', { role: selectedRole.replace('_', ' ') })}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.roleSubtitle')}</p>
              </div>
              <Button onClick={saveLayout} disabled={savingDash || dashLoading}>
                {savingDash ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {t('dashboard.saveLayout')}
              </Button>
            </div>

            {dashLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : !dashConfig ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                {t('dashboard.noActiveDashboard', { role: selectedRole })}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Placed Widgets */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">{t('dashboard.placedWidgets')}</h4>
                  {placements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                      {t('dashboard.emptyDashboard')}
                    </div>
                  ) : (
                    placements.map((p, idx) => (
                      <div key={p.id + '-' + idx} className="flex items-center gap-4 bg-card border rounded-xl p-3 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveUp(idx)} disabled={idx === 0}><ArrowUp className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveDown(idx)} disabled={idx === placements.length - 1}><ArrowDown className="w-3 h-3" /></Button>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.widgetType}</p>
                        </div>
                        
                        {/* Size Controls */}
                        <div className="flex gap-4 mr-4">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">{t('dashboard.width')}</span>
                            <div className="flex items-center gap-1 mt-1 bg-muted rounded-md p-0.5">
                              <button onClick={() => changeSpan(idx, 'colSpan', -1)} disabled={p.colSpan <= 1} className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm text-xs disabled:opacity-50">-</button>
                              <span className="text-xs font-mono w-4 text-center">{p.colSpan}</span>
                              <button onClick={() => changeSpan(idx, 'colSpan', 1)} disabled={p.colSpan >= 4} className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm text-xs disabled:opacity-50">+</button>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">{t('dashboard.height')}</span>
                            <div className="flex items-center gap-1 mt-1 bg-muted rounded-md p-0.5">
                              <button onClick={() => changeSpan(idx, 'rowSpan', -1)} disabled={p.rowSpan <= 1} className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm text-xs disabled:opacity-50">-</button>
                              <span className="text-xs font-mono w-4 text-center">{p.rowSpan}</span>
                              <button onClick={() => changeSpan(idx, 'rowSpan', 1)} disabled={p.rowSpan >= 4} className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm text-xs disabled:opacity-50">+</button>
                            </div>
                          </div>
                        </div>

                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeWidgetFromDash(idx)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Available Widgets */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">{t('dashboard.availableWidgets')}</h4>
                  <div className="bg-muted/30 rounded-xl border p-4 space-y-3 min-h-[300px]">
                    {availableWidgetsForRole.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">{t('dashboard.noWidgetsAvailable')}</p>
                    ) : (
                      availableWidgetsForRole.map(w => (
                        <div key={w.id} className="flex items-center justify-between bg-card border rounded-lg p-3 shadow-sm">
                          <div>
                            <p className="font-semibold text-sm leading-tight">{w.name}</p>
                            <p className="text-[10px] text-muted-foreground">{w.widgetType}</p>
                          </div>
                          <Button size="sm" variant="secondary" onClick={() => addWidgetToDash(w)}>
                            <Plus className="w-4 h-4 mr-1" /> {t('dashboard.add')}
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};


