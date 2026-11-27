import { Container } from "@/components/layouts/container";
import { InterviewLandingSection } from "@/features/interview-config/client/components/interview-landing-section";
import { getInterviewConfig } from "@/features/interview-config/server/loaders/get-interview-config";
import { getPublicBillRespondents } from "@/features/user-topic-analysis/server/loaders/get-public-bill-respondents";
import { BillDisclaimer } from "../../../client/components/bill-detail/bill-disclaimer";
import type { BillWithContent } from "../../../shared/types";
import { BillShareButtons } from "../share/bill-share-buttons";
import { BillDetailHeader } from "./bill-detail-header";

interface BillDetailLayoutProps {
  bill: BillWithContent;
}

export async function BillDetailLayout({ bill }: BillDetailLayoutProps) {
  const [interviewConfig, respondents] = await Promise.all([
    getInterviewConfig(bill.id),
    // レポート一覧（/bills/[id]/opinions）と同じ読み込みで、件数をそろえる
    getPublicBillRespondents(bill.id),
  ]);

  return (
    <div className="container mx-auto pb-8 max-w-4xl">
      <BillDetailHeader
        bill={bill}
        hasInterviewConfig={interviewConfig != null}
        opinionCount={respondents.length}
      />

      <Container>
        {interviewConfig != null && (
          <div className="my-8">
            <InterviewLandingSection billId={bill.id} />
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
