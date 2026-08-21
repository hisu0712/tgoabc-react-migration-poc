import emptyContent from "@/assets/empty_content.png";

export default function EmptyContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 pt-20">
      <img className="w-40" src={emptyContent} alt={content} />
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}
