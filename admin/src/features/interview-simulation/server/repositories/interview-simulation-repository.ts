import "server-only";

import { createAdminClient } from "@mirai-gikai/supabase";

/**
 * interview_report を id で 1 件取得する。
 * 既存の interview-report-repository は session_id ベースなので、
 * シミュレーション機能用にレポート ID 直接アクセスを提供する。
 */
export async function findInterviewReportById(reportId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_report")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch interview report: ${error.message}`);
  }

  return data;
}

/**
 * 議案とコンテンツを取得する
 */
export async function fetchBillWithContents(billId: string) {
  const supabase = createAdminClient();

  const { data: bill, error: billError } = await supabase
    .from("bills")
    .select("*")
    .eq("id", billId)
    .single();

  if (billError) {
    throw new Error(`Failed to fetch bill: ${billError.message}`);
  }

  const { data: contents, error: contentsError } = await supabase
    .from("bill_contents")
    .select("*")
    .eq("bill_id", billId);

  if (contentsError) {
    throw new Error(`Failed to fetch bill contents: ${contentsError.message}`);
  }

  const normalContent = contents.find((c) => c.difficulty_level === "normal");

  return {
    bill,
    billTitle: normalContent?.title ?? bill.name,
    billContent: normalContent?.content ?? "",
    billSummary: normalContent?.summary ?? "",
  };
}
