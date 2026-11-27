import { Container } from "@/components/layouts/container";
import { BillDisclaimer } from "@/features/bills/client/components/bill-detail/bill-disclaimer";
import { BillSearchOverlay } from "@/features/bills/client/components/bill-search-overlay";
import { BillsByTagSection } from "@/features/bills/server/components/bills-by-tag-section";
import { CategoryTabs } from "@/features/bills/server/components/category-tabs";
import { FeaturedBillSection } from "@/features/bills/server/components/featured-bill-section";
import { InterviewOpenBillSection } from "@/features/bills/server/components/interview-open-bill-section";
import { getBillSearchData } from "@/features/bills/server/loaders/get-bill-search-data";
import { loadHomeData } from "@/features/bills/server/loaders/load-home-data";
import { pickHomeSections } from "@/features/bills/shared/utils/pick-home-sections";

/** カテゴリタブの「注目」から飛ばす先。 */
const FEATURED_ANCHOR = "featured";

export default async function Home() {
  // ゆくゆくタグ機能がマージされたらBFFに統合する
  const [{ billsByTag, featuredBills, interviewOpenBills }, searchData] =
    await Promise.all([loadHomeData(), getBillSearchData()]);

  const { tagGroups } = pickHomeSections({
    billsByTag,
    featuredBills,
    interviewOpenBills,
    // TENJO は会期を扱わないので、注目セクションはいつも出す
    inSession: true,
  });

  return (
    <>
      {/*
        ヘッダーは fixed で、main-layout の上余白は md 以上にしか効かないため、
        モバイルではここで余白を確保する（パンくずを持つページと同じ規約）。
      */}
      <Container className="pt-24 md:pt-5">
        <div className="pt-4">
          <CategoryTabs
            billsByTag={billsByTag}
            featuredAnchor={FEATURED_ANCHOR}
          />
        </div>
        {/* 検索の入口。キーワードとテーマの両方をモーダルに並べる */}
        <div className="flex justify-end pt-2">
          <BillSearchOverlay {...searchData} />
        </div>
      </Container>

      {/* 議案一覧セクション */}
      <Container className="">
        <div className="py-10">
          <main className="flex flex-col gap-16">
            {/* AIインタビュー受付中セクション。意見を出せる法案を最初に見せる。 */}
            <InterviewOpenBillSection bills={interviewOpenBills} />

            {/* 注目の法案（TENJO は会期を扱わないので、いつも出す） */}
            <section id={FEATURED_ANCHOR}>
              <FeaturedBillSection bills={featuredBills} />
            </section>

            {/* タグ別議案一覧セクション（タグに紐づく議案を全件出す） */}
            <BillsByTagSection billsByTag={tagGroups} />
          </main>
        </div>
      </Container>

      <Container>
        {/* 免責事項 */}
        <BillDisclaimer />
      </Container>
    </>
  );
}
