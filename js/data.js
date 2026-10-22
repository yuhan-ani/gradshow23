/**
 * 상영회 데이터
 * - 실제 정보가 확정되면 아래 값만 교체하면 됩니다.
 * - thumbnail 을 null로 두면 자동으로 장식 플레이스홀더가 표시됩니다. webtoonUrl 이 있는 작품에는 "웹툰 보러 가기" 버튼이 생기며, 영상과 같은 일정(videoSchedule)으로 열리고 닫힙니다.
 * - videoUrl 은 유튜브 videoId 문자열입니다. (현재는 블렌더 재단의 공개 라이선스 영상으로 임시 대체 — 실제 작품 영상으로 교체 필요)
 * - 지금은 다른 사람에게 데모로 보여주기 위해 제목/설명/팀원/러닝타임을 전부 플레이스홀더(작품 -N, 팀 -N, 학생-N, 00:00)로 단순화한 상태입니다.
 */
window.SHOWCASE_DATA = {
  // 영상 공개 설정
  //  - videosOpen: null  → 아래 일정(videoSchedule)에 따라 자동으로 열고 닫는다(기본)
  //  - videosOpen: true  → 일정과 상관없이 항상 열림 / false → 항상 가림(COMING SOON)
  // 시각은 모두 한국 시간(+09:00)이며, 공개 시작 시각 이상 ~ 종료 시각 미만에만 영상이 열린다
  videosOpen: null,
  videoSchedule: {
    open: "2026-10-26T07:00:00+09:00",
    close: "2026-11-01T23:59:00+09:00"
  },
  videosOpenDate: "10월 26일 (월)",
  hero: {
    title: "DRAWN TO THE SPOTLIGHT",
    subtitle: "2026 Animation & Webtoon Graduation Showcase",
    edition: "제23회 졸업작품 상영회",
    period: "2026. 10. 26 (월) · 오후 6:30",
    venue: "유한대학교 유재라관 6층 유한아트홀",
    posterImage: "assets/hero-poster.svg"
  },
  contact: {
    department: "유한대학교 방송미디어학과 애니메이션웹툰전공",
    website: "https://anima.yuhan.ac.kr/index.do",
    instagram: "https://www.instagram.com/yuhan.ani/"
  },
  /* 오시는 길 — 약도(assets/route/campus-map.svg, 1044x1140) 위의 좌표로 경로를 그린다.
     약도는 실제 지도와 방향이 같게(위쪽이 남쪽, 오른쪽이 서쪽) 그려져 있어서, 글에는 동·서·남·북을 쓰지 않는다.
     segments: 경로 조각. kind = walk(걷기) | drive(차) | stairs(계단) | elevator(엘리베이터) | jump(건물 안 이동, 선 없이 순간이동)
     spots: 약도 위 사진 버튼. 누르면 사진이 열린다. { x, y, label, photo, caption }  (photo가 없는 항목은 표시하지 않는다) */
  directions: {
    title: "오시는 길",
    address: "(14780) 경기도 부천시 소사구 경인로 590",
    notice: "현재 교내 공사로 길이 복잡합니다. 약도를 보시고 천천히 찾아와 주세요.",
    destination: "유재라관(8호관) 6층 유한아트홀",
    map: {
      image: "assets/route/campus-map.svg",
      width: 1044,
      height: 1200,
      labels: [
        { x: 127, y: 276, t: "7호관", s: 32 },
        { x: 594, y: 138, t: "8호관", s: 36, dest: true },
        { x: 594, y: 176, t: "유재라관", s: 24, dest: true },
        { x: 580, y: 443, t: "1호관", s: 32 },
        { x: 394, y: 650, t: "3호관", s: 32, r: -90 },
        { x: 95, y: 650, t: "6호관", s: 32, r: -90 },
        { x: 225, y: 650, t: "5호관", s: 32, r: -90 },
        { x: 125, y: 970, t: "4호관", s: 32 },
        { x: 125, y: 997, t: "학생회관", s: 20 },
        { x: 650, y: 976, t: "2호관", s: 32 },
        { x: 798, y: 772, t: "농구장", s: 22, court: true },
        { x: 120, y: 146, t: "언덕 위", s: 24, area: true },
        { x: 120, y: 172, t: "3층 높이", s: 20, area: true },
        { x: 112, y: 1034, t: "낮은 지대", s: 24, area: true },
        { x: 112, y: 1060, t: "지하 2층 높이", s: 20, area: true },
        { x: 491, y: 296, t: "공사 중", s: 24, warn: true },
        { x: 530, y: 384, t: "공사 중", s: 24, warn: true },
        { x: 322, y: 650, t: "공사 중", s: 24, warn: true, r: -90 },
        { x: 155, y: 796, t: "편의점", s: 28, poi: true },
        { x: 748, y: 196, t: "주차장", s: 28, poi: true },
        { x: 935, y: 386, t: "동상", s: 28, poi: true },
        { x: 822, y: 1078, t: "버스정류장", s: 28, poi: true },
        { x: 904, y: 568, t: "돌계단", s: 28, poi: true },
        { x: 430, y: 966, t: "엘리베이터", s: 28, poi: true },
        { x: 222, y: 1068, t: "계단", s: 28, poi: true },
        { x: 640, y: 1098, t: "횡단보도", s: 28, poi: true }
      ]
    },
    /* 약도 위 사진 버튼. 경로의 spots 에 이름(문자열)으로 넣으면 그 경로에서 보인다.
       photos: 누르면 차례로 넘겨 볼 사진들 (assets/route/photos/) */
    spotLib: {
      h5in: { x: 205, y: 925, label: "5호관 입구", photos: [
        { src: "assets/route/photos/h5-in.jpg", caption: "5호관 입구" } ] },
      h5out: { x: 205, y: 395, label: "5호관 출구", photos: [
        { src: "assets/route/photos/h5-out.jpg", caption: "5호관 출구" },
        { src: "assets/route/photos/h5-view7.jpg", caption: "5호관을 나오면 보이는 7호관" } ] },
      gardenEntry: { x: 300, y: 296, label: "8호관 가는 길 입구", photos: [
        { src: "assets/route/photos/garden-7ho-side.jpg", caption: "7호관 옆, 8호관으로 가는 길" },
        { src: "assets/route/photos/garden-entry.jpg", caption: "8호관으로 들어가는 길 입구" } ] },
      fork1: { x: 420, y: 272, label: "첫 번째 갈림길", photos: [
        { src: "assets/route/photos/fork-1.jpg", caption: "첫 번째 갈림길 — 오른쪽은 공사 중이니 왼쪽으로" } ] },
      fork2: { x: 300, y: 185, label: "두 번째 갈림길", photos: [
        { src: "assets/route/photos/fork-2.jpg", caption: "두 번째 갈림길 — 오른쪽으로" } ] },
      fork3: { x: 478, y: 66, label: "세 번째 갈림길", photos: [
        { src: "assets/route/photos/fork-3.jpg", caption: "세 번째 갈림길 — 오른쪽 샛길로" } ] },
      h8: { x: 594, y: 252, label: "8호관", photos: [
        { src: "assets/route/photos/h8-near.jpg", caption: "8호관 가까이" },
        { src: "assets/route/photos/h8-entrance.jpg", caption: "8호관 출입구" },
        { src: "assets/route/photos/h8-lobby.jpg", caption: "8호관 로비 — 엘리베이터는 오른쪽" },
        { src: "assets/route/photos/h8-elevator.jpg", caption: "엘리베이터 타는 곳 (6층 유한아트홀)" } ] },
      uphill: { x: 990, y: 860, label: "오르막길", photos: [
        { src: "assets/route/photos/uphill-start.jpg", caption: "오르막길 입구" },
        { src: "assets/route/photos/uphill.jpg", caption: "오르막길" } ] },
      statue: { x: 935, y: 436, label: "동상", photos: [
        { src: "assets/route/photos/statue.jpg", caption: "유한 박사님 동상" } ] }
    },
    routes: [
      {
        id: "stairs",
        name: "계단 이용",
        tag: "도보 · 계단 약 5층",
        segments: [
          { kind: "walk", points: [[511, 1032], [309, 1030]] },
          { kind: "stairs", points: [[309, 1030], [309, 988]] },
          { kind: "walk", points: [[309, 988], [309, 926], [256, 914], [250, 362]] },
          { kind: "walk", points: [[250, 362], [376, 247], [351, 175], [436, 102], [479, 162], [556, 204]] }
        ],
        spots: [
          { x: 436, y: 1112, label: "횡단보도", photos: [
            { src: "assets/route/photos/crosswalk.jpg", caption: "횡단보도 건너편 신호등" } ] },
          { x: 372, y: 1082, label: "계단 입구", photos: [
            { src: "assets/route/photos/stair-in.jpg", caption: "계단 입구" } ] },
          { x: 262, y: 960, label: "계단 출구", photos: [
            { src: "assets/route/photos/stair-out.jpg", caption: "계단 출구" } ] },
          "h5in", "h5out", "gardenEntry", "fork1", "fork2", "fork3", "h8"
        ]
      },
      {
        id: "elevator",
        name: "엘리베이터 이용",
        tag: "도보 · 3호관 엘리베이터",
        segments: [
          { kind: "walk", points: [[822, 1028], [944, 990], [928, 678]] },
          { kind: "stairs", points: [[928, 678], [866, 676]] },
          { kind: "walk", points: [[866, 676], [864, 862], [452, 892]] },
          { kind: "elevator", points: [[452, 892], [414, 902]], label: { t: "L → 3층", dx: 8, dy: -46 } },
          { kind: "walk", points: [[414, 902], [309, 914], [256, 914], [250, 362]] },
          { kind: "walk", points: [[250, 362], [376, 247], [351, 175], [436, 102], [479, 162], [556, 204]] }
        ],
        spots: [
          { x: 944, y: 1070, label: "버스정류장", photos: [
            { src: "assets/route/photos/busstop.jpg", caption: "유한대학교 버스정류장" } ] },
          "uphill",
          "statue",
          { x: 992, y: 680, label: "돌계단", photos: [
            { src: "assets/route/photos/stone-stairs.jpg", caption: "돌계단" } ] },
          { x: 690, y: 845, label: "농구장", photos: [
            { src: "assets/route/photos/court.jpg", caption: "농구장" },
            { src: "assets/route/photos/to-elev.jpg", caption: "농구장을 지나 엘리베이터로 가는 길" } ] },
          { x: 548, y: 944, label: "엘리베이터", photos: [
            { src: "assets/route/photos/elev-view.jpg", caption: "엘리베이터가 보이는 곳" },
            { src: "assets/route/photos/elev-l.jpg", caption: "엘리베이터 — L층에서 3층으로" } ] },
          { x: 326, y: 850, label: "3층", photos: [
            { src: "assets/route/photos/elev-3f.jpg", caption: "3층에서 내렸을 때" } ] },
          "h5in", "h5out", "gardenEntry", "fork1", "fork2", "fork3", "h8"
        ]
      },
      {
        id: "car",
        name: "자가용 이용",
        tag: "주차장 · 엘리베이터",
        segments: [
          { kind: "drive", points: [[1016, 1170], [1008, 1060], [990, 658], [984, 520], [920, 478], [860, 400], [815, 325], [772, 290], [750, 282]] },
          { kind: "jump", points: [[748, 282], [215, 352]], label: { t: "엘리베이터 → 1층", dx: 160, dy: -42 } },
          { kind: "walk", points: [[215, 352], [250, 364], [376, 247], [351, 175], [436, 102], [479, 162], [556, 204]] }
        ],
        spots: [
          "uphill", "statue",
          { x: 684, y: 228, label: "주차장 입구", photos: [
            { src: "assets/route/photos/parking.jpg", caption: "주차장 입구" } ] },
          "gardenEntry", "fork1", "fork2", "fork3", "h8"
        ]
      }
    ]
  },
  faculty: {
    greeting: {
      paragraphs: [
        "애니메이션웹툰전공 졸업작품 상영회를 찾아주신 여러분께 감사드립니다.",
        "이번 상영회는 학생들이 그동안 배우고 경험한 것을 바탕으로 완성한 작품을 선보이는 자리입니다. 각자의 고민과 시도, 작업의 과정이 담긴 작품들을 한자리에서 소개할 수 있게 되어 뜻깊게 생각합니다.",
        "작품이 완성되기까지 지도해 주신 교수님들과 함께해 주신 모든 분들께 감사드리며, 바쁘신 가운데 상영회에 참석해 주신 여러분께도 진심으로 감사드립니다.",
        "학생들이 준비한 작품들을 편안하게 관람해 주시고, 앞으로 이어질 새로운 시작에도 따뜻한 관심과 응원 부탁드립니다."
      ],
      sign: "제 23대 집행부 일동"
    },
    groups: [
      { label: "학과장", names: ["강현종"] },
      { label: "지도교수", names: ["안현숙", "강효은", "이문형", "박정선", "이진우", "채범석", "김미경", "김종훈", "류명희", "안형혜", "안민채", "정예진"] }
    ]
  },
  teams: [
    { order: 1, teamName: "몽글", title: "구름을 좇는 아이", genre: "2D 애니메이션", synopsis: "〈구름을 좇는 아이〉는 ‘자신을 있는 그대로 받아들이고 사랑하자’를 주제로 제작한 2D 단편 애니메이션이다. 회색 곱슬머리 때문에 친구들에게 ‘먹구름’이라 놀림받으며 자신의 모습을 콤플렉스로 여기던 누리는 구름을 배달하는 요정 루아를 만나게 된다. 도망친 먹구름을 찾으면 머리를 바꿔주겠다는 루아의 제안을 받아들인 누리는 함께 먹구름을 찾아 나서고, 거울 속 세계에서 자신의 모습을 마주하게 된다. 그 과정에서 누리는 자신이 싫어했던 모습을 받아들이며 있는 그대로의 자신을 사랑하는 법을 깨닫는다.", runtime: "06:56", mediaType: "video", videoUrl: "s846yUkLK1U", thumbnail: "assets/posters/01.jpg", posterY: 50,
      members: [
        { name: "홍가영", role: "원동화 러프(기본도형, 디테일, 흐름), 3D 배경 렌더, 3D 배경 보정, 컬러 가이드",
          bio: "졸업작품을 진행하며 제 스스로 욕심이 생기며 아쉬움이 남기도 했지만 동시에 작업에 재미를 느끼기도 했던 것 같습니다. 팀원분들 모두가 열심히 해주셔서 감사합니다!" },
        { name: "박채빈", role: "스토리, 스토리보드, 클린업, 후보정",
          bio: "단편 애니메이션 한 편을 직접 제작해볼 수 있었던 경험이 좋았습니다. 기획부터 제작까지 전 과정에 참여하면서 다양한 분야를 경험해보고, 그 과정에서 어떤 분야가 저와 잘 맞는지 알아갈 수 있었습니다. 또한 작품을 직접 만들어보면서 이전보다 애니메이션을 볼 때 장면과 연출을 더욱 세심하게 살펴보게 되었습니다." },
        { name: "정민서", role: "졸작 클린업, 이펙트, 로고디자인, 배경 모델링",
          bio: "1년 넘게 팀원들과 함께하며 많은 걸 배운 작품입니다. 즐겁게 봐주시면 감사하겠습니다!" },
        { name: "한수지", role: "캐릭터 디자인, 스토리보드, 걷기/뛰기 원동화, 영상편집, 선화, 채색",
          bio: "끝까지 완성할 수 있어 뿌듯하고 좋은 경험이 되었습니다. 몽글팀 화이팅!" },
        { name: "이지민", role: "동화 작업, 채색, 3D 배경, 레이아웃, 사운드 가이드, 임시 더빙",
          bio: "좋은 팀원들과 함께 작품을 완성해가며 역량을 키우고, 협업의 즐거움과 팀워크의 의미를 배울 수 있었습니다. 함께해준 팀원들 모두 수고 많았습니다!" },
        { name: "박서빈", role: "메인채색, 립싱크, 선화 정리(클린업) 수정",
          bio: "복학하면서 프로젝트 중간에 합류하게 되어 처음에는 적응하는 데 어려움도 있었습니다. 하지만 팀원들과 함께 작업하면서 금방 익숙해졌고, 하나의 작품을 완성하기까지 여러 가지를 배우고 경험할 수 있었습니다. 쉽지만은 않았지만 끝까지 함께해서 더 뿌듯한 작업이었습니다." }
      ] },
    { order: 2, teamName: "Blue Bird", title: "Apple Pie", genre: "3D 애니메이션", synopsis: "〈Apple Pie〉는 주인공인 소년이 맛있는 애플파이를 만들어 할머니를 행복하게 만들어주기 위해 오랫동안 노력하였다. 하지만 끝내 완성된 애플파이를 전달하지 못한 주인공의 위기와 극복을 담은 감성적인 가족 드라마 장르의 3D 애니메이션이다.", runtime: "07:30", mediaType: "video", videoUrl: "sp1Z-oJXQNY", thumbnail: "assets/posters/02.jpg", posterY: 50,
      members: [
        { name: "이희진", role: "감독, 3D모델링 및 리깅, 애니메이팅",
          bio: "A l'approche de la projection de mon film de fin d'études, j'ai l'impression que c'est vraiment la fin... Toute l'équipe, vous avez vraiment bien travaillé. Et je remercie le professeur, l'assistant et le comité exécutif qui m'ont aidé à organiser la projection. Enfin, les gars, merci d'avoir suivi le mauvais chef, je vous aime. ＼(^○^)／",
          bioKo: "졸업작품 상영회를 앞두니 이제 진짜 끝이라는 생각이드네요… 팀원분들 정말 수고 많으셨습니다! 그리고 상영회 진행을 위해 도와준 교수님 및 조교님, 집행부 여러분께 감사하다는 말을 드리며. 마지막으로 팀원들아 못난 팀장 따라줘서 고맙고 사랑한다!!! ＼(^○^)／" },
        { name: "우자연", role: "3D 건물 모델링 및 리깅, 애니메이팅",
          bio: "Même si j'ai parfois eu envie de tout arrêter, voir mes coéquipiers travailler dur jusqu'au bout m'a poussé à tenir bon jusqu'à la fin. On a tous bien galéré et je vous dis un grand merci! ｄ(≧∀≦)ｂ",
          bioKo: "그만 둘까 생각이 들어도 끝까지 열심히 하는 팀원들을 보며 저도 마지막까지 참여할 수 있었습니다. 다들 너무 고생 많았고 고마워요! ｄ(≧∀≦)ｂ" },
        { name: "백민재", role: "편집, 3D 모델링 및 리깅, 애니메이팅",
          bio: "Un grand merci à mes coéquipiers qui se sont battus à mes côtés jusqu'au bout ! Je souhaite de tout cœur le meilleur aux juniors qui s'apprêtent à créer de magnifiques œuvres, dans leurs débuts et tous leurs projets créatifs.",
          bioKo: "끝까지 함께 달려준 팀원분들 정말 고생 많았어요! 앞으로 멋진 작품을 만들어갈 후배 여러분의 새로운 시작과 모든 창작 길을 진심으로 응원합니다." },
        { name: "홍윤서", role: "서기, 3D 모델링 및 리깅, 애니메이팅",
          bio: "Au début du projet, j'étais un peu dépassé car c'était ma première expérience en animation 3D ; heureusement, j'ai eu la chance de trouver des coéquipiers formidables. Nous avons étudié et collaboré pendant un an et demi, et je suis ravi que nous ayons pu mener ce projet à bien. Je suis vraiment reconnaissant à mes coéquipiers pour leur travail acharné et leur dévouement, et je leur souhaite tout le bonheur du monde !",
          bioKo: "작품 제작 초기에는 처음 도전하는 3D 애니메이션인 만큼 막막하였지만, 마음이 잘 맞는 팀원들을 만나 1년 반 동안 함께 공부하고 서로 맞춰가며 무사히 작품을 완성할 수 있게 되어 좋았습니다. 함께 고생하고 노력해 준 팀원들에게 정말 고맙고, 다들 앞으로 행복한 일들만 가득하길 바랍니다!" },
        { name: "차유림", role: "3D 캐릭터 모델링 및 애니메이팅",
          bio: "C'était la première fois que je réalisais un projet de fin d'études avec les membres de mon équipe, et cela m'a permis de vivre une nouvelle expérience. Je voudrais remercier mes coéquipiers d'avoir continué jusqu'au bout, même si le travail en 3D n'était pas toujours facile. Je pense que c'est grâce aux efforts de chacun que nous avons pu terminer ce projet. J'espère sincèrement que chacun pourra réussir dans la voie qu'il souhaite suivre à l'avenir.",
          bioKo: "처음으로 팀원들과 함께 졸업작품을 제작하며 새로운 경험을 할 수 있었습니다. 3D 작업이 쉽지 않았음에도 끝까지 함께해준 팀원들에게 감사하다는 말을 전하고 싶습니다. 모두가 잘 버텨주었기에 작품도 끝까지 완성될 수 있었다고 생각하며, 앞으로도 각자 원하는 길에서 좋은 결과가 있기를 바랍니다." }
      ] },
    { order: 3, teamName: "매드쉽", title: "카아루디루나", genre: "2D 애니메이션", synopsis: "평화로운 마을에서 사람들의 꿈을 담고 있던 ‘꿈 구슬’이 어느 날 흔적도 없이 사라진다. 꿈 구슬이 누군가에게 도둑맞았다는 사실을 알게 된 소녀 루나는 사라진 꿈을 되찾기 위해 위험한 그림자 세계로 향한다. 그곳에서 루나는 두려움과 시련, 장애물에 맞서며 앞으로 나아간다. 끝없는 고난과 역경을 이겨낸 루나는 마침내 자신의 꿈 구슬과 마을 사람들의 꿈 구슬을 되찾고, 모두에게 잃어버린 꿈과 희망을 다시 돌려준다.", runtime: "05:08", mediaType: "video", videoUrl: "XgGh9kan85w", thumbnail: "assets/posters/03.jpg", posterY: 25,
      members: [
        { name: "박한별", role: "감독, 원화, 동화, 채색, 스토리보드, 배경, 편집",
          bio: "나를 죽이지 못하는 고통은 나를 더 강하게 만든다." },
        { name: "조채원", role: "원화, 동화, 채색, 스토리보드, 배경, 캐릭터 디자인",
          bio: "우여곡절을 거쳐 만들어가는 동안 많은 것을 배울 수 있었고, 함께해온 모든 분께 감사드립니다!" },
        { name: "정민석", role: "원화, 동화, 채색, 스토리보드, 캐릭터 디자인",
          bio: "많이 미숙했지만 뜻깊은 제작이었습니다!" }
      ] },
    { order: 4, teamName: "미정", title: "레나의 여행", genre: "2D 애니메이션", synopsis: "서로 다른 두 세계를 배경으로, 우연한 만남을 통해 이어지는 사람들의 기억과 감정을 담아낸 감성 판타지 작품. 다른 세계에서 온 소녀 레나와 커피를 수확하며 살아가는 청년 바리의 만남을 중심으로, 낯선 두 사람이 함께 시간을 보내며 서로에게 특별한 존재가 되어가는 과정. 작품 속 커피를 기억과 감정을 연결하는 매개체로 활용하여, 소중한 사람과의 관계와 미처 전하지 못했던 마음의 의미를 담아낸 작품.", runtime: "07:18", mediaType: "video", videoUrl: "7zEALosyLzI", thumbnail: "assets/posters/04.jpg", posterY: 45,
      members: [
        { name: "이진우", role: "감독, 편집, 스토리보드 일부, 시나리오, 원화, 동화 일부",
          bio: "모자란 감독과 작업하느라 고생한 팀원분들에게 감사의 말씀 드리고 싶고, 진짜 저희 손으로 작품을 만들어냈다는 게 믿기지 않습니다." },
        { name: "곽상덕", role: "배경",
          bio: "부족한 점도 많았지만 팀원분들과 함께 작품을 완성할 수 있어서 좋았습니다. 함께해주신 팀원분들께 감사드립니다." },
        { name: "임정민", role: "스토리보드 일부, 원화 일부, 동화, 선화, 채색",
          bio: "졸업작품 작업은 저에게 이론을 넘어, 실제로 작업을 내 손으로 해본 가장 값진 시간이었습니다." }
      ] },
    { order: 5, teamName: "200%", title: "소리 없는 불꽃", genre: "웹툰", synopsis: "〈소리 없는 불꽃〉은 대기업 회장의 마약 비리를 파헤치는 기자 이재현과 피해자 유가족 박소연의 이야기를 담은 웹툰 프로모션 영상이다. 화재 사건을 시작으로 숨겨진 마약 비리의 진실을 추적하며, 권력과 비리에 맞서는 평범한 사람들의 모습을 빠른 장면 전환으로 표현했다. 작은 목소리들이 모여 거대한 권력에 맞서는 과정을 통해 정의와 연대의 메시지를 전달하고자 했다.", runtime: "01:39", mediaType: "video", videoUrl: "no3wjGTGP4A", thumbnail: "assets/posters/05.jpg", posterY: 12,
      webtoonUrl: "https://m.blog.naver.com/PostView.naver?blogId=wkdwlsgud99&logNo=224446726335&proxyReferer=&noTrackingCode=true",
      members: [
        { group: "PV 프로모션팀", name: "장진형", role: "팀장, 프로모션 스틸컷 제작, 웹툰 인물 명암 및 러프 보조",
          bio: "모두 고생하셨습니다!" },
        { group: "PV 프로모션팀", name: "김상우", role: "프로모션 스틸컷 제작, 웹툰 인물 선화",
          bio: "다들 고생하셨습니다." },
        { group: "PV 프로모션팀", name: "전주형", role: "프로모션 영상 효과, 연출 및 웹툰 후보정 서식, 타이틀 및 팀명 제작",
          bio: "다들 수고하셨습니다. 감사합니다." },
        { group: "PV 프로모션팀", name: "손중근", role: "프로모션 영상 및 사운드 편집",
          bio: "모두 수고하셨습니다. 감사합니다." },
        { group: "웹툰팀", name: "이소담", role: "웹툰 스토리보드 및 메인 러프",
          bio: "모두 수고하셨습니당 앞으로 화이팅합시다!" },
        { group: "웹툰팀", name: "박연우", role: "웹툰 시나리오, 배경 채색",
          bio: "팀원분들 모두 수고 많으셨습니다." },
        { group: "웹툰팀", name: "김예은", role: "웹툰 배경 러프 구체화",
          bio: "1년 넘게 함께하신 팀원분들 모두 수고하셨습니다." },
        { group: "웹툰팀", name: "전용후", role: "웹툰 배경 선화",
          bio: "고생하셨습니다. 감사합니다." },
        { group: "웹툰팀", name: "이혁", role: "웹툰 인물 밑색",
          bio: "고생하셨습니다." }
      ] },
    { order: 6, teamName: "먼지", title: "갑각", genre: "2D 애니메이션", synopsis: "단편 애니메이션 〈갑각〉은 청소년기 관계 속에서 드러나는 감정의 어긋남과 균열을 다루는 청춘 드라마다. 작품은 16살의 여름, 친구로 지냈던 두 인물 A와 B의 관계를 서로 다른 기억과 감정의 시선으로 그려낸다. 우정과 동경, 애착과 집착 사이에서 서툴게 엇갈리는 두 사람의 관계를 통해 청소년기의 불안정한 감정과 애착이 남기는 흔적을 섬세하게 담아낸다.", runtime: "06:06", mediaType: "video", videoUrl: "sub8wsunoPg", thumbnail: "assets/posters/06.jpg", posterY: 50,
      members: [
        { name: "박채연", role: "각본/감독, 콘티, 배경미술",
          bio: "부족한 제게 먼지 친구들과 협력하여 작품을 만드는 과정은 정말 좋은 경험이자 큰 영광이었습니다. 팀 이름과 같이 작은 먼지들이 모여 한 덩어리를 만들듯, 사소한 것 하나부터 마지막까지 함께 만들어나가고 헤쳐 나가는 모든 과정이기에 뜻깊었습니다. 함께할 수 있어서 기뻤고, 함께 끝마쳐 더욱 기쁩니다." },
        { name: "모정현", role: "조감독, 원동화, 편집",
          bio: "다들 힘을 합쳐 길고도 짧은 시간 동안 정말 고생 많으셨습니다. 힘든 상황도 많았지만 그만큼 배우고 느낄 수 있었던 것도 많았던 것 같습니다. 함께 작품을 완성할 수 있어서 뜻깊었고, 다들 정말 수고하셨습니다!" },
        { name: "신수빈", role: "메인 원화, 캐릭터 디자인, 작화감독",
          bio: "길기도 했고 짧기도 했던 시간이었던 것 같습니다. 여럿이서 작품을 만들어보는 건 처음이었는데 혼자서는 떠올리지 못했을 생각과, 새로운 시선을 공유하는 재미가 신선했습니다. 값진 경험으로 남을 것 같습니다. 모두 수고 많으셨습니다!" },
        { name: "임지유", role: "선화, 채색, 배경",
          bio: "졸업작품을 준비하면서 생각보다 힘든 순간도 많았지만 그래도 하나씩 완성해가는 과정이 재미있었습니다! 다 같이 고생하면서 만든 만큼 완성된 작품을 보니 뿌듯하기도 하고 이제 끝이라고 생각하니 조금 아쉽기도 합니다. 그동안 같이 고생한 팀원들 모두 수고 많았습니다ㅎㅎ" }
      ] },
    { order: 7, teamName: "달콤공방", title: "Instant World", genre: "2D 애니메이션", synopsis: "〈Instant World〉는 달콤한 간식을 좋아하지만 먹을 수 없는 병을 가진 소녀 시온과, 그런 시온을 돕는 미니미 로크의 이야기를 담은 2D 뮤직비디오 애니메이션이다. 상상 속 간식으로 가득한 세계에서 두 친구가 함께하는 따뜻한 일상과 추억을 통해, 좋아하는 것들과 소중한 행복을 마음속에 간직하며 살아가는 의미를 전한다.", runtime: "03:16", mediaType: "video", videoUrl: "skOjLSdg4KY", thumbnail: "assets/posters/07.jpg", posterY: 45,
      members: [
        { name: "고은빈", role: "감독, 원동화, 배경",
          bio: "긴 시간 동안 졸업작품을 제작하면서 많은 점을 배울 수 있는 시간이었습니다. 다 함께 힘을 모아 제작하게 되어 기쁘고 즐거웠습니다. 부족한 점이 많은 감독이었지만, 믿고 함께해 준 팀원분들에게 감사합니다. 수고 많으셨습니다!" },
        { name: "윤다빈", role: "부감독, 작화감독, 원동화, 배경",
          bio: "서로 협업하며 멋진 작품을 만들 수 있어서 기뻤습니다 :)" },
        { name: "이유빈", role: "원동화, 배경, 로고",
          bio: "준비하는 기간 동안 수고 많으셨습니다. 다 함께 힘을 모아 작품을 만들 수 있게 되어 기뻤습니다." },
        { name: "신지은", role: "원동화, 배경",
          bio: "부족한 점도 많았지만 서로 도우며 최종 졸업작품을 완성할 수 있어서 뿌듯했습니다. 모두 고생 많으셨습니다." },
        { name: "복민서", role: "원동화, 배경",
          bio: "짧지 않은 시간 동안 모두 고생 많으셨습니다. 좋은 경험과 좋은 결과물을 만들어낼 수 있어서 영광이었습니다." },
        { name: "송창흔", role: "원동화, 배경, 편집",
          bio: "긴 시간 동안 함께 작업하느라 모두 고생 많았고 정말 뜻깊은 시간이었습니다! 앞으로도 다들 행복하시길!!" }
      ] },
    { order: 8, teamName: "ARCO", title: "인형의 메아리", genre: "2D 애니메이션", synopsis: "골동품 가게에서 우연히 움직이는 인형 에오스를 만난 세린. 두 사람은 계약을 맺고, 에오스의 잃어버린 가족을 찾기 위해 나선다. 그러던 중 세뇌당한 쌍둥이 셀레네와 마주하게 된다. 과연 세린과 에오스는 셀레네의 세뇌를 풀고 소중한 유대를 되찾을 수 있을까?", runtime: "04:41", mediaType: "video", videoUrl: "H7GsvnBKVKk", thumbnail: "assets/posters/08.jpg",
      members: [
        { name: "한아연", role: "팀장, 3D 모델링",
          bio: "얼결에 감독 노릇을 하고 부족한 점도 많이 느끼고 어디서도 경험하기 힘든 값진 경험을 한 것 같습니다. 다음에 비슷한 일을 하게 된다면 발판 삼아 나아가고자 합니다. 다들 너무 수고 많았습니다!" },
        { name: "김아영", role: "편집, 문서",
          bio: "1년 반이라는 시간 동안 한 작품을 완성해 볼 수 있어서 좋았고, 팀원들과 아이디어, 의견 조율 등 여러 활동을 할 수 있는 값진 경험을 한 것 같습니다." },
        { name: "서수영", role: "원화, 레이아웃",
          bio: "협동과 협력을 배울 수 있는 좋은 기회였습니다. 애니메이션 제작의 어려움과 즐거움 또한 알게 되어 보람찼습니다! 다들 고생 많으셨습니다." },
        { name: "장은채", role: "원동화",
          bio: "처음으로 제대로 된 애니메이션 제작을 해본 만큼 작업 과정에서 여러 가지를 배우고 경험할 수 있어 뜻깊은 시간이었습니다. 함께 작품을 완성하기까지 노력해 준 팀원 모두에게 감사드리고 싶습니다. 다들 정말 고생 많으셨습니다!" },
        { name: "도은지", role: "클린업, 동화",
          bio: "하나의 작품을 처음부터 끝까지 책임감 있게 완성하며 많은 경험을 쌓을 수 있었습니다. 앞으로도 이 경험을 바탕으로 꾸준히 작업해 나가고 싶습니다." },
        { name: "김경희", role: "클린업, 배경",
          bio: "내 취향의 작품을 팀원들과 함께 처음부터 끝까지 제작할 수 있어 즐거웠습니다. 모두 수고하셨습니다!" },
        { name: "원정후", role: "원동화",
          bio: "졸업작품을 준비하며 생각했던 것을 직접 작품으로 만들어보는 값진 경험을 할 수 있었습니다. 팀원들과 함께 작업하면서 협업의 중요성과 작품을 완성하는 과정에 대해 많이 배웠습니다. 아쉬운 점도 있지만 끝까지 완성했다는 것에 의미를 두고, 좋은 경험으로 기억하고 싶습니다." },
        { name: "한승비", role: "3D 모델링, 렌더링",
          bio: "3D 배경을 맡아 제작했습니다. 여러 사람과 함께 하나의 작품을 완성해가는 과정에서 많이 배우고 성장할 수 있었습니다. 다들 수고하셨습니다." }
      ] },
    { order: 9, teamName: "무르무르", title: "개복치의 죽음", genre: "3D 애니메이션", synopsis: "사소한 자극에도 생명을 잃는 개복치처럼, 사회적 고립 속에서 한 줄의 희망을 얻었지만, 결국엔 무너져 버리는 현대인의 유약한 심리를 그린 3D AI 애니메이션", runtime: "05:48", mediaType: "video", videoUrl: "LdncHR0kHaU", thumbnail: "assets/posters/09.jpg",
      members: [
        { name: "김혁진", role: "감독, Scenario, Storyboard, Animatic, Character, Prop, Environment Modeling, Rigging, Animating, AI Production, Post-Processing, Sound Design, Editing",
          bio: "졸업작품을 만드는 내내 힘들어서 개복치가 될 뻔했지만, 좋은 팀원들이 있어 함께 힘을 합쳐 작품을 만들 수 있었습니다. 그리고 나온 작품을 보니 그간의 시련들이 보상으로 돌아와 행복했습니다." },
        { name: "김지원", role: "Character Design, Title Design, Poster Design, 2D Graphic Art",
          bio: "좋은 팀원들을 만난 덕분에 힘든 과정도 즐겁게 이겨낼 수 있었고, 서로 소통하며 끝까지 함께 완성해 낼 수 있어서 정말 뜻깊은 시간이었습니다." },
        { name: "이권준", role: "Prop Modeling, Environment Modeling",
          bio: "재미있었고 졸업작품은 인생의 기억에 남는 활동이었으며 다음에 기회가 있다면 또 해보고 싶습니다." },
        { name: "조민교", role: "Prop Modeling, Environment Modeling",
          bio: "함께 작업하며 막히는 점 없이 잘 해나갔고, 좋은 팀을 만나 소통도 활발하게 하며 완벽하게 마무리하여 굉장히 뿌듯합니당." }
      ] },
    { order: 10, teamName: "Finale", title: "심해의 거성", genre: "2D 애니메이션", synopsis: "단편 애니메이션 〈심해의 거성〉은 신의 분노로 수몰된 성에서 유일하게 살아남은 주인공 ‘라피스’를 통해, 짙은 죄책감과 과거의 상처를 딛고 다시 한번 현실을 향해 나아가려는 여정을 담아낸 판타지 작품이다. 동족을 지키지 못했다는 죄책감에 라피스는 스스로 만들어 낸 환상 속으로 도피한다. 하지만 안온했던 환상은 서서히 균열을 일으키며 붕괴하고, 그의 두려움이 형상화된 괴물이 나타나 라피스를 추격하기 시작한다. 무너지는 환상 속에서 절체절명의 위기를 맞은 순간, 의문의 조력자 ‘아줄’이 등장해 그를 현실로 이끈다. 작품은 괴물로부터 아줄과 함께 성을 탈출하려는 라피스의 여정을 통해, 과거의 트라우마에서 벗어나고자 하는 인물의 치열한 감정선을 섬세하게 묘사한다.", runtime: "07:20", mediaType: "video", videoUrl: "QGioUjjWd_k", thumbnail: "assets/posters/10.jpg",
      members: [
        { name: "김정은", role: "감독, 스토리보드, 원화",
          bio: "모두 정말 고생하셨습니다. 감사합니다!!!" },
        { name: "노명진", role: "동화, 채색",
          bio: "다 함께 라피스처럼 고난을 이겨낸 만큼, 수고 많으셨습니다." },
        { name: "서푸른", role: "영상 편집, 보정",
          bio: "1년 동안 모두 감사했고 수고하셨습니다!" },
        { name: "염호정", role: "선화, 배경",
          bio: "다들 고생하셨고 수고하셨습니다~!" }
      ] },
    { order: 11, teamName: "약한친구들", title: "Endless", genre: "2D 애니메이션", synopsis: "〈Endless〉는 의료용 마약류의 불법 유통과 중독의 위험성을 다룬 범죄·사회 고발 추리 애니메이션이다. 의료용 마약을 불법 유통하던 병원장은 자신의 범죄를 은폐하기 위해 살인을 저지르지만, 사건 이후 기억을 잃게 된다. 이후 사건을 목격한 간호사의 협박을 계기로 잃어버린 기억을 되찾고, 자신이 저지른 범죄와 마주하게 된다. 그러나 끝내 자신마저 마약에 중독되는 비극적인 결말을 맞이한다. 작품은 “이젠 누구도 돌아갈 수 없어”라는 대사를 통해 한 번 시작된 마약 범죄와 중독이 돌이킬 수 없는 결과로 이어질 수 있음을 보여주며, 마약류 오남용과 불법 유통의 심각성에 대한 경각심을 전달하고자 한다.", runtime: "07:05", mediaType: "video", videoUrl: "d_K_x9l9suk", thumbnail: "assets/posters/11.jpg", posterY: 65,
      members: [
        { name: "김윤영", role: "총감독, 배경",
          bio: "팀원분들이 끝까지 잘해주셔서 너무 고마웠고 애니메이션 한 편을 만드는 경험을 할 수 있어서 굉장히 뜻깊었습니다! 교수님들과 팀원분들의 많은 도움이 있었기에 완성할 수 있었습니다! 감사합니다!!" },
        { name: "최세진", role: "조감독, 원화",
          bio: "끝까지 해내서 좋았습니다. 함께한 팀원들, 방향을 잡아주신 교수님들 모두 감사합니다." },
        { name: "주수빈", role: "배경",
          bio: "팀원들과 합을 맞춰 나가며 하나의 작품을 완성해 낸 것이 뿌듯합니다. 많은 보람을 느낄 수 있는 시간이었습니다." },
        { name: "유현선", role: "동화",
          bio: "이번 졸업작품을 진행하며 원화와 동화의 타이밍 감각을 확실히 익힐 수 있었습니다. 특히 핵심 동작(포즈) 사이의 연결 흐름을 파악하고, 각 동작의 프레임을 어떻게 배분하느냐에 따라 움직임의 완성도와 연출이 크게 달라진다는 점을 깊이 이해하게 되었습니다." },
        { name: "정해인", role: "동화",
          bio: "팀원들과 함께 졸업작품을 진행하며 처음에는 제 역할을 잘 해낼 수 있을지 걱정이 많았으나, 서로 잘 이끌어준 덕분에 많은 것을 배우고 성장할 수 있었습니다. 특히 씬을 구성하는 원화와 동화의 타이밍, 채색 방법을 배우며 수행 능력을 키울 수 있었고, 배움 속 팀업의 가치와 중요성을 다시 한번 깨닫게 되었습니다." },
        { name: "김민석", role: "클린업",
          bio: "팀원들과 함께 하나의 작품을 완성해 나가는 과정이 새롭고 뜻깊었습니다. 서로 협력하며 완성한 만큼 더욱 기억에 남는 작업이었던 것 같습니다." },
        { name: "김창윤", role: "편집",
          bio: "능력 좋은 분들만 모인 팀에 합류해서 작업하게 되어 행운이었습니다. 작품의 분위기를 살리기 위해 사운드 연출에 특히 공을 많이 들였습니다. 즐겁게 봐주세요!" }
      ] }
  ]
};
