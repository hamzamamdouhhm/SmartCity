import React from "react";
import { useTranslation } from "react-i18next";
import { Container } from "./ui";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-tertiary">
          <span>
            © {new Date().getFullYear()} Smart City Benchmarking · {t("universityProject")}
          </span>
          <span>{t("dataSources")}</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
