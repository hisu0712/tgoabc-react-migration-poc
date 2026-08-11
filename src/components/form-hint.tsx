export default function FormHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary text-sm bg-primary/10 flex h-9 items-center rounded-md px-3">
      {children}
    </p>
  );
}
