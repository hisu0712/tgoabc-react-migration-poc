export default function FormHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-primary bg-primary/10 flex items-center rounded-md px-3 py-2 text-sm">
      {children}
    </p>
  );
}
