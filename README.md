# TENJO AIインタビュー / TENJO AI Interview

> [!IMPORTANT]
> **本サービスは、政党チームみらいが運営しているものではありません。**
> **This service is not operated by the political party Team Mirai.**

## このリポジトリについて

- このリポジトリは、[team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai)(AGPL-3.0)を fork し、「TENJO AIインタビュー」(ブランド: TENJO KANAZAWA)として改変したものです。
- 改変を開始した日: 2026-11-25(fork 元のコミット: `aac6f9ba`)
- ライセンス: fork 元と同じ **GNU Affero General Public License v3.0(AGPL-3.0)** です。[LICENSE](./LICENSE) は変更していません。
- 変更の履歴: このリポジトリの git のコミット履歴を参照してください。
- 本家: リポジトリ https://github.com/team-mirai/mirai-gikai / サービス https://gikai.team-mir.ai/

## About this repository

- This repository is a fork of [team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai) (AGPL-3.0), modified as "TENJO AI Interview" (brand: TENJO KANAZAWA).
- Modifications started on: 2026-11-25 (forked from commit `aac6f9ba`)
- License: **GNU Affero General Public License v3.0 (AGPL-3.0)**, the same as the original. The [LICENSE](./LICENSE) file is unchanged.
- Change history: see the git commit history of this repository.
- Original project: repository https://github.com/team-mirai/mirai-gikai / service https://gikai.team-mir.ai/

---

以下は fork 元(みらい議会)の README です。 / Below is the original README of the upstream project (Mirai Gikai).

# みらい議会

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/team-mirai-volunteer/mirai-gikai)
[![codecov](https://codecov.io/gh/team-mirai/mirai-gikai/branch/develop/graph/badge.svg)](https://codecov.io/gh/team-mirai/mirai-gikai)

## セットアップ

```bash
# Supabaseの起動
npx supabase start

# 環境変数の設定（必要に応じて.envの内容を変更してください）
cp .env.example .env

# パッケージインストール
pnpm install

# SupabaseのDB初期化, 開発用シードデータのセットアップ
pnpm db:reset

# サーバー起動
pnpm dev
```

## マイグレーション

```bash
# マイグレーションファイル生成
npx supabase migration new マイグレーション名

# マイグレーション実行 & 型ファイル更新
pnpm db:migrate
```

## Adminユーザーの作成

1. Supabase Studio上で Authentication > Add User からユーザーを作成
2. Supabase Studio上で以下のSQLを実行

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["admin"]}'::jsonb
WHERE email = '<1で作成したユーザーのemail>';
```

> [!NOTE]
> ローカル開発環境では、`pnpm seed`（`pnpm db:reset` からも実行されます）によって `email: admin@example.com, password: admin123456` のAdminユーザーが作成されます。
> このAdminユーザーは `SUPABASE_URL` が localhost を指している場合のみ作成され、ホスト環境（staging・preview ブランチ等）には作成されません。
> メールアドレス・パスワードを変えたい場合は `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` を設定してください。

## Fork して独自サービスを運営する場合

本リポジトリを fork して独自にサービスを運営する場合は、[Fork ガイドライン](./FORK_GUIDELINES.md) を確認してください。本家サービスとの混同防止のため、ロゴ・カラー・サービス名称などの変更が必要です。
