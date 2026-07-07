import { TopBar } from '@/design-system/version-a/TopBar';

export default function VersionALayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-version="a">
      <TopBar />
      {children}
    </div>
  );
}
