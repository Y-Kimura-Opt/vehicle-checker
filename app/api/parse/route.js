export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { inputText } = body;

    if (!inputText || !inputText.trim()) {
      return Response.json({ error: "Missing input text" }, { status: 400 });
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `以下のテキストから貨物/荷物の情報を抽出し、JSON配列のみを返してください。説明や\`\`\`は不要です。

出力形式（JSON配列のみ）:
[{"l":長さcm,"w":幅cm,"h":高さcm,"q":数量,"kg":1個あたり重量kg}]

ルール:
・寸法はcm単位に変換（mm→÷10、m→×100、inch→×2.54）
・重量はkg単位に変換（lb→÷2.205、g→÷1000）
・総重量しかない場合は合計数量で割って1個あたりを算出
・数量が不明な場合は1
・重量が不明な場合は0
・寸法が読み取れない行は無視
・最大50品目まで

テキスト:
${inputText}`
        }]
      })
    });

    const data = await resp.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "Parse processing failed" }, { status: 500 });
  }
}
