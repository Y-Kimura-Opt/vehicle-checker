export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { base64Data, mediaType } = body;

    if (!base64Data || !mediaType) {
      return Response.json({ error: "Missing image data" }, { status: 400 });
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
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
            { type: "text", text: `この画像から貨物/荷物の情報を読み取り、以下の形式のテキストのみを返してください。余計な説明は不要です。

フォーマット:
総重量：XXX kg
サイズ：
[長さ]cm×[幅]cm×[高さ]cm/[数量]pc（1個あたり[重量]kg）

・寸法はcm単位、重量はkg単位で出力
・複数品目がある場合はサイズ行を複数出力
・重量情報があれば「（1個あたりXXkg）」を付加
・画像から読み取れる情報のみ出力し、推測しない
・数量が不明な場合は1pcとする` }
          ]
        }]
      })
    });

    const data = await resp.json();
    return Response.json(data);
  } catch (e) {
    return Response.json({ error: "OCR processing failed" }, { status: 500 });
  }
}
