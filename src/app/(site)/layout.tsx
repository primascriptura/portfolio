import { Dock } from '@/design-system/components';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Dock />
    </>
  );
}
