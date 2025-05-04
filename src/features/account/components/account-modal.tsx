"use client";

// React & Next
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes'; // Keep for Theme toggle if desired here
import {
    CreditCard,
    KeyRound,
    Laptop,
    LifeBuoy, // Keep help
    LogOut,
    Moon,
    Settings, // Can keep for general app settings link maybe?
    ShieldCheck,
    Sun,
    Trash2, // Maybe for Delete Account
    User
} from 'lucide-react';

import { signOut } from "@/app/(public)/auth-actions"
// Internal UI Components
import { Button } from '@/components/ui/button';
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/components/ui/use-toast';
// Internal Modules & Actions
// import { clearChats } from '@/features/chat/actions/chat'; // Less relevant here
import { supabase } from '@/libs/supabase/supabase-client';
// External Libraries
import type { User as SupabaseUser } from '@supabase/supabase-js';
// import { updateUserPreferences } from '@/features/account/actions/user'; // Maybe needed later

interface AccountModalProps {
    // Add prop for triggering pricing URL update
    openPricing: () => void;
    // closeAccountModal is no longer needed if Dialog manages its own state
}

type AccountSection = 'account' | 'subscription' | 'security' | 'general'; // Add General back if needed

// Accept openPricing prop
export function AccountModal({ openPricing }: AccountModalProps) {
    const { theme, setTheme } = useTheme(); // Keep theme state if the toggle remains
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<AccountSection>('account');
    const [userData, setUserData] = useState<SupabaseUser | null>(null);
    const [preferredLanguage, setPreferredLanguage] = useState('en'); // Keep language state
    const { toast } = useToast(); // Move hook call here

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUserData(user);
            // Fetch user preferences like language here if available
            // const userPrefs = await getUserPreferences(user?.id); // Example
            // if (userPrefs?.language) setPreferredLanguage(userPrefs.language);
        }
        fetchUser();
        setActiveSection('account');
    }, []);

    const handleSignOut = async () => {
        const response = await signOut();

        if (response?.error) {
            toast({
                variant: 'destructive',
                description: 'An error occurred while logging out. Please try again or contact support.',
            });
        } else {
            router.push('/login');
            router.refresh();

            toast({
                description: 'You have been logged out.',
            });
        }
    };

    // Placeholder for future implementation
    const handleChangePassword = () => {
        alert("Password change functionality not implemented yet.");
        // router.push('/forgot-password'); // Or redirect to password reset page
    };

    // Update Manage Subscription handler
    const handleManageSubscription = () => {
        // No need to close this modal explicitly if parent Dialog handles it
        openPricing(); // Call the passed function to update URL
    };

    const handleLanguageChange = async (value: string) => {
        setPreferredLanguage(value);
        // Persist language change
    };

    const handleThemeChange = (value: string) => {
        setTheme(value);
        // Persist theme change (usually handled by next-themes)
    };

    // Update Nav Items
    const navItems = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'general', label: 'Preferences', icon: Settings }, // Keep General for Theme/Lang
    ] as const;

    return (
        <DialogContent className="max-w-3xl h-[70vh] p-0 gap-0 bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg flex overflow-hidden">
            {/* Left Navigation */}
            <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 flex flex-col py-4 px-2 bg-[#eae2d8]/50 dark:bg-[#343541]/30">
                <DialogHeader className="px-2 pb-4 mb-2 border-b border-gray-300 dark:border-gray-700 relative">
                    {/* Update Title */}
                    <DialogTitle className="text-lg font-semibold">Account Settings</DialogTitle>
                </DialogHeader>
                <nav className="flex-1 space-y-1">
                    {navItems.map(item => (
                        <Button
                            key={item.id}
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            className={`w-full justify-start h-9 px-3 ${activeSection === item.id ? 'bg-black/5 dark:bg-white/10 font-medium' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}
                            onClick={() => setActiveSection(item.id)}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                </nav>
                <div className="mt-auto pt-4 border-t border-gray-300 dark:border-gray-700 space-y-1">
                    {/* Keep Help & Logout */}
                    <Button variant="ghost" className="w-full justify-start h-9 px-3 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
                        <LifeBuoy className="mr-2 h-4 w-4" /> Help & FAQ
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start h-9 px-3 text-destructive dark:text-red-500 hover:bg-destructive/10 hover:text-destructive dark:hover:bg-red-500/10 dark:hover:text-red-500"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                </div>
            </div>

            {/* Right Content Area */}
            <div className="w-3/4 flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Render content based on activeSection */}

                    {/* Account Details Section */}
                    {activeSection === 'account' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Account Details</h3>
                            <Separator />
                            <div className="space-y-1.5">
                                <Label htmlFor="account-email">Email</Label>
                                <div id="account-email" className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background border-none">
                                    {userData?.email || 'Loading...'}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="account-name">Name</Label>
                                <div id="account-name" className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background border-none">
                                    {userData?.user_metadata?.name || 'Not set'}
                                </div>
                                <p className="text-xs text-muted-foreground">Name is based on your sign-up method.</p>
                            </div>

                        </div>
                    )}

                    {/* Subscription Section */}
                    {activeSection === 'subscription' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Subscription</h3>
                            <Separator />
                            <div className="p-4 border rounded-lg border-gray-300 dark:border-gray-600 bg-background">
                                <p className="text-sm font-medium mb-1">Current Plan: <span className="font-normal">Free Tier</span></p> {/* Placeholder */}
                                <p className="text-xs text-muted-foreground mb-3">Includes basic features and usage limits.</p> {/* Placeholder */}
                                <Button onClick={handleManageSubscription} size="sm">Manage Subscription</Button>
                            </div>
                            {/* Add usage details if applicable */}
                            {/* <div className="space-y-2">
                                <Label>Usage this month</Label>
                                <Progress value={33} className="w-[60%]" />
                                <p className="text-xs text-muted-foreground">33% of your monthly limit used.</p>
                            </div> */}
                        </div>
                    )}

                    {/* Security Section */}
                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Security</h3>
                            <Separator />
                            <div className="flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600">
                                <div>
                                    <Label className="font-medium">Change Password</Label>
                                    <p className="text-xs text-muted-foreground">Update your account password.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleChangePassword}>
                                    <KeyRound className="mr-2 h-4 w-4" /> Change
                                </Button>
                            </div>
                            {/* Add MFA status/setup here */}
                            <div className="flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600">
                                <div>
                                    <Label className="font-medium">Two-Factor Authentication</Label>
                                    <p className="text-xs text-muted-foreground">Status: <span className="text-yellow-600 dark:text-yellow-400">Not Enabled</span></p> {/* Placeholder */}
                                </div>
                                <Button variant="outline" size="sm" disabled>Enable</Button> {/* Disabled for now */}
                            </div>
                            {/* Add Delete Account section here */}
                            <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50 bg-destructive/5 dark:border-red-500/50 dark:bg-red-900/10">
                                <div>
                                    <Label className="font-medium text-destructive dark:text-red-400">Delete Account</Label>
                                    <p className="text-xs text-destructive/80 dark:text-red-400/80">Permanently delete your account and all data.</p>
                                </div>
                                <Button variant="destructive" size="sm" disabled>Delete Account</Button> {/* Needs confirmation! Disabled for now */}
                            </div>
                        </div>
                    )}

                    {/* General Preferences Section (Theme/Language) */}
                    {activeSection === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Preferences</h3>
                            <Separator />
                            <div className="space-y-4">
                                <Label>Theme</Label>
                                <Select value={theme} onValueChange={handleThemeChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            <span className="flex items-center"><Sun className="mr-2 h-4 w-4" /> Light</span>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <span className="flex items-center"><Moon className="mr-2 h-4 w-4" /> Dark</span>
                                        </SelectItem>
                                        <SelectItem value="system">
                                            <span className="flex items-center"><Laptop className="mr-2 h-4 w-4" /> System</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <Label>Language</Label>
                                <Select value={preferredLanguage} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="eu">Euskara</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">Choose your preferred language for the interface.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
} 