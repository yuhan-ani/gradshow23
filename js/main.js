/**
 * DRAWN TO THE SPOTLIGHT — 상영회 사이트 렌더링 & 인터랙션
 * SHOWCASE_DATA(js/data.js)를 읽어 화면을 구성합니다.
 */
(function () {
  "use strict";

  const data = window.SHOWCASE_DATA;
  if (!data) return;

  /* ---------------------------------------------------------
     0. YouTube IFrame API — lazy load, 1회만
  --------------------------------------------------------- */
  let ytApiPromise = null;
  function loadYouTubeAPI() {
    if (ytApiPromise) return ytApiPromise;
    ytApiPromise = new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (typeof prevCallback === "function") prevCallback();
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    });
    return ytApiPromise;
  }

  /* ---------------------------------------------------------
     1. 히어로
  --------------------------------------------------------- */
  function renderHero() {
    const h = data.hero;
    setText("heroEdition", h.edition);
    setHeroTitleArc("heroTitle", h.title);
    setText("heroSubtitle", h.subtitle);
    setText("heroPeriod", h.period);
    setText("heroVenue", h.venue);

    const posterImg = document.querySelector(".hero__poster");
    if (posterImg && h.posterImage) posterImg.src = h.posterImage;

    renderHeroGallery();
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  }

  /* --- 타이틀을 글자 단위로 쪼개 완만한 원호 위에 올리고, 첫 글자를 드롭캡처럼 키움 --- */
  function setHeroTitleArc(id, text) {
    const el = document.getElementById(id);
    if (!el || text == null) return;

    el.setAttribute("aria-label", text);
    el.textContent = "";

    let firstLetterDone = false;
    Array.from(text).forEach((ch) => {
      const span = document.createElement("span");
      span.className = "hero__title-char";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ch;

      if (ch === " ") {
        span.className += " hero__title-char--space";
      } else if (!firstLetterDone) {
        span.className += " hero__title-dropcap";
        firstLetterDone = true;
      }
      el.appendChild(span);
    });

    layoutHeroTitleArc(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layoutHeroTitleArc(el));

    let raf = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => layoutHeroTitleArc(el));
    });
  }

  /* 실제 글자 위치(x)를 재서 큰 원 위에 배치 — 글자 폭이 달라도 곡선이 매끈하고, 기울기는 그 지점의 접선과 일치 */
  function layoutHeroTitleArc(el) {
    const spans = Array.from(el.querySelectorAll(".hero__title-char"));
    if (!spans.length) return;

    spans.forEach((s) => { s.style.transform = "none"; s.style.marginLeft = "0"; });

    // 글자를 쪼개면 A-W 같은 쌍의 커닝이 사라지므로, 쌍을 붙였을 때의 폭과의 차이만큼 간격을 되돌린다
    const kerns = spans.map((s, i) => {
      const prev = spans[i - 1];
      const skip = !prev || s.classList.contains("hero__title-char--space") || prev.classList.contains("hero__title-char--space") ||
        s.classList.contains("hero__title-dropcap") || prev.classList.contains("hero__title-dropcap");
      if (skip) return 0;
      const probe = document.createElement("span");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
      probe.textContent = prev.textContent + s.textContent;
      el.appendChild(probe);
      const pairWidth = probe.getBoundingClientRect().width;
      el.removeChild(probe);
      return pairWidth - prev.getBoundingClientRect().width - s.getBoundingClientRect().width;
    });
    // 폰트에 보정값이 없는 대각선 쌍은 눈으로 맞춘 값(em)을 직접 적용
    const manualKern = { AW: -0.17, WA: -0.08, AV: -0.1, VA: -0.1, AT: -0.08, TA: -0.08, LT: -0.06, TL: -0.04 };
    spans.forEach((s, i) => {
      if (!i) return;
      const pair = spans[i - 1].textContent + s.textContent;
      const manual = manualKern[pair] ? manualKern[pair] * parseFloat(getComputedStyle(s).fontSize) : 0;
      const total = (kerns[i] || 0) + manual;
      if (total) s.style.marginLeft = `${total.toFixed(2)}px`;
    });

    // 글자 크기가 달라도(드롭캡) 같은 바닥선 위에서 돌도록, 회전 기준점을 박스 아래가 아니라 실제 baseline에 둔다
    const baselines = spans.map((s) => {
      const probe = document.createElement("i");
      probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
      s.appendChild(probe);
      const b = probe.getBoundingClientRect().bottom - s.getBoundingClientRect().top;
      s.removeChild(probe);
      return b;
    });

    const left = spans[0].getBoundingClientRect().left;
    const right = spans[spans.length - 1].getBoundingClientRect().right;
    const half = (right - left) / 2;
    if (half <= 0) return;
    const center = left + half;

    const edgeDeg = 7;  // 양 끝 글자가 기우는 각도 — 작을수록 완만
    const radius = half / Math.sin((edgeDeg * Math.PI) / 180);

    spans.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const x = r.left + r.width / 2 - center;
      s.style.transformOrigin = `50% ${baselines[i].toFixed(1)}px`;
      const a = Math.asin(Math.max(-1, Math.min(1, x / radius)));
      const drop = radius * (1 - Math.cos(a));  // 가운데는 0, 양 끝으로 갈수록 아래로
      s.style.transform = `translateY(${drop.toFixed(1)}px) rotate(${((a * 180) / Math.PI).toFixed(2)}deg)`;
    });
  }

  /* --- 스포트라이트 빔 안에 쌓이는 액자 갤러리(11개): 흩어진 시작 위치 → 최종 위치로 "날아와 눌러앉는"
         바로 그 엘리먼트가 애니메이션이 끝난 뒤에도 그대로 Hero의 실제 UI로 남는다(별도 인트로 없음) --- */
  function renderHeroGallery() {
    const wrap = document.getElementById("heroGallery");
    if (!wrap) return;

    const teams = data.teams.slice().sort((a, b) => a.order - b.order);
    wrap.innerHTML = "";

    // 8방향(상/우상/우/우하/하/좌하/좌/좌상)에서 각자 다른 위치로 날아들어옴
    const directions = [
      { x: 0, y: -1 },
      { x: 0.8, y: -0.8 },
      { x: 1, y: 0 },
      { x: 0.8, y: 0.8 },
      { x: 0, y: 1 },
      { x: -0.8, y: 0.8 },
      { x: -1, y: 0 },
      { x: -0.8, y: -0.8 }
    ];
    const travel = 320;
    const n = teams.length;

    // 화면 크기와 상관없이 항상 같은 모양이 되도록 고정 px 좌표 사용 (컨테이너 240x500, 포스터 64x96)
    const firstY = 52;
    const lastY = 452;
    const pitch = (lastY - firstY) / Math.max(n - 1, 1);

    teams.forEach((team, i) => {
      const frame = document.createElement("div");
      frame.className = "hero__gallery-frame";

      // 최종 위치: 가운데를 중심으로 살짝 지그재그, 겹침, 크기 변화를 주어
      // "불규칙하지만 균형 있게 이어진 하나의 조형물"처럼 보이게 함
      const topPx = firstY + i * pitch;
      const zig = (i % 2 === 0 ? 1 : -1) * (32 + Math.sin(i * 2.1) * 8);  // 좌우로 번갈아, 이웃과 거의 닿을 만큼만 벌림
      const restRot = Math.sin(i * 1.7) * 4.2;
      const scale = 0.86 + 0.2 * Math.abs(Math.sin(i * 1.1 + 0.4));
      const jitter = Math.sin(i * 3.3) * 0.5 + 0.5; // 0~1, 포스터마다 다른 느낌을 주는 지터

      frame.style.top = `${topPx.toFixed(0)}px`;
      frame.style.left = `calc(50% + ${zig.toFixed(0)}px)`;
      frame.style.setProperty("--z", String(i + 1));
      frame.style.setProperty("--rot", `${restRot.toFixed(2)}deg`);
      frame.style.setProperty("--scale", scale.toFixed(2));

      // 시작 상태: 화면 가장자리 방향으로 흩어져 있고 더 많이 돌아가 있음
      const dir = directions[i % directions.length];
      frame.style.setProperty("--fx", `${(dir.x * travel * (0.8 + jitter * 0.4)).toFixed(0)}px`);
      frame.style.setProperty("--fy", `${(dir.y * travel * (0.8 + jitter * 0.4)).toFixed(0)}px`);
      frame.style.setProperty("--frot", `${(restRot + (i % 2 === 0 ? -1 : 1) * (26 + jitter * 14)).toFixed(1)}deg`);
      frame.style.setProperty("--delay", `${(jitter * 0.45 + i * 0.045).toFixed(2)}s`);
      frame.style.setProperty("--dur", `${(1.05 + jitter * 0.35).toFixed(2)}s`);

      const mat = document.createElement("div");
      mat.className = "hero__gallery-mat";

      if (team.thumbnail) {
        frame.classList.add("hero__gallery-frame--image");
        const img = document.createElement("img");
        img.src = team.thumbnail;
        img.alt = "";
        mat.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "hero__gallery-placeholder";
        mat.appendChild(placeholder);
      }

      frame.appendChild(mat);
      wrap.appendChild(frame);
    });
  }

  /* --- Hero 등장 애니메이션: 극장 암전 → 포스터 조립 → 스포트라이트 점등 → 금장식/타이틀 리빌.
         끝나도 다른 화면으로 전환하지 않고, 같은 Hero DOM이 그대로 완성된 최종 화면이 된다. --- */
  function setupHeroEntrance() {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      // 중간 연출 없이, 모든 최종 상태를 즉시 적용(짧은 fade는 CSS의 transition-duration 축소로 처리됨)
      hero.classList.add("hero--posters-in", "hero--spotlight-on", "hero--revealed", "hero--ornament-in");
      return;
    }

    const after = (ms, fn) => window.setTimeout(fn, ms);

    after(300, () => hero.classList.add("hero--posters-in"));    // 11개 포스터 조립
    after(2100, () => hero.classList.add("hero--spotlight-on")); // 스포트라이트 점등
    after(2400, () => hero.classList.add("hero--revealed"));     // 포스터가 빛을 받아 밝아짐
    after(2800, () => hero.classList.add("hero--ornament-in"));  // 금장식 등장(타이틀은 CSS 자체 딜레이로 비슷한 시점에 등장)
  }

  /* --- Hero 인터랙션: 스크롤에는 포스터/텍스트가 깊이감 있게 반응하고,
         데스크톱에서는 마우스 위치에 아주 살짝만 반응해서 화면이 "살아있는" 느낌을 줌 --- */
  function setupHeroInteraction() {
    const hero = document.getElementById("hero");
    const poster = hero && hero.querySelector(".hero__poster");
    const content = hero && hero.querySelector(".hero__content");
    const gallery = hero && hero.querySelector(".hero__gallery");
    const spotlight = hero && hero.querySelector(".hero__spotlight");
    const stars = hero && hero.querySelector(".hero__stars");
    if (!hero || !poster || !content) return;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    // 등장 애니메이션(heroContentIn)이 끝나면 CSS animation을 내려서,
    // 이후 스크롤/마우스 패럴랙스가 인라인 transform으로 그대로 반영되게 함
    content.addEventListener("animationend", () => { content.style.animation = "none"; }, { once: true });

    const POSTER_SPEED = 0.35;          // 포스터 배경이 스크롤보다 느리게 따라오는 비율
    const GALLERY_SCROLL_SPEED = 0.45;  // 액자 갤러리는 배경보다 조금 빠르게(텍스트보다는 느리게)
    const CONTENT_SPEED = 0.55;         // 텍스트가 위로 사라지는 비율(가장 빠르게)
    const FADE_RANGE = 0.85;            // 히어로 높이의 몇 %를 스크롤해야 다 사라지는지

    let scrollY = 0;
    let mouseX = 0; // -1 ~ 1
    let mouseY = 0; // -1 ~ 1
    let ticking = false;

    function render() {
      ticking = false;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * FADE_RANGE)));

      poster.style.transform = `scale(1.15) translateY(${scrollY * POSTER_SPEED}px)`;
      content.style.transform = `translateY(${-scrollY * CONTENT_SPEED}px)`;
      content.style.opacity = String(1 - progress);

      if (gallery) {
        const gx = mouseX * 4;   // 마우스에 의한 아주 작은 오프셋(최대 ~4px)
        const gy = -scrollY * GALLERY_SCROLL_SPEED + mouseY * 3;
        gallery.style.transform = `translate(calc(-50% + ${gx.toFixed(1)}px), ${gy.toFixed(1)}px)`;
        gallery.style.opacity = String(1 - progress);
      }

      if (spotlight) {
        const sx = mouseX * 12;  // 스포트라이트는 조금 더 크게(최대 ~12px) 반응
        const sy = scrollY * 0.08 + mouseY * 8;
        spotlight.style.transform = `translate(calc(-50% + ${sx.toFixed(1)}px), ${sy.toFixed(1)}px)`;
      }

      if (stars) {
        stars.style.transform = `translate(${(mouseX * 6).toFixed(1)}px, ${(mouseY * 4).toFixed(1)}px)`;
      }
    }

    function requestRender() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    }

    function onScroll() {
      scrollY = window.scrollY || window.pageYOffset || 0;
      requestRender();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    render();

    // 마우스 패럴랙스는 정밀 포인터(데스크톱)에서만. 모바일/터치에는 적용하지 않음
    const canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover) {
      hero.addEventListener("mousemove", (e) => {
        hero.classList.remove("hero--settling");
        const rect = hero.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        requestRender();
      });

      hero.addEventListener("mouseleave", () => {
        hero.classList.add("hero--settling");
        mouseX = 0;
        mouseY = 0;
        requestRender();
      });
    }
  }

  /* ---------------------------------------------------------
     2. 목차 (TOC)
  --------------------------------------------------------- */
  function renderTOC() {
    const list = document.getElementById("tocList");
    if (!list) return;
    const frag = document.createDocumentFragment();

    data.teams
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((team) => {
        const li = document.createElement("li");
        li.className = "toc__item";

        const a = document.createElement("a");
        a.className = "toc__link";
        a.href = `#team-${team.order}`;

        const num = document.createElement("span");
        num.className = "toc__num";
        num.textContent = String(team.order).padStart(2, "0");

        const label = document.createElement("span");
        label.className = "toc__label";
        label.textContent = team.title;

        const teamName = document.createElement("span");
        teamName.className = "toc__team";
        teamName.textContent = `team. ${team.teamName}`;

        a.append(num, label, teamName);
        li.appendChild(a);
        frag.appendChild(li);
      });

    list.appendChild(frag);
  }

  /* ---------------------------------------------------------
     3. 팀 카드
  --------------------------------------------------------- */
  function renderTeamCards() {
    const wrap = document.getElementById("teamCards");
    if (!wrap) return;
    const frag = document.createDocumentFragment();

    data.teams
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((team) => {
        frag.appendChild(buildTeamCard(team));
      });

    wrap.appendChild(frag);
  }

  function buildTeamCard(team) {
    const isWebtoon = team.mediaType === "video+webtoon";

    const article = document.createElement("article");
    article.className = "team-card";
    article.id = `team-${team.order}`;

    article.innerHTML = `
      <div class="team-card__frame">
        <div class="team-card__media">
          <div class="video-embed" data-order="${team.order}">
            <button type="button" class="video-embed__thumb" aria-label="${escapeAttr(team.title)} 영상 재생">
              <span class="video-embed__thumb-genre">${escapeHtml(team.genre)}</span>
              <span class="video-embed__play" aria-hidden="true">▶</span>
              <span class="video-embed__thumb-caption">Click to Play</span>
            </button>
          </div>
        </div>
        <div class="team-card__body">
          <span class="team-card__order">Feature No. ${String(team.order).padStart(2, "0")}</span>
          <h2 class="team-card__title">${escapeHtml(team.title)}</h2>
          ${team.teamName ? `<p class="team-card__team">team. ${escapeHtml(team.teamName)}</p>` : ""}
          <span class="team-card__genre">${escapeHtml(team.genre)}</span>
          <p class="team-card__synopsis">${escapeHtml(team.synopsis)}</p>
          <span class="team-card__runtime">Running Time — ${escapeHtml(team.runtime)}</span>

          ${isWebtoon ? `
          <div class="webtoon-prompt" id="webtoonPrompt-${team.order}" aria-hidden="true">
            <span class="webtoon-prompt__arrow" aria-hidden="true">▾</span>
            <span>${escapeHtml(team.webtoonPrompt || "웹툰 감상하기")}</span>
          </div>
          <div class="webtoon-viewer" id="webtoonViewer-${team.order}" aria-label="${escapeAttr(team.title)} 웹툰"></div>
          ` : ""}

          <button type="button" class="accordion-toggle" aria-expanded="false" aria-controls="members-${team.order}">
            <span class="accordion-toggle__icon" aria-hidden="true">▾</span>
            <span>만든 사람들 보기</span>
          </button>
          <div class="accordion-panel" id="members-${team.order}"></div>
        </div>
      </div>
    `;

    // video embed
    const videoEmbed = article.querySelector(".video-embed");
    wireVideoEmbed(videoEmbed, team);

    // accordion + members
    const toggle = article.querySelector(".accordion-toggle");
    const panel = article.querySelector(".accordion-panel");
    panel.appendChild(buildMemberGallery(team.members || []));

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "accordion-close";
    closeBtn.innerHTML = '<span class="accordion-toggle__icon" aria-hidden="true">▾</span><span>닫기</span>';
    closeBtn.addEventListener("click", () => {
      toggle.click();
      toggle.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    panel.appendChild(closeBtn);

    wireAccordion(toggle, panel);

    return article;
  }

  /* ---------------------------------------------------------
     4. 영상 임베드 — 클릭 시 재생, 자동재생 금지
  --------------------------------------------------------- */
  let activePlayer = null;

  function wireVideoEmbed(container, team) {
    const thumbBtn = container.querySelector(".video-embed__thumb");
    if (!thumbBtn) return;

    thumbBtn.addEventListener("click", async () => {
      if (!team.videoUrl) {
        thumbBtn.querySelector(".video-embed__thumb-caption").textContent = "영상 준비 중입니다";
        return;
      }

      thumbBtn.disabled = true;
      thumbBtn.querySelector(".video-embed__thumb-caption").textContent = "불러오는 중…";

      const playerHost = document.createElement("div");
      playerHost.id = `yt-player-${team.order}`;
      container.innerHTML = "";
      container.appendChild(playerHost);

      const YT = await loadYouTubeAPI();
      let controls = null;
      new YT.Player(playerHost.id, {
        videoId: team.videoUrl,
        playerVars: { controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, cc_load_policy: 0 },
        events: {
          onReady: (e) => {
            controls = buildPlayerControls(container, e.target, YT);
            const frame = container.querySelector("iframe");
            if (frame) frame.setAttribute("tabindex", "-1");
            container.addEventListener("scroll", () => { container.scrollTop = 0; container.scrollLeft = 0; });
            hideCaptions(e.target);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              if (activePlayer && activePlayer !== e.target) activePlayer.pauseVideo();
              activePlayer = e.target;
              hideCaptions(e.target);
            }
            if (controls) controls.onState(e.data);
            if (team.mediaType === "video+webtoon" && e.data === YT.PlayerState.ENDED) {
              revealWebtoonPrompt(team.order);
            }
          }
        }
      });
    });
  }

  /* ---------------------------------------------------------
     4.5 직접 만든 재생 컨트롤 — 유튜브 기본 컨트롤/로고/제목 링크를 가리고
         재생·진행바·시간·소리·전체화면을 사이트에서 제공
  --------------------------------------------------------- */
  const ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1" fill="currentColor"/><rect x="13.8" y="5" width="4.2" height="14" rx="1" fill="currentColor"/></svg>',
    volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5l4.5 3.8V5.7L7.5 9.5H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5l4.5 3.8V5.7L7.5 9.5H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    enter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    exit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // 유튜브 자막은 재생이 시작된 뒤에 늦게 올라오기도 해서 준비될 때와 재생될 때 모두 끈다
  function hideCaptions(player) {
    try {
      player.unloadModule("captions");
      player.unloadModule("cc");
      player.setOption("captions", "track", {});
    } catch (err) { /* 자막 모듈이 없으면 무시 */ }
  }

  function formatTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function buildPlayerControls(container, player, YT) {
    container.classList.add("vplayer", "is-paused");

    const ui = document.createElement("div");
    ui.className = "vplayer__ui";
    ui.innerHTML = `
      <div class="vplayer__shield"></div>
      <div class="vplayer__center" aria-hidden="true">${ICONS.play}</div>
      <div class="vplayer__bar">
        <button type="button" class="vplayer__btn vplayer__play" aria-label="재생">${ICONS.play}</button>
        <span class="vplayer__time vplayer__cur">0:00</span>
        <input class="vplayer__seek" type="range" min="0" max="1000" value="0" step="1" aria-label="재생 위치">
        <span class="vplayer__time vplayer__dur">0:00</span>
        <button type="button" class="vplayer__btn vplayer__mute" aria-label="음소거">${ICONS.volume}</button>
        <input class="vplayer__vol" type="range" min="0" max="100" value="100" step="1" aria-label="볼륨">
        <button type="button" class="vplayer__btn vplayer__fs" aria-label="전체화면">${ICONS.enter}</button>
      </div>`;
    container.appendChild(ui);

    const $ = (sel) => ui.querySelector(sel);
    const shield = $(".vplayer__shield");
    const center = $(".vplayer__center");
    const playBtn = $(".vplayer__play");
    const seek = $(".vplayer__seek");
    const curEl = $(".vplayer__cur");
    const durEl = $(".vplayer__dur");
    const muteBtn = $(".vplayer__mute");
    const vol = $(".vplayer__vol");
    const fsBtn = $(".vplayer__fs");

    let playing = false;
    let seeking = false;
    let tick = null;
    let idleTimer = null;

    function setFill(el, pct) { el.style.setProperty("--p", `${pct}%`); }
    setFill(seek, 0);
    setFill(vol, 100);

    function refreshTime() {
      const dur = player.getDuration() || 0;
      const cur = seeking ? (seek.value / 1000) * dur : player.getCurrentTime() || 0;
      curEl.textContent = formatTime(cur);
      durEl.textContent = formatTime(dur);
      if (!seeking) {
        const pct = dur ? (cur / dur) * 100 : 0;
        seek.value = String(Math.round(pct * 10));
        setFill(seek, pct);
      }
    }

    function showUi() {
      container.classList.remove("is-idle");
      clearTimeout(idleTimer);
      if (playing) idleTimer = setTimeout(() => container.classList.add("is-idle"), 2600);
    }

    function togglePlay() {
      const st = player.getPlayerState();
      if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING) {
        player.pauseVideo();
      } else {
        if (st === YT.PlayerState.ENDED) player.seekTo(0, true);
        player.playVideo();
      }
      showUi();
    }

    // 유튜브 API의 mute/setVolume은 바로 반영되지 않으므로 상태를 직접 기억해 아이콘에 사용
    let isMuted = !!player.isMuted();
    let level = Number(player.getVolume());
    if (!Number.isFinite(level)) level = 100;
    vol.value = String(level);
    setFill(vol, level);

    function updateMuteIcon() {
      const silent = isMuted || level === 0;
      muteBtn.innerHTML = silent ? ICONS.muted : ICONS.volume;
      muteBtn.setAttribute("aria-label", silent ? "음소거 해제" : "음소거");
    }

    // 터치: 화면을 누르면 컨트롤만 나오고/숨고, 재생·정지는 컨트롤 버튼이나 정중앙을 눌러야 함.
    // 마우스: 영상 아무 곳이나 클릭하면 재생·정지
    shield.addEventListener("click", (e) => {
      const touch = e.pointerType ? e.pointerType !== "mouse" : isTouch();
      if (!touch) { togglePlay(); return; }
      if (container.classList.contains("is-idle") || !playing) {
        showUi();
      } else {
        clearTimeout(idleTimer);
        container.classList.add("is-idle");
      }
    });
    center.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay();
    });
    playBtn.addEventListener("click", togglePlay);

    seek.addEventListener("input", () => {
      seeking = true;
      setFill(seek, seek.value / 10);
      refreshTime();
      showUi();
    });
    seek.addEventListener("change", () => {
      const dur = player.getDuration() || 0;
      player.seekTo((seek.value / 1000) * dur, true);
      seeking = false;
      refreshTime();
    });

    muteBtn.addEventListener("click", () => {
      if (isMuted || level === 0) {
        player.unMute();
        isMuted = false;
        if (level === 0) { level = 60; player.setVolume(60); vol.value = "60"; setFill(vol, 60); }
      } else {
        player.mute();
        isMuted = true;
      }
      updateMuteIcon();
      showUi();
    });

    vol.addEventListener("input", () => {
      level = Number(vol.value);
      setFill(vol, level);
      player.setVolume(level);
      if (level > 0 && isMuted) { player.unMute(); isMuted = false; }
      updateMuteIcon();
      showUi();
    });

    const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;

    // 전체화면에서는 화면 비율이 16:9가 아닐 수 있어서, 영상(16:9)이 잘리지 않고 가운데에 오도록
    // 유튜브 틀 크기를 직접 계산한다(위아래 64px 여분은 유튜브 표시를 가리기 위한 것)
    const frame = container.querySelector("iframe");
    function layoutFrame() {
      if (!frame) return;
      const isFs = fsElement() === container || container.classList.contains("is-pseudo-fs");
      if (!isFs) {
        ["left", "top", "width", "height"].forEach((p) => frame.style.removeProperty(p));
        return;
      }
      const W = container.clientWidth;
      const H = container.clientHeight;
      const bw = Math.min(W, (H * 16) / 9);
      const bh = (bw * 9) / 16;
      frame.style.left = `${(W - bw) / 2}px`;
      frame.style.top = `${(H - bh) / 2 - 64}px`;
      frame.style.width = `${bw}px`;
      frame.style.height = `${bh + 128}px`;
    }
    window.addEventListener("resize", layoutFrame);

    function updateFsIcon() {
      const on = fsElement() === container || container.classList.contains("is-pseudo-fs");
      fsBtn.innerHTML = on ? ICONS.exit : ICONS.enter;
      fsBtn.setAttribute("aria-label", on ? "전체화면 종료" : "전체화면");
      layoutFrame();
    }
    fsBtn.addEventListener("click", () => {
      if (fsElement() === container) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else if (container.classList.contains("is-pseudo-fs")) {
        container.classList.remove("is-pseudo-fs");
        updateFsIcon();
      } else {
        const usePseudo = () => {
          if (fsElement() === container) return;
          container.classList.add("is-pseudo-fs");
          updateFsIcon();
        };
        const request = container.requestFullscreen || container.webkitRequestFullscreen;
        if (request) {
          try {
            const req = request.call(container);
            if (req && req.catch) req.catch(usePseudo);
          } catch (err) {
            usePseudo();
          }
          // 일부 브라우저(앱 내장 브라우저 등)는 요청을 조용히 무시하므로, 곧바로 전환되지 않으면 화면 채우기로 대체
          setTimeout(usePseudo, 450);
        } else {
          usePseudo();
        }
      }
      showUi();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && container.classList.contains("is-pseudo-fs")) {
        container.classList.remove("is-pseudo-fs");
        updateFsIcon();
      }
    });
    // 휴대폰에서 진짜 전체화면이 되면 가로 방향으로 잠금(지원하는 브라우저만). 나가면 해제
    const isTouch = () => window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    function syncOrientation() {
      if (!isTouch() || !screen.orientation) return;
      try {
        if (fsElement() === container) {
          const p = screen.orientation.lock && screen.orientation.lock("landscape");
          if (p && p.catch) p.catch(() => {});
        } else if (screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (err) { /* 방향 잠금을 지원하지 않으면 무시 */ }
    }
    document.addEventListener("fullscreenchange", () => { updateFsIcon(); syncOrientation(); });
    document.addEventListener("webkitfullscreenchange", () => { updateFsIcon(); syncOrientation(); });

    ["mousemove", "keydown", "focusin"].forEach((evt) =>
      container.addEventListener(evt, showUi, { passive: true })
    );
    // 컨트롤(버튼·슬라이더)을 만질 때는 숨김 타이머를 다시 시작. 화면(막)을 누르는 건 위의 click 처리에서 따로 다룸
    container.addEventListener("pointerdown", (e) => {
      if (!shield.contains(e.target) && !center.contains(e.target)) showUi();
    }, { passive: true });
    container.addEventListener("keydown", (e) => {
      if (e.key === " " && e.target === container) { e.preventDefault(); togglePlay(); }
    });

    updateMuteIcon();
    refreshTime();

    return {
      onState(state) {
        const S = YT.PlayerState;
        playing = state === S.PLAYING || state === S.BUFFERING;
        container.classList.toggle("is-paused", !playing);
        playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
        playBtn.setAttribute("aria-label", playing ? "일시정지" : "재생");
        clearInterval(tick);
        if (state === S.PLAYING) tick = setInterval(refreshTime, 250);
        refreshTime();
        showUi();
      }
    };
  }

  /* ---------------------------------------------------------
     5. 웹툰 특수 흐름 — 재생 완료 → 안내 페이드인 →
        스크롤 → 안내 페이드아웃 & 웹툰 인라인 뷰어 노출
  --------------------------------------------------------- */
  function revealWebtoonPrompt(order) {
    const prompt = document.getElementById(`webtoonPrompt-${order}`);
    if (!prompt) return;

    prompt.setAttribute("aria-hidden", "false");
    prompt.classList.add("is-visible");

    let triggered = false;
    const onScroll = () => {
      if (triggered) return;
      triggered = true;
      window.removeEventListener("scroll", onScroll);
      fadeOutPromptAndOpenWebtoon(order);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function fadeOutPromptAndOpenWebtoon(order) {
    const prompt = document.getElementById(`webtoonPrompt-${order}`);
    const viewer = document.getElementById(`webtoonViewer-${order}`);
    if (prompt) {
      prompt.classList.add("is-fading");
      prompt.classList.remove("is-visible");
      window.setTimeout(() => prompt.setAttribute("aria-hidden", "true"), 600);
    }
    if (viewer && !viewer.dataset.rendered) {
      renderWebtoonViewer(viewer, order);
      viewer.dataset.rendered = "true";
    }
    if (viewer) viewer.classList.add("is-open");
  }

  function renderWebtoonViewer(viewer, order) {
    const team = data.teams.find((t) => t.order === order);
    if (!team) return;

    const images = team.webtoonImages;
    const cutCount = (images && images.length) || team.webtoonCutCount || 6;

    for (let i = 0; i < cutCount; i++) {
      const src = images && images[i];
      if (src) {
        const img = document.createElement("img");
        img.className = "webtoon-viewer__cut";
        img.src = src;
        img.alt = `${team.title} 웹툰 ${i + 1}컷`;
        img.loading = "lazy";
        viewer.appendChild(img);
      } else {
        const cut = document.createElement("div");
        cut.className = "webtoon-viewer__placeholder-cut";
        cut.setAttribute("role", "img");
        cut.setAttribute("aria-label", `${team.title} 웹툰 ${i + 1}컷 (이미지 준비 중)`);
        cut.textContent = `Cut ${String(i + 1).padStart(2, "0")} · 이미지 준비 중`;
        viewer.appendChild(cut);
      }
    }
  }

  /* ---------------------------------------------------------
     6. 아코디언 — 만든 사람들 보기
  --------------------------------------------------------- */
  function wireAccordion(toggle, panel) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));

      if (!expanded) {
        panel.classList.add("is-open");
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        const done = (e) => {
          if (e.propertyName !== "max-height") return;
          panel.removeEventListener("transitionend", done);
          if (panel.classList.contains("is-open")) panel.style.maxHeight = "none";
        };
        panel.addEventListener("transitionend", done);
        setTimeout(() => {
          if (panel.classList.contains("is-open")) panel.style.maxHeight = "none";
        }, 600);
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        void panel.offsetHeight;
        panel.classList.remove("is-open");
        panel.style.maxHeight = "0px";
      }
    });
  }

  function buildMemberGallery(members) {
    const gallery = document.createElement("div");
    gallery.className = "member-gallery";

    let lastGroup = null;
    members.forEach((member) => {
      if (member.group && member.group !== lastGroup) {
        const heading = document.createElement("p");
        heading.className = "member-group";
        heading.textContent = member.group;
        gallery.appendChild(heading);
      }
      lastGroup = member.group || null;

      const item = document.createElement("div");
      item.className = "member";

      const frame = document.createElement("div");
      frame.className = "member__frame";

      if (member.illustration) {
        const img = document.createElement("img");
        img.className = "member__portrait";
        img.src = member.illustration;
        img.alt = `${member.name} 캐릭터 일러스트`;
        frame.appendChild(img);
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "member__portrait-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        placeholder.textContent = initials(member.name);
        frame.appendChild(placeholder);
      }

      const name = document.createElement("p");
      name.className = "member__name";
      name.textContent = member.name;

      const role = document.createElement("p");
      role.className = "member__role";
      role.textContent = member.role;

      const bio = document.createElement("p");
      bio.className = "member__bio";
      bio.textContent = member.bio;
      if (member.bioKo) bio.lang = "fr";

      item.append(frame, name, role, bio);
      if (member.bioKo) {
        const bioKo = document.createElement("p");
        bioKo.className = "member__bio member__bio--ko";
        bioKo.textContent = member.bioKo;
        item.appendChild(bioKo);
      }
      gallery.appendChild(item);
    });

    return gallery;
  }

  function initials(name) {
    if (!name) return "?";
    return name.trim().slice(-2);
  }

  /* ---------------------------------------------------------
     6.5 지도 교수진
  --------------------------------------------------------- */
  function renderFaculty() {
    const f = data.faculty;
    if (!f) return;

    const bodyEl = document.getElementById("facultyGreetingBody");
    if (bodyEl && f.greeting) {
      (f.greeting.paragraphs || []).forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        bodyEl.appendChild(p);
      });
    }

    const signEl = document.getElementById("facultyGreetingSign");
    if (signEl) {
      if (f.greeting && f.greeting.sign) {
        signEl.textContent = f.greeting.sign;
      } else {
        signEl.remove();
      }
    }

    const groupsEl = document.getElementById("facultyGroups");
    if (groupsEl) {
      (f.groups || []).forEach((group) => {
        const wrap = document.createElement("div");
        wrap.className = "faculty__group";

        const label = document.createElement("p");
        label.className = "faculty__group-label";
        label.textContent = group.label;

        const names = document.createElement("p");
        names.className = "faculty__group-names";
        const list = group.names || [];
        list.forEach((name, i) => {
          const span = document.createElement("span");
          span.className = "faculty__group-name";
          span.textContent = i < list.length - 1 ? `${name} ·` : name;
          names.appendChild(span);
          if (i < list.length - 1) names.appendChild(document.createTextNode(" "));
        });

        wrap.append(label, names);
        groupsEl.appendChild(wrap);
      });
    }
  }

  /* ---------------------------------------------------------
     7. 크레딧
  --------------------------------------------------------- */
  function renderCredits() {
    const c = data.contact;
    if (!c) return;
    setText("creditsDept", c.department);

    const websiteEl = document.getElementById("creditsWebsite");
    if (websiteEl && c.website) {
      websiteEl.href = c.website;
      websiteEl.textContent = c.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
    }

    const igEl = document.getElementById("creditsInstagram");
    if (igEl && c.instagram) {
      igEl.href = c.instagram;
      const handle = c.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
      igEl.textContent = `@${handle}`;
    }
  }

  /* ---------------------------------------------------------
     8. 유틸
  --------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  /* ---------------------------------------------------------
     init
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderFaculty();
    renderTOC();
    renderTeamCards();
    renderCredits();
    setupHeroEntrance();
    setupHeroInteraction();
  });
})();
