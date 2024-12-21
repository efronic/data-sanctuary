"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Id } from '@/convex/_generated/dataModel'
import { useAction } from 'convex/react'
import { api } from '@/convex/_generated/api'

const formSchema = z.object({
	question: z.string().min(2, {
		message: "Please ask a valid question.",
	}),
})

export function ChatPanel({
	documentId,
	}: {
		documentId: Id<"documents">;
	}) {
		const askQuestion = useAction(api.documents.askQuestion);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			question: "",
		},
	});

		async function onSubmit(values: z.infer<typeof formSchema>) {
			await askQuestion({ question: values.question, documentId }).then(console.log);
		}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="question"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message</FormLabel>
							<FormControl>
								<Input placeholder="Ask a question" {...field} />
							</FormControl>
							{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Ask</Button>
			</form>
		</Form>
	)
}
