"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import { 
  User as UserIcon, 
  Shield, 
  Palette, 
  Save,
  Upload,
  Trash2,
  Key,
  Info
} from "lucide-react";
import { User } from "@/lib/types/users";
import { useTheme } from "next-themes";
import { changePassword, deleteUser, getAuthMethods, updateUser, updateUserProfile } from "@/lib/actions/user";
import { createClient } from "@/libs/supabase/client/client";
import { deleteCookie } from "@/libs/supabase/server/cookies";

interface SettingsClientProps {
  user: User;
}

interface AuthMethods {
  hasPassword: boolean;
  providers: string[];
  primaryProvider: string;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  console.log("SettingsClient rendered with user:", user);
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [authMethods, setAuthMethods] = useState<AuthMethods | null>(null);
  const [profileData, setProfileData] = useState({
    nickname: user.nickname || "",
    biography: user.biography || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [preferences, setPreferences] = useState({
    darkMode: false
  });

  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: theme === 'dark'
    }));
  }, [theme]);

  useEffect(() => {
    const fetchAuthMethods = async () => {
      const result = await getAuthMethods(user.id);
      if (result.success) {
        setAuthMethods(result.data ?? null);
      }
    };
    fetchAuthMethods();
    setProfileData({
      nickname: user.nickname || "",
      biography: user.biography || ""
    });
  }, [user.id]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // Validate input data
      if (!profileData.nickname?.trim()) {
        toast.error("Display name is required");
        return;
      }

      if (profileData.nickname.length > 50) {
        toast.error("Display name must be less than 50 characters");
        return;
      }

      if (profileData.biography && profileData.biography.length > 500) {
        toast.error("Bio must be less than 500 characters");
        return;
      }

      const result = await updateUserProfile(user.id, {
        nickname: profileData.nickname.trim(),
        biography: profileData.biography?.trim() || null
      });

      if (result.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    try {
      const newTheme = preferences.darkMode ? 'dark' : 'light';
      setTheme(newTheme);
      
      localStorage.setItem('theme-preference', newTheme);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Appearance settings updated successfully");
    } catch (error) {
      toast.error("Failed to update appearance settings");
      console.error("Error updating preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        toast.success("Password updated successfully");
        // Clear form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        toast.error(result.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const result = await deleteUser(user.id);
      if (result.success) {
        toast.success("Account deleted successfully");
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        await deleteCookie("sb-user");
        await deleteCookie("sb-token");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const getProviderDisplayName = (provider: string) => {
    const providerNames: { [key: string]: string } = {
      'google': 'Google',
      'github': 'GitHub',
      'email': 'Email'
    };
    return providerNames[provider] || provider;
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="profile" className="space-y-6 h-full overflow-y-hidden">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and how others see you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.image} />
                  <AvatarFallback className="text-lg">
                    {user.full_name?.slice(0,2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-gray-500">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ""}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                    />
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Verified
                    </Badge>
                    {authMethods && (
                      <Badge variant="outline">
                        {getProviderDisplayName(authMethods?.primaryProvider)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.nickname}
                    onChange={(e) => setProfileData(prev => ({ ...prev, nickname: e.target.value }))}
                    placeholder="How should we call you?"
                    />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.biography}
                    onChange={(e) => setProfileData(prev => ({ ...prev, biography: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    rows={3}
                    />
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="overflow-y-auto py-5">
          <div className="space-y-6">
            {/* Authentication Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentication Methods
                </CardTitle>
                <CardDescription>
                  Manage how you sign in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authMethods ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sign-in Providers</p>
                        <div className="flex gap-2 mt-1">
                          {authMethods?.providers.map((provider) => (
                            <Badge key={provider} variant="secondary">
                              {getProviderDisplayName(provider)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {!authMethods?.hasPassword && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="text-sm text-blue-800 dark:text-blue-200">
                            <p className="font-medium">No password set</p>
                            <p>You're currently signing in with {getProviderDisplayName(authMethods?.primaryProvider)}.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Loading authentication methods...</div>
                )}
              </CardContent>
            </Card>

            {/* Password Management */}
            {authMethods?.hasPassword ? (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        disabled={loading}
                        />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        disabled={loading}
                        />
                      <p className="text-xs text-gray-500">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        disabled={loading}
                        />
                    </div>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 dark:text-red-400">
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                  
                  <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={loading}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                          {loading ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-gray-500">
                    Toggle between light and dark themes
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked: boolean) => 
                    setPreferences(prev => ({ ...prev, darkMode: checked }))
                  }
                  />
              </div>

              <Button onClick={handlePreferencesUpdate} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Appearance"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}