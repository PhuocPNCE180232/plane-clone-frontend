"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AccountSettingsPage() {
  const { user, updateUser } = useAuth();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user changes externally
  React.useEffect(() => {
    if (user) {
      if (!isEditingName) setName(user.name || "");
      if (!isEditingEmail) setEmail(user.email || "");
    }
  }, [user, isEditingName, isEditingEmail]);

  const handleSaveName = async () => {
    try {
      setIsSaving(true);
      await updateUser({ name });
      toast.success("Tên đã được cập nhật thành công.");
      setIsEditingName(false);
    } catch (error) {
      toast.error("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Vui lòng nhập đúng định dạng email.");
      return;
    }

    try {
      setIsSaving(true);
      await updateUser({ email });
      toast.success("Email đã được cập nhật thành công.");
      setIsEditingEmail(false);
    } catch (error) {
      toast.error("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  const avatarLetter = user.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-300">
      <div className="mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">Account Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your personal information and profile settings.</p>
      </div>
      
      <div className="space-y-12">
        {/* Profile Picture Section */}
        <section>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-3xl font-semibold shadow-sm ring-4 ring-zinc-50 dark:ring-[#1a1a1a]">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name ?? ""}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatarLetter
              )}
            </div>
            <div className="text-sm text-zinc-500">
              <p>This picture will be displayed on your profile and across the workspace.</p>
            </div>
          </div>
        </section>

        {/* General Information Section */}
        <section>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            General Information
          </h2>
          
          <div className="flex flex-col">
            {/* Name Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-500 mb-1">Full Name</p>
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="max-w-xs"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveName} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingName(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-base text-zinc-900 dark:text-zinc-100 font-medium">
                    {user.name || "Not provided"}
                  </p>
                )}
              </div>
              {!isEditingName && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                  Change
                </Button>
              )}
            </div>

            {/* Email Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-500 mb-1">Email Address</p>
                {isEditingEmail ? (
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="max-w-xs"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEmail} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingEmail(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-base text-zinc-900 dark:text-zinc-100 font-medium">
                    {user.email}
                  </p>
                )}
              </div>
              {!isEditingEmail && (
                <Button variant="outline" size="sm" onClick={() => setIsEditingEmail(true)}>
                  Change
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
