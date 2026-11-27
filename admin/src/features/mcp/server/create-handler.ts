import "server-only";

import {
  createMcpHandler,
  experimental_withMcpAuth as withMcpAuth,
} from "mcp-handler";
import { registerBillsTools } from "./tools/register-bills-tools";
import { registerChatUsageTools } from "./tools/register-chat-usage-tools";
import { registerInterviewMetricsTools } from "./tools/register-interview-metrics-tools";
import { registerInterviewTools } from "./tools/register-interview-tools";
import { registerPreviewTools } from "./tools/register-preview-tools";
import { registerTagsTools } from "./tools/register-tags-tools";
import { withToolCallLogging } from "./utils/with-tool-call-logging";
import { verifyMcpToken } from "./verify-token";

export function createAdminMcpHandler() {
  const baseHandler = createMcpHandler(
    (baseServer) => {
      const server = withToolCallLogging(baseServer);
      registerBillsTools(server);
      registerChatUsageTools(server);
      registerInterviewMetricsTools(server);
      registerInterviewTools(server);
      registerPreviewTools(server);
      registerTagsTools(server);
    },
    {
      serverInfo: {
        name: "mirai-gikai-admin-mcp",
        version: "0.1.0",
      },
    },
    {
      basePath: "/api",
      verboseLogs: process.env.NODE_ENV !== "production",
    }
  );

  return withMcpAuth(baseHandler, verifyMcpToken, {
    required: true,
  });
}
