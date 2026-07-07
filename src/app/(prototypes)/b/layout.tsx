import { Nav } from '@/design-system/version-b/Nav';

export default function VersionBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-version="b">
      <Nav />
      {children}
    </div>
  );
}
