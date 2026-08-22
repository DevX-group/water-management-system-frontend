import '@/index.css';
import React, { useEffect, useState, useCallback } from 'react';
import { getWidgetCatalog, updateWidget, getDashboardConfigByRole, updateDashboardLayout } from '@/services/dashboardService';
import type { WidgetDefinition, DashboardConfig, DashboardWidgetConfig } from '@/types/dashboard';
import { WidgetContainer } from '@/components/dashboard/WidgetContainer';
import { WidgetRenderer } from '@/components/dashboard/WidgetRenderer';
import { LayoutGrid, RefreshCw, Loader2, Save, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ALL_ROLES = ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'CUSTOMER_HANDLER', 'METER_READER', 'CUSTOMER'];

export const WidgetManagementPage: React.FC = () => {
  const { toast } = useToast();

  const [catalog, setCatalog] = useState<WidgetDefinition[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  
  const [selectedRole, setSelectedRole] = useState<string>('SUPER_ADMIN');
  const [dashConfig, setDashConfig] = useState<DashboardConfig | null>(null);
  const [placements, setPlacements] = useState<DashboardWidgetConfig[]>([]);
  const [dashLoading, setDashLoading] = useState(false);
  const [savingDash, setSavingDash] = useState(false);

  const loadCatalog = useCallback(() => {
    setCatalogLoading(true);
    getWidgetCatalog()
      .then(setCatalog)
      .catch(() => toast({ title: 'Failed to load widget catalog', variant: 'destructive' }))
      .finally(() => setCatalogLoading(false));
  }, [toast]);

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

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    loadDashboard(selectedRole);
  }, [selectedRole, loadDashboard]);

  // Widget Catalog Updates
  const handleUpdateWidgetName = async (widget: WidgetDefinition, newName: string) => {
    if (!newName.trim() || newName === widget.name) return;
    try {
      await updateWidget(widget.id, { name: newName });
      toast({ title: 'Widget name updated.' });
      loadCatalog();
    } catch {
      toast({ title: 'Failed to update widget name.', variant: 'destructive' });
    }
  };

  const handleToggleWidgetRole = async (widget: WidgetDefinition, role: string) => {
    const roles = new Set(widget.allowedRoles || []);
    if (roles.has(role)) roles.delete(role);
    else roles.add(role);
    
    try {
      await updateWidget(widget.id, { allowedRoles: Array.from(roles) });
      toast({ title: 'Widget roles updated.' });
      loadCatalog();
    } catch {
      toast({ title: 'Failed to update widget roles.', variant: 'destructive' });
    }
  };

  const handleToggleWidgetStatus = async (widget: WidgetDefinition) => {
    if (!widget.active) {
      toast({ title: 'Inactive widgets cannot be reactivated via UI.', variant: 'destructive' });
      return;
    }
    if (!confirm(`Deactivate widget "${widget.name}"? It will be removed from all dashboards and cannot be reactivated.`)) return;
    
    try {
      await updateWidget(widget.id, { active: false });
      toast({ title: 'Widget deactivated.' });
      loadCatalog();
      loadDashboard(selectedRole);
    } catch {
      toast({ title: 'Failed to deactivate widget.', variant: 'destructive' });
    }
  };

  // Dashboard Layout Updates
  const saveLayout = async () => {
    if (!dashConfig) return;
    setSavingDash(true);
    try {
      const payload = placements.map((p, idx) => ({
        widgetId: p.id,
        colSpan: p.colSpan,
        rowSpan: p.rowSpan,
        visible: true,
        position: idx,
      }));
      await updateDashboardLayout(dashConfig.dashboardId, payload as any);
      toast({ title: 'Dashboard layout saved successfully.' });
      loadDashboard(selectedRole);
    } catch {
      toast({ title: 'Failed to save layout', variant: 'destructive' });
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
        id: widget.id,
        componentKey: widget.componentKey,
        name: widget.name,
        colSpan: 1,
        rowSpan: 1,
        position: prev.length,
        visible: true,
        widgetType: widget.widgetType,
        configJson: null,
      } as DashboardWidgetConfig
    ]);
  };

  const availableWidgetsForRole = catalog.filter(w => 
    w.active && 
    (w.allowedRoles || []).includes(selectedRole) && 
    !placements.some(p => p.id === w.id)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Widget Management</h1>
          <p className="text-muted-foreground">Manage the widget catalog and configure role dashboards.</p>
        </div>
      </div>

      {/* Widget Catalog Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Widget Catalog</h2>
          <Button variant="outline" size="sm" onClick={loadCatalog}>
            <RefreshCw className={`w-4 h-4 mr-2 ${catalogLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
        
        {catalogLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map(w => (
              <div key={w.id} className={`bg-card border rounded-xl overflow-hidden flex flex-col transition-all shadow-sm ${!w.active ? 'opacity-60' : ''}`}>
                {/* Visual Preview */}
                <div className="bg-muted/30 p-4 flex justify-center items-center border-b min-h-[160px] pointer-events-none transform scale-90 origin-center">
                  <WidgetContainer name={w.name} className="w-full max-w-sm m-0 shadow-lg bg-card">
                    <WidgetRenderer componentKey={w.componentKey} name={w.name} />
                  </WidgetContainer>
                </div>
                
                <div className="p-4 space-y-4 flex-1 flex flex-col">
                  {/* Name Edit */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Widget Name</label>
                    <Input 
                      defaultValue={w.name} 
                      onBlur={(e) => handleUpdateWidgetName(w, e.target.value)}
                      disabled={!w.active}
                      className="h-8 font-medium"
                    />
                  </div>
                  
                  {/* Role Assignment */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase mb-2 block">Allowed Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_ROLES.map(role => {
                        const isAssigned = (w.allowedRoles || []).includes(role);
                        return (
                          <div 
                            key={role} 
                            onClick={() => w.active && handleToggleWidgetRole(w, role)}
                            className={`text-[10px] px-2 py-1 rounded-full cursor-pointer transition-colors border ${
                              !w.active ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                              isAssigned ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {role.replace('_', ' ')}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm font-medium">{w.active ? 'Active' : 'Deactivated'}</span>
                    <Switch 
                      checked={w.active} 
                      onCheckedChange={() => handleToggleWidgetStatus(w)}
                      disabled={!w.active} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dashboard Configuration Section */}
      <section className="space-y-4 pt-8 border-t">
        <h2 className="text-xl font-semibold">Dashboard Configurations</h2>
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
                <h3 className="text-lg font-medium">{selectedRole.replace('_', ' ')} Dashboard</h3>
                <p className="text-sm text-muted-foreground">Add, resize, and reorder widgets for this role.</p>
              </div>
              <Button onClick={saveLayout} disabled={savingDash || dashLoading}>
                {savingDash ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Layout
              </Button>
            </div>

            {dashLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : !dashConfig ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                No active dashboard found for {selectedRole}.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Placed Widgets */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Placed Widgets</h4>
                  {placements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                      Dashboard is empty. Add widgets from the panel.
                    </div>
                  ) : (
                    placements.map((p, idx) => (
                      <div key={p.id} className="flex items-center gap-4 bg-card border rounded-xl p-3 shadow-sm">
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
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Width</span>
                            <div className="flex items-center gap-1 mt-1 bg-muted rounded-md p-0.5">
                              <button onClick={() => changeSpan(idx, 'colSpan', -1)} disabled={p.colSpan <= 1} className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm text-xs disabled:opacity-50">-</button>
                              <span className="text-xs font-mono w-4 text-center">{p.colSpan}</span>
                              <button onClick={() => changeSpan(idx, 'colSpan', 1)} disabled={p.colSpan >= 4} className="w-5 h-5 flex items-center justify-center bg-background rounded shadow-sm text-xs disabled:opacity-50">+</button>
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase">Height</span>
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
                  <h4 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Available Widgets</h4>
                  <div className="bg-muted/30 rounded-xl border p-4 space-y-3 min-h-[300px]">
                    {availableWidgetsForRole.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No other widgets available for this role.</p>
                    ) : (
                      availableWidgetsForRole.map(w => (
                        <div key={w.id} className="flex items-center justify-between bg-card border rounded-lg p-3 shadow-sm">
                          <div>
                            <p className="font-semibold text-sm leading-tight">{w.name}</p>
                            <p className="text-[10px] text-muted-foreground">{w.widgetType}</p>
                          </div>
                          <Button size="sm" variant="secondary" onClick={() => addWidgetToDash(w)}>
                            <Plus className="w-4 h-4 mr-1" /> Add
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
