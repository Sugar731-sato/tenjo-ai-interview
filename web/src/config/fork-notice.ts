/**
 * fork 版であることを示す表示の文言(FORK_GUIDELINES 必須要件5)
 *
 * 英語表示に切り替えるときは、FORK_NOTICE_LANG を "en" にする。
 */
export const FORK_NOTICE = {
  ja: {
    disclaimer: "これは政党チームみらいが運営しているものではありません",
    sourceCode: "ソースコード(GitHub)",
    upstreamService: "本家「みらい議会」",
    upstreamRepo: "fork元のリポジトリ",
  },
  en: {
    disclaimer:
      "This service is not operated by the political party Team Mirai.",
    sourceCode: "Source code (GitHub)",
    upstreamService: "Original service: Mirai Gikai",
    upstreamRepo: "Upstream repository",
  },
} as const;

export type ForkNoticeLang = keyof typeof FORK_NOTICE;

export const FORK_NOTICE_LANG: ForkNoticeLang = "ja";
