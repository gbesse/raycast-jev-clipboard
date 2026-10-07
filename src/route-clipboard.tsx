import { Action, ActionPanel, Clipboard, Color, Detail, Icon, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { acceptResponse, buildRequest, fixtureResponse, routedText, type Route } from "./core.js";

type Decision = { route: Route; text: string; truncated: boolean };

export default function Command() {
  const [decision, setDecision] = useState<Decision>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    Clipboard.readText()
      .then((text) => {
        const request = buildRequest(text ?? "");
        setDecision({ route: acceptResponse(request, fixtureResponse(request)), text: request.observation.text, truncated: request.observation.truncated });
      })
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : String(cause)));
  }, []);

  if (error) return <Detail markdown={`# Clipboard not routed\n\n${error}`} />;
  if (!decision) return <Detail isLoading markdown="# Reading clipboard…" />;

  const output = routedText(decision.route, decision.text);
  const markdown = `# ${decision.route.label}\n\n> ${decision.text.replaceAll("\n", "\n> ")}\n\n**Why:** ${decision.route.reason}\n\n${decision.truncated ? "⚠️ Preview limited to 2,000 characters." : "The clipboard was processed locally."}`;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Route" text={{ value: decision.route.label, color: Color.Blue }} icon={Icon.ArrowRight} />
          <Detail.Metadata.Label title="Mode" text="Offline fixture" icon={Icon.Lock} />
          <Detail.Metadata.TagList title="Contract"><Detail.Metadata.TagList.Item text="1 of 4 finite routes" color={Color.Green} /></Detail.Metadata.TagList>
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action.CopyToClipboard content={output} title="Copy Routed Text" />
          <Action title="Replace Clipboard" icon={Icon.Clipboard} onAction={async () => { await Clipboard.copy(output); await showToast({ style: Toast.Style.Success, title: "Clipboard routed", message: decision.route.label }); }} />
        </ActionPanel>
      }
    />
  );
}
