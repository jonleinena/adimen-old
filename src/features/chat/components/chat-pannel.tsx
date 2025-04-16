"use client"

import { useEffect, useRef, useState } from "react"
import { CircleFadingPlus, SendHorizontal, FileText, X } from "lucide-react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { saveChat } from "@/features/chat/actions/chat"
import { useChat } from "@ai-sdk/react"

import { AuthKitButton } from "./authkit-button"

interface ChatPanelProps {
    chatId: string
}

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ChatPanel({ chatId }: ChatPanelProps) {
    const [inputValue, setInputValue] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { messages, input, handleInputChange, handleSubmit, isLoading, status, stop } = useChat({
        id: chatId,
        api: "/api/chat",
        onFinish: async (message) => {
            // Save the chat after each message
            await saveChat(
                {
                    id: chatId,
                    title: messages[0]?.content.substring(0, 100) || "New Chat",
                    messages: [...messages, message],
                    createdAt: new Date().toISOString(),
                }
            )
        },
    })

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage(null); // Clear previous error
        if (e.target.files && e.target.files.length > 0) {
            if (files.length > 0) {
                setErrorMessage("Solo puedes adjuntar un archivo a la vez.");
                e.target.value = ''; // Clear the input to allow re-selection if needed
                return;
            }

            const selectedFile = e.target.files[0];

            if (selectedFile.size > MAX_SIZE_BYTES) {
                setErrorMessage(`El archivo supera el límite de ${MAX_SIZE_MB}MB.`);
                e.target.value = ''; // Clear the input
                return;
            }

            // Valid file
            setFiles([selectedFile]);
            // Don't clear e.target.value immediately, allow the browser to show the selected file name briefly
        }
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (inputValue.trim() || files.length > 0) {
            // Process attachments if present
            let attachmentDescriptions = '';
            if (files.length) {
                attachmentDescriptions = files
                    .map(file => {
                        if (file.type.startsWith('image/')) {
                            return `[Attached Image: ${file.name}]`;
                        } else if (file.type.startsWith('text/')) {
                            return `[Attached Text File: ${file.name}]`;
                        } else if (file.type === 'application/pdf') {
                            return `[Attached PDF: ${file.name}]`;
                        }
                        return '';
                    })
                    .filter(Boolean)
                    .join('\n');
            }

            // Append attachment descriptions to the message
            const messageContent = attachmentDescriptions
                ? `${inputValue}\n\n${attachmentDescriptions}`
                : inputValue;

            // Convert File[] back to FileList for experimental_attachments
            const dataTransfer = new DataTransfer();
            files.forEach(file => dataTransfer.items.add(file));
            const fileList = dataTransfer.files;

            handleSubmit(e, {
                experimental_attachments: fileList.length > 0 ? fileList : undefined
            })
            setInputValue("")
            setFiles([])
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            const form = e.currentTarget.form
            if (form) form.requestSubmit()
        }
    }

    // Función para eliminar un archivo
    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.filter((_, index) => index !== indexToRemove)
            // Si no quedan archivos, resetea el input de archivos
            if (updatedFiles.length === 0 && fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            return updatedFiles
        })
        setErrorMessage(null); // Clear error on removal
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input value
        }
    }

    return (
        <div className="fixed left-4 right-0 bottom-0 bg-white dark:bg-gray-900 dark:border-gray-800 py-4">
            <div className="mx-auto max-w-2xl px-4">
                <form
                    onSubmit={handleFormSubmit}
                    className="relative space-y-4"
                >
                    {/* File preview section */}
                    {files.length > 0 && (
                        <div className="flex flex-row gap-2 items-start flex-wrap">
                            {files.map((file, index) => {
                                // Contenedor relativo para el botón de eliminar
                                const PreviewContainer = ({ children }: { children: React.ReactNode }) => (
                                    <div className="relative group">
                                        {children}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <span className="text-xs text-muted-foreground mt-1 block truncate max-w-[96px]">
                                            {file.name}
                                        </span>
                                    </div>
                                );

                                if (file.type.startsWith('image/')) {
                                    return (
                                        <PreviewContainer key={`${file.name}-${index}`}>
                                            <img
                                                className="w-24 h-24 object-cover rounded-md"
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                            />
                                        </PreviewContainer>
                                    )
                                } else if (file.type === 'application/pdf') {
                                    return (
                                        <PreviewContainer key={`${file.name}-${index}`}>
                                            <div className="w-24 h-24 bg-secondary rounded-md flex flex-col items-center justify-center gap-1 p-2">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        </PreviewContainer>
                                    )
                                } else {
                                    return (
                                        <PreviewContainer key={`${file.name}-${index}`}>
                                            <div className="w-24 h-24 bg-secondary rounded-md flex flex-col items-center justify-center gap-1 p-2">
                                                <FileText className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        </PreviewContainer>
                                    )
                                }
                            })}
                        </div>
                    )}

                    {/* Error message display */}
                    {errorMessage && (
                         <p className="text-sm text-red-500 px-1">{errorMessage}</p>
                    )}

                    <div className="overflow-hidden rounded-[20px] border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                        <Textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                handleInputChange(e)
                                setInputValue(e.target.value)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={isLoading ? "Waiting for response..." : "Message..."}
                            className="min-h-[60px] max-h-[300px] w-full resize-none border-0 bg-transparent py-3.5 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                            rows={1}
                            disabled={isLoading}
                            id="message-input"
                        />
                        <div className="flex items-center justify-between px-3 py-1.5 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*,text/*,application/pdf"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <CircleFadingPlus className="h-4 w-4" />
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    AI may produce inaccurate information
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AuthKitButton />
                                <Button
                                    type="submit"
                                    disabled={isLoading || (!inputValue.trim() && files.length === 0)}
                                    className="rounded-full h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                                    size="icon"
                                >
                                    <SendHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

