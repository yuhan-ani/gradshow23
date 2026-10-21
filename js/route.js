/**
 * 오시는 길 — 약도 위에서 경로가 단계별로 이어지는 길안내 시뮬레이션
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

    let modal = null;
    let svg = null, routeGroup = null;
    let routeIdx = 0, stepIdx = 0;
    let runToken = 0;
    let autoplay = false, autoTimer = null;
    let lastFocus = null;
    let segs = []; // 현재 경로의 조각별 SVG 요소
    let marker = null, markerFadeTimer = null;
    const el = {};

    /* ---------- helpers ---------- */
    function svgEl(name, attrs, parent) {
      const n = document.createElementNS(SVGNS, name);
      Object.keys(attrs || {}).forEach((k) => n.setAttribute(k, attrs[k]));
      if (parent) parent.appendChild(n);
      return n;
    }
    const pathD = (pts) => "M" + pts.map((p) => p[0] + " " + p[1]).join(" L");
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
              <p class="route-modal__eyebrow">Directions · Getting Here</p>
              <h2 class="route-modal__title" id="routeTitle">${esc(cfg.title)}</h2>
              <p class="route-modal__dest">${esc(cfg.destination)}</p>
            </div>
            <button type="button" class="route-modal__close" data-close aria-label="닫기">&times;</button>
          </header>
          <div class="route-orn" aria-hidden="true"><span></span><i></i><span></span></div>
          <div class="route-tabs" role="tablist" aria-label="이동 방법"></div>
          <div class="route-modal__body">
            <div class="route-map-wrap">
              <div class="route-map" id="routeMap"></div>
              <ul class="route-legend" aria-label="약도 색상 안내">
                <li><i class="route-legend__sw route-legend__sw--low"></i>낮은 지대 (지하 2층 높이)</li>
                <li><i class="route-legend__sw route-legend__sw--high"></i>언덕 위 (3층 높이)</li>
                <li><i class="route-legend__sw route-legend__sw--warn"></i>공사 중</li>
                <li><i class="route-legend__sw route-legend__sw--grass"></i>풀밭</li>
              </ul>
              ${cfg.mapNote ? `<p class="route-map-note">※ ${esc(cfg.mapNote)}</p>` : ""}
            </div>
            <div class="route-panel">
              <ul class="route-notices">${(cfg.notices || []).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
              <div class="route-step" aria-live="polite">
                <p class="route-step__count"></p>
                <h3 class="route-step__title"></h3>
                <p class="route-chip" hidden></p>
                <p class="route-step__text"></p>
                <figure class="route-step__photo" hidden>
                  <img alt="" loading="lazy" decoding="async">
                  <figcaption></figcaption>
                </figure>
              </div>
              <div class="route-dots" role="group" aria-label="단계 이동"></div>
              <div class="route-controls">
                <button type="button" class="route-ctl" data-act="prev">이전</button>
                <button type="button" class="route-ctl route-ctl--primary" data-act="next">다음</button>
                <button type="button" class="route-ctl" data-act="play" aria-pressed="false">자동 안내</button>
              </div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);

      el.tabs = modal.querySelector(".route-tabs");
      el.count = modal.querySelector(".route-step__count");
      el.title = modal.querySelector(".route-step__title");
      el.chip = modal.querySelector(".route-chip");
      el.text = modal.querySelector(".route-step__text");
      el.photo = modal.querySelector(".route-step__photo");
      el.photoImg = el.photo.querySelector("img");
      el.photoCap = el.photo.querySelector("figcaption");
      el.dots = modal.querySelector(".route-dots");
      el.prev = modal.querySelector('[data-act="prev"]');
      el.next = modal.querySelector('[data-act="next"]');
      el.play = modal.querySelector('[data-act="play"]');
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

      modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
      el.prev.addEventListener("click", () => { stopAuto(); go(stepIdx - 1); });
      el.next.addEventListener("click", () => { stopAuto(); go(stepIdx + 1); });
      el.play.addEventListener("click", () => (autoplay ? stopAuto() : startAuto()));
      modal.addEventListener("keydown", onKey);

      buildMapBase();
    }

    function buildMapBase() {
      const m = cfg.map;
      svg = svgEl("svg", { viewBox: `0 0 ${m.width} ${m.height}`, class: "route-svg", role: "img", "aria-label": "학교 약도" });
      svgEl("image", { href: m.image, x: 0, y: 0, width: m.width, height: m.height, preserveAspectRatio: "none" }, svg);

      const labels = svgEl("g", { class: "route-labels" }, svg);
      (m.labels || []).forEach((L) => {
        const size = L.poi ? 24 : L.warn ? 28 : L.area ? (L.small ? 20 : 26) : L.small ? 22 : 30;
        const cls = L.dest ? "dest" : L.warn ? "warn" : L.poi ? "poi" : L.area ? "area" : "bld";
        const g = svgEl("g", { class: "route-label route-label--" + cls }, labels);
        if (L.poi) {
          const w = textWidth(L.t, size) + 26;
          svgEl("rect", { x: L.x - w / 2, y: L.y - size * 0.95, width: w, height: size * 1.5, rx: size * 0.75 }, g);
        }
        const t = svgEl("text", { x: L.x, y: L.y, "text-anchor": "middle", "font-size": size }, g);
        t.textContent = L.t;
      });

      routeGroup = svgEl("g", { class: "route-routes" }, svg);
      document.getElementById("routeMap").appendChild(svg);
    }

    /* ---------- route drawing ---------- */
    function renderRoute() {
      routeGroup.textContent = "";
      segs = [];
      const route = cfg.routes[routeIdx];
      const ghost = svgEl("g", { class: "route-ghost" }, routeGroup);
      const live = svgEl("g", { class: "route-live" }, routeGroup);
      const icons = svgEl("g", { class: "route-seg-labels" }, routeGroup);

      route.segments.forEach((s, k) => {
        const d = pathD(s.points);
        const dashed = s.kind === "stairs" || s.kind === "elevator";
        const isJump = s.kind === "jump";
        if (!isJump) svgEl("path", { d, class: "route-ghost__line" }, ghost);

        const outline = svgEl("path", { d, class: "route-line route-line--outline" }, live);
        const line = svgEl("path", { d, class: "route-line route-line--" + s.kind }, live);
        const len = isJump ? 1 : line.getTotalLength();
        let tag = null;
        if (s.label) {
          const mid = isJump ? s.points[0] : line.getPointAtLength(len / 2);
          const tx = mid.x != null ? mid.x : mid[0], ty = mid.y != null ? mid.y : mid[1];
          const w = textWidth(s.label.t, 22) + 22;
          tag = svgEl("g", { class: "route-seg-tag", transform: `translate(${tx + (s.label.dx || 0)} ${ty + (s.label.dy || 0)})` }, icons);
          svgEl("rect", { x: -w / 2, y: -17, width: w, height: 32, rx: 16 }, tag);
          const t = svgEl("text", { x: 0, y: 6, "text-anchor": "middle", "font-size": 22 }, tag);
          t.textContent = s.label.t;
        }
        segs.push({ s, outline, line, len, dashed, isJump, tag, p: 0 });
        setProgress(k, 0);
      });

      // 출발 / 도착 표시
      const first = route.segments[0].points[0];
      const lastSeg = route.segments[route.segments.length - 1];
      const end = lastSeg.points[lastSeg.points.length - 1];
      const start = svgEl("g", { class: "route-start", transform: `translate(${first[0]} ${first[1]})` }, routeGroup);
      svgEl("circle", { r: 15 }, start);
      const st = svgEl("text", { y: -26, "text-anchor": "middle", "font-size": 24 }, start);
      st.textContent = "출발";
      const dest = svgEl("g", { class: "route-end", transform: `translate(${end[0]} ${end[1]})` }, routeGroup);
      svgEl("polygon", { points: "0,-26 7,-8 26,0 7,8 0,26 -7,8 -26,0 -7,-8" }, dest);

      marker = svgEl("g", { class: "route-marker" }, routeGroup);
      svgEl("circle", { r: 26, class: "route-marker__pulse" }, marker);
      svgEl("circle", { r: 13, class: "route-marker__dot" }, marker);
      placeMarker(first);
    }

    function dashArrayFor(seg, p) {
      if (!seg.dashed) {
        return seg.len + " " + (seg.len + 4);
      }
      const target = seg.len * p, parts = [];
      let pos = 0;
      while (pos < target - 0.01) {
        const dash = Math.min(14, target - pos); parts.push(dash); pos += dash;
        if (pos >= target - 0.01) break;
        const gap = Math.min(10, target - pos); parts.push(gap); pos += gap;
      }
      if (parts.length % 2 === 1) parts.push(seg.len + 50); else { parts.push(0); parts.push(seg.len + 50); }
      return parts.join(" ");
    }

    function setProgress(k, p) {
      const seg = segs[k];
      seg.p = p;
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
        seg.line.style.strokeDasharray = seg.len + " " + (seg.len + 4);
        seg.outline.style.strokeDasharray = seg.len + " " + (seg.len + 4);
        seg.line.style.strokeDashoffset = off; seg.outline.style.strokeDashoffset = off;
      }
      const vis = p > 0.001 ? "1" : "0";
      seg.line.style.opacity = vis; seg.outline.style.opacity = vis;
      if (seg.tag) seg.tag.classList.toggle("is-on", p > 0.98);
    }

    function pointAt(k, p) {
      const seg = segs[k];
      if (seg.isJump) { const pt = p < 1 ? seg.s.points[0] : seg.s.points[seg.s.points.length - 1]; return pt; }
      const q = seg.line.getPointAtLength(seg.len * p);
      return [q.x, q.y];
    }
    function placeMarker(pt) { marker.setAttribute("transform", `translate(${pt[0]} ${pt[1]})`); }

    function endOf(k) {
      const pts = segs[k].s.points; return pts[pts.length - 1];
    }
    function startOf(k) { return segs[k].s.points[0]; }

    function animateSeg(k, token) {
      const seg = segs[k];
      if (seg.isJump) {
        // 건물 안에서의 이동: 표시가 사라졌다가 도착 지점에서 나타난다
        return new Promise(async (res) => {
          marker.classList.add("is-hidden");
          await sleep(reduceMotion ? 0 : 450);
          if (token !== runToken) return res();
          placeMarker(endOf(k)); setProgress(k, 1);
          marker.classList.remove("is-hidden");
          await sleep(reduceMotion ? 0 : 350);
          res();
        });
      }
      return new Promise((res) => {
        if (reduceMotion) { setProgress(k, 1); placeMarker(endOf(k)); return res(); }
        const dur = Math.max(650, Math.min(2200, seg.len * (seg.dashed ? 2.4 : 2.0)));
        const t0 = performance.now();
        (function frame(now) {
          if (token !== runToken) return res();
          const t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease in-out
          setProgress(k, e);
          placeMarker(pointAt(k, e));
          if (t < 1) requestAnimationFrame(frame); else res();
        })(t0);
      });
    }

    /* ---------- steps ---------- */
    async function go(i, opts) {
      const route = cfg.routes[routeIdx];
      i = Math.max(0, Math.min(route.steps.length - 1, i));
      const token = ++runToken;
      stepIdx = i;
      updatePanel();

      const drawnBefore = new Set();
      route.steps.slice(0, i).forEach((s) => s.draw.forEach((k) => drawnBefore.add(k)));
      const cur = route.steps[i].draw;
      segs.forEach((seg, k) => {
        if (drawnBefore.has(k)) setProgress(k, 1);
        else if (!cur.includes(k)) setProgress(k, 0);
      });

      // 이 단계가 시작되는 위치에 표시를 둔다
      const prev = i > 0 ? route.steps[i - 1].draw : null;
      const startPt = prev ? endOf(prev[prev.length - 1]) : startOf(cur[0]);
      marker.classList.remove("is-hidden");
      placeMarker(startPt);
      cur.forEach((k) => { if (!segs[k].isJump) setProgress(k, 0); });

      if (opts && opts.instant) {
        cur.forEach((k) => setProgress(k, 1));
        placeMarker(endOf(cur[cur.length - 1]));
        marker.classList.remove("is-hidden");
        return;
      }
      for (const k of cur) {
        if (token !== runToken) return;
        await animateSeg(k, token);
      }
    }

    function updatePanel() {
      const route = cfg.routes[routeIdx];
      const step = route.steps[stepIdx];
      el.count.textContent = `STEP ${stepIdx + 1} / ${route.steps.length}`;
      el.title.textContent = step.title;
      el.text.textContent = step.text;
      if (step.chip) {
        el.chip.hidden = false;
        el.chip.textContent = step.chip.text;
        el.chip.className = "route-chip route-chip--" + step.chip.type;
      } else { el.chip.hidden = true; }
      if (step.photo) {
        el.photo.hidden = false;
        el.photoImg.src = step.photo.src;
        el.photoImg.alt = step.photo.caption || "";
        el.photoCap.textContent = step.photo.caption || "";
      } else { el.photo.hidden = true; el.photoImg.removeAttribute("src"); }

      el.dots.textContent = "";
      route.steps.forEach((s, i) => {
        const d = document.createElement("button");
        d.type = "button";
        d.className = "route-dot" + (i === stepIdx ? " is-current" : i < stepIdx ? " is-done" : "");
        d.setAttribute("aria-label", `${i + 1}단계: ${s.title}`);
        if (i === stepIdx) d.setAttribute("aria-current", "step");
        d.addEventListener("click", () => { stopAuto(); go(i); });
        el.dots.appendChild(d);
      });
      el.prev.disabled = stepIdx === 0;
      const last = stepIdx === route.steps.length - 1;
      el.next.disabled = last;

      [...el.tabs.children].forEach((b, i) => {
        b.classList.toggle("is-active", i === routeIdx);
        b.setAttribute("aria-selected", String(i === routeIdx));
      });
    }

    function selectRoute(i) {
      stopAuto();
      routeIdx = i;
      renderRoute();
      go(0);
    }

    /* ---------- autoplay ---------- */
    function startAuto() {
      autoplay = true;
      el.play.setAttribute("aria-pressed", "true");
      el.play.textContent = "안내 정지";
      const route = cfg.routes[routeIdx];
      const begin = async () => {
        let i = stepIdx >= route.steps.length - 1 ? 0 : stepIdx;
        while (autoplay) {
          await go(i);
          if (!autoplay) break;
          await new Promise((r) => { autoTimer = setTimeout(r, reduceMotion ? 1600 : 1800); });
          if (!autoplay) break;
          if (i >= route.steps.length - 1) break;
          i++;
        }
        stopAuto();
      };
      begin();
    }
    function stopAuto() {
      autoplay = false;
      clearTimeout(autoTimer);
      if (el.play) { el.play.setAttribute("aria-pressed", "false"); el.play.textContent = "자동 안내"; }
    }

    /* ---------- open / close ---------- */
    function open() {
      if (!modal) build();
      lastFocus = document.activeElement;
      modal.hidden = false;
      document.documentElement.classList.add("route-open");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      routeIdx = 0;
      renderRoute();
      go(0);
      el.close.focus({ preventScroll: true });
    }
    function close() {
      stopAuto();
      runToken++;
      modal.classList.remove("is-open");
      modal.hidden = true;
      document.documentElement.classList.remove("route-open");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); close(); return; }
      if (e.key === "ArrowRight") { stopAuto(); go(stepIdx + 1); return; }
      if (e.key === "ArrowLeft") { stopAuto(); go(stepIdx - 1); return; }
      if (e.key === "Tab") {
        const f = [...modal.querySelectorAll("button:not([disabled]), a[href]")].filter((n) => n.offsetParent !== null);
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
