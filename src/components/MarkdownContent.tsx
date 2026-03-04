interface MarkdownContentProps {
  html: string;
}

export default function MarkdownContent({ html }: MarkdownContentProps) {
  return (
    <div
      className="markdown-content min-w-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
