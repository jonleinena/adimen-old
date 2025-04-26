"use client";

// React & Next
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    Archive,
    Construction,
    Database,
    Languages,
    Laptop,
    LifeBuoy,
    LogOut,
    MessageSquareText,
    Moon,
    Network,
    Palette,
    Power,
    Settings,
    Shield,
    Sun,
    Trash2,
    User,
    X,
} from 'lucide-react';

// Internal UI Components
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
// Internal Modules & Actions
import { clearChats } from '@/features/chat/actions/chat';
import { supabase } from '@/libs/supabase/supabase-client';
// External Libraries
import type { User as SupabaseUser } from '@supabase/supabase-js';
// import { updateUserPreferences } from '@/features/account/actions/user';

interface SettingsModalProps {
    // Remove isOpen and onClose props
    // isOpen: boolean;
    // onClose: () => void;
}

type SettingsSection = 'general' | 'personalization' | 'speech' | 'dataControls' | 'builderProfile' | 'connectedApps' | 'security';

export function SettingsModal({ }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<SettingsSection>('general');
    const [userData, setUserData] = useState<SupabaseUser | null>(null);
    const [preferredLanguage, setPreferredLanguage] = useState('en'); // Default or fetch from user data
    // Add state for other settings as needed

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUserData(user);
            // Fetch user preferences like language here if available
            // const userPrefs = await getUserPreferences(user?.id); // Example
            // if (userPrefs?.language) setPreferredLanguage(userPrefs.language);
        }
        // Fetch user only when the component mounts or relevant dependencies change, not based on isOpen
        fetchUser();
        setActiveSection('general');
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // onClose(); // Parent Dialog handles closing
        router.push('/login');
        router.refresh();
    };

    const handleClearAllChats = async () => {
        try {
            await clearChats();
            // onClose(); // Parent Dialog handles closing
            router.refresh();
        } catch (error) {
            console.error("Failed to clear chats:", error);
            // Optionally show an error toast
        }
    };

    const handleLanguageChange = async (value: string) => {
        setPreferredLanguage(value);
        // try {
        //     await updateUserPreferences(userData?.id, { language: value });
        //     // Optionally show success toast
        // } catch (error) {
        //     console.error("Failed to update language:", error);
        //     // Optionally show error toast and revert state
        //     setPreferredLanguage(currentLanguage); // Revert optimistic update
        // }
    };

    const handleThemeChange = (value: string) => {
        setTheme(value);
    };


    const navItems = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'personalization', label: 'Personalization', icon: Palette },
        { id: 'speech', label: 'Speech', icon: MessageSquareText },
        { id: 'dataControls', label: 'Data Controls', icon: Database },
        { id: 'builderProfile', label: 'Builder Profile', icon: Construction },
        { id: 'connectedApps', label: 'Connected Apps', icon: Network },
        { id: 'security', label: 'Security', icon: Shield },
        // Add more sections as needed
    ] as const; // Use "as const" for stricter typing of id

    return (
        // <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl h-[70vh] p-0 gap-0 bg-[#f8f5f2] dark:bg-[#242525] text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg flex overflow-hidden">
            {/* Left Navigation */}
            <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 flex flex-col py-4 px-2 bg-[#eae2d8]/50 dark:bg-[#343541]/30">
                <DialogHeader className="px-2 pb-4 mb-2 border-b border-gray-300 dark:border-gray-700 relative">
                    <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
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

            {/* Right Content */}
            <div className="w-3/4 flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1">
                    {/* Render content based on activeSection */}
                    {activeSection === 'general' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">General Settings</h3>
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
                            {/* Add other general settings here */}
                        </div>
                    )}

                    {activeSection === 'personalization' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Personalization</h3>
                            <Separator />
                            <p className="text-sm text-muted-foreground">Personalization settings coming soon.</p>
                            {/* Add Personalization settings */}
                        </div>
                    )}

                    {activeSection === 'speech' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Speech</h3>
                            <Separator />
                            <p className="text-sm text-muted-foreground">Speech settings coming soon.</p>
                            {/* Add Speech settings */}
                        </div>
                    )}

                    {activeSection === 'dataControls' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Data Controls</h3>
                            <Separator />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600">
                                    <div>
                                        <Label className="font-medium">Archived Chats</Label>
                                        <p className="text-xs text-muted-foreground">Manage your archived conversations.</p>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>Manage</Button> {/* Disabled for now */}
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg border-gray-300 dark:border-gray-600">
                                    <div>
                                        <Label className="font-medium">Archive all chats</Label>
                                        <p className="text-xs text-muted-foreground">Move all your current chats to the archive.</p>
                                    </div>
                                    <Button variant="outline" size="sm" disabled>Archive all</Button> {/* Disabled for now */}
                                </div>
                                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50 bg-destructive/5 dark:border-red-500/50 dark:bg-red-900/10">
                                    <div>
                                        <Label className="font-medium text-destructive dark:text-red-400">Delete all chats</Label>
                                        <p className="text-xs text-destructive/80 dark:text-red-400/80">Permanently delete all your chat history.</p>
                                    </div>
                                    {/* Add Confirmation Dialog Trigger Here */}
                                    <Button variant="destructive" size="sm" onClick={handleClearAllChats}>Delete all</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'builderProfile' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Builder Profile</h3>
                            <Separator />
                            <p className="text-sm text-muted-foreground">Builder Profile settings coming soon.</p>
                            {/* Add Builder Profile settings */}
                        </div>
                    )}

                    {activeSection === 'connectedApps' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Connected Apps</h3>
                            <Separator />
                            <p className="text-sm text-muted-foreground">Connected Apps settings coming soon.</p>
                            {/* Add Connected Apps settings */}
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium">Security</h3>
                            <Separator />
                            <p className="text-sm text-muted-foreground">Security settings coming soon.</p>
                            {/* Add Security settings */}
                        </div>
                    )}
                </div>
                {/* Optional Footer for Save/Cancel if needed per section */}
                {/* <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex justify-end space-x-2">
                         <Button variant="outline" onClick={onClose}>Cancel</Button>
                         <Button>Save Changes</Button>
                     </div> */}
            </div>
        </DialogContent>
        // </Dialog>
    );
} 