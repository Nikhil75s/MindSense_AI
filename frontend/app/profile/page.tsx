"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Key, Shield, Loader2, AlertCircle, CheckCircle2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Profile() {
  const { user, refreshUser, signOut } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    newsletter: user?.newsletter || false,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!user) return null // Handled by middleware/redirects

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccessMsg("Profile updated successfully")
      await refreshUser()
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccessMsg("Password changed successfully")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to change password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch("/api/user/profile", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete account")
      
      await signOut()
      router.push("/")
    } catch (err: any) {
      setErrorMsg(err.message)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8 col-span-full">
          <TabsList className="flex flex-col h-auto w-full md:w-[250px] bg-transparent space-y-2 p-0 justify-start items-stretch">
            <TabsTrigger value="profile" className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 transition-all rounded-lg">
              <User className="w-4 h-4 mr-2" />
              Public Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 transition-all rounded-lg">
              <Key className="w-4 h-4 mr-2" />
              Password & Security
            </TabsTrigger>
            <TabsTrigger value="account" className="justify-start px-4 py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/20 transition-all rounded-lg">
              <Shield className="w-4 h-4 mr-2" />
              Account Management
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 w-full max-w-2xl">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-500">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{errorMsg}</p>
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3 text-green-500">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{successMsg}</p>
              </div>
            )}

            <TabsContent value="profile" className="mt-0">
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="text-lg font-bold font-display mb-6">Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} required />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={profileData.username} onChange={e => setProfileData({...profileData, username: e.target.value})} placeholder="@johndoe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email} disabled className="bg-muted/50 text-muted-foreground" />
                      {!user.isEmailVerified && <p className="text-xs text-orange-500 mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Unverified</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} placeholder="A short bio about yourself" rows={3} />
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox id="newsletter" checked={profileData.newsletter} onCheckedChange={c => setProfileData({...profileData, newsletter: !!c})} className="mt-1" />
                    <Label htmlFor="newsletter" className="font-normal text-muted-foreground cursor-pointer">
                      Subscribe to the MindSense AI newsletter for product updates and wellness tips.
                    </Label>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                      {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</> : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="text-lg font-bold font-display mb-6">Change Password</h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" required value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Updating...</> : "Update Password"}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="account" className="mt-0 space-y-6">
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="text-lg font-bold font-display mb-4">Account Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Account Status</span>
                    <span className="font-medium text-green-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Active</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-500/80 mb-6 leading-relaxed">
                  Permanently delete your account and all associated data. This action cannot be undone. 
                  All your past analyses and history will be lost forever.
                </p>
                
                {showDeleteConfirm ? (
                  <div className="space-y-4 animate-in fade-in">
                    <p className="text-sm font-medium text-red-500">Are you absolutely sure?</p>
                    <div className="flex gap-3">
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                        {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Deleting...</> : "Yes, delete my account"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="destructive" className="bg-red-500 hover:bg-red-600" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
