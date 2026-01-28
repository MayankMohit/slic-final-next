"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import RouteLoader from "./RouteLoader";

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setLoading(false);
    }, 4000); // must match animation timing

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <RouteLoader />}
      {displayChildren}
    </>
  );
}
