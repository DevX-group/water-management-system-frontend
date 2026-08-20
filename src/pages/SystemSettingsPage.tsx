import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  getSystemDetails,
  updateSystemDetails,
} from '@/services/systemSettingsService';
import {
  getAllActiveRegions,
  addRegion,
  deleteRegion,
} from '@/services/regionService';
import type { SystemDetailsRequest } from '@/types/systemSettings';
import type { AddRegionResponse } from '@/types/region';
import {
  Settings,
  MapPin,
  Trash2,
  Plus,
  Save,
  Loader2,
} from 'lucide-react';
import { BackupManagementCard } from '@/components/system-settings/BackupManagementCard';

export const SystemSettingsPage: React.FC = () => {
  const [systemDetails, setSystemDetails] =
    useState<SystemDetailsRequest>({
      companyName: '',
      officeAddress: '',
      officeContactNumber: '',
      officeEmail: '',
      defaultCurrency: '',
      bankName: '',
      branch: '',
      accountNumber: '',
      accountName: '',
    });

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);

  const [regions, setRegions] = useState<AddRegionResponse[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

  const [newRegionName, setNewRegionName] = useState('');
  const [addingRegion, setAddingRegion] = useState(false);

  useEffect(() => {
    fetchSystemDetails();
    fetchRegions();
  }, []);

  const fetchSystemDetails = async () => {
    try {
      setLoadingDetails(true);

      const data = await getSystemDetails();

      if (data) {
        setSystemDetails(data);
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to load system details';
      toast.error(msg);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchRegions = async () => {
    try {
      setLoadingRegions(true);

      const data = await getAllActiveRegions();

      setRegions(data);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to load regions';
      toast.error(msg);
    } finally {
      setLoadingRegions(false);
    }
  };

  const handleSystemDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setSystemDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSystemDetails = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSavingDetails(true);

      await updateSystemDetails(systemDetails);

      toast.success('System details updated successfully');
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to update system details';
      toast.error(msg);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleAddRegion = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newRegionName.trim()) return;

    try {
      setAddingRegion(true);

      const response = await addRegion({
        regionName: newRegionName,
      });

      setRegions((prev) => [...prev, response]);
      setNewRegionName('');

      toast.success('Region added successfully');
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to add region';
      toast.error(msg, { className: "toast-error" });
    } finally {
      setAddingRegion(false);
    }
  };

  const handleDeleteRegion = async (
    regionCode: string
  ) => {
    try {
      await deleteRegion(regionCode);

      setRegions((prev) =>
        prev.filter(
          (r) => r.regionCode !== regionCode
        )
      );

      toast.success('Region deleted successfully');
      } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        'Failed to delete region';
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-6xl mx-auto p-4 md:p-8"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          System Settings
        </h1>

        <p className="text-muted-foreground text-lg">
          Manage global system configurations and operating regions.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8">

        {/* ==================== SYSTEM DETAILS ==================== */}
        <Card className="border-primary/10 shadow-soft hover:shadow-lg transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-secondary/30 pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2.5 rounded-xl gradient-primary text-white shadow-sm">
                <Settings className="h-5 w-5" />
              </div>

              System Details
            </CardTitle>

            <CardDescription className="text-base ml-14">
              Update the core business information used across the system.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {loadingDetails ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <form
                onSubmit={handleSaveSystemDetails}
                className="space-y-6"
              >
                {/* General System Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="companyName"
                      className="text-sm font-semibold text-foreground/80"
                    >
                      Company Name
                    </Label>

                    <Input
                      id="companyName"
                      name="companyName"
                      value={systemDetails.companyName || ''}
                      onChange={handleSystemDetailsChange}
                      className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="defaultCurrency"
                      className="text-sm font-semibold text-foreground/80"
                    >
                      Default Currency
                    </Label>

                    <Input
                      id="defaultCurrency"
                      name="defaultCurrency"
                      value={systemDetails.defaultCurrency || ''}
                      onChange={handleSystemDetailsChange}
                      className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="officeContactNumber"
                      className="text-sm font-semibold text-foreground/80"
                    >
                      Contact Number
                    </Label>

                    <Input
                      id="officeContactNumber"
                      name="officeContactNumber"
                      value={
                        systemDetails.officeContactNumber || ''
                      }
                      onChange={handleSystemDetailsChange}
                      className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label
                      htmlFor="officeEmail"
                      className="text-sm font-semibold text-foreground/80"
                    >
                      Email Address
                    </Label>

                    <Input
                      id="officeEmail"
                      name="officeEmail"
                      type="email"
                      value={systemDetails.officeEmail || ''}
                      onChange={handleSystemDetailsChange}
                      className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>

                  <div className="space-y-2.5 md:col-span-2">
                    <Label
                      htmlFor="officeAddress"
                      className="text-sm font-semibold text-foreground/80"
                    >
                      Office Address
                    </Label>

                    <Input
                      id="officeAddress"
                      name="officeAddress"
                      value={systemDetails.officeAddress || ''}
                      onChange={handleSystemDetailsChange}
                      className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                {/* Bank Information */}
                <div className="pt-6 border-t border-border/50 mt-2">
                  <h3 className="text-lg font-bold text-foreground/90 mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-5 rounded-full gradient-primary inline-block"></span>
                    Bank Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2.5">
                      <Label
                        htmlFor="bankName"
                        className="text-sm font-semibold text-foreground/80"
                      >
                        Bank Name
                      </Label>

                      <Input
                        id="bankName"
                        name="bankName"
                        value={systemDetails.bankName || ''}
                        onChange={handleSystemDetailsChange}
                        className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label
                        htmlFor="branch"
                        className="text-sm font-semibold text-foreground/80"
                      >
                        Branch
                      </Label>

                      <Input
                        id="branch"
                        name="branch"
                        value={systemDetails.branch || ''}
                        onChange={handleSystemDetailsChange}
                        className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label
                        htmlFor="accountName"
                        className="text-sm font-semibold text-foreground/80"
                      >
                        Account Name
                      </Label>

                      <Input
                        id="accountName"
                        name="accountName"
                        value={systemDetails.accountName || ''}
                        onChange={handleSystemDetailsChange}
                        className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label
                        htmlFor="accountNumber"
                        className="text-sm font-semibold text-foreground/80"
                      >
                        Account Number
                      </Label>

                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={systemDetails.accountNumber || ''}
                        onChange={handleSystemDetailsChange}
                        className="rounded-xl border-primary/20 focus-visible:ring-primary/30"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 flex justify-end">
                  <Button
                    type="submit"
                    disabled={savingDetails}
                    className="gap-2.5 gradient-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 rounded-xl px-8 h-11 text-base btn-shine"
                  >
                    {savingDetails ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}

                    Save Configuration
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* ==================== REGIONS ==================== */}
        <Card className="border-primary/10 shadow-soft hover:shadow-lg transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-secondary/30">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-2.5 rounded-xl gradient-primary text-white shadow-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  Regions
                </CardTitle>

                <CardDescription className="text-base ml-14 mt-1">
                  Manage the active operating regions available in the system.
                </CardDescription>
              </div>

              {/* Region Count */}
              <div className="flex items-center gap-2 ml-14 sm:ml-0">
                <span className="text-sm text-muted-foreground">
                  Active Regions
                </span>

                <span className="inline-flex items-center justify-center min-w-9 h-9 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {regions.length}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">

            {/* Add Region Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2 w-full sm:max-w-md">

                <div className="flex gap-3">
                  <Input
                    id="newRegionName"
                    placeholder="Enter region name"
                    value={newRegionName}
                    onChange={(e) =>
                      setNewRegionName(e.target.value)
                    }
                    disabled={addingRegion}
                    className="rounded-xl border-primary/20 focus-visible:ring-primary/30 h-11"
                  />

                  <Button
                    type="button"
                    onClick={handleAddRegion}
                    disabled={
                      addingRegion ||
                      !newRegionName.trim()
                    }
                    className="shrink-0 h-11 px-5 rounded-xl gradient-primary text-white shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all gap-2"
                  >
                    {addingRegion ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    Add Region
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Add regions that will be available for customer registration
                and system operations.
              </p>
            </div>

            {/* Region Table */}
            <div className="rounded-2xl border border-primary/10 overflow-hidden bg-background">

              {loadingRegions ? (
                <div className="flex flex-col justify-center items-center h-[280px] gap-3">
                  <Loader2 className="h-9 w-9 animate-spin text-primary" />

                  <p className="text-sm text-muted-foreground">
                    Loading regions...
                  </p>
                </div>
              ) : regions.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col justify-center items-center py-16 px-6 text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
                    <MapPin className="h-8 w-8 text-primary/60" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">
                    No regions available
                  </h3>

                  <p className="text-sm text-muted-foreground max-w-sm mt-1">
                    Add your first operating region using the form above.
                  </p>
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-secondary/40 sticky top-0 z-10 backdrop-blur-md">
                      <TableRow className="hover:bg-transparent border-b border-primary/10">
                        <TableHead className="w-[180px] pl-6 font-semibold text-foreground">
                          Region Code
                        </TableHead>

                        <TableHead className="font-semibold text-foreground">
                          Region Name
                        </TableHead>

                        <TableHead className="w-[140px] text-right pr-6 font-semibold text-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {regions.map((region) => (
                        <TableRow
                          key={region.regionCode}
                          className="group border-b border-border/50 hover:bg-primary/[0.03] transition-colors"
                        >
                          {/* Region Code */}
                          <TableCell className="pl-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-xs tracking-wide">
                              {region.regionCode}
                            </span>
                          </TableCell>

                          {/* Region Name */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-secondary">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                              </div>

                              <span className="font-medium text-foreground">
                                {region.regionName}
                              </span>
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right pr-6">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Delete
                                  </span>
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent className="rounded-2xl border-primary/20 shadow-xl shadow-primary/5">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Region?
                                  </AlertDialogTitle>

                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the region{' '}
                                    <strong>
                                      {region.regionName}
                                    </strong>{' '}
                                    and remove its configurations from the
                                    system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl">
                                    Cancel
                                  </AlertDialogCancel>

                                  <AlertDialogAction
                                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md transition-all"
                                    onClick={() =>
                                      handleDeleteRegion(
                                        region.regionCode
                                      )
                                    }
                                  >
                                    Delete Region
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ==================== BACKUPS ==================== */}
        <BackupManagementCard />

      </div>
    </motion.div>
  );
};

