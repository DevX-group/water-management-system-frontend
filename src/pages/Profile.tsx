import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, MapPin, CreditCard } from "lucide-react";

const Profile = () => {
  const user = {
    name: "A.B.C. Example Name",
    address: "No.1, Xyz Road, Region1, Colombo",
    nic: "200010000001",
    phone: "0711234567",
    email: "example001@gmail.com",
    region: "Region1",
    connection: "Metered",
    subscriptionNo: "R10001",
  };

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">Profile Update Request</h1>
        <p className="text-muted-foreground mb-8">Submit changes for admin review. You cannot directly change the data.</p>

        <Card className="shadow-card border-none">
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" />Your Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={user.name} disabled className="mt-1 bg-secondary/50" /></div>
              <div><Label>NIC</Label><Input value={user.nic} disabled className="mt-1 bg-secondary/50" /></div>
              <div><Label>Mobile Number</Label><Input value={user.phone} disabled className="mt-1 bg-secondary/50" /></div>
              <div><Label>Email</Label><Input value={user.email} disabled className="mt-1 bg-secondary/50" /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input value={user.address} disabled className="mt-1 bg-secondary/50" /></div>
              <div><Label>Region</Label><Input value={user.region} disabled className="mt-1 bg-secondary/50" /></div>
              <div><Label>Connection Type</Label><Input value={user.connection} disabled className="mt-1 bg-secondary/50" /></div>
              <div><Label>Subscription No</Label><Input value={user.subscriptionNo} disabled className="mt-1 bg-secondary/50" /></div>
            </div>

            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold mb-4">Request Change</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>New Mobile Number</Label><Input placeholder="Enter new number" className="mt-1" /></div>
                <div><Label>New Email</Label><Input placeholder="Enter new email" className="mt-1" /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="gradient-primary">Submit Request</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;
