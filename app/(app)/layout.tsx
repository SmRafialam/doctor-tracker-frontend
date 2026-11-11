import Layout from "@/components/Layout";

/** Every route in this group is protected by proxy.ts and shares the app shell. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return <Layout>{children}</Layout>;
}
