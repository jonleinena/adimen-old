import { redirect } from "next/navigation"
import { generateId } from 'ai'

export default async function Page() {
    const id = generateId()

    redirect(`/chat/${id}`)
}

