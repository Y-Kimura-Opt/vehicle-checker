"use client";
import { useState, useMemo } from "react";

const T = {
  ja: {
    vKv:"軽バン", vKt:"幌車（軽）", v2t:"2Tトラック", v4t:"4Tトラック", v10:"10Tトラック", vTr:"トレーラー",
    dKv:"小口緊急配送", dKt:"小型貨物", d2t:"パレット対応", d4t:"中距離幹線", d10:"長距離幹線", dTr:"超大型貨物",
    title:"車両積載判定ツール", subtitle:"デッドスペース・シミュレーション対応",
    cargoInfo:"📋 貨物情報", lbW:"1個の重量", lbL:"長さ (L)", lbCw:"幅 (W)", lbH:"高さ (H)", lbQ:"数量",
    uPcs:"個", uKg:"kg", uCm:"cm",
    totW:"総重量", uVol:"単体容積", totV:"総容積",
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
    lgB:"カートン", lgD:"デッドスペース", lgC:"キャブ",
    font:"system-ui, sans-serif",
    langBtn:"🇨🇳 中文",
  },
  zh: {
    vKv:"轻型厢货", vKt:"篷车（轻型）", v2t:"2T卡车", v4t:"4T卡车", v10:"10T卡车", vTr:"挂车",
    dKv:"小件紧急配送", dKt:"小型货物", d2t:"托盘适配", d4t:"中途干线", d10:"长途干线", dTr:"超大型货物",
    title:"车辆装载判定工具", subtitle:"空置空间模拟对应",
    cargoInfo:"📋 货物信息", lbW:"单件重量", lbL:"长 (L)", lbCw:"宽 (W)", lbH:"高 (H)", lbQ:"数量",
    uPcs:"件", uKg:"kg", uCm:"cm",
    totW:"总重量", uVol:"单件体积", totV:"总体积",
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
    lgB:"纸箱", lgD:"空置空间", lgC:"驾驶室",
    font:"'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Hiragino Sans GB', sans-serif",
    langBtn:"🇯🇵 日本語",
  },
};
const VN = { kv:["vKv","dKv"], kt:["vKt","dKt"], "2t":["v2t","d2t"], "4t":["v4t","d4t"], "10":["v10","d10"], tr:["vTr","dTr"] };
function vn(v,t){ const k=VN[v.id]; return k?t[k[0]]:v.id; }
function vd(v,t){ const k=VN[v.id]; return k?t[k[1]]:""; }

const TRUCKS = [
  { id:"kv", w:350,  ew:350,  L:180, W:130, H:120 },
  { id:"kt", w:350,  ew:350,  L:200, W:140, H:180 },
  { id:"2t", w:2000, ew:1700, L:430, W:180, H:200 },
  { id:"4t", w:4000, ew:3700, L:620, W:210, H:240 },
  { id:"10", w:10000,ew:10000,L:960, W:235, H:250 },
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

export default function CargoVehicleTool({ defaultLang = "ja" }) {
  const [w, setW] = useState(6);
  const [l, setL] = useState(80);
  const [cw, setCw] = useState(65);
  const [h, setH] = useState(34);
  const [q, setQ] = useState(12);
  const [fixH, setFixH] = useState(true);
  const [lang, setLang] = useState(defaultLang);
  const t = T[lang];

  // Committed values (only update on button press)
  const [committed, setCommitted] = useState({ w:6, l:80, cw:65, h:34, q:12, fixH:true });
  const [hasResult, setHasResult] = useState(false);

  const doJudge = () => { setCommitted({ w, l, cw, h, q, fixH }); setHasResult(true); };

  // Check if inputs differ from last committed values
  const isDirty = hasResult && (w !== committed.w || l !== committed.l || cw !== committed.cw || h !== committed.h || q !== committed.q || fixH !== committed.fixH);

  // Live summary (always updates)
  const tw = w * q;
  const uv = (l * cw * h) / 1e6;
  const tv = uv * q;

  // Results based on committed values only
  const cargo = useMemo(() => committed, [committed]);
  const ctw = committed.w * committed.q;

  // Check if a single item fits in any regular truck (for trailer fallback)
  const singleItemFitsRegular = useMemo(() => {
    if (!hasResult) return true;
    return TRUCKS.some(v => {
      if (committed.w > v.ew) return false;
      const st = simulate(v, committed.l, committed.cw, committed.h, 1, committed.fixH);
      return st && st.ok;
    });
  }, [committed, hasResult]);

  // Find best single truck
  const best = useMemo(() => {
    if (!hasResult) return null;
    return TRUCKS.find(v => {
      if (ctw > v.ew) return false;
      const st = simulate(v, committed.l, committed.cw, committed.h, committed.q, committed.fixH);
      return st && st.ok;
    });
  }, [committed, hasResult]);

  // Multi-truck calculation: fill 10T first, then find smallest truck for remainder
  const truck10 = TRUCKS.find(v => v.id === "10");
  const multiTruck = useMemo(() => {
    if (!hasResult || best || !singleItemFitsRegular || !truck10) return null;
    const st10 = simulate(truck10, committed.l, committed.cw, committed.h, committed.q, committed.fixH);
    if (!st10) return null;
    const maxPer10 = Math.min(st10.max, Math.floor(truck10.ew / committed.w));
    if (maxPer10 <= 0) return null;

    const num10 = Math.floor(committed.q / maxPer10);
    const remainder = committed.q - num10 * maxPer10;

    if (remainder === 0) {
      return { plan: [{ vehicle: truck10, count: num10, maxPerTruck: maxPer10, assigned: maxPer10 }] };
    }

    // Find smallest truck for the remainder
    let remainVehicle = null;
    for (const v of TRUCKS) {
      if (committed.w * remainder > v.ew) continue;
      const stR = simulate(v, committed.l, committed.cw, committed.h, remainder, committed.fixH);
      if (stR && stR.ok) { remainVehicle = v; break; }
    }

    const plan = [];
    if (remainVehicle && remainVehicle.id !== truck10.id) {
      // Simulate with large qty to find true max capacity of remainder vehicle
      const stRFull = simulate(remainVehicle, committed.l, committed.cw, committed.h, 99999, committed.fixH);
      const trueMax = stRFull ? Math.min(stRFull.max, Math.floor(remainVehicle.ew / committed.w)) : remainder;
      if (num10 > 0) plan.push({ vehicle: truck10, count: num10, maxPerTruck: maxPer10, assigned: maxPer10 });
      plan.push({ vehicle: remainVehicle, count: 1, maxPerTruck: trueMax, assigned: remainder });
    } else {
      // Remainder also needs 10T — consolidate
      plan.push({ vehicle: truck10, count: num10 + 1, maxPerTruck: maxPer10, assigned: maxPer10 });
    }
    return { plan };
  }, [committed, hasResult, best, singleItemFitsRegular]);

  // Trailer: only when single item exceeds all regular trucks
  const needsTrailer = hasResult && !best && !singleItemFitsRegular;
  const trailerSt = needsTrailer ? simulate(TRAILER, committed.l, committed.cw, committed.h, committed.q, committed.fixH) : null;

  const bestSt = best ? simulate(best, committed.l, committed.cw, committed.h, committed.q, committed.fixH) : null;
  const bestCapPct = bestSt ? (committed.q / bestSt.max) * 100 : 0;
  const bestPerLayer = bestSt ? bestSt.nL * bestSt.nW : 0;
  const bestActualTiers = bestPerLayer > 0 ? Math.ceil(committed.q / bestPerLayer) : 0;
  const bestActualGapH = best && bestSt ? best.H - (bestActualTiers * bestSt.bh) : 0;
  const bestHasSmallGap = bestSt && (
    (bestSt.gL > 0 && bestSt.gL < 5) ||
    (bestSt.gW > 0 && bestSt.gW < 5) ||
    (bestActualGapH > 0 && bestActualGapH < 5)
  );
  const bestWPct = best ? (committed.w * committed.q / best.ew * 100) : 0;
  const bestTight = best && bestSt && (
    bestCapPct >= 80 || (bestHasSmallGap && bestCapPct >= 50) || bestWPct > 85
  );

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "16px 12px", fontFamily: t.font }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>📦</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{t.title}</h1>
          <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{t.subtitle}</p>
        </div>
        <button onClick={() => setLang(lang==="ja"?"zh":"ja")} style={{ background:"#f1f5f9", border:"1px solid #e2e8f0", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer", color:"#475569" }}>{t.langBtn}</button>
      </div>

      {/* Input */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginBottom: 10 }}>{t.cargoInfo}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          <Input label={t.lbW} unit={t.uKg} val={w} set={setW} />
          <Input label={t.lbL} unit={t.uCm} val={l} set={setL} />
          <Input label={t.lbCw} unit={t.uCm} val={cw} set={setCw} />
          <Input label={t.lbH} unit={t.uCm} val={h} set={setH} />
          <Input label={t.lbQ} unit={t.uPcs} val={q} set={setQ} min={1} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
          <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t.totW}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{tw.toLocaleString()} <span style={{ fontSize: 11, color: "#94a3b8" }}>kg</span></div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t.uVol}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{uv.toFixed(2)} <span style={{ fontSize: 11, color: "#94a3b8" }}>m³</span></div>
          </div>
          <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{t.totV}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{tv.toFixed(2)} <span style={{ fontSize: 11, color: "#94a3b8" }}>m³</span></div>
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

      {/* Results section */}
      {hasResult && (
        <>
          {/* Dirty warning */}
          {isDirty && (
            <div style={{
              background: "#fffbeb", border: "1px solid #fbbf24", borderRadius: 8,
              padding: "8px 12px", marginBottom: 12, fontSize: 11, color: "#92400e",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.dirtyW}
            </div>
          )}

          {/* Recommendation: single truck */}
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
              {bestTight && (
                <span style={{ fontSize: 10, color: "#92400e", fontWeight: 500 }}>
                  {t.recTN}
                </span>
              )}
            </div>
          )}

          {/* Recommendation: multi-truck */}
          {multiTruck && (
            <div style={{
              background: "#eff6ff", border: "1px solid #93c5fd",
              borderRadius: 10, padding: "12px 16px", marginBottom: 16,
            }}>
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
                  {t.mTot(committed.q,multiTruck.plan.reduce((s,p)=>s+p.count,0))}
                </div>
              </div>
            </div>
          )}

          {/* Recommendation: trailer (single item too large for any truck) */}
          {needsTrailer && (
            <div style={{
              background: "#fefce8", border: "1px solid #fbbf24",
              borderRadius: 10, padding: "12px 16px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#ca8a04" }}>{t.trW}</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{vn(TRAILER,t)}</span>
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
                {t.trEx}
              </div>
              {trailerSt && trailerSt.ok && (
                <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600, marginTop: 4 }}>
                  {t.trOk(trailerSt.max)}
                </div>
              )}
              {trailerSt && !trailerSt.ok && (
                <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 4 }}>
                  {t.trNg(trailerSt.max)}
                </div>
              )}
              {!trailerSt && (
                <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 4 }}>
                  {t.trSzNg}
                </div>
              )}
            </div>
          )}

          {/* Stacking Visualization for recommended vehicle */}
          {best && bestSt && (
            <StackingViz vehicle={best} stacking={bestSt} qty={committed.q} t={t} />
          )}

          {/* Results */}
          <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", marginBottom: 10 }}>{t.resT}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 }}>
            {TRUCKS.map(v => <Card key={v.id} v={v} cargo={cargo} plan={multiTruck ? multiTruck.plan : null} t={t} />)}
            {needsTrailer && <Card v={TRAILER} cargo={cargo} plan={null} t={t} />}
          </div>
        </>
      )}

      <div style={{ marginTop: 16, fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>
        {t.foot}
      </div>
    </div>
  );
}
