/**
 * Layout for "View as Brand" page
 * This removes the admin sidebar to simulate the brand experience
 */
export default function ViewAsBrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Return children directly without the admin sidebar
  // The page itself handles the preview banner
  return <>{children}</>;
}
