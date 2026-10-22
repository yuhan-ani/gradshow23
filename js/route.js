/**
 * 오시는 길 — 약도 위에 경로를 그리고, 약도의 사진 버튼을 누르면 사진을 보여 준다
 * 데이터는 js/data.js 의 SHOWCASE_DATA.directions 를 읽는다.
 */
(function () {
  "use strict";

  const cfg = window.SHOWCASE_DATA && window.SHOWCASE_DATA.directions;
  const SVGNS = "http://www.w3.org/2000/svg";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function init() {
    const openBtn = document.getElementById("routeOpen");
    if (!openBtn) return;
    if (!cfg || !cfg.routes || !cfg.routes.length) { openBtn.remove(); return; }

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let modal = null, svg = null, routeGroup = null, spotGroup = null;
    let routeIdx = 0, runToken = 0, lastFocus = null;
    let segs = [], marker = null, spots = [], viewerIdx = -1, viewerSpot = null;
    const el = {};

    /* ---------- helpers ---------- */
    function svgEl(name, attrs, parent) {
      const n = document.createElementNS(SVGNS, name);
      Object.keys(attrs || {}).forEach((k) => n.setAttribute(k, attrs[k]));
      if (parent) parent.appendChild(n);
      return n;
    }
    // 꺾이는 곳을 둥글게 이어서 부드러운 길로 그린다
    const pathD = (pts, r = 22) => {
      if (pts.length < 3) return "M" + pts.map((p) => p[0] + " " + p[1]).join(" L");
      let d = "M" + pts[0][0] + " " + pts[0][1];
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1], b = pts[i], c = pts[i + 1];
        const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
        const k = Math.min(r, l1 / 2, l2 / 2);
        const p1 = [b[0] + (a[0] - b[0]) * k / l1, b[1] + (a[1] - b[1]) * k / l1];
        const p2 = [b[0] + (c[0] - b[0]) * k / l2, b[1] + (c[1] - b[1]) * k / l2];
        d += " L" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + " Q" + b[0] + " " + b[1] + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
      }
      const z = pts[pts.length - 1];
      return d + " L" + z[0] + " " + z[1];
    };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    function textWidth(t, size) {
      let w = 0;
      for (const ch of t) w += /[ㄱ-힣]/.test(ch) ? size : size * 0.58;
      return w;
    }

    /* ---------- build modal ---------- */
    function build() {
      modal = document.createElement("div");
      modal.className = "route-modal";
      modal.id = "routeModal";
      modal.hidden = true;
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-labelledby", "routeTitle");
      modal.innerHTML = `
        <div class="route-modal__backdrop" data-close></div>
        <div class="route-modal__box">
          <header class="route-modal__head">
            <div>
              <h2 class="route-modal__title" id="routeTitle">${esc(cfg.title)}</h2>
              <p class="route-modal__dest">${esc(cfg.destination)}</p>
              ${cfg.address ? `<p class="route-modal__addr">${esc(cfg.address)}</p>` : ""}
            </div>
            <button type="button" class="route-modal__close" data-close aria-label="닫기">&times;</button>
          </header>
          ${cfg.notice ? `<p class="route-notice">${esc(cfg.notice)}</p>` : ""}
          <div class="route-tabs" role="tablist" aria-label="이동 방법"></div>
          <div class="route-map" id="routeMap"></div>
          <div class="route-bar">
            <div class="route-photobar" hidden>
              <p class="route-hint">번호를 누르면 실제 길 사진을 볼 수 있습니다.</p>
              <button type="button" class="route-toggle" aria-pressed="true">사진 번호 표시</button>
            </div>
            <button type="button" class="route-replay">경로 다시 보기</button>
          </div>
          <div class="route-viewer" hidden>
            <div class="route-viewer__backdrop" data-viewer-close></div>
            <figure class="route-viewer__box">
              <img alt="">
              <figcaption></figcaption>
              <button type="button" class="route-viewer__btn route-viewer__prev" aria-label="이전 사진">&#8249;</button>
              <button type="button" class="route-viewer__btn route-viewer__next" aria-label="다음 사진">&#8250;</button>
              <button type="button" class="route-viewer__btn route-viewer__close" data-viewer-close aria-label="사진 닫기">&times;</button>
            </figure>
          </div>
        </div>`;
      document.body.appendChild(modal);

      el.tabs = modal.querySelector(".route-tabs");
      el.photoBar = modal.querySelector(".route-photobar");
      el.toggle = modal.querySelector(".route-toggle");
      el.replay = modal.querySelector(".route-replay");
      el.viewer = modal.querySelector(".route-viewer");
      el.vImg = el.viewer.querySelector("img");
      el.vCap = el.viewer.querySelector("figcaption");
      el.vPrev = el.viewer.querySelector(".route-viewer__prev");
      el.vNext = el.viewer.querySelector(".route-viewer__next");
      el.close = modal.querySelector(".route-modal__close");

      cfg.routes.forEach((r, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "route-tab";
        b.setAttribute("role", "tab");
        b.innerHTML = `<span class="route-tab__name">${esc(r.name)}</span><span class="route-tab__tag">${esc(r.tag || "")}</span>`;
        b.addEventListener("click", () => selectRoute(i));
        el.tabs.appendChild(b);
      });

      modal.addEventListener("click", (e) => {
        if (e.target.closest("[data-viewer-close]")) { closeViewer(); return; }
        if (e.target.closest("[data-close]")) close();
      });
      el.replay.addEventListener("click", () => play());
      el.toggle.addEventListener("click", () => {
        const on = el.toggle.getAttribute("aria-pressed") !== "true";
        el.toggle.setAttribute("aria-pressed", on ? "true" : "false");
        spotGroup.style.display = on ? "" : "none";
        if (!on) closeViewer();
      });
      el.vPrev.addEventListener("click", () => showSpot(viewerIdx - 1));
      el.vNext.addEventListener("click", () => showSpot(viewerIdx + 1));
      modal.addEventListener("keydown", onKey);

      buildMapBase();
    }

    function buildMapBase() {
      const m = cfg.map;
      svg = svgEl("svg", { viewBox: `0 0 ${m.width} ${m.height}`, class: "route-svg", role: "img", "aria-label": "학교 약도" });
      svgEl("image", { href: m.image, x: 0, y: 0, width: m.width, height: m.height, preserveAspectRatio: "none" }, svg);

      const labels = svgEl("g", { class: "route-labels" }, svg);
      (m.labels || []).forEach((L) => {
        const size = L.s || 28;
        const cls = L.dest ? "dest" : L.warn ? "warn" : L.poi ? "poi" : L.area ? "area" : L.court ? "court" : "bld";
        const g = svgEl("g", { class: "route-label route-label--" + cls }, labels);
        if (L.r) g.setAttribute("transform", `rotate(${L.r} ${L.x} ${L.y})`);
        if (L.poi) {
          const w = textWidth(L.t, size) + 28;
          svgEl("rect", { x: L.x - w / 2, y: L.y - size * 0.98, width: w, height: size * 1.52, rx: size * 0.76 }, g);
        }
        const t = svgEl("text", { x: L.x, y: L.y, "text-anchor": "middle", "font-size": size }, g);
        t.textContent = L.t;
      });

      // 공사로 끊긴 길: 점선이 공사 구간에 닿아 멈춘다
      (m.blocked || []).forEach((b) => {
        const g = svgEl("g", { class: "route-blocked" }, svg);
        const d = pathD(b.points, 18);
        svgEl("path", { d, class: "route-blocked__outline" }, g);
        svgEl("path", { d, class: "route-blocked__line" }, g);
        const e = b.points[b.points.length - 1];
        const x = svgEl("g", { class: "route-blocked__x", transform: `translate(${e[0]} ${e[1]})` }, g);
        svgEl("circle", { r: 20 }, x);
        svgEl("path", { d: "M-9 -9L9 9M9 -9L-9 9" }, x);
        if (b.label) {
          const size = 24, w = textWidth(b.label.t, size) + 26;
          const pill = svgEl("g", { class: "route-blocked__label", transform: `translate(${e[0] + (b.label.dx || 0)} ${e[1] + (b.label.dy || 0)})` }, g);
          svgEl("rect", { x: -w / 2, y: -size * 0.95, width: w, height: size * 1.5, rx: size * 0.75 }, pill);
          const t = svgEl("text", { x: 0, y: 0, "text-anchor": "middle", "font-size": size }, pill);
          t.textContent = b.label.t;
        }
      });

      routeGroup = svgEl("g", { class: "route-routes" }, svg);
      spotGroup = svgEl("g", { class: "route-spots" }, svg);
      modal.querySelector("#routeMap").appendChild(svg);
    }

    /* ---------- route drawing ---------- */
    function renderRoute() {
      routeGroup.textContent = "";
      spotGroup.textContent = "";
      segs = [];
      const route = cfg.routes[routeIdx];
      const live = svgEl("g", { class: "route-live" }, routeGroup);
      const icons = svgEl("g", { class: "route-seg-labels" }, routeGroup);

      route.segments.forEach((s) => {
        const d = pathD(s.points);
        const isJump = s.kind === "jump";
        const dashed = s.kind === "stairs" || s.kind === "elevator";
        const outline = svgEl("path", { d, class: "route-line route-line--outline" }, live);
        const line = svgEl("path", { d, class: "route-line route-line--" + s.kind }, live);
        const len = isJump ? 1 : line.getTotalLength();
        let tag = null;
        if (s.label) {
          const mid = isJump ? { x: s.points[0][0], y: s.points[0][1] } : line.getPointAtLength(len / 2);
          const w = textWidth(s.label.t, 28) + 28;
          tag = svgEl("g", { class: "route-seg-tag", transform: `translate(${mid.x + (s.label.dx || 0)} ${mid.y + (s.label.dy || 0)})` }, icons);
          svgEl("rect", { x: -w / 2, y: -23, width: w, height: 44, rx: 22 }, tag);
          const t = svgEl("text", { x: 0, y: 9, "text-anchor": "middle", "font-size": 28 }, tag);
          t.textContent = s.label.t;
        }
        segs.push({ s, outline, line, len, dashed, isJump, tag });
      });

      const first = route.segments[0].points[0];
      const lastSeg = route.segments[route.segments.length - 1];
      const end = lastSeg.points[lastSeg.points.length - 1];
      const start = svgEl("g", { class: "route-start", transform: `translate(${first[0]} ${first[1]})` }, routeGroup);
      svgEl("circle", { r: 15 }, start);
      const st = svgEl("text", { y: -28, "text-anchor": "middle", "font-size": 28 }, start);
      st.textContent = "출발";
      const dest = svgEl("g", { class: "route-end", transform: `translate(${end[0]} ${end[1]})` }, routeGroup);
      svgEl("polygon", { points: "0,-30 8,-9 30,0 8,9 0,30 -8,9 -30,0 -8,-9" }, dest);

      marker = svgEl("g", { class: "route-marker" }, routeGroup);
      svgEl("circle", { r: 28, class: "route-marker__pulse" }, marker);
      svgEl("circle", { r: 13, class: "route-marker__dot" }, marker);

      renderSpots(route);
    }

    // 사진 점이 경로 선 위에 겹치지 않도록, 선에서 조금 떨어진 곳으로 옮긴다
    function nudgeFromRoute(p, route) {
      if (p.onRoute) return [p.x, p.y];
      const MIN = 42;
      let best = null;
      route.segments.forEach((s) => {
        if (s.kind === "jump") return;
        for (let i = 0; i < s.points.length - 1; i++) {
          const a = s.points[i], b = s.points[i + 1];
          const dx = b[0] - a[0], dy = b[1] - a[1], len2 = dx * dx + dy * dy || 1;
          const t = Math.max(0, Math.min(1, ((p.x - a[0]) * dx + (p.y - a[1]) * dy) / len2));
          const qx = a[0] + t * dx, qy = a[1] + t * dy;
          const d = Math.hypot(p.x - qx, p.y - qy);
          if (!best || d < best.d) best = { d, qx, qy, nx: -dy, ny: dx };
        }
      });
      if (!best || best.d >= MIN) return [p.x, p.y];
      let vx = p.x - best.qx, vy = p.y - best.qy;
      if (Math.hypot(vx, vy) < 1) { vx = best.nx; vy = best.ny; }
      const k = MIN / Math.hypot(vx, vy);
      return [best.qx + vx * k, best.qy + vy * k];
    }

    function renderSpots(route) {
      // 이름(문자열)으로 적은 사진 버튼은 spotLib 에서 가져온다
      spots = (route.spots || [])
        .map((p) => (typeof p === "string" ? (cfg.spotLib || {})[p] : p && p.ref ? Object.assign({}, (cfg.spotLib || {})[p.ref], p) : p))
        .filter((p) => p && p.photos && p.photos.length);
      el.photoBar.hidden = !spots.length;
      spots.forEach((p, i) => {
        const [x, y] = nudgeFromRoute(p, route);
        const g = svgEl("g", { class: "route-spot", transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`, tabindex: "0", role: "button", "aria-label": (p.label || "사진") + " 사진 보기" }, spotGroup);
        svgEl("circle", { r: 34, class: "route-spot__hit" }, g);
        svgEl("circle", { r: 19, class: "route-spot__bg" }, g);
        const t = svgEl("text", { x: 0, y: 9, "text-anchor": "middle", "font-size": 24, class: "route-spot__num" }, g);
        t.textContent = String(i + 1);
        const act = () => openViewer(i);
        g.addEventListener("click", act);
        g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
      });
    }

    function dashArrayFor(seg, p) {
      const target = seg.len * p, parts = [];
      let pos = 0;
      while (pos < target - 0.01) {
        const dash = Math.min(16, target - pos); parts.push(dash); pos += dash;
        if (pos >= target - 0.01) break;
        const gap = Math.min(11, target - pos); parts.push(gap); pos += gap;
      }
      if (parts.length % 2 === 1) parts.push(seg.len + 50); else { parts.push(0); parts.push(seg.len + 50); }
      return parts.join(" ");
    }

    function setProgress(k, p) {
      const seg = segs[k];
      if (seg.isJump) {
        seg.line.style.opacity = p > 0.99 ? "1" : "0"; seg.outline.style.display = "none";
        if (seg.tag) seg.tag.classList.toggle("is-on", p > 0.98);
        return;
      }
      if (seg.dashed) {
        const da = dashArrayFor(seg, p);
        seg.line.style.strokeDasharray = da; seg.outline.style.strokeDasharray = da;
        seg.line.style.strokeDashoffset = 0; seg.outline.style.strokeDashoffset = 0;
      } else {
        const off = seg.len * (1 - p);
        const da = seg.len + " " + (seg.len + 4);
        seg.line.style.strokeDasharray = da; seg.outline.style.strokeDasharray = da;
        seg.line.style.strokeDashoffset = off; seg.outline.style.strokeDashoffset = off;
      }
      const vis = p > 0.001 ? "1" : "0";
      seg.line.style.opacity = vis; seg.outline.style.opacity = vis;
      if (seg.tag) seg.tag.classList.toggle("is-on", p > 0.98);
    }

    const placeMarker = (pt) => marker.setAttribute("transform", `translate(${pt[0]} ${pt[1]})`);
    const endOf = (k) => { const pts = segs[k].s.points; return pts[pts.length - 1]; };
    const startOf = (k) => segs[k].s.points[0];

    function animateSeg(k, token) {
      const seg = segs[k];
      if (seg.isJump) {
        return new Promise(async (res) => {
          marker.classList.add("is-hidden");
          await sleep(reduceMotion ? 0 : 450);
          if (token !== runToken) return res();
          placeMarker(endOf(k)); setProgress(k, 1);
          marker.classList.remove("is-hidden");
          await sleep(reduceMotion ? 0 : 300);
          res();
        });
      }
      return new Promise((res) => {
        if (reduceMotion) { setProgress(k, 1); placeMarker(endOf(k)); return res(); }
        const dur = Math.max(500, Math.min(1500, seg.len * 1.6));
        const t0 = performance.now();
        (function frame(now) {
          if (token !== runToken) return res();
          const t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          setProgress(k, e);
          const q = seg.line.getPointAtLength(seg.len * e);
          placeMarker([q.x, q.y]);
          if (t < 1) requestAnimationFrame(frame); else res();
        })(t0);
      });
    }

    // 경로를 처음부터 차례로 그린다
    async function play() {
      const token = ++runToken;
      segs.forEach((_, k) => setProgress(k, 0));
      marker.classList.remove("is-hidden");
      placeMarker(startOf(0));
      for (let k = 0; k < segs.length; k++) {
        await animateSeg(k, token);
        if (token !== runToken) return;
      }
    }

    function selectRoute(i) {
      routeIdx = i;
      [...el.tabs.children].forEach((b, j) => { b.classList.toggle("is-active", j === i); b.setAttribute("aria-selected", j === i ? "true" : "false"); });
      closeViewer();
      renderRoute();
      play();
    }

    /* ---------- 사진 보기 ---------- */
    function openViewer(i) {
      viewerSpot = spots[i];
      el.viewer.hidden = false;
      showSpot(0);
      el.viewer.querySelector(".route-viewer__close").focus({ preventScroll: true });
    }
    function showSpot(i) {
      if (!viewerSpot) return;
      const list = viewerSpot.photos;
      viewerIdx = (i + list.length) % list.length;
      const p = list[viewerIdx];
      el.vImg.src = p.src;
      el.vImg.alt = p.caption || viewerSpot.label || "";
      el.vCap.textContent = (p.caption || viewerSpot.label || "") + (list.length > 1 ? `  (${viewerIdx + 1}/${list.length})` : "");
      const many = list.length > 1;
      el.vPrev.hidden = !many; el.vNext.hidden = !many;
    }
    function closeViewer() {
      if (!el.viewer || el.viewer.hidden) return;
      el.viewer.hidden = true;
      el.vImg.removeAttribute("src");
      viewerIdx = -1;
      viewerSpot = null;
    }

    /* ---------- open / close ---------- */
    function open() {
      if (!modal) build();
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.documentElement.classList.add("route-open");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      selectRoute(0);
      el.close.focus({ preventScroll: true });
    }
    function close() {
      runToken++;
      closeViewer();
      modal.classList.remove("is-open");
      modal.hidden = true;
      document.documentElement.classList.remove("route-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); if (!el.viewer.hidden) closeViewer(); else close(); return; }
      if (!el.viewer.hidden) {
        if (e.key === "ArrowRight") showSpot(viewerIdx + 1);
        else if (e.key === "ArrowLeft") showSpot(viewerIdx - 1);
      }
      if (e.key === "Tab") {
        const scope = el.viewer.hidden ? modal : el.viewer;
        const f = [...scope.querySelectorAll("button:not([disabled]):not([hidden]), [tabindex='0']")].filter((n) => n.offsetParent !== null || n.closest("svg"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    openBtn.addEventListener("click", open);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
