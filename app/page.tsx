import { Header } from "@/components/header";
import { PostGenerator } from "@/components/post-generator";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              AI Social Media Post Generator
            </h1>
            <p className="text-lg text-muted-foreground">
              Create engaging social media content with AI assistance
            </p>
          </div>
          
          <PostGenerator />
        </div>
      </div>
    </main>
  );
}