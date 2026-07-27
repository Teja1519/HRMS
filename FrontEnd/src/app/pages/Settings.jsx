import { useEffect, useState } from "react";
import { User, Lock, Bell, Settings as SettingsIcon, Save, Building2, Clock, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import api from "../lib/api";
import { toast } from "sonner";

export function Settings() {
  const [settings, setSettings] = useState({
    company_name: "HRMS Corp",
    office_start_time: "09:00",
    office_end_time: "18:00",
    currency: "INR"
  });

  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const response = await api.get("/settings");
      if (response.data?.data) {
        setSettings((prev) => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/settings", settings);
      toast.success("Company settings updated successfully!");
      await loadSettings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings & Preferences</h1>
        <p className="text-muted-foreground mt-1">Manage company rules, work hours, and portal settings</p>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">
            <Building2 className="w-4 h-4 mr-2" />
            Company & Work Hours
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            My Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company & Attendance Configuration</CardTitle>
              <CardDescription>Configure working hours, late arrival thresholds, and currency.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={settings.company_name}
                      onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Base Currency</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(val) => setSettings({ ...settings, currency: val })}
                    >
                      <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeStartTime">Office Start Time (Late Threshold)</Label>
                    <Input
                      id="officeStartTime"
                      type="time"
                      value={settings.office_start_time}
                      onChange={(e) => setSettings({ ...settings, office_start_time: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeEndTime">Office End Time</Label>
                    <Input
                      id="officeEndTime"
                      type="time"
                      value={settings.office_end_time}
                      onChange={(e) => setSettings({ ...settings, office_end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user?.Username?.slice(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user?.Username}</h3>
                  <Badge variant="outline">{user?.Role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
