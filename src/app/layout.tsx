import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
    title: "Isekai Manga - AI Story Generator",
    description: "Create amazing isekai manga stories with AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ClientLayout>{children}</ClientLayout>
        </html>
    );
}
