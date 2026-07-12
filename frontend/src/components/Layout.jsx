import React, { Suspense } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { Container, SkeletonText } from "./ui";

const PageFallback = () => (
  <div className="py-12 animate-pulse">
    <SkeletonText lines={4} />
  </div>
);

const Layout = ({ children, stakeholder, setStakeholder }) => {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <Navigation stakeholder={stakeholder} setStakeholder={setStakeholder} />
      <main className="flex-1 pt-20 pb-12">
        <Container>
          <Suspense fallback={<PageFallback />}>{children}</Suspense>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
