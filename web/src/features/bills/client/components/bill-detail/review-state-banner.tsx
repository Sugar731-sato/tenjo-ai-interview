import type { ArticleReviewState } from "../../../shared/utils/article-review-state";
import { ReviewInProgressBanner } from "./review-status-banner";

/**
 * 記事のレビュー状態に応じたバナー。レビュー中の記事にだけ出す
 */
export function ReviewStateBanner({ state }: { state: ArticleReviewState }) {
  if (state === "in_review") return <ReviewInProgressBanner />;
  return null;
}
