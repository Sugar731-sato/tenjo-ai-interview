"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EXTERNAL_LINKS } from "@/config/external-links";
import { FORK_NOTICE, FORK_NOTICE_LANG } from "@/config/fork-notice";
import { isInterviewPage } from "@/lib/page-layout-utils";
import { routes } from "@/lib/routes";
import { policyLinks, primaryLinks } from "./footer.config";

export function Footer() {
  const pathname = usePathname();

  if (isInterviewPage(pathname)) {
    return null;
  }

  return (
    <footer className="bg-tenjo-base text-tenjo-cream">
      <div className="mx-auto flex w-full max-w-[500px] flex-col items-center px-6 py-14 pb-20 text-center">
        <FooterLogoSection />
        <FooterForkNotice />
        <FooterPrimaryLinks />
        <FooterPolicies />
        <FooterCopyright />
      </div>
    </footer>
  );
}

function FooterLogoSection() {
  return (
    <div className="flex flex-col items-center text-center mb-9">
      <Link href={routes.home()} aria-label="TENJO KANAZAWA トップページ">
        <Image
          src="/img/logo-cream.svg"
          alt="TENJO KANAZAWA"
          width={150}
          height={128}
          className="h-auto"
        />
      </Link>
    </div>
  );
}

function FooterForkNotice() {
  const notice = FORK_NOTICE[FORK_NOTICE_LANG];

  const links = [
    { label: notice.sourceCode, href: EXTERNAL_LINKS.GITHUB_REPO },
    { label: notice.upstreamService, href: EXTERNAL_LINKS.UPSTREAM_SERVICE },
    { label: notice.upstreamRepo, href: EXTERNAL_LINKS.UPSTREAM_REPO },
  ];

  return (
    <div className="w-full mb-6 border border-tenjo-cream px-4 py-3">
      <p className="text-[14px] font-bold leading-relaxed">
        {notice.disclaimer}
      </p>
      <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[12px] font-semibold">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-tenjo-rule"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterPrimaryLinks() {
  return (
    <nav aria-label="主要リンク" className="w-full mb-5">
      <ul
        className="
      flex flex-col items-center gap-3 text-[14px] font-semibold
      md:flex-row md:justify-center md:gap-5
      "
      >
        {primaryLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href as Route}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-tenjo-rule focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tenjo-cream"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterPolicies() {
  return (
    <div className="flex flex-col items-center text-[12px] font-semibold mb-5">
      <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1">
        {policyLinks.map((policy, index) => (
          <li key={policy.label} className="flex items-center gap-2">
            <Link
              href={policy.href as Route}
              target={policy.external ? "_blank" : undefined}
              rel={policy.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-tenjo-rule focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tenjo-cream"
            >
              {policy.label}
            </Link>
            {index < policyLinks.length - 1 ? <span>｜</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCopyright() {
  return (
    <div className="text-center text-sm font-medium">
      © 2025 Team Mirai All rights Reserved
    </div>
  );
}
