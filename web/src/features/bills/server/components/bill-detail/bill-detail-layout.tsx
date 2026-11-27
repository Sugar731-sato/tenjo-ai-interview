import { Container } from "@/components/layouts/container";
import type { DifficultyLevelEnum } from "@/features/bill-difficulty/shared/types";
import { InterviewLandingSection } from "@/features/interview-config/client/components/interview-landing-section";
import { getInterviewConfig } from "@/features/interview-config/server/loaders/get-interview-config";
import { getPublicBillRespondents } from "@/features/user-topic-analysis/server/loaders/get-public-bill-respondents";
import { BillDetailClient } from "../../../client/components/bill-detail/bill-detail-client";
import { BillDisclaimer } from "../../../client/components/bill-detail/bill-disclaimer";
import { BillStatusProgress } from "../../../client/components/bill-detail/bill-status-progress";
import { SupplementaryResolutionsSection } from "../../../client/components/bill-detail/supplementary-resolutions-section";
import type { BillWithContent } from "../../../shared/types";
import { getPublishedSupplementaryResolutions } from "../../loaders/get-published-supplementary-resolutions";
import { BillShareButtons } from "../share/bill-share-buttons";
import { BillDetailHeader } from "./bill-detail-header";

interface BillDetailLayoutProps {
  bill: BillWithContent;
  currentDifficulty: DifficultyLevelEnum;
}

export async function BillDetailLayout({
  bill,
  currentDifficulty,
}: BillDetailLayoutProps) {
  const [interviewConfig, respondents, supplementaryResolutions] =
    await Promise.all([
      getInterviewConfig(bill.id),
      // レポート一覧（/bills/[id]/opinions）と同じ読み込みで、件数をそろえる
      getPublicBillRespondents(bill.id),
      getPublishedSupplementaryResolutions(bill.id),
    ]);

  return (
    <div className="container mx-auto pb-8 max-w-4xl">
      {/*
        テキスト選択機能とチャット連携の実装パターン:
        - BillContentはServer Componentのまま保持（SSRによる高速な初期レンダリング）
        - BillDetailClientでクライアントサイド機能（テキスト選択、チャット連携）を提供
        - このパターンによりSSRを保持しつつインタラクティブ機能を実装
      */}
      <BillDetailClient
        bill={bill}
        currentDifficulty={currentDifficulty}
        hasInterviewConfig={interviewConfig != null}
      >
        <BillDetailHeader
          bill={bill}
          hasInterviewConfig={interviewConfig != null}
          opinionCount={respondents.length}
        />
        <Container>
          {/* 議案ステータス進捗 */}
          <div className="my-8">
            <BillStatusProgress
              status={bill.status}
              originatingHouse={bill.originating_house}
              statusNote={bill.status_note}
            />
          </div>
        </Container>
      </BillDetailClient>

      <Container>
        {interviewConfig != null && (
          <div className="my-8">
            <InterviewLandingSection billId={bill.id} />
          </div>
        )}
        {/* 附帯決議は院ごとに公開確認を経て公開する。公開済みのものが無ければ出さない */}
        {supplementaryResolutions.length > 0 && (
          <div className="my-8">
            <SupplementaryResolutionsSection
              resolutions={supplementaryResolutions}
            />
          </div>
        )}
        {/* シェアボタン */}
        <div className="my-8">
          <BillShareButtons bill={bill} />
        </div>

        {/* データの出典と免責事項 */}
        <div className="my-8">
          <BillDisclaimer />
        </div>
      </Container>
    </div>
  );
}
