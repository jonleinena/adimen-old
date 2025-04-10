"use client";

import { Message } from "ai";
import { motion } from "framer-motion";

import { suggestedActions } from "../constants/suggestedActions";

interface SuggestedActionsProps {
    messages: Message[];
    onActionClick: (message: string) => void;
}

export function SuggestedActions({ messages, onActionClick }: SuggestedActionsProps) {
    if (messages.length > 0) return null;

    return (
        <div className="grid sm:grid-cols-2 gap-5 w-full max-w-2xl mx-auto mt-8 mb-4 px-4">
            {suggestedActions.map((suggestedAction, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    key={index}
                    className={index > 1 ? "hidden sm:block" : "block"}
                >
                    <button
                        onClick={() => onActionClick(suggestedAction.action)}
                        className="w-full h-full text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 focus:outline-none rounded-xl p-4 text-sm transition-all duration-200 flex flex-col gap-2"
                    >
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            {suggestedAction.title}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                            {suggestedAction.label}
                        </span>
                    </button>
                </motion.div>
            ))}
        </div>
    );
} 