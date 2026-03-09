"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import FeedbackButton from "./FeedbackButton";

const T = {
  ja: {
    vKv:"軽バン", vKt:"幌車（軽）", v2t:"2Tトラック", v4t:"4Tトラック", v10:"10Tトラック", vTr:"トレーラー",
    dKv:"小口緊急配送", dKt:"小型貨物", d2t:"パレット対応", d4t:"中距離幹線", d10:"長距離幹線", dTr:"超大型貨物",
    title:"車両積載判定ツール", subtitle:"デッドスペース・シミュレーション対応",
    cargoInfo:"📋 貨物情報", lbW:"1個の重量", lbL:"長さ (L)", lbCw:"幅 (W)", lbH:"高さ (H)", lbQ:"数量",
    uPcs:"個", uKg:"kg", uCm:"cm",
    totW:"総重量", uVol:"単体容積", totV:"総容積", totQ:"合計数量",
    fixH:"天地固定（高さ方向を上向きに保持）",
    btnDone:"判定済み", btnRe:"再判定（入力変更済み）", btnGo:"判定開始",
    dirtyW:"⚠ 入力が変更されました。「再判定」ボタンを押して結果を更新してください。",
    recW:"⚠ 推奨（要注意）", rec:"💡 推奨", recMin:"— 最小適合車型",
    recTN:"※ 積載が限界に近いため、1サイズ上の車両も検討してください",
    multi:"🚛 複数台手配",
    mTot:(q,n)=>`合計 ${q}個 → ${n}台`,
    mLine:(nm,a,c)=>`${nm}：${a}個 × ${c}台`,
    mMax:(m)=>`（最大${m}個/台）`,
    trW:"⚠ トレーラーが必要",
    trEx:"1個のサイズまたは重量が軽バン〜10Tトラックの範囲を超えており、トレーラーが必要です。",
    trOk:(m)=>`✓ トレーラーで積載可能（最大${m}個）`,
    trNg:(m)=>`✗ トレーラーでも数量超過（最大${m}個） — 複数台手配が必要です`,
    trSzNg:"✗ 1個のサイズがトレーラーの荷台を超過 — 特殊車両をご検討ください",
    resT:"🚛 各車型判定結果",
    foot:"※ 荷台寸法は一般的な標準値。積載量は架装等を考慮した実用値を設定。均一サイズの直方体を前提。",
    bCaut:"⚠ 要注意", bOk:"✓ 積載可", bNg:"✗ 不可",
    bCnt:(n)=>`${n}台`,
    ldCap:"積載量", rated:(w)=>`(定格${w}kg)`, vol:"容積:", inSz:"内寸:",
    wLbl:(tw,ew)=>`重量 (${tw} / ${ew} kg)`,
    qMar:(q,m)=>`個数余裕 (${q} / ${m} 個)`, qRem:(n)=>`あと${n}個`,
    vEff:(d)=>`容積効率（デッドスペース ${d}%）`,
    sPat:"積付パターン（実使用 / 最大）",
    sVal:(nL,nW,at,q)=>`${nL}×${nW}×${at}段 = ${q}個`,
    sMax:(nH,m)=>`/ 最大${nH}段${m}個`,
    aGap:"実際の隙間",
    tgT:"⚠ 積載が限界に近い — 1サイズ上の車両も検討してください",
    tgM:"貨物サイズや荷台の実測値に誤差がある場合、積載できない可能性があります。",
    tgCr:"運送会社へ確認：", tgCrD:"実車の荷台寸法・最大積載量で積載可能か確認してください",
    tgSh:"荷主へ確認：", tgShD:"貨物の重量・寸法・梱包サイズの正確性を再確認してください",
    trCP:(p,m,q)=>`個数が最大積載の${p}%（最大${m}個中${q}個）`,
    trGp:(d,v)=>`${d}方向の隙間がわずか ${v}cm`,
    trWP:(p)=>`重量が最大積載の${p}%`,
    stI:(ti,ld)=>`📦 段積み情報（${ti}段）— 最下段荷重：${ld} kg / カートン`,
    stID:(ld)=>`荷主へカートンの耐荷重（圧縮強度）が ${ld} kg 以上であることをご確認ください。`,
    plA:(a,c)=>`${a}個積載 × ${c}台`,
    plS:(nL,nW,nH,m)=>`積付: ${nL}×${nW}×${nH}段 = 最大${m}個/台`,
    ngS:(nL,nW,nH,m)=>`最適積付: ${nL}×${nW}×${nH}段 = 最大${m}個`,
    ngW:(tw,ew)=>`⚠ 重量超過 (${tw}kg > ${ew}kg)`,
    ngQ:(m,q)=>`⚠ 数量超過 (最大${m}個 < ${q}個)`,
    ngSz:"⚠ サイズ超過（1個が荷台に入りません）",
    vzT:(nm)=>`📐 ${nm} — 積載イメージ図`,
    vzSb:(bl,bw,bh,nL,nW,nH,ld)=>`カートン ${bl}×${bw}×${bh}cm → ${nL}×${nW}×${nH}段 = ${ld}個積載`,
    vzSd:"🔍 側面図", vzTp:"🔍 上面図", vzRr:"🔍 後面図",
    vzSL:(L,H)=>`荷台 ${L}cm × 高さ ${H}cm`,
    vzTL:(L,W)=>`荷台 ${L}cm × 幅 ${W}cm`,
    vzRL:(W,H)=>`幅 ${W}cm × 高さ ${H}cm`,
    vzGap:(dim,v)=>`${dim}:${v}`,
    vzMinGap:"最小余白",
    lgB:"カートン", lgD:"デッドスペース", lgC:"キャブ",
    font:"system-ui, sans-serif",
    addLine:"+ 品目追加", delLine:"削除", clear:"クリア",
    paste:"📋 貼り付け（画像可）",
    pasteSub:"貨物情報のテキストを貼り付けてください（形式は自由）",
    pastePlace:"どんな形式でもOKです。例：\n\n80cm×74cm×116cm 12個 5kg\nL800 W740 H1160 × 10pc\nサイズ: 80x74x116, 数量12\n\nメール本文や表のコピペもそのまま貼り付けできます",
    pasteBtn:"取り込み", pasteCancel:"キャンセル",
    pasteParsing:"🔍 AI解析中...",
    pasteErr:"貨物情報を読み取れませんでした。寸法（長さ×幅×高さ）と数量を含むテキストを貼り付けてください。",
    tabText:"📋 テキスト", tabImg:"📷 画像",
    imgSub:"スクリーンショットや写真をドロップ、貼り付け、または選択してください",
    imgDrop:"画像をここにドロップ\nまたはクリックして選択",
    imgReading:"🔍 画像を読み取り中...",
    imgErr:"画像から貨物情報を読み取れませんでした。テキスト入力をお試しください。",
    imgOk:"画像から読み取った内容を下に表示しました。確認して「取り込み」を押してください。",
    lineNo:(n)=>`品目${n}`, maxLines:"※ 最大50品目",
    zoneT:(nm)=>`📐 ${nm} — ゾーン配置図`,
    zoneLn:(i,dims,q,usedL)=>`品目${i}: ${dims} ×${q}個 → L:${usedL}cm`,
    zoneRem:(l)=>`余り ${l}cm`,
    zoneNote:"※ 大品目からL方向にゾーン配置。小品目は上部空間に上積み",
    zoneStkLn:(i,dims,q)=>`↑ 品目${i}: ${dims} ×${q}個（上積み）`,
    tier:(n)=> n === 1 ? "1段目（床面）" : `${n}段目`,
    zoneFill:(f)=>`容積効率 ${f}%`,
    zoneHGap:(h,pct)=>`H余白: ${h}cm (${pct}%)`,
    zoneUsedL:(u,total)=>`L方向使用 ${u} / ${total} cm`,
    zoneW:(tw,ew)=>`重量 ${tw} / ${ew} kg`,
    znOk:"✓ 積載可", znNg:"✗ 不可", znCaut:"⚠ 要注意",
    znWOver:"⚠ 重量超過", znLOver:"⚠ L方向超過", znNoFit:"⚠ サイズ超過",
    mzTk:(n,nm)=>`${n}台目: ${nm}`,
    mzItems:(items)=> items.map(it => `品目${it.idx}×${it.q}`).join(", "),
    langBtn:"🇨🇳 中文",
  },
  zh: {
    vKv:"轻型厢货", vKt:"篷车（轻型）", v2t:"2T卡车", v4t:"4T卡车", v10:"10T卡车", vTr:"挂车",
    dKv:"小件紧急配送", dKt:"小型货物", d2t:"托盘适配", d4t:"中途干线", d10:"长途干线", dTr:"超大型货物",
    title:"车辆装载判定工具", subtitle:"空置空间模拟对应",
    cargoInfo:"📋 货物信息", lbW:"单件重量", lbL:"长 (L)", lbCw:"宽 (W)", lbH:"高 (H)", lbQ:"数量",
    uPcs:"件", uKg:"kg", uCm:"cm",
    totW:"总重量", uVol:"单件体积", totV:"总体积", totQ:"合计数量",
    fixH:"天地固定（高度方向保持朝上）",
    btnDone:"已判定", btnRe:"重新判定（已修改输入）", btnGo:"开始判定",
    dirtyW:"⚠ 输入已变更。请点击「重新判定」按钮以更新结果。",
    recW:"⚠ 推荐（需注意）", rec:"💡 推荐", recMin:"— 最小适配车型",
    recTN:"※ 装载接近极限，建议同时考虑大一号车型",
    multi:"🚛 多车调配",
    mTot:(q,n)=>`合计 ${q}件 → ${n}辆`,
    mLine:(nm,a,c)=>`${nm}：${a}件 × ${c}辆`,
    mMax:(m)=>`（最大${m}件/辆）`,
    trW:"⚠ 需用挂车",
    trEx:"单件尺寸或重量超出轻型厢货至10T卡车的范围，需要使用挂车。",
    trOk:(m)=>`✓ 挂车可装载（最大${m}件）`,
    trNg:(m)=>`✗ 挂车也超量（最大${m}件）— 需要多车调配`,
    trSzNg:"✗ 单件尺寸超出挂车车厢 — 请考虑特殊车辆",
    resT:"🚛 各车型判定结果",
    foot:"※ 车厢尺寸为一般标准值。载重量已考虑上装等因素设定实用值。以统一尺寸的长方体为前提。",
    bCaut:"⚠ 需注意", bOk:"✓ 可装载", bNg:"✗ 不可",
    bCnt:(n)=>`${n}辆`,
    ldCap:"载重量", rated:(w)=>`(额定${w}kg)`, vol:"容积:", inSz:"内尺寸:",
    wLbl:(tw,ew)=>`重量 (${tw} / ${ew} kg)`,
    qMar:(q,m)=>`数量余量 (${q} / ${m} 件)`, qRem:(n)=>`还可装${n}件`,
    vEff:(d)=>`容积效率（空置空间 ${d}%）`,
    sPat:"堆放模式（实际使用 / 最大）",
    sVal:(nL,nW,at,q)=>`${nL}×${nW}×${at}层 = ${q}件`,
    sMax:(nH,m)=>`/ 最大${nH}层${m}件`,
    aGap:"实际间隙",
    tgT:"⚠ 装载接近极限 — 建议考虑大一号车辆",
    tgM:"货物尺寸或车厢实测值存在偏差时，可能无法装载。",
    tgCr:"向运输公司确认：", tgCrD:"请确认实际车厢尺寸及最大载重是否可以装载",
    tgSh:"向货主确认：", tgShD:"请再次确认货物重量、尺寸及包装尺寸的准确性",
    trCP:(p,m,q)=>`数量达到最大装载的${p}%（最大${m}件中${q}件）`,
    trGp:(d,v)=>`${d}方向间隙仅 ${v}cm`,
    trWP:(p)=>`重量达到最大载重的${p}%`,
    stI:(ti,ld)=>`📦 堆叠信息（${ti}层）— 最底层承重：${ld} kg / 箱`,
    stID:(ld)=>`请向货主确认纸箱的耐压强度（抗压强度）达到 ${ld} kg 以上。`,
    plA:(a,c)=>`${a}件装载 × ${c}辆`,
    plS:(nL,nW,nH,m)=>`堆放: ${nL}×${nW}×${nH}层 = 最大${m}件/辆`,
    ngS:(nL,nW,nH,m)=>`最佳堆放: ${nL}×${nW}×${nH}层 = 最大${m}件`,
    ngW:(tw,ew)=>`⚠ 重量超限 (${tw}kg > ${ew}kg)`,
    ngQ:(m,q)=>`⚠ 数量超限 (最大${m}件 < ${q}件)`,
    ngSz:"⚠ 尺寸超限 (单件无法放入车厢)",
    vzT:(nm)=>`📐 ${nm} — 装载示意图`,
    vzSb:(bl,bw,bh,nL,nW,nH,ld)=>`纸箱 ${bl}×${bw}×${bh}cm → ${nL}×${nW}×${nH}层 = 装载${ld}件`,
    vzSd:"🔍 侧视图", vzTp:"🔍 俯视图", vzRr:"🔍 后视图",
    vzSL:(L,H)=>`车厢 ${L}cm × 高 ${H}cm`,
    vzTL:(L,W)=>`车厢 ${L}cm × 宽 ${W}cm`,
    vzRL:(W,H)=>`宽 ${W}cm × 高 ${H}cm`,
    vzGap:(dim,v)=>`${dim}:${v}`,
    vzMinGap:"最小余量",
    lgB:"纸箱", lgD:"空置空间", lgC:"驾驶室",
    font:"'Noto Sans SC', system-ui, sans-serif",
    addLine:"+ 添加品目", delLine:"删除", clear:"清除",
    paste:"📋 粘贴（可识图）",
    pasteSub:"请粘贴货物信息文本（任何格式均可）",
    pastePlace:"任何格式均可。例：\n\n80cm×74cm×116cm 12个 5kg\nL800 W740 H1160 × 10pc\n尺寸: 80x74x116, 数量12\n\n邮件正文或表格内容也可直接粘贴",
    pasteBtn:"导入", pasteCancel:"取消",
    pasteParsing:"🔍 AI解析中...",
    pasteErr:"无法识别货物信息。请粘贴包含尺寸（长×宽×高）和数量的文本。",
    tabText:"📋 文本", tabImg:"📷 图片",
    imgSub:"拖放、粘贴或选择截图/照片",
    imgDrop:"将图片拖放到此处\n或点击选择",
    imgReading:"🔍 正在识别图片...",
    imgErr:"无法从图片中识别货物信息。请尝试文本输入。",
    imgOk:"已从图片中识别内容，请确认后点击「导入」。",
    lineNo:(n)=>`品目${n}`, maxLines:"※ 最多50个品目",
    zoneT:(nm)=>`📐 ${nm} — 分区配置图`,
    zoneLn:(i,dims,q,usedL)=>`品目${i}: ${dims} ×${q}件 → L:${usedL}cm`,
    zoneRem:(l)=>`剩余 ${l}cm`,
    zoneNote:"※ 大品目优先沿L方向分区配置，小品目叠放于上方空间",
    zoneStkLn:(i,dims,q)=>`↑ 品目${i}: ${dims} ×${q}件（叠放）`,
    tier:(n)=> n === 1 ? "第1层（地面）" : `第${n}层`,
    zoneFill:(f)=>`容积效率 ${f}%`,
    zoneHGap:(h,pct)=>`H余量: ${h}cm (${pct}%)`,
    zoneUsedL:(u,total)=>`L方向使用 ${u} / ${total} cm`,
    zoneW:(tw,ew)=>`重量 ${tw} / ${ew} kg`,
    znOk:"✓ 可装载", znNg:"✗ 不可", znCaut:"⚠ 需注意",
    znWOver:"⚠ 重量超限", znLOver:"⚠ L方向超限", znNoFit:"⚠ 尺寸超限",
    mzTk:(n,nm)=>`第${n}辆: ${nm}`,
    mzItems:(items)=> items.map(it => `品目${it.idx}×${it.q}`).join(", "),
    langBtn:"🇯🇵 日本語",
  },
};
const VN = { kv:["vKv","dKv"], kt:["vKt","dKt"], "2t":["v2t","d2t"], "4t":["v4t","d4t"], "10":["v10","d10"], tr:["vTr","dTr"] };
function vn(v,t){ const k=VN[v.id]; return k?t[k[0]]:v.id; }
function vd(v,t){ const k=VN[v.id]; return k?t[k[1]]:""; }

const TRUCKS = [
  { id:"kv", w:350,  ew:350,  L:180, W:130, H:120 },
  { id:"kt", w:350,  ew:350,  L:200, W:140, H:180 },
  { id:"2t", w:2000, ew:2000, L:430, W:170, H:200 },
  { id:"4t", w:4000, ew:2300, L:620, W:230, H:230 },
  { id:"10", w:10000,ew:12500,L:960, W:235, H:250 },
];

const TRAILER = { id:"tr", w:20000,ew:17000,L:1200,W:235, H:270 };

function simulate(v, cl, cw, ch, qty, fixH = false) {
  const rots = fixH
    ? [[cl,cw,ch],[cw,cl,ch]]  // H fixed upright: only rotate L and W
    : [[cl,cw,ch],[cw,cl,ch],[cl,ch,cw],[ch,cl,cw],[cw,ch,cl],[ch,cw,cl]];
  let best = null;
  for (const [bl, bw, bh] of rots) {
    if (bl > v.L || bw > v.W || bh > v.H) continue;
    const nL = Math.floor(v.L / bl);
    const nW = Math.floor(v.W / bw);
    const nH = Math.floor(v.H / bh);
    const max = nL * nW * nH;
    if (max <= 0) continue;
    const loaded = Math.min(qty, max);
    const fill = (bl * bw * bh * loaded) / (v.L * v.W * v.H) * 100;
    const ok = max >= qty;
    const r = { bl, bw, bh, nL, nW, nH, max, loaded, ok, fill, dead: 100 - fill,
      gL: v.L - nL * bl, gW: v.W - nW * bw, gH: v.H - nH * bh };
    if (!best || (r.ok && !best.ok) || (r.ok === best.ok && r.fill > best.fill)) best = r;
  }
  return best;
}

// --- Zone-based mixed cargo simulation with stacking optimization ---
function getRots(cl, cw, ch, fixH) {
  return fixH
    ? [[cl,cw,ch],[cw,cl,ch]]
    : [[cl,cw,ch],[cw,cl,ch],[cl,ch,cw],[ch,cl,cw],[cw,ch,cl],[ch,cw,cl]];
}

// Single allocation pass with given item order and strategy
function tryAlloc(v, lines, fixH, stackOpt) {
  const zones = [];
  // Pre-compute min box height per line (for stacking target)
  const lineMinBh = lines.map(ln => {
    if (ln.q <= 0 || ln.l <= 0 || ln.cw <= 0 || ln.h <= 0) return Infinity;
    const rots = getRots(ln.l, ln.cw, ln.h, fixH);
    let m = Infinity;
    for (const [,,bh] of rots) { if (bh <= v.H) m = Math.min(m, bh); }
    return m;
  });

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (line.q <= 0 || line.l <= 0 || line.cw <= 0 || line.h <= 0) continue;
    let qtyLeft = line.q;
    const rots = getRots(line.l, line.cw, line.h, fixH);

    // Phase 1: try to stack in existing zones' top space
    for (const zone of zones) {
      if (qtyLeft <= 0) break;
      if (zone.topH <= 0) continue;
      let bestFit = null;
      for (const [bl, bw, bh] of rots) {
        if (bl > zone.usedL || bw > v.W || bh > zone.topH) continue;
        const nL = Math.floor(zone.usedL / bl);
        const nW = Math.floor(v.W / bw);
        const nH = Math.floor(zone.topH / bh);
        const max = nL * nW * nH;
        if (max > 0 && (!bestFit || max > bestFit.max)) {
          bestFit = { bl, bw, bh, nL, nW, nH, max, usedH: nH * bh };
        }
      }
      if (bestFit) {
        const placed = Math.min(qtyLeft, bestFit.max);
        zone.topItems.push({ line, placed, ...bestFit });
        zone.topH -= bestFit.usedH;
        qtyLeft -= placed;
      }
    }

    // Phase 2: allocate new L zone for remaining
    if (qtyLeft > 0) {
      const remainL = v.L - zones.reduce((s, z) => s + z.usedL, 0);

      // Find min bh among future items (for stack-optimized nH)
      let futureMinBh = Infinity;
      if (stackOpt) {
        for (let j = li + 1; j < lines.length; j++) futureMinBh = Math.min(futureMinBh, lineMinBh[j]);
      }

      let bestZ = null;
      for (const [bl, bw, bh] of rots) {
        if (bw > v.W || bh > v.H) continue;
        const nW = Math.floor(v.W / bw);
        const maxNH = Math.floor(v.H / bh);

        // Determine nH candidates: always try max, optionally try stack-optimized
        const nhSet = new Set([maxNH]);
        if (stackOpt && futureMinBh < Infinity) {
          for (let nh = maxNH; nh >= 1; nh--) {
            if (v.H - nh * bh >= futureMinBh) { nhSet.add(nh); break; }
          }
        }

        for (const nH of nhSet) {
          if (nH <= 0) continue;
          const perSlice = nW * nH;
          if (perSlice <= 0) continue;
          const nL = Math.ceil(qtyLeft / perSlice);
          const usedL = nL * bl;
          if (usedL > remainL) continue;
          const topH = v.H - nH * bh;
          const hasRoom = stackOpt && topH >= futureMinBh;
          const bestHasRoom = bestZ && stackOpt && bestZ.topH >= futureMinBh;
          // In stackOpt mode: prefer having stacking room; among equals minimize usedL
          if (!bestZ ||
              (hasRoom && !bestHasRoom) ||
              (hasRoom === bestHasRoom && usedL < bestZ.usedL) ||
              (hasRoom === bestHasRoom && usedL === bestZ.usedL && topH > bestZ.topH)) {
            bestZ = { bl, bw, bh, nW, nH, nL, perSlice, usedL, qty: qtyLeft,
                      topH, max: nL * perSlice };
          }
        }
      }
      if (!bestZ) return null;
      zones.push({ ...bestZ, line, topItems: [] });
    }
  }

  const totalUsedL = zones.reduce((s, z) => s + z.usedL, 0);
  if (totalUsedL > v.L) return null;
  let totalVol = 0;
  for (const line of lines) {
    if (line.q > 0) totalVol += line.l * line.cw * line.h * line.q;
  }
  return { zones, remainL: v.L - totalUsedL, usedL: totalUsedL, totalVol,
           fill: (totalVol / (v.L * v.W * v.H)) * 100 };
}

// Try 2 strategies: large-first × (standard / stack-optimized), pick best usedL
// Large items always go on the floor first for stability
function simulateZone(v, sortedLines, fixH) {
  const results = [
    tryAlloc(v, sortedLines, fixH, false),
    tryAlloc(v, sortedLines, fixH, true),
  ].filter(Boolean);
  if (results.length === 0) return null;
  results.sort((a, b) => a.usedL - b.usedL);
  return results[0];
}

// Greedy fill: pack as many items as possible into one vehicle
// Returns { zoneResult, placed: [{...line, q}], remaining: [{...line, q}] } or null
function greedyFillZone(v, sortedLines, fixH) {
  const lines = sortedLines.filter(ln => ln.q > 0);
  if (lines.length === 0) return null;

  const totalW = lines.reduce((s, ln) => s + ln.w * ln.q, 0);
  // Try full fit first
  if (totalW <= v.ew) {
    const full = simulateZone(v, lines, fixH);
    if (full) return { zoneResult: full, placed: lines.map(ln => ({...ln})), remaining: [] };
  }

  // Sequential greedy: add items one type at a time (large first), binary search max qty
  function greedyPass(lines, initCurrent, initWeight) {
    let current = [...initCurrent];
    let curWeight = initWeight;
    for (const ln of lines) {
      const maxByW = ln.w > 0 ? Math.floor((v.ew - curWeight) / ln.w) : ln.q;
      const upper = Math.min(ln.q, maxByW);
      if (upper <= 0) continue;
      let lo = 0, hi = upper;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        const test = [...current, {...ln, q: mid}];
        const r = simulateZone(v, test, fixH);
        if (r) lo = mid; else hi = mid - 1;
      }
      if (lo > 0) { current.push({...ln, q: lo}); curWeight += ln.w * lo; }
    }
    return current;
  }

  const initial = greedyPass(lines, [], 0);
  if (initial.length === 0) return null;

  // Column-trim optimization: for each placed item, try reducing to previous
  // full-column boundary and use freed L space for more items
  let bestCurrent = initial;
  let bestTotal = initial.reduce((s, p) => s + p.q, 0);

  const initZR = simulateZone(v, initial, fixH);
  if (initZR) {
    for (const zone of initZR.zones) {
      const perSlice = zone.nW * zone.nH;
      if (perSlice <= 0) continue;
      const fullCols = Math.floor(zone.qty / perSlice);
      const trimmedQty = fullCols * perSlice;
      if (trimmedQty >= zone.qty || trimmedQty <= 0) continue; // no partial column

      // Build trimmed allocation
      const trimmed = initial.map(p =>
        p.id === zone.line.id ? {...p, q: trimmedQty} : {...p}
      ).filter(p => p.q > 0);
      const trimWeight = trimmed.reduce((s, p) => s + p.w * p.q, 0);

      // Find remaining items to fill freed space (exclude the trimmed item)
      const placedIds = {};
      for (const p of trimmed) placedIds[p.id] = p.q;
      const remLines = lines
        .filter(ln => ln.id !== zone.line.id)  // skip trimmed item
        .map(ln => {
          const already = placedIds[ln.id] || 0;
          return {...ln, q: ln.q - already};
        }).filter(ln => ln.q > 0);

      const refilled = greedyPass(remLines, trimmed, trimWeight);
      // Consolidate duplicate ids
      const merged = [];
      for (const p of refilled) {
        const ex = merged.find(m => m.id === p.id);
        if (ex) ex.q += p.q; else merged.push({...p});
      }
      const refillTotal = merged.reduce((s, p) => s + p.q, 0);
      if (refillTotal > bestTotal && simulateZone(v, merged, fixH)) {
        bestCurrent = merged;
        bestTotal = refillTotal;
      }
    }
  }

  const zoneResult = simulateZone(v, bestCurrent, fixH);
  if (!zoneResult) return null;
  // Sum placed qty per id (handle potential duplicates)
  const placedQty = {};
  for (const p of bestCurrent) placedQty[p.id] = (placedQty[p.id] || 0) + p.q;
  const remaining = [];
  for (const ln of lines) {
    const rem = ln.q - (placedQty[ln.id] || 0);
    if (rem > 0) remaining.push({...ln, q: rem});
  }
  return { zoneResult, placed: bestCurrent, remaining };
}


// --- Stacking Visualization with Truck Shape ---
function StackingViz({ vehicle, stacking, qty, t }) {
  if (!vehicle || !stacking) return null;
  const { bl, bw, bh, nL, nW, nH, gL, gW, gH } = stacking;

  const layerColors = ["#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e","#ef4444","#f97316","#eab308"];
  const cabColor = "#475569";
  const cabLight = "#64748b";
  const frameColor = "#94a3b8";
  const wheelColor = "#334155";
  const bedBg = "#f1f5f9";
  const deadBg = "#fef2f2";

  // --- Scaling ---
  const bedMaxPx = 280;
  const sideScale = Math.min(bedMaxPx / vehicle.L, 140 / vehicle.H);
  const bedW = vehicle.L * sideScale;
  const bedH = vehicle.H * sideScale;
  const cabW = Math.max(bedW * 0.18, 36);
  const cabH = bedH * 0.7;
  const wheelR = Math.max(bedH * 0.12, 10);

  const topScale = Math.min(bedMaxPx / vehicle.L, 100 / vehicle.W);
  const topBedW = vehicle.L * topScale;
  const topBedH = vehicle.W * topScale;
  const topCabW = Math.max(topBedW * 0.18, 30);
  const topCabH = topBedH * 0.75;

  const frontScale = Math.min(160 / vehicle.W, 140 / vehicle.H);
  const fBedW = vehicle.W * frontScale;
  const fBedH = vehicle.H * frontScale;
  const fWheelR = Math.max(fBedH * 0.12, 10);

  // --- Box builders ---
  // Real loading order: layer by layer from bottom. Within each layer, fill L then W.
  const perLayer = nL * nW;
  const fullLayers = Math.floor(qty / perLayer);
  const remainder = qty % perLayer;
  const actualTiers = fullLayers + (remainder > 0 ? 1 : 0);

  function buildSideBoxes() {
    const boxes = [];
    for (let k = 0; k < actualTiers; k++) {
      const isPartial = k === fullLayers && remainder > 0;
      const lCount = isPartial ? Math.min(nL, remainder) : nL;
      const c = layerColors[k % layerColors.length];
      for (let i = 0; i < lCount; i++) {
        boxes.push(<div key={`s${i}-${k}`} style={{
          position:"absolute", left: i*bl*sideScale+1, bottom: k*bh*sideScale+1,
          width: bl*sideScale-2, height: bh*sideScale-2,
          background: c+"25", border:`1px solid ${c}`, borderRadius:1,
        }}/>);
      }
    } return boxes;
  }
  function buildTopBoxes() {
    const boxes = [];
    for (let i = 0; i < nL; i++) {
      for (let j = 0; j < nW; j++) {
        const idx = j * nL + i;
        const tiers = fullLayers + (remainder > 0 && idx < remainder ? 1 : 0);
        if (tiers <= 0) continue;
        boxes.push(<div key={`t${i}-${j}`} style={{
          position:"absolute", left: i*bl*topScale+1, top: j*bw*topScale+1,
          width: bl*topScale-2, height: bw*topScale-2,
          background: layerColors[0]+"30", border:`1px solid ${layerColors[0]}`, borderRadius:1,
          fontSize:8, display:"flex", alignItems:"center", justifyContent:"center",
          color: layerColors[0], fontWeight:600,
        }}>×{tiers}</div>);
      }
    } return boxes;
  }
  function buildFrontBoxes() {
    const boxes = [];
    // Rear view: mirror W axis. Dead space (gW) on left, boxes packed to right.
    const offsetX = gW * frontScale;
    for (let k = 0; k < actualTiers; k++) {
      const isPartial = k === fullLayers && remainder > 0;
      const wCount = isPartial ? Math.ceil(remainder / nL) : nW;
      const c = layerColors[k % layerColors.length];
      for (let j = 0; j < wCount; j++) {
        const mirrorJ = nW - 1 - j;
        boxes.push(<div key={`f${j}-${k}`} style={{
          position:"absolute", left: offsetX + mirrorJ*bw*frontScale+1, bottom: k*bh*frontScale+1,
          width: bw*frontScale-2, height: bh*frontScale-2,
          background: c+"25", border:`1px solid ${c}`, borderRadius:1,
        }}/>);
      }
    } return boxes;
  }

  const Wheel = ({size, style}) => (
    <div style={{ width:size*2, height:size*2, borderRadius:"50%", background:wheelColor,
      border:"3px solid #1e293b", boxShadow:"inset 0 0 0 3px #64748b", ...style }} />
  );

  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:16, marginBottom:16 }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:4 }}>
        {t.vzT(vn(vehicle,t))}
      </div>
      <div style={{ fontSize:11, color:"#94a3b8", marginBottom:14 }}>
        {t.vzSb(bl,bw,bh,nL,nW,nH,stacking.loaded)}
      </div>

      <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-end" }}>

        {/* ===== SIDE VIEW ===== */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", marginBottom:6, textAlign:"center" }}>{t.vzSd}</div>
          <div style={{ position:"relative", width: cabW + bedW + 8, height: bedH + wheelR + 16 }}>
            {/* Cab */}
            <div style={{
              position:"absolute", left:0, bottom: wheelR + 4,
              width: cabW, height: cabH,
              background: cabColor, borderRadius:"8px 4px 0 0",
              display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"center", paddingTop:4,
            }}>
              {/* Windshield */}
              <div style={{ width: cabW*0.7, height: cabH*0.35, background:"#bfdbfe",
                borderRadius:"4px 2px 0 0", border:"1px solid #93c5fd" }} />
              {/* Door line */}
              <div style={{ width:"70%", height:1, background:"#64748b", marginTop: cabH*0.15 }} />
            </div>

            {/* Cargo bed frame */}
            <div style={{
              position:"absolute", left: cabW + 4, bottom: wheelR + 4,
              width: bedW, height: bedH,
              background: bedBg, border:`2px solid ${frameColor}`, borderRadius:"2px 2px 0 0",
              overflow:"hidden",
            }}>
              {/* Cargo boxes */}
              {buildSideBoxes()}
              {/* Dead space indicators */}
              {gL > 0 && <div style={{ position:"absolute", right:0, top:0, width:gL*sideScale, height:"100%", background:deadBg, borderLeft:"1px dashed #fca5a5" }}/>}
              {(() => { const unusedH = vehicle.H - actualTiers * bh; return unusedH > 0 && <div style={{ position:"absolute", top:0, left:0, width:nL*bl*sideScale, height:unusedH*sideScale, background:deadBg, borderBottom:"1px dashed #fca5a5" }}/>; })()}
            </div>

            {/* Chassis bar */}
            <div style={{
              position:"absolute", left:0, bottom: wheelR + 2,
              width: cabW + bedW + 4, height:3,
              background: cabLight, borderRadius:2,
            }}/>

            {/* Wheels */}
            <Wheel size={wheelR} style={{ position:"absolute", left: cabW*0.3, bottom:0 }} />
            <Wheel size={wheelR} style={{ position:"absolute", left: cabW + bedW*0.2, bottom:0 }} />
            <Wheel size={wheelR} style={{ position:"absolute", left: cabW + bedW*0.75, bottom:0 }} />

            {/* Ground line */}
            <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:1, background:"#e2e8f0" }}/>
          </div>
          <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:4 }}>
            {t.vzSL(vehicle.L,vehicle.H)}
          </div>
        </div>

        {/* ===== TOP VIEW ===== */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", marginBottom:6, textAlign:"center" }}>{t.vzTp}</div>
          <div style={{ position:"relative", width: topCabW + topBedW + 8, height: Math.max(topBedH, topCabH) + 4 }}>
            {/* Cab top */}
            <div style={{
              position:"absolute", left:0,
              top: (Math.max(topBedH, topCabH) - topCabH) / 2,
              width: topCabW, height: topCabH,
              background: cabColor, borderRadius:"6px 3px 3px 6px",
            }}>
              {/* Windshield hint */}
              <div style={{
                position:"absolute", left:2, top:"15%",
                width: topCabW*0.3, height:"70%",
                background:"#bfdbfe", borderRadius:"3px 0 0 3px", border:"1px solid #93c5fd",
              }}/>
            </div>

            {/* Cargo bed top */}
            <div style={{
              position:"absolute", left: topCabW + 4, top: (Math.max(topBedH, topCabH) - topBedH) / 2,
              width: topBedW, height: topBedH,
              background: bedBg, border:`2px solid ${frameColor}`, borderRadius:2,
              overflow:"hidden",
            }}>
              {buildTopBoxes()}
              {gL > 0 && <div style={{ position:"absolute", right:0, top:0, width:gL*topScale, height:"100%", background:deadBg, borderLeft:"1px dashed #fca5a5" }}/>}
              {gW > 0 && <div style={{ position:"absolute", bottom:0, left:0, width:nL*bl*topScale, height:gW*topScale, background:deadBg, borderTop:"1px dashed #fca5a5" }}/>}
            </div>
          </div>
          <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:4 }}>
            {t.vzTL(vehicle.L,vehicle.W)}
          </div>
        </div>

        {/* ===== REAR VIEW ===== */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", marginBottom:6, textAlign:"center" }}>{t.vzRr}</div>
          <div style={{ position:"relative", width: fBedW + 16, height: fBedH + fWheelR + 20 }}>
            {/* Truck body frame */}
            <div style={{
              position:"absolute", left:4, bottom: fWheelR + 4,
              width: fBedW + 8, height: fBedH + 6,
              background: frameColor, borderRadius:"3px 3px 0 0",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {/* Cargo opening */}
              <div style={{
                width: fBedW, height: fBedH,
                background: bedBg, border:`2px solid ${cabLight}`, borderRadius:2,
                position:"relative", overflow:"hidden",
              }}>
                {buildFrontBoxes()}
                {gW > 0 && <div style={{ position:"absolute", left:0, top:0, width:gW*frontScale, height:"100%", background:deadBg, borderRight:"1px dashed #fca5a5" }}/>}
                {(() => { const unusedH = vehicle.H - actualTiers * bh; return unusedH > 0 && <div style={{ position:"absolute", top:0, right:0, width:nW*bw*frontScale, height:unusedH*frontScale, background:deadBg, borderBottom:"1px dashed #fca5a5" }}/>; })()}
              </div>
            </div>

            {/* Rear bumper */}
            <div style={{
              position:"absolute", left:2, bottom: fWheelR + 2,
              width: fBedW + 12, height:4,
              background: cabLight, borderRadius:2,
            }}/>

            {/* Rear lights */}
            <div style={{ position:"absolute", left:5, bottom: fWheelR + 8, width:6, height:10, background:"#ef4444", borderRadius:2 }}/>
            <div style={{ position:"absolute", right:5, bottom: fWheelR + 8, width:6, height:10, background:"#ef4444", borderRadius:2 }}/>

            {/* Wheels */}
            <Wheel size={fWheelR} style={{ position:"absolute", left: 6, bottom:0 }} />
            <Wheel size={fWheelR} style={{ position:"absolute", right: 6, bottom:0 }} />

            {/* Ground */}
            <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:1, background:"#e2e8f0" }}/>
          </div>
          <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:4 }}>
            {t.vzRL(vehicle.W,vehicle.H)}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:14, marginTop:12, fontSize:10, color:"#64748b", justifyContent:"center", flexWrap:"wrap" }}>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:12, height:12, background:layerColors[0]+"30", border:`1px solid ${layerColors[0]}`, borderRadius:2, display:"inline-block" }}/>
          {t.lgB}
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:12, height:12, background:deadBg, border:"1px dashed #fca5a5", borderRadius:2, display:"inline-block" }}/>
          {t.lgD}
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:12, height:12, background:cabColor, borderRadius:2, display:"inline-block" }}/>
          {t.lgC}
        </span>
      </div>
    </div>
  );
}

function Bar({ pct, color }) {
  return (
    <div style={{ height: 5, background: "#e2e8f0", borderRadius: 3, overflow: "hidden", marginTop: 3 }}>
      <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 3, transition: "width 0.3s" }} />
    </div>
  );
}

function Card({ v, cargo, plan, t }) {
  const tw = cargo.w * cargo.q;
  const effW = v.ew;
  const wOk = tw <= effW;
  const st = simulate(v, cargo.l, cargo.cw, cargo.h, cargo.q, cargo.fixH);
  const fits = st && st.ok;
  const ok = wOk && fits;
  const wPct = (tw / effW) * 100;
  const vol = (v.L * v.W * v.H / 1e6).toFixed(1);

  // Check if this vehicle is part of the recommended multi-truck plan
  const planEntry = plan ? plan.find(p => p.vehicle.id === v.id) : null;
  const isInPlan = !!planEntry;

  // Calculate actual tiers and real gaps based on actual usage
  const perLayer = ok && st ? st.nL * st.nW : 0;
  const actualTiers = perLayer > 0 ? Math.ceil(cargo.q / perLayer) : 0;
  const actualGapH = ok && st ? v.H - (actualTiers * st.bh) : 0;
  const actualGapL = st ? st.gL : 0;
  const actualGapW = st ? st.gW : 0;

  // Tight-fit warning
  const capacityPct = ok && st ? (cargo.q / st.max) * 100 : 0;
  const hasSmallGap = ok && st && (
    (actualGapL > 0 && actualGapL < 5) ||
    (actualGapW > 0 && actualGapW < 5) ||
    (actualGapH > 0 && actualGapH < 5)
  );
  const tight = ok && st && (
    capacityPct >= 80 || (hasSmallGap && capacityPct >= 50) || wPct > 85
  );
  const tightReasons = [];
  if (ok && st) {
    if (capacityPct >= 80) tightReasons.push(t.trCP(capacityPct.toFixed(0),st.max,cargo.q));
    if (hasSmallGap && capacityPct >= 50) {
      if (actualGapL > 0 && actualGapL < 5) tightReasons.push(t.trGp("L",actualGapL));
      if (actualGapW > 0 && actualGapW < 5) tightReasons.push(t.trGp("W",actualGapW));
      if (actualGapH > 0 && actualGapH < 5) tightReasons.push(t.trGp("H",actualGapH));
    }
    if (wPct > 85) tightReasons.push(t.trWP(wPct.toFixed(0)));
  }

  const borderColor = ok ? (tight ? "#f59e0b" : "#22c55e") : isInPlan ? "#93c5fd" : "#e2e8f0";
  const bgColor = ok ? (tight ? "#fffbeb" : "#f0fdf4") : isInPlan ? "#eff6ff" : "#fff";
  const badgeColor = ok ? (tight ? "#f59e0b" : "#22c55e") : isInPlan ? "#2563eb" : "#ef4444";
  const badgeText = ok ? (tight ? t.bCaut : t.bOk) : isInPlan ? t.bCnt(planEntry.count) : t.bNg;

  return (
    <div style={{
      background: bgColor,
      border: ok || isInPlan ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
      borderRadius: 10, padding: 14,
      opacity: ok || isInPlan ? 1 : 0.5,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{vn(v,t)}</span>
          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 6 }}>{vd(v,t)}</span>
        </div>
        <span style={{
          background: badgeColor,
          color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "3px 8px", borderRadius: 12,
        }}>
          {badgeText}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 11, color: "#64748b", marginBottom: 6 }}>
        <div>
          <span style={{ color: "#64748b" }}>{t.ldCap}</span>
          <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 13 }}>
            <b style={{ color: "#1e293b" }}>{effW.toLocaleString()}kg</b>
            {v.w !== v.ew && <span style={{ fontSize: 9, color: "#94a3b8", marginLeft: 3 }}>{t.rated(v.w.toLocaleString())}</span>}
          </div>
        </div>
        <div>{t.vol} <b style={{ color: "#1e293b" }}>{vol}m³</b></div>
        <div>{t.inSz} <b style={{ color: "#1e293b" }}>{v.L}×{v.W}×{v.H}</b></div>
      </div>

      {ok && st && (
        <div style={{ background: tight ? "#fefce8" : "#f8fafc", borderRadius: 6, padding: 10, marginTop: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b" }}>
            <span>{t.wLbl(tw.toLocaleString(),effW.toLocaleString())}</span>
            <span style={{ fontWeight: 600, color: wPct > 100 ? "#ef4444" : wPct > 80 ? "#f59e0b" : "#22c55e" }}>{wPct.toFixed(0)}%</span>
          </div>
          <Bar pct={wPct} color={wPct > 100 ? "#ef4444" : wPct > 80 ? "#f59e0b" : "#22c55e"} />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginTop: 6 }}>
            <span>{t.qMar(cargo.q,st.max)}</span>
            <span style={{ fontWeight: 600, color: capacityPct > 80 ? "#f59e0b" : "#22c55e" }}>{t.qRem(st.max-cargo.q)}</span>
          </div>
          <Bar pct={capacityPct} color={capacityPct > 80 ? "#f59e0b" : "#22c55e"} />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748b", marginTop: 6 }}>
            <span>{t.vEff(st.dead.toFixed(1))}</span>
            <span style={{ fontWeight: 600, color: "#3b82f6" }}>{st.fill.toFixed(1)}%</span>
          </div>
          <Bar pct={st.fill} color="#3b82f6" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8, fontSize: 11 }}>
            <div>
              <div style={{ color: "#94a3b8", fontSize: 10 }}>{t.sPat}</div>
              <div style={{ fontWeight: 700, color: "#1e293b" }}>
                {t.sVal(st.nL,st.nW,actualTiers,cargo.q)}
                <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 10, marginLeft: 4 }}>{t.sMax(st.nH,st.max)}</span>
              </div>
            </div>
            <div>
              <div style={{ color: "#94a3b8", fontSize: 10 }}>{t.aGap}</div>
              <div style={{ fontWeight: 700, color: actualGapL + actualGapW + actualGapH > 0 ? "#f59e0b" : "#22c55e" }}>
                L{actualGapL}cm / W{actualGapW}cm / H{actualGapH}cm
              </div>
            </div>
          </div>

          {tight && tightReasons.length > 0 && (
            <div style={{
              marginTop: 8, background: "#fef3c7", border: "1px solid #fbbf24",
              borderRadius: 6, padding: "8px 10px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 3 }}>
                {t.tgT}
              </div>
              {tightReasons.map((r, i) => (
                <div key={i} style={{ fontSize: 10, color: "#92400e", marginTop: 1 }}>・{r}</div>
              ))}
              <div style={{ fontSize: 10, color: "#b45309", marginTop: 4 }}>
                {t.tgM}
              </div>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{
                  background: "#fff7ed", border: "1px solid #fdba74", borderRadius: 4,
                  padding: "5px 8px", fontSize: 10, color: "#9a3412",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 13 }}>🚛</span>
                  <span><b>{t.tgCr}</b>{t.tgCrD}</span>
                </div>
                <div style={{
                  background: "#fff7ed", border: "1px solid #fdba74", borderRadius: 4,
                  padding: "5px 8px", fontSize: 10, color: "#9a3412",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 13 }}>📦</span>
                  <span><b>{t.tgSh}</b>{t.tgShD}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom carton load warning: actual tiers 3+, load 30kg+ */}
          {(() => {
            const perLayer = st.nL * st.nW;
            const actualTiers = perLayer > 0 ? Math.ceil(cargo.q / perLayer) : 0;
            const bottomLoad = cargo.w * (actualTiers - 1);
            if (actualTiers >= 3 && bottomLoad >= 30) return (
              <div style={{
                marginTop: 8, background: "#f8fafc", border: "1px solid #cbd5e1",
                borderRadius: 6, padding: "8px 10px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 3 }}>
                  {t.stI(actualTiers,bottomLoad.toFixed(1))}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 3 }}>
                  {t.stID(bottomLoad.toFixed(1))}
                </div>
              </div>
            );
            return null;
          })()}
        </div>
      )}

      {/* Plan vehicle info */}
      {isInPlan && st && (
        <div style={{ fontSize: 11, color: "#2563eb", marginTop: 4, background: "#f0f7ff", borderRadius: 6, padding: "8px 10px" }}>
          <div>{t.plA(planEntry.assigned,planEntry.count)}</div>
          <div style={{ color: "#64748b", fontSize: 10, marginTop: 3 }}>
            {t.plS(st.nL,st.nW,st.nH,st.max)}
          </div>
        </div>
      )}

      {/* NG reasons (not in plan) */}
      {!ok && !isInPlan && st && (
        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, background: "#f8fafc", borderRadius: 6, padding: "6px 10px" }}>
          {t.ngS(st.nL,st.nW,st.nH,st.max)}
        </div>
      )}

      {!ok && !isInPlan && !wOk && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{t.ngW(tw.toLocaleString(),effW.toLocaleString())}</div>}
      {!ok && !isInPlan && !fits && st && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>{t.ngQ(st.max,cargo.q)}</div>}
      {!st && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}>{t.ngSz}</div>}
    </div>
  );
}

function Input({ label, unit, val, set, min = 0, step = 1 }) {
  const [text, setText] = useState(String(val));
  useEffect(() => { setText(String(val)); }, [val]);
  const commit = (v) => { const n = parseFloat(v); set(isNaN(n) ? 0 : n); };
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 3 }}>{label}</div>
      <div style={{ position: "relative" }}>
        <input type="text" inputMode="decimal" value={text}
          onChange={e => { setText(e.target.value); const n = parseFloat(e.target.value); if (!isNaN(n)) set(n); }}
          onBlur={() => { const n = parseFloat(text); if (isNaN(n) || n < min) { setText(String(min)); set(min); } else { setText(String(n)); set(n); } }}
          style={{
            width: "100%", boxSizing: "border-box",
            border: "1px solid #d1d5db", borderRadius: 6,
            padding: "8px 32px 8px 10px", fontSize: 14, fontWeight: 600,
            outline: "none",
          }}
        />
        <span style={{
          position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
          fontSize: 11, color: "#94a3b8", fontWeight: 600,
        }}>{unit}</span>
      </div>
    </div>
  );
}

// --- Zone Visualization for mixed cargo ---
function ZoneViz({ vehicle, zoneResult, sortedLines, origLines, t }) {
  if (!vehicle || !zoneResult) return null;
  const { zones, remainL } = zoneResult;

  const zColors = ["#3b82f6","#8b5cf6","#f59e0b","#10b981","#ec4899","#f97316","#06b6d4","#ef4444","#6366f1","#84cc16"];
  // Color by original input order
  const colorMap = {};
  origLines.forEach((ln, i) => { colorMap[ln.id] = zColors[i % zColors.length]; });
  const origIdx = (line) => origLines.findIndex(ln => ln.id === line.id) + 1;

  const cabColor = "#475569", cabLight = "#64748b", frameColor = "#94a3b8", wheelColor = "#334155";
  const bedBg = "#f1f5f9", deadBg = "#fef2f2";

  // --- Scaling (same as StackingViz) ---
  const bedMaxPx = 280;
  const sideScale = Math.min(bedMaxPx / vehicle.L, 140 / vehicle.H);
  const bedW = vehicle.L * sideScale;
  const bedH = vehicle.H * sideScale;
  const cabW = Math.max(bedW * 0.18, 36);
  const cabH = bedH * 0.7;
  const wheelR = Math.max(bedH * 0.12, 10);

  const topScale = Math.min(bedMaxPx / vehicle.L, 100 / vehicle.W);
  const topBedW = vehicle.L * topScale;
  const topBedH = vehicle.W * topScale;
  const topCabW = Math.max(topBedW * 0.18, 30);
  const topCabH = topBedH * 0.75;

  const frontScale = Math.min(160 / vehicle.W, 140 / vehicle.H);
  const fBedW = vehicle.W * frontScale;
  const fBedH = vehicle.H * frontScale;
  const fWheelR = Math.max(fBedH * 0.12, 10);

  // --- Build zone blocks for side view (L×H) ---
  // Helper: CSS grid lines for individual boxes within a zone
  function boxGrid(colPx, rowPx, color) {
    const lc = color + "70";
    const parts = [];
    if (colPx > 6) parts.push(
      `repeating-linear-gradient(90deg, transparent, transparent ${colPx - 1}px, ${lc} ${colPx - 1}px, ${lc} ${colPx + 0.5}px)`
    );
    if (rowPx > 6) parts.push(
      `repeating-linear-gradient(0deg, transparent, transparent ${rowPx - 1}px, ${lc} ${rowPx - 1}px, ${lc} ${rowPx + 0.5}px)`
    );
    return parts.length ? { backgroundImage: parts.join(", ") } : {};
  }

  function buildSideBlocks() {
    const blocks = [];
    let xOff = 0;
    for (let zi = 0; zi < zones.length; zi++) {
      const z = zones[zi];
      const c = colorMap[z.line.id] || zColors[0];
      const primaryH = z.nH * z.bh;
      // Primary zone
      blocks.push(<div key={`p${zi}`} style={{
        position:"absolute", left: xOff * sideScale, bottom: 0,
        width: z.usedL * sideScale, height: primaryH * sideScale,
        backgroundColor: c + "22", border:`1.5px solid ${c}60`, borderRadius:1,
        ...boxGrid(z.bl * sideScale, z.bh * sideScale, c),
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: Math.min(z.usedL * sideScale, primaryH * sideScale) > 30 ? 9 : 7,
        overflow:"hidden",
      }}>
        <span style={{ fontWeight:700, color:c }}>{t.lineNo(origIdx(z.line))}</span>
      </div>);

      // Stacked items on top
      let stackBottom = primaryH;
      for (const ti of z.topItems) {
        const tc = colorMap[ti.line.id] || zColors[0];
        const sh = ti.usedH;
        blocks.push(<div key={`s${zi}_${ti.line.id}`} style={{
          position:"absolute", left: xOff * sideScale, bottom: stackBottom * sideScale,
          width: z.usedL * sideScale, height: sh * sideScale,
          backgroundColor: tc + "18", border:`1.5px dashed ${tc}60`, borderRadius:1,
          ...boxGrid(ti.bl * sideScale, ti.bh * sideScale, tc),
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: Math.min(z.usedL * sideScale, sh * sideScale) > 24 ? 8 : 6,
          overflow:"hidden",
        }}>
          <span style={{ fontWeight:600, color:tc, opacity:0.8 }}>↑{t.lineNo(origIdx(ti.line))}</span>
        </div>);
        stackBottom += sh;
      }
      // H dead space at top of this zone (skip if very small)
      const gapH = vehicle.H - stackBottom;
      if (gapH > vehicle.H * 0.05) {
        blocks.push(<div key={`gh${zi}`} style={{
          position:"absolute", left: xOff * sideScale, top: 0,
          width: z.usedL * sideScale, height: gapH * sideScale,
          background: deadBg, borderBottom:"1px dashed #fca5a5",
        }}/>);
      }
      xOff += z.usedL;
    }
    // Remaining L dead space
    if (remainL > 0) {
      blocks.push(<div key="deadL" style={{
        position:"absolute", right:0, top:0,
        width: remainL * sideScale, height:"100%",
        background: deadBg, borderLeft:"1px dashed #fca5a5",
      }}/>);
    }
    return blocks;
  }

  // --- Build zone blocks for top view (L×W) ---
  function buildTopBlocks() {
    const blocks = [];
    let xOff = 0;
    for (let zi = 0; zi < zones.length; zi++) {
      const z = zones[zi];
      const c = colorMap[z.line.id] || zColors[0];
      const usedW = z.nW * z.bw;

      if (z.topItems.length > 0) {
        // Has stacking: show topmost item as primary, floor item as secondary
        const top = z.topItems[z.topItems.length - 1]; // highest stacked
        const tc = colorMap[top.line.id] || zColors[0];
        const topUsedL = top.nL * top.bl;
        const topUsedW = top.nW * top.bw;

        // Top item covers its L×W range
        blocks.push(<div key={`tpt${zi}`} style={{
          position:"absolute", left: xOff * topScale, top: 0,
          width: topUsedL * topScale, height: topUsedW * topScale,
          backgroundColor: tc + "22", border:`1.5px solid ${tc}60`, borderRadius:1,
          ...boxGrid(top.bl * topScale, top.bw * topScale, tc),
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: Math.min(topUsedL * topScale, topUsedW * topScale) > 24 ? 8 : 6,
          overflow:"hidden",
        }}>
          <span style={{ fontWeight:700, color:tc }}>↑{t.lineNo(origIdx(top.line))}</span>
        </div>);

        // Floor item visible in remaining L (if top doesn't cover full zone L)
        if (topUsedL < z.usedL) {
          blocks.push(<div key={`tpf${zi}`} style={{
            position:"absolute", left: (xOff + topUsedL) * topScale, top: 0,
            width: (z.usedL - topUsedL) * topScale, height: usedW * topScale,
            backgroundColor: c + "22", border:`1.5px solid ${c}60`, borderRadius:1,
            ...boxGrid(z.bl * topScale, z.bw * topScale, c),
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize: 7, overflow:"hidden",
          }}>
            <span style={{ fontWeight:700, color:c }}>{t.lineNo(origIdx(z.line))}</span>
          </div>);
        }

        // W dead space (based on wider of top/floor)
        const maxW = Math.max(usedW, topUsedW);
        const gW = vehicle.W - maxW;
        if (gW > 2) {
          blocks.push(<div key={`twg${zi}`} style={{
            position:"absolute", left: xOff * topScale, bottom: 0,
            width: z.usedL * topScale, height: gW * topScale,
            background: deadBg, borderTop:"1px dashed #fca5a5",
          }}/>);
        }
      } else {
        // No stacking: show floor item only
        blocks.push(<div key={`tp${zi}`} style={{
          position:"absolute", left: xOff * topScale, top: 0,
          width: z.usedL * topScale, height: usedW * topScale,
          backgroundColor: c + "22", border:`1.5px solid ${c}60`, borderRadius:1,
          ...boxGrid(z.bl * topScale, z.bw * topScale, c),
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: Math.min(z.usedL * topScale, usedW * topScale) > 30 ? 9 : 7,
          overflow:"hidden",
        }}>
          <span style={{ fontWeight:700, color:c }}>{t.lineNo(origIdx(z.line))}</span>
        </div>);
        // W dead space
        const gW = vehicle.W - usedW;
        if (gW > 2) {
          blocks.push(<div key={`twg${zi}`} style={{
            position:"absolute", left: xOff * topScale, bottom: 0,
            width: z.usedL * topScale, height: gW * topScale,
            background: deadBg, borderTop:"1px dashed #fca5a5",
          }}/>);
        }
      }
      xOff += z.usedL;
    }
    if (remainL > 0) {
      blocks.push(<div key="deadL" style={{
        position:"absolute", right:0, top:0,
        width: remainL * topScale, height:"100%",
        background: deadBg, borderLeft:"1px dashed #fca5a5",
      }}/>);
    }
    return blocks;
  }

  // --- Build zone blocks for rear view (W×H) - show first zone ---
  function buildRearBlocks() {
    const blocks = [];
    if (zones.length === 0) return blocks;
    const z = zones[zones.length - 1]; // rearmost zone
    const c = colorMap[z.line.id] || zColors[0];
    const primaryH = z.nH * z.bh;
    const usedW = z.nW * z.bw;
    const gW = vehicle.W - usedW;
    const offsetX = gW * frontScale;
    // Primary
    blocks.push(<div key="rp" style={{
      position:"absolute", left: offsetX, bottom:0,
      width: usedW * frontScale, height: primaryH * frontScale,
      backgroundColor: c + "22", border:`1.5px solid ${c}60`, borderRadius:1,
      ...boxGrid(z.bw * frontScale, z.bh * frontScale, c),
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, overflow:"hidden",
    }}>
      <span style={{ fontWeight:700, color:c }}>{t.lineNo(origIdx(z.line))}</span>
    </div>);
    // Stacked
    let stackBottom = primaryH;
    for (const ti of z.topItems) {
      const tc = colorMap[ti.line.id] || zColors[0];
      const tiW = ti.nW * ti.bw;
      blocks.push(<div key={`rs_${ti.line.id}`} style={{
        position:"absolute", left: offsetX, bottom: stackBottom * frontScale,
        width: tiW * frontScale, height: ti.usedH * frontScale,
        backgroundColor: tc + "18", border:`1.5px dashed ${tc}60`, borderRadius:1,
        ...boxGrid(ti.bw * frontScale, ti.bh * frontScale, tc),
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, overflow:"hidden",
      }}>
        <span style={{ fontWeight:600, color:tc, opacity:0.8 }}>↑{t.lineNo(origIdx(ti.line))}</span>
      </div>);
      stackBottom += ti.usedH;
    }
    // H dead space at top (skip if very small)
    const gapH = vehicle.H - stackBottom;
    if (gapH > vehicle.H * 0.05) {
      blocks.push(<div key="deadH" style={{
        position:"absolute", left: offsetX, top:0,
        width: Math.max(usedW, ...z.topItems.map(ti => ti.nW * ti.bw)) * frontScale,
        height: gapH * frontScale,
        background: deadBg, borderBottom:"1px dashed #fca5a5",
      }}/>);
    }
    // W dead space (skip if very small)
    if (gW > vehicle.W * 0.05) {
      blocks.push(<div key="deadW" style={{
        position:"absolute", left:0, top:0,
        width: gW * frontScale, height:"100%",
        background: deadBg, borderRight:"1px dashed #fca5a5",
      }}/>);
    }
    return blocks;
  }

  // --- Compute min gaps for axis labels ---
  const gapL = remainL;
  const minGapH = zones.length > 0 ? zones.reduce((min, z) => {
    const usedH = z.nH * z.bh + z.topItems.reduce((s, ti) => s + ti.usedH, 0);
    return Math.min(min, vehicle.H - usedH);
  }, vehicle.H) : vehicle.H;
  const minGapW = zones.length > 0 ? zones.reduce((min, z) => {
    return Math.min(min, vehicle.W - z.nW * z.bw);
  }, vehicle.W) : vehicle.W;

  const gapStyle = { color:"#e09070", fontWeight:600 };

  const Wheel = ({size, style}) => (
    <div style={{ width:size*2, height:size*2, borderRadius:"50%", background:wheelColor,
      border:"3px solid #1e293b", boxShadow:"inset 0 0 0 3px #64748b", ...style }} />
  );

  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:16, marginBottom:16 }}>
      <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:4 }}>
        {t.zoneT(vn(vehicle,t))}
      </div>
      <div style={{ fontSize:10, color:"#94a3b8", marginBottom:14 }}>{t.zoneNote}</div>

      <div style={{ display:"flex", gap:24, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-end" }}>

        {/* ===== SIDE VIEW ===== */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", marginBottom:6, textAlign:"center" }}>{t.vzSd}</div>
          <div style={{ position:"relative", width: cabW + bedW + 8, height: bedH + wheelR + 16 }}>
            <div style={{
              position:"absolute", left:0, bottom: wheelR + 4,
              width: cabW, height: cabH,
              background: cabColor, borderRadius:"8px 4px 0 0",
              display:"flex", flexDirection:"column", justifyContent:"flex-start", alignItems:"center", paddingTop:4,
            }}>
              <div style={{ width: cabW*0.7, height: cabH*0.35, background:"#bfdbfe", borderRadius:"4px 2px 0 0", border:"1px solid #93c5fd" }} />
              <div style={{ width:"70%", height:1, background:"#64748b", marginTop: cabH*0.15 }} />
            </div>
            <div style={{
              position:"absolute", left: cabW + 4, bottom: wheelR + 4,
              width: bedW, height: bedH,
              background: bedBg, border:`2px solid ${frameColor}`, borderRadius:"2px 2px 0 0",
              overflow:"hidden",
            }}>
              {buildSideBlocks()}
            </div>
            <div style={{ position:"absolute", left:0, bottom: wheelR + 2, width: cabW + bedW + 4, height:3, background: cabLight, borderRadius:2 }}/>
            <Wheel size={wheelR} style={{ position:"absolute", left: cabW*0.3, bottom:0 }} />
            <Wheel size={wheelR} style={{ position:"absolute", left: cabW + bedW*0.2, bottom:0 }} />
            <Wheel size={wheelR} style={{ position:"absolute", left: cabW + bedW*0.75, bottom:0 }} />
            <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:1, background:"#e2e8f0" }}/>
          </div>
          <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:4 }}>{t.vzSL(vehicle.L,vehicle.H)} <span style={gapStyle}>｜ {t.vzMinGap} {t.vzGap("L",gapL)} / {t.vzGap("H",minGapH)} cm</span></div>
        </div>

        {/* ===== TOP VIEW ===== */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", marginBottom:6, textAlign:"center" }}>{t.vzTp}</div>
          <div style={{ position:"relative", width: topCabW + topBedW + 8, height: Math.max(topBedH, topCabH) + 4 }}>
            <div style={{
              position:"absolute", left:0, top: (Math.max(topBedH, topCabH) - topCabH) / 2,
              width: topCabW, height: topCabH,
              background: cabColor, borderRadius:"6px 3px 3px 6px",
            }}>
              <div style={{ position:"absolute", left:2, top:"15%", width: topCabW*0.3, height:"70%", background:"#bfdbfe", borderRadius:"3px 0 0 3px", border:"1px solid #93c5fd" }}/>
            </div>
            <div style={{
              position:"absolute", left: topCabW + 4, top: (Math.max(topBedH, topCabH) - topBedH) / 2,
              width: topBedW, height: topBedH,
              background: bedBg, border:`2px solid ${frameColor}`, borderRadius:2,
              overflow:"hidden",
            }}>
              {buildTopBlocks()}
            </div>
          </div>
          <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:4 }}>{t.vzTL(vehicle.L,vehicle.W)} <span style={gapStyle}>｜ {t.vzMinGap} {t.vzGap("L",gapL)} / {t.vzGap("W",minGapW)} cm</span></div>
        </div>

        {/* ===== REAR VIEW ===== */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#64748b", marginBottom:6, textAlign:"center" }}>{t.vzRr}</div>
          <div style={{ position:"relative", width: fBedW + 16, height: fBedH + fWheelR + 20 }}>
            <div style={{
              position:"absolute", left:4, bottom: fWheelR + 4,
              width: fBedW + 8, height: fBedH + 6,
              background: frameColor, borderRadius:"3px 3px 0 0",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{
                width: fBedW, height: fBedH,
                background: bedBg, border:`2px solid ${cabLight}`, borderRadius:2,
                position:"relative", overflow:"hidden",
              }}>
                {buildRearBlocks()}
              </div>
            </div>
            <div style={{ position:"absolute", left:2, bottom: fWheelR + 2, width: fBedW + 12, height:4, background: cabLight, borderRadius:2 }}/>
            <div style={{ position:"absolute", left:5, bottom: fWheelR + 8, width:6, height:10, background:"#ef4444", borderRadius:2 }}/>
            <div style={{ position:"absolute", right:5, bottom: fWheelR + 8, width:6, height:10, background:"#ef4444", borderRadius:2 }}/>
            <Wheel size={fWheelR} style={{ position:"absolute", left: 6, bottom:0 }} />
            <Wheel size={fWheelR} style={{ position:"absolute", right: 6, bottom:0 }} />
            <div style={{ position:"absolute", bottom:0, left:0, width:"100%", height:1, background:"#e2e8f0" }}/>
          </div>
          <div style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:4 }}>{t.vzRL(vehicle.W,vehicle.H)} <span style={gapStyle}>｜ {t.vzMinGap} {t.vzGap("W",minGapW)} / {t.vzGap("H",minGapH)} cm</span></div>
        </div>
      </div>

      {/* Legend: per-line color */}
      <div style={{ display:"flex", gap:12, marginTop:12, fontSize:10, color:"#64748b", justifyContent:"center", flexWrap:"wrap" }}>
        {origLines.map((ln, i) => (
          <span key={ln.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:10, height:10, background:zColors[i % zColors.length]+"30",
              border:`1px solid ${zColors[i % zColors.length]}`, borderRadius:2, display:"inline-block" }}/>
            {t.lineNo(i+1)}: {ln.l}×{ln.cw}×{ln.h}cm
          </span>
        ))}
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:10, height:10, background:deadBg, border:"1px dashed #fca5a5", borderRadius:2, display:"inline-block" }}/>
          {t.lgD}
        </span>
      </div>

      {/* Detail list - card style, 2 columns */}
      <div style={{ marginTop:12, display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:8 }}>
        {zones.map((z, zi) => {
          const lineIdx = origIdx(z.line);
          const c = colorMap[z.line.id];
          return (
            <div key={`z${zi}`} style={{
              background:"#fff", borderRadius:8, padding:"10px 14px",
              borderLeft:`3px solid ${c}`,
              boxShadow:"0 1px 3px rgba(0,0,0,0.04)",
            }}>
              {/* Tier 1 - Floor item */}
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                <span style={{
                  fontSize:9, fontWeight:700, color:"#fff", background:c,
                  padding:"1px 7px", borderRadius:10, whiteSpace:"nowrap",
                }}>{t.tier(1)}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:12, fontWeight:700, color:c }}>{t.lineNo(lineIdx)}</span>
                <span style={{ fontSize:12, fontWeight:600, color:"#1e293b" }}>
                  {z.line.l}×{z.line.cw}×{z.line.h}cm
                </span>
                <span style={{ fontSize:11, color:"#64748b" }}>×{z.qty}{t.uPcs}</span>
                <span style={{
                  fontSize:9, background:"#f1f5f9", color:"#64748b", padding:"1px 6px",
                  borderRadius:4, fontFamily:"monospace",
                }}>{z.nL}L × {z.nW}W × {z.nH}H</span>
              </div>
              <div style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>
                L: {z.usedL}cm
              </div>

              {/* Stacked tiers */}
              {z.topItems.map((ti, j) => {
                const tiIdx = origIdx(ti.line);
                const tc = colorMap[ti.line.id];
                const tierNum = j + 2;
                return (
                  <div key={`t${j}`} style={{ borderTop:"1px dashed #e2e8f0", marginTop:8, paddingTop:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                      <span style={{
                        fontSize:9, fontWeight:700, color:"#fff", background:tc+"cc",
                        padding:"1px 7px", borderRadius:10, whiteSpace:"nowrap",
                      }}>{t.tier(tierNum)}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      <span style={{ fontSize:11, fontWeight:600, color:tc }}>{t.lineNo(tiIdx)}</span>
                      <span style={{ fontSize:11, fontWeight:600, color:"#475569" }}>
                        {ti.line.l}×{ti.line.cw}×{ti.line.h}cm
                      </span>
                      <span style={{ fontSize:10, color:"#64748b" }}>×{ti.placed}{t.uPcs}</span>
                      <span style={{
                        fontSize:9, background:"#f8fafc", color:"#94a3b8", padding:"1px 5px",
                        borderRadius:3, fontFamily:"monospace",
                      }}>{ti.nL}L × {ti.nW}W × {ti.nH}H</span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// --- Card for multi-line (zone-based) ---
function MultiCard({ v, zoneResult, totalWeight, origLines, truckCount, isRecommended, t }) {
  const effW = v.ew;
  const wOk = totalWeight <= effW;
  const ok = zoneResult !== null && wOk;
  const wPct = (totalWeight / effW) * 100;
  const vehicleVol = (v.L * v.W * v.H / 1e6).toFixed(1);

  // Determine NG reasons
  const ngReasons = [];
  if (!wOk) ngReasons.push(t.znWOver);
  if (!zoneResult) ngReasons.push(t.znLOver);

  const tight = ok && zoneResult && (wPct > 85 || zoneResult.remainL < 20);
  const hasMulti = !ok && truckCount > 0;
  const borderColor = ok ? (tight ? "#f59e0b" : "#22c55e") : hasMulti ? (isRecommended ? "#22c55e" : "#93c5fd") : "#e2e8f0";
  const bgColor = ok ? (tight ? "#fffbeb" : "#f0fdf4") : hasMulti ? (isRecommended ? "#f0fdf4" : "#eff6ff") : "#fff";
  const badgeColor = ok ? (tight ? "#f59e0b" : "#22c55e") : hasMulti ? (isRecommended ? "#22c55e" : "#2563eb") : "#ef4444";
  const badgeText = ok ? (tight ? t.znCaut : t.znOk) : hasMulti ? t.bCnt(truckCount) : t.znNg;

  return (
    <div style={{
      background: bgColor,
      border: ok || hasMulti ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
      borderRadius: 10, padding: 14,
      opacity: ok || hasMulti ? 1 : 0.5,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div>
          <span style={{ fontSize:16, fontWeight:700 }}>{vn(v,t)}</span>
          <span style={{ fontSize:11, color:"#94a3b8", marginLeft:6 }}>{vd(v,t)}</span>
        </div>
        <span style={{
          background:badgeColor, color:"#fff", fontSize:11, fontWeight:700,
          padding:"3px 8px", borderRadius:12,
        }}>{badgeText}</span>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, fontSize:11, color:"#64748b", marginBottom:6 }}>
        <div>
          <span style={{ color:"#64748b" }}>{t.ldCap}</span>
          <div style={{ fontWeight:600, fontSize:13 }}>
            <b style={{ color:"#1e293b" }}>{effW.toLocaleString()}kg</b>
            {v.w !== v.ew && <span style={{ fontSize:9, color:"#94a3b8", marginLeft:3 }}>{t.rated(v.w.toLocaleString())}</span>}
          </div>
        </div>
        <div>{t.vol} <b style={{ color:"#1e293b" }}>{vehicleVol}m³</b></div>
        <div>{t.inSz} <b style={{ color:"#1e293b" }}>{v.L}×{v.W}×{v.H}</b></div>
      </div>

      {ok && zoneResult && (
        <div style={{ background: tight ? "#fefce8" : "#f8fafc", borderRadius:6, padding:10, marginTop:6 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b" }}>
            <span>{t.zoneW(totalWeight.toLocaleString(), effW.toLocaleString())}</span>
            <span style={{ fontWeight:600, color: wPct > 85 ? "#f59e0b" : "#22c55e" }}>{wPct.toFixed(0)}%</span>
          </div>
          <Bar pct={wPct} color={wPct > 85 ? "#f59e0b" : "#22c55e"} />

          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b", marginTop:6 }}>
            <span>{t.zoneUsedL(zoneResult.usedL, v.L)}</span>
            <span style={{ fontWeight:600, color: zoneResult.remainL < 20 ? "#f59e0b" : "#22c55e" }}>
              {t.zoneRem(zoneResult.remainL)}
            </span>
          </div>
          <Bar pct={(zoneResult.usedL / v.L) * 100} color={zoneResult.remainL < 20 ? "#f59e0b" : "#3b82f6"} />

          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#64748b", marginTop:6 }}>
            <span>{t.zoneFill(zoneResult.fill.toFixed(1))}</span>
          </div>
          <Bar pct={zoneResult.fill} color="#3b82f6" />

          {/* Per-zone breakdown */}
          <div style={{ marginTop:8, fontSize:10, color:"#64748b" }}>
            {zoneResult.zones.map((z, i) => {
              const oi = origLines ? origLines.findIndex(ln => ln.id === z.line.id) + 1 : i + 1;
              return (
              <div key={i} style={{ marginTop: i > 0 ? 2 : 0 }}>
                <div>{t.lineNo(oi)}: {z.bl}×{z.bw}×{z.bh}cm → {z.nL}×{z.nW}×{z.nH} (L:{z.usedL}cm)</div>
                {z.topItems && z.topItems.map((ti, j) => {
                  const toi = origLines ? origLines.findIndex(ln => ln.id === ti.line.id) + 1 : j + 1;
                  return (
                  <div key={j} style={{ marginLeft:12, color:"#94a3b8", fontStyle:"italic" }}>
                    ↑ {t.lineNo(toi)}: {ti.bl}×{ti.bw}×{ti.bh}cm × {ti.placed}{t.uPcs}
                  </div>
                );})}
              </div>
            );})}
          </div>
        </div>
      )}

      {!ok && ngReasons.length > 0 && (
        <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>
          {ngReasons.map((r,i) => <div key={i}>{r}</div>)}
        </div>
      )}
    </div>
  );
}

export default function CargoVehicleTool({ defaultLang = "ja" }) {
  const [lines, setLines] = useState([{ id: 1, w: 6, l: 80, cw: 65, h: 34, q: 12 }]);
  const [nextId, setNextId] = useState(2);
  const [fixH, setFixH] = useState(true);
  const [lang, setLang] = useState(defaultLang);
  const t = T[lang];

  // Load Noto Sans SC from Google Fonts for Chinese
  useEffect(() => {
    if (lang === "zh" && !document.querySelector('link[href*="Noto+Sans+SC"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, [lang]);

  const addLine = () => {
    if (lines.length >= 50) return;
    setLines([...lines, { id: nextId, w: 0, l: 0, cw: 0, h: 0, q: 1 }]);
    setNextId(nextId + 1);
  };
  const removeLine = (id) => {
    if (lines.length <= 1) return;
    setLines(lines.filter(ln => ln.id !== id));
  };
  const updateLine = (id, field, val) => {
    setLines(lines.map(ln => ln.id === id ? { ...ln, [field]: val } : ln));
  };

  // Paste import
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [pasteMsg, setPasteMsg] = useState(null); // { ok, text }
  const [pasteTab, setPasteTab] = useState("text"); // "text" | "image"
  const [parseLoading, setParseLoading] = useState(false);
  const [imgPreview, setImgPreview] = useState(null); // base64 data URL
  const imgFileRef = useRef(null);

  const parseWithAI = async (inputText) => {
    setParseLoading(true);
    setPasteMsg(null);
    try {
      const resp = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText })
      });
      const data = await resp.json();
      const raw = data.content?.map(b => b.type === "text" ? b.text : "").join("") || "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const items = JSON.parse(cleaned);
      if (!Array.isArray(items) || items.length === 0) {
        setPasteMsg({ ok: false, text: t.pasteErr });
        return;
      }
      const newLines = items.slice(0, 50).map((it, i) => ({
        id: nextId + i,
        l: Number(it.l) || 0,
        cw: Number(it.w) || 0,
        h: Number(it.h) || 0,
        q: Number(it.q) || 1,
        w: Number(it.kg) || 0,
      }));
      setLines(newLines);
      setNextId(nextId + newLines.length);
      setCommitted(null);
      setPasteOpen(false); setPasteMsg(null); setPasteText(""); setImgPreview(null);
    } catch (e) {
      setPasteMsg({ ok: false, text: t.pasteErr });
    } finally {
      setParseLoading(false);
    }
  };

  const processImage = async (base64Data, mediaType) => {
    setParseLoading(true);
    setPasteMsg(null);
    setImgPreview(`data:${mediaType};base64,${base64Data}`);
    try {
      const resp = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Data, mediaType })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.type === "text" ? b.text : "").join("") || "";
      if (text.trim()) {
        setPasteText(text.trim());
        setPasteMsg({ ok: true, text: t.imgOk });
      } else {
        setPasteMsg({ ok: false, text: t.imgErr });
      }
    } catch (e) {
      setPasteMsg({ ok: false, text: t.imgErr });
    } finally {
      setParseLoading(false);
    }
  };

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const [header, base64] = dataUrl.split(",");
      const mediaType = header.match(/data:(.*?);/)?.[1] || "image/png";
      processImage(base64, mediaType);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleImageFile(file);
  };

  const handlePasteImage = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        handleImageFile(item.getAsFile());
        return;
      }
    }
  };
  const doPaste = () => {
    if (!pasteText.trim()) {
      setPasteMsg({ ok: false, text: t.pasteErr });
      return;
    }
    parseWithAI(pasteText);
  };

  // Committed values (only update on button press)
  const [committed, setCommitted] = useState(null);
  const hasResult = committed !== null;

  const doJudge = () => setCommitted({ lines: lines.map(ln => ({...ln})), fixH });

  // isDirty: compare current inputs vs last committed
  const isDirty = hasResult && (() => {
    if (fixH !== committed.fixH) return true;
    if (lines.length !== committed.lines.length) return true;
    return lines.some((ln, i) => {
      const c = committed.lines[i];
      if (!c) return true;
      return ln.w !== c.w || ln.l !== c.l || ln.cw !== c.cw || ln.h !== c.h || ln.q !== c.q;
    });
  })();

  // Live summary
  const totalWeight = lines.reduce((s, ln) => s + ln.w * ln.q, 0);
  const totalVol = lines.reduce((s, ln) => s + (ln.l * ln.cw * ln.h / 1e6) * ln.q, 0);

  const isSingle = hasResult && committed.lines.length === 1;

  // ====== Single-line results (existing logic, exact backward compat) ======
  const singleCargo = isSingle ? { ...committed.lines[0], fixH: committed.fixH } : null;
  const ctw = singleCargo ? singleCargo.w * singleCargo.q : 0;

  const singleItemFitsRegular = useMemo(() => {
    if (!isSingle) return true;
    return TRUCKS.some(v => {
      if (singleCargo.w > v.ew) return false;
      const st = simulate(v, singleCargo.l, singleCargo.cw, singleCargo.h, 1, committed.fixH);
      return st && st.ok;
    });
  }, [committed, isSingle]);

  const best = useMemo(() => {
    if (!isSingle) return null;
    return TRUCKS.find(v => {
      if (ctw > v.ew) return false;
      const st = simulate(v, singleCargo.l, singleCargo.cw, singleCargo.h, singleCargo.q, committed.fixH);
      return st && st.ok;
    });
  }, [committed, isSingle]);

  const truck10 = TRUCKS.find(v => v.id === "10");
  const multiTruck = useMemo(() => {
    if (!isSingle || best || !singleItemFitsRegular || !truck10) return null;
    const st10 = simulate(truck10, singleCargo.l, singleCargo.cw, singleCargo.h, singleCargo.q, committed.fixH);
    if (!st10) return null;
    const maxPer10 = Math.min(st10.max, Math.floor(truck10.ew / singleCargo.w));
    if (maxPer10 <= 0) return null;
    const num10 = Math.floor(singleCargo.q / maxPer10);
    const remainder = singleCargo.q - num10 * maxPer10;
    if (remainder === 0) return { plan: [{ vehicle: truck10, count: num10, maxPerTruck: maxPer10, assigned: maxPer10 }] };
    let remainVehicle = null;
    for (const v of TRUCKS) {
      if (singleCargo.w * remainder > v.ew) continue;
      const stR = simulate(v, singleCargo.l, singleCargo.cw, singleCargo.h, remainder, committed.fixH);
      if (stR && stR.ok) { remainVehicle = v; break; }
    }
    const plan = [];
    if (remainVehicle && remainVehicle.id !== truck10.id) {
      const stRFull = simulate(remainVehicle, singleCargo.l, singleCargo.cw, singleCargo.h, 99999, committed.fixH);
      const trueMax = stRFull ? Math.min(stRFull.max, Math.floor(remainVehicle.ew / singleCargo.w)) : remainder;
      if (num10 > 0) plan.push({ vehicle: truck10, count: num10, maxPerTruck: maxPer10, assigned: maxPer10 });
      plan.push({ vehicle: remainVehicle, count: 1, maxPerTruck: trueMax, assigned: remainder });
    } else {
      plan.push({ vehicle: truck10, count: num10 + 1, maxPerTruck: maxPer10, assigned: maxPer10 });
    }
    return { plan };
  }, [committed, isSingle, best, singleItemFitsRegular]);

  const needsTrailer = isSingle && hasResult && !best && !singleItemFitsRegular;
  const trailerSt = needsTrailer ? simulate(TRAILER, singleCargo.l, singleCargo.cw, singleCargo.h, singleCargo.q, committed.fixH) : null;
  const bestSt = best ? simulate(best, singleCargo.l, singleCargo.cw, singleCargo.h, singleCargo.q, committed.fixH) : null;
  const bestCapPct = bestSt ? (singleCargo.q / bestSt.max) * 100 : 0;
  const bestPerLayer = bestSt ? bestSt.nL * bestSt.nW : 0;
  const bestActualTiers = bestPerLayer > 0 ? Math.ceil(singleCargo.q / bestPerLayer) : 0;
  const bestActualGapH = best && bestSt ? best.H - (bestActualTiers * bestSt.bh) : 0;
  const bestHasSmallGap = bestSt && (
    (bestSt.gL > 0 && bestSt.gL < 5) || (bestSt.gW > 0 && bestSt.gW < 5) || (bestActualGapH > 0 && bestActualGapH < 5)
  );
  const bestWPct = best ? (singleCargo.w * singleCargo.q / best.ew * 100) : 0;
  const bestTight = best && bestSt && (bestCapPct >= 80 || (bestHasSmallGap && bestCapPct >= 50) || bestWPct > 85);

  // ====== Multi-line results (zone-based) ======
  const isMulti = hasResult && committed.lines.length > 1;
  const cTotalWeight = hasResult ? committed.lines.reduce((s, ln) => s + ln.w * ln.q, 0) : 0;

  // Sort by single-item volume descending (large items first)
  const sortedLines = useMemo(() => {
    if (!isMulti) return [];
    return [...committed.lines]
      .filter(ln => ln.q > 0 && ln.l > 0 && ln.cw > 0 && ln.h > 0)
      .sort((a, b) => (b.l * b.cw * b.h) - (a.l * a.cw * a.h));
  }, [committed, isMulti]);

  // Zone results per vehicle
  const zoneResults = useMemo(() => {
    if (!isMulti) return {};
    const results = {};
    for (const v of TRUCKS) {
      if (cTotalWeight > v.ew) { results[v.id] = null; continue; }
      results[v.id] = simulateZone(v, sortedLines, committed.fixH);
    }
    // Trailer
    if (cTotalWeight <= TRAILER.ew) {
      results[TRAILER.id] = simulateZone(TRAILER, sortedLines, committed.fixH);
    }
    return results;
  }, [committed, isMulti, sortedLines, cTotalWeight]);

  const multiBest = useMemo(() => {
    if (!isMulti) return null;
    return TRUCKS.find(v => cTotalWeight <= v.ew && zoneResults[v.id] !== null);
  }, [isMulti, zoneResults, cTotalWeight]);

  const multiBestZR = multiBest ? zoneResults[multiBest.id] : null;
  const multiBestTight = multiBest && multiBestZR && (
    (cTotalWeight / multiBest.ew * 100) > 85 || multiBestZR.remainL < 20
  );
  const multiNeedsTrailer = useMemo(() => {
    if (!isMulti) return false;
    // Only show trailer if some individual item doesn't fit in any regular truck
    for (const ln of sortedLines) {
      const singleFits = TRUCKS.some(v => {
        const rots = committed.fixH
          ? [[ln.l, ln.cw, ln.h], [ln.cw, ln.l, ln.h]]
          : [[ln.l,ln.cw,ln.h],[ln.cw,ln.l,ln.h],[ln.l,ln.h,ln.cw],[ln.h,ln.l,ln.cw],[ln.cw,ln.h,ln.l],[ln.h,ln.cw,ln.l]];
        return rots.some(([bl,bw,bh]) => bl <= v.L && bw <= v.W && bh <= v.H);
      });
      if (!singleFits) return true;
    }
    return false;
  }, [isMulti, sortedLines, committed]);
  const multiTrailerZR = multiNeedsTrailer ? zoneResults[TRAILER.id] : null;

  // Multi-truck plan for mixed cargo when no single truck fits
  const multiPlan = useMemo(() => {
    if (!isMulti || multiBest) return null; // single truck works

    let remaining = sortedLines.map(ln => ({...ln}));
    const plan = [];
    const truck10 = TRUCKS[TRUCKS.length - 1];

    for (let i = 0; i < 10; i++) {
      const active = remaining.filter(ln => ln.q > 0);
      if (active.length === 0) break;

      // Try smallest truck that fits all remaining
      const remW = active.reduce((s, ln) => s + ln.w * ln.q, 0);
      let fullFit = null;
      for (const v of TRUCKS) {
        if (remW > v.ew) continue;
        const r = simulateZone(v, active, committed.fixH);
        if (r) { fullFit = { vehicle: v, zoneResult: r, placed: active.map(ln => ({...ln})) }; break; }
      }
      if (fullFit) { plan.push(fullFit); break; }

      // Greedy fill with 10T
      const fill = greedyFillZone(truck10, active, committed.fixH);
      if (fill) {
        plan.push({ vehicle: truck10, zoneResult: fill.zoneResult, placed: fill.placed });
        remaining = fill.remaining;
      } else {
        // Try trailer for oversized items
        const trFill = greedyFillZone(TRAILER, active, committed.fixH);
        if (trFill) {
          plan.push({ vehicle: TRAILER, zoneResult: trFill.zoneResult, placed: trFill.placed });
          remaining = trFill.remaining;
        } else break;
      }
    }
    return plan.length > 0 ? plan : null;
  }, [isMulti, multiBest, sortedLines, committed]);

  // Per-vehicle truck count for NG vehicles
  const truckCounts = useMemo(() => {
    if (!isMulti) return {};
    const counts = {};
    for (const v of [...TRUCKS, TRAILER]) {
      if (zoneResults[v.id]) continue; // single truck OK (non-null result exists)
      // Count how many of this vehicle type needed
      let remaining = sortedLines.map(ln => ({...ln}));
      let n = 0;
      for (let i = 0; i < 20; i++) {
        const active = remaining.filter(ln => ln.q > 0);
        if (active.length === 0) break;
        const fill = greedyFillZone(v, active, committed.fixH);
        if (!fill) break;
        n++;
        remaining = fill.remaining;
      }
      const leftover = remaining.filter(ln => ln.q > 0);
      if (n > 0 && leftover.length === 0) counts[v.id] = n;
    }
    return counts;
  }, [isMulti, sortedLines, zoneResults, committed]);

  // Recommended = fewest trucks among regular trucks, or from multiPlan
  const multiRecommendedId = useMemo(() => {
    if (multiBest) return multiBest.id;
    // Find regular truck with fewest count
    let minCount = Infinity, minId = null;
    for (const v of TRUCKS) {
      const c = truckCounts[v.id];
      if (c && c < minCount) { minCount = c; minId = v.id; }
    }
    return minId;
  }, [multiBest, truckCounts]);

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "16px 12px", fontFamily: t.font }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>📦</span>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t.title}</h1>
          <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{t.subtitle}</p>
        </div>
        <button onClick={() => setLang(lang==="ja"?"zh":"ja")} style={{ background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer", color:"#475569" }}>{t.langBtn}</button>
      </div>

      {/* Paste Import Modal */}
      {pasteOpen && (
        <div style={{
          position:"fixed", top:0, left:0, right:0, bottom:0,
          background:"rgba(0,0,0,0.4)", zIndex:1000,
          display:"flex", alignItems:"center", justifyContent:"center", padding:16,
        }} onClick={() => { setPasteOpen(false); setImgPreview(null); }}>
          <div style={{
            background:"#fff", borderRadius:12, padding:20, width:"100%", maxWidth:520,
            boxShadow:"0 20px 60px rgba(0,0,0,0.2)",
          }} onClick={e => e.stopPropagation()}>
            {/* Tabs */}
            <div style={{ display:"flex", gap:0, marginBottom:16, borderBottom:"2px solid #e2e8f0" }}>
              {["text","image"].map(tab => (
                <button key={tab} onClick={() => { setPasteTab(tab); setPasteMsg(null); }} style={{
                  flex:1, padding:"8px 0", fontSize:13, fontWeight:600, cursor:"pointer",
                  border:"none", background:"none",
                  borderBottom: pasteTab === tab ? "2px solid #3b82f6" : "2px solid transparent",
                  color: pasteTab === tab ? "#3b82f6" : "#94a3b8",
                  marginBottom:-2,
                }}>{tab === "text" ? t.tabText : t.tabImg}</button>
              ))}
            </div>

            {pasteTab === "text" ? (
              <>
                <div style={{ fontSize:11, color:"#94a3b8", marginBottom:12 }}>{t.pasteSub}</div>
                <textarea
                  value={pasteText}
                  onChange={e => { setPasteText(e.target.value); setPasteMsg(null); }}
                  placeholder={t.pastePlace}
                  disabled={parseLoading}
                  style={{
                    width:"100%", height:160, padding:12, fontSize:13, fontFamily:"monospace",
                    border:"1px solid #e2e8f0", borderRadius:8, resize:"vertical",
                    outline:"none", boxSizing:"border-box", lineHeight:1.6,
                    opacity: parseLoading ? 0.5 : 1,
                  }}
                  autoFocus
                />
              </>
            ) : (
              <>
                <div style={{ fontSize:11, color:"#94a3b8", marginBottom:12 }}>{t.imgSub}</div>
                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                  onPaste={handlePasteImage}
                  onClick={() => imgFileRef.current?.click()}
                  tabIndex={0}
                  style={{
                    border:"2px dashed #cbd5e1", borderRadius:10, padding: imgPreview ? 8 : 32,
                    textAlign:"center", cursor:"pointer", background:"#f8fafc",
                    minHeight: 120, display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center", outline:"none",
                    transition:"border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
                  onBlur={e => e.currentTarget.style.borderColor = "#cbd5e1"}
                >
                  {parseLoading ? (
                    <div style={{ fontSize:14, color:"#3b82f6", fontWeight:600 }}>{t.imgReading}</div>
                  ) : imgPreview ? (
                    <img src={imgPreview} alt="" style={{ maxWidth:"100%", maxHeight:200, borderRadius:6 }} />
                  ) : (
                    <div style={{ fontSize:13, color:"#94a3b8", whiteSpace:"pre-line" }}>{t.imgDrop}</div>
                  )}
                  <input ref={imgFileRef} type="file" accept="image/*" style={{ display:"none" }}
                    onChange={e => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]); }} />
                </div>
                {/* Show extracted text for review */}
                {pasteText && !parseLoading && (
                  <textarea
                    value={pasteText}
                    onChange={e => { setPasteText(e.target.value); setPasteMsg(null); }}
                    style={{
                      width:"100%", height:100, padding:10, fontSize:12, fontFamily:"monospace",
                      border:"1px solid #e2e8f0", borderRadius:8, resize:"vertical",
                      outline:"none", boxSizing:"border-box", lineHeight:1.5, marginTop:10,
                    }}
                  />
                )}
              </>
            )}

            {pasteMsg && (
              <div style={{
                marginTop:8, fontSize:12, fontWeight:600, padding:"6px 10px", borderRadius:6,
                background: pasteMsg.ok ? "#f0fdf4" : "#fef2f2",
                color: pasteMsg.ok ? "#16a34a" : "#ef4444",
              }}>{pasteMsg.text}</div>
            )}
            <div style={{ display:"flex", gap:8, marginTop:12, justifyContent:"flex-end" }}>
              <button onClick={() => { setPasteOpen(false); setImgPreview(null); }} style={{
                background:"none", border:"1px solid #d1d5db", borderRadius:8,
                padding:"8px 16px", fontSize:13, color:"#64748b", cursor:"pointer",
              }}>{t.pasteCancel}</button>
              <button onClick={doPaste} disabled={parseLoading} style={{
                background: parseLoading ? "#94a3b8" : "#3b82f6", color:"#fff", border:"none", borderRadius:8,
                padding:"8px 20px", fontSize:13, fontWeight:700, cursor: parseLoading ? "not-allowed" : "pointer",
              }}>{parseLoading ? t.pasteParsing : t.pasteBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* Input: multi-line table */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{t.cargoInfo}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => { setPasteOpen(true); setPasteMsg(null); setPasteText(""); setPasteTab("text"); setImgPreview(null); }} style={{
              background: "#f0fdf4", color: "#16a34a", border: "1px solid #86efac", borderRadius: 6,
              padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
            }}>{t.paste}</button>
            {lines.length < 50 && (
              <button onClick={addLine} style={{
                background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6,
                padding: "4px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}>{t.addLine}</button>
            )}
            <button onClick={() => { setLines([{ id: nextId, w: 0, l: 0, cw: 0, h: 0, q: 1 }]); setNextId(nextId + 1); setCommitted(null); }} style={{
              background: "none", border: "1px solid #d1d5db", borderRadius: 6,
              padding: "3px 10px", fontSize: 11, color: "#94a3b8", cursor: "pointer",
            }}>{t.clear}</button>
          </div>
        </div>

        {/* Line rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {lines.map((ln, idx) => (
            <div key={ln.id} style={{
              display: "grid",
              gridTemplateColumns: lines.length > 1 ? "28px repeat(5, 1fr) 28px" : "repeat(5, 1fr)",
              gap: 6, alignItems: "end",
            }}>
              {lines.length > 1 && (
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textAlign: "center", paddingBottom: 10 }}>
                  {idx + 1}
                </div>
              )}
              <Input label={idx === 0 ? t.lbW : ""} unit={t.uKg} val={ln.w} set={v => updateLine(ln.id, "w", v)} />
              <Input label={idx === 0 ? t.lbL : ""} unit={t.uCm} val={ln.l} set={v => updateLine(ln.id, "l", v)} />
              <Input label={idx === 0 ? t.lbCw : ""} unit={t.uCm} val={ln.cw} set={v => updateLine(ln.id, "cw", v)} />
              <Input label={idx === 0 ? t.lbH : ""} unit={t.uCm} val={ln.h} set={v => updateLine(ln.id, "h", v)} />
              <Input label={idx === 0 ? t.lbQ : ""} unit={t.uPcs} val={ln.q} set={v => updateLine(ln.id, "q", v)} min={1} />
              {lines.length > 1 && (
                <button onClick={() => removeLine(ln.id)} style={{
                  background: "none", border: "none", fontSize: 14, color: "#cbd5e1",
                  cursor: "pointer", paddingBottom: 8, transition: "color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                onMouseLeave={e => e.currentTarget.style.color = "#cbd5e1"}
                >🗑</button>
              )}
            </div>
          ))}
        </div>
        {lines.length >= 50 && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>{t.maxLines}</div>}

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
          <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t.totQ}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{lines.reduce((s, ln) => s + (ln.q || 0), 0).toLocaleString()} <span style={{ fontSize: 11, color: "#94a3b8" }}>{t.uPcs}</span></div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t.totW}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totalWeight.toLocaleString()} <span style={{ fontSize: 11, color: "#94a3b8" }}>kg</span></div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t.totV}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{totalVol.toFixed(3)} <span style={{ fontSize: 11, color: "#94a3b8" }}>m³</span></div>
          </div>
        </div>

        {/* Options */}
        <label style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 12,
          fontSize: 12, color: "#475569", cursor: "pointer", userSelect: "none",
        }}>
          <input type="checkbox" checked={fixH} onChange={e => setFixH(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#3b82f6", cursor: "pointer" }} />
          <span>{t.fixH}</span>
        </label>

        {/* Judge button */}
        <button onClick={doJudge} style={{
          marginTop: 14, width: "100%", padding: "12px 0",
          background: isDirty ? "#f59e0b" : "#3b82f6",
          color: "#fff", border: "none", borderRadius: 8,
          fontSize: 15, fontWeight: 700, cursor: "pointer",
          transition: "background 0.2s",
          boxShadow: isDirty ? "0 0 0 3px rgba(245,158,11,0.3)" : "none",
        }}>
          🚛 {hasResult && !isDirty ? t.btnDone : isDirty ? t.btnRe : t.btnGo}
        </button>
      </div>

      {/* ====== Results ====== */}
      {hasResult && (
        <>
          {/* Dirty warning */}
          {isDirty && (
            <div style={{
              background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 8,
              padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#92400e",
              display: "flex", alignItems: "center", gap: 6,
            }}>{t.dirtyW}</div>
          )}

          {/* ===== Single-line results ===== */}
          {isSingle && (
            <>
              {best && (
                <div style={{
                  background: bestTight ? "#fffbeb" : "#f0fdf4",
                  border: bestTight ? "1px solid #fbbf24" : "1px solid #86efac",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: bestTight ? "#f59e0b" : "#22c55e" }}>
                    {bestTight ? t.recW : t.rec}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{vn(best,t)}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{t.recMin}</span>
                  {bestTight && <span style={{ fontSize: 10, color: "#92400e", fontWeight: 500 }}>{t.recTN}</span>}
                </div>
              )}

              {multiTruck && (
                <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{t.multi}</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>
                      {multiTruck.plan.map((p, i) => (
                        <span key={i}>
                          {i > 0 && <span style={{ color: "#94a3b8", fontWeight: 400 }}> ＋ </span>}
                          {vn(p.vehicle,t)} × {t.bCnt(p.count)}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
                    {multiTruck.plan.map((p, i) => (
                      <div key={i} style={{ marginTop: i > 0 ? 2 : 0 }}>
                        {t.mLine(vn(p.vehicle,t),p.assigned,p.count)}
                        {p.assigned < p.maxPerTruck && <span style={{ color: "#94a3b8" }}>{t.mMax(p.maxPerTruck)}</span>}
                      </div>
                    ))}
                    <div style={{ marginTop: 4, fontWeight: 600, color: "#1e293b" }}>
                      {t.mTot(singleCargo.q,multiTruck.plan.reduce((s,p)=>s+p.count,0))}
                    </div>
                  </div>
                </div>
              )}

              {needsTrailer && (
                <div style={{ background: "#fefce8", border: "1px solid #fbbf24", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#ca8a04" }}>{t.trW}</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{vn(TRAILER,t)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>{t.trEx}</div>
                  {trailerSt && trailerSt.ok && <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 4 }}>{t.trOk(trailerSt.max)}</div>}
                  {trailerSt && !trailerSt.ok && <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 4 }}>{t.trNg(trailerSt.max)}</div>}
                  {!trailerSt && <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 4 }}>{t.trSzNg}</div>}
                </div>
              )}

              {best && bestSt && <StackingViz vehicle={best} stacking={bestSt} qty={singleCargo.q} t={t} />}

              <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 10 }}>{t.resT}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
                {TRUCKS.map(v => <Card key={v.id} v={v} cargo={singleCargo} plan={multiTruck ? multiTruck.plan : null} t={t} />)}
                {needsTrailer && <Card v={TRAILER} cargo={singleCargo} plan={null} t={t} />}
              </div>
            </>
          )}

          {/* ===== Multi-line results ===== */}
          {isMulti && (
            <>
              {/* Recommendation: single truck */}
              {multiBest && (
                <div style={{
                  background: multiBestTight ? "#fffbeb" : "#f0fdf4",
                  border: multiBestTight ? "1px solid #fbbf24" : "1px solid #86efac",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                  display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: multiBestTight ? "#f59e0b" : "#22c55e" }}>
                    {multiBestTight ? t.recW : t.rec}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{vn(multiBest,t)}</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{t.recMin}</span>
                  {multiBestTight && <span style={{ fontSize: 10, color: "#92400e", fontWeight: 500 }}>{t.recTN}</span>}
                </div>
              )}

              {/* Trailer recommendation */}
              {multiNeedsTrailer && multiTrailerZR && (
                <div style={{ background: "#fefce8", border: "1px solid #fbbf24", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#ca8a04" }}>{t.trW}</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{vn(TRAILER,t)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>{t.trEx}</div>
                  {multiTrailerZR && <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 4 }}>{t.znOk}</div>}
                  {!multiTrailerZR && <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 4 }}>{t.znNg}</div>}
                </div>
              )}

              {/* Multi-truck plan */}
              {multiPlan && (
                <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>{t.multi}</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>
                      {(() => {
                        const counts = {};
                        multiPlan.forEach(p => {
                          const nm = vn(p.vehicle, t);
                          counts[nm] = (counts[nm] || 0) + 1;
                        });
                        return Object.entries(counts).map(([nm, cnt], i) => (
                          <span key={i}>
                            {i > 0 && <span style={{ color: "#94a3b8", fontWeight: 400 }}> ＋ </span>}
                            {nm} × {t.bCnt(cnt)}
                          </span>
                        ));
                      })()}
                    </span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#64748b" }}>
                    {multiPlan.map((p, i) => (
                      <div key={i} style={{ marginTop: i > 0 ? 2 : 0 }}>
                        {t.mzTk(i + 1, vn(p.vehicle, t))} — {t.mzItems(
                          p.placed.map(pl => ({ idx: committed.lines.findIndex(ln => ln.id === pl.id) + 1, q: pl.q }))
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zone visualization: single truck */}
              {multiBest && multiBestZR && (
                <ZoneViz vehicle={multiBest} zoneResult={multiBestZR} sortedLines={sortedLines} origLines={committed.lines} t={t} />
              )}

              {/* Zone visualization: multi-truck plan - one per truck */}
              {multiPlan && multiPlan.map((p, i) => (
                <div key={`mz${i}`} style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                    {t.mzTk(i + 1, vn(p.vehicle, t))}
                  </div>
                  <ZoneViz vehicle={p.vehicle} zoneResult={p.zoneResult} sortedLines={p.placed} origLines={committed.lines} t={t} />
                </div>
              ))}

              <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 10 }}>{t.resT}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
                {TRUCKS.map(v => <MultiCard key={v.id} v={v} zoneResult={zoneResults[v.id]} totalWeight={cTotalWeight} origLines={committed.lines} truckCount={truckCounts[v.id] || 0} isRecommended={v.id === multiRecommendedId} t={t} />)}
                {multiNeedsTrailer && <MultiCard v={TRAILER} zoneResult={multiTrailerZR} totalWeight={cTotalWeight} origLines={committed.lines} truckCount={truckCounts[TRAILER.id] || 0} isRecommended={false} t={t} />}
              </div>
            </>
          )}
        </>
      )}

      <div style={{ marginTop: 16, fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{t.foot}</div>
      <FeedbackButton lang={lang} />
    </div>
  );
}
