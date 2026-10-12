/**
 * 상영회 데이터
 * - 실제 정보가 확정되면 아래 값만 교체하면 됩니다.
 * - thumbnail / illustration / webtoonImages 를 null로 두면 자동으로 장식 플레이스홀더가 표시됩니다.
 * - videoUrl 은 유튜브 videoId 문자열입니다. (현재는 블렌더 재단의 공개 라이선스 영상으로 임시 대체 — 실제 작품 영상으로 교체 필요)
 * - 지금은 다른 사람에게 데모로 보여주기 위해 제목/설명/팀원/러닝타임을 전부 플레이스홀더(작품 -N, 팀 -N, 학생-N, 00:00)로 단순화한 상태입니다.
 */
window.SHOWCASE_DATA = {
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
      { label: "지도교수", names: ["안현숙", "강효은", "이문형", "박정선", "채범석", "김미경", "김종훈", "류명희", "안형혜", "오필정", "안민채", "이지웅", "정예진"] }
    ]
  },
  teams: [
    { order: 1, teamName: "몽글", title: "구름을 좇는 아이", genre: "2D 애니메이션", synopsis: "〈구름을 좇는 아이〉는 ‘자신을 있는 그대로 받아들이고 사랑하자’를 주제로 제작한 2D 단편 애니메이션이다. 회색 곱슬머리 때문에 친구들에게 ‘먹구름’이라 놀림받으며 자신의 모습을 콤플렉스로 여기던 누리는 구름을 배달하는 요정 루아를 만나게 된다. 도망친 먹구름을 찾으면 머리를 바꿔주겠다는 루아의 제안을 받아들인 누리는 함께 먹구름을 찾아 나서고, 거울 속 세계에서 자신의 모습을 마주하게 된다. 그 과정에서 누리는 자신이 싫어했던 모습을 받아들이며 있는 그대로의 자신을 사랑하는 법을 깨닫는다.", runtime: "06:56", mediaType: "video", videoUrl: "s846yUkLK1U", thumbnail: "assets/posters/01.jpg",
      members: [
        { name: "홍가영", role: "원동화 러프(기본도형, 디테일, 흐름), 3D 배경 렌더, 3D 배경 보정, 컬러 가이드",
          bio: "졸업작품을 진행하며 제 스스로 욕심이 생기며 아쉬움이 남기도 했지만 동시에 작업에 재미를 느끼기도 했던 것 같습니다. 팀원분들 모두가 열심히 해주셔서 감사합니다!",
          illustration: "assets/members/avatar-1.svg" },
        { name: "박채빈", role: "스토리, 스토리보드, 클린업, 후보정",
          bio: "단편 애니메이션 한 편을 직접 제작해볼 수 있었던 경험이 좋았습니다. 기획부터 제작까지 전 과정에 참여하면서 다양한 분야를 경험해보고, 그 과정에서 어떤 분야가 저와 잘 맞는지 알아갈 수 있었습니다. 또한 작품을 직접 만들어보면서 이전보다 애니메이션을 볼 때 장면과 연출을 더욱 세심하게 살펴보게 되었습니다.",
          illustration: "assets/members/avatar-2.svg" },
        { name: "정민서", role: "졸작 클린업, 이펙트, 로고디자인, 배경 모델링",
          bio: "1년 넘게 팀원들과 함께하며 많은 걸 배운 작품입니다. 즐겁게 봐주시면 감사하겠습니다!",
          illustration: "assets/members/avatar-3.svg" },
        { name: "한수지", role: "캐릭터 디자인, 스토리보드, 걷기/뛰기 원동화, 영상편집, 선화, 채색",
          bio: "끝까지 완성할 수 있어 뿌듯하고 좋은 경험이 되었습니다. 몽글팀 화이팅!",
          illustration: "assets/members/avatar-4.svg" },
        { name: "이지민", role: "동화 작업, 채색, 3D 배경, 레이아웃, 사운드 가이드, 임시 더빙",
          bio: "좋은 팀원들과 함께 작품을 완성해가며 역량을 키우고, 협업의 즐거움과 팀워크의 의미를 배울 수 있었습니다. 함께해준 팀원들 모두 수고 많았습니다!",
          illustration: "assets/members/avatar-5.svg" },
        { name: "박서빈", role: "메인채색, 립싱크, 선화 정리(클린업) 수정",
          bio: "복학하면서 프로젝트 중간에 합류하게 되어 처음에는 적응하는 데 어려움도 있었습니다. 하지만 팀원들과 함께 작업하면서 금방 익숙해졌고, 하나의 작품을 완성하기까지 여러 가지를 배우고 경험할 수 있었습니다. 쉽지만은 않았지만 끝까지 함께해서 더 뿌듯한 작업이었습니다.",
          illustration: "assets/members/avatar-6.svg" }
      ] },
    { order: 2, teamName: "Blue Bird", title: "Apple Pie", genre: "3D 애니메이션", synopsis: "〈Apple Pie〉는 주인공인 소년이 맛있는 애플파이를 만들어 할머니를 행복하게 만들어주기 위해 오랫동안 노력하였다. 하지만 끝내 완성된 애플파이를 전달하지 못한 주인공의 위기와 극복을 담은 감성적인 가족 드라마 장르의 3D 애니메이션이다.", runtime: "07:30", mediaType: "video", videoUrl: "sp1Z-oJXQNY", thumbnail: "assets/posters/02.jpg",
      members: [
        { name: "이희진", role: "감독, 3D모델링 및 리깅, 애니메이팅",
          bio: "A l'approche de la projection de mon film de fin d'études, j'ai l'impression que c'est vraiment la fin... Toute l'équipe, vous avez vraiment bien travaillé. Et je remercie le professeur, l'assistant et le comité exécutif qui m'ont aidé à organiser la projection. Enfin, les gars, merci d'avoir suivi le mauvais chef, je vous aime. ＼(^○^)／",
          bioKo: "졸업작품 상영회를 앞두니 이제 진짜 끝이라는 생각이드네요… 팀원분들 정말 수고 많으셨습니다! 그리고 상영회 진행을 위해 도와준 교수님 및 조교님, 집행부 여러분께 감사하다는 말을 드리며. 마지막으로 팀원들아 못난 팀장 따라줘서 고맙고 사랑한다!!! ＼(^○^)／",
          illustration: "assets/members/avatar-6.svg" },
        { name: "우자연", role: "3D 건물 모델링 및 리깅, 애니메이팅",
          bio: "Même si j'ai parfois eu envie de tout arrêter, voir mes coéquipiers travailler dur jusqu'au bout m'a poussé à tenir bon jusqu'à la fin. On a tous bien galéré et je vous dis un grand merci! ｄ(≧∀≦)ｂ",
          bioKo: "그만 둘까 생각이 들어도 끝까지 열심히 하는 팀원들을 보며 저도 마지막까지 참여할 수 있었습니다. 다들 너무 고생 많았고 고마워요! ｄ(≧∀≦)ｂ",
          illustration: "assets/members/avatar-1.svg" },
        { name: "백민재", role: "편집, 3D 모델링 및 리깅, 애니메이팅",
          bio: "Un grand merci à mes coéquipiers qui se sont battus à mes côtés jusqu'au bout ! Je souhaite de tout cœur le meilleur aux juniors qui s'apprêtent à créer de magnifiques œuvres, dans leurs débuts et tous leurs projets créatifs.",
          bioKo: "끝까지 함께 달려준 팀원분들 정말 고생 많았어요! 앞으로 멋진 작품을 만들어갈 후배 여러분의 새로운 시작과 모든 창작 길을 진심으로 응원합니다.",
          illustration: "assets/members/avatar-2.svg" },
        { name: "홍윤서", role: "서기, 3D 모델링 및 리깅, 애니메이팅",
          bio: "Au début du projet, j'étais un peu dépassé car c'était ma première expérience en animation 3D ; heureusement, j'ai eu la chance de trouver des coéquipiers formidables. Nous avons étudié et collaboré pendant un an et demi, et je suis ravi que nous ayons pu mener ce projet à bien. Je suis vraiment reconnaissant à mes coéquipiers pour leur travail acharné et leur dévouement, et je leur souhaite tout le bonheur du monde !",
          bioKo: "작품 제작 초기에는 처음 도전하는 3D 애니메이션인 만큼 막막하였지만, 마음이 잘 맞는 팀원들을 만나 1년 반 동안 함께 공부하고 서로 맞춰가며 무사히 작품을 완성할 수 있게 되어 좋았습니다. 함께 고생하고 노력해 준 팀원들에게 정말 고맙고, 다들 앞으로 행복한 일들만 가득하길 바랍니다!",
          illustration: "assets/members/avatar-3.svg" },
        { name: "차유림", role: "3D 캐릭터 모델링 및 애니메이팅",
          bio: "C'était la première fois que je réalisais un projet de fin d'études avec les membres de mon équipe, et cela m'a permis de vivre une nouvelle expérience. Je voudrais remercier mes coéquipiers d'avoir continué jusqu'au bout, même si le travail en 3D n'était pas toujours facile. Je pense que c'est grâce aux efforts de chacun que nous avons pu terminer ce projet. J'espère sincèrement que chacun pourra réussir dans la voie qu'il souhaite suivre à l'avenir.",
          bioKo: "처음으로 팀원들과 함께 졸업작품을 제작하며 새로운 경험을 할 수 있었습니다. 3D 작업이 쉽지 않았음에도 끝까지 함께해준 팀원들에게 감사하다는 말을 전하고 싶습니다. 모두가 잘 버텨주었기에 작품도 끝까지 완성될 수 있었다고 생각하며, 앞으로도 각자 원하는 길에서 좋은 결과가 있기를 바랍니다.",
          illustration: "assets/members/avatar-4.svg" }
      ] },
    { order: 3, teamName: "매드쉽", title: "카아루디루나", genre: "2D 애니메이션", synopsis: "평화로운 마을에서 사람들의 꿈을 담고 있던 ‘꿈 구슬’이 어느 날 흔적도 없이 사라진다. 꿈 구슬이 누군가에게 도둑맞았다는 사실을 알게 된 소녀 루나는 사라진 꿈을 되찾기 위해 위험한 그림자 세계로 향한다. 그곳에서 루나는 두려움과 시련, 장애물에 맞서며 앞으로 나아간다. 끝없는 고난과 역경을 이겨낸 루나는 마침내 자신의 꿈 구슬과 마을 사람들의 꿈 구슬을 되찾고, 모두에게 잃어버린 꿈과 희망을 다시 돌려준다.", runtime: "05:08", mediaType: "video", videoUrl: "XgGh9kan85w", thumbnail: "assets/posters/03.jpg",
      members: [
        { name: "박한별", role: "감독, 원화, 동화, 채색, 스토리보드, 배경, 편집",
          bio: "나를 죽이지 못하는 고통은 나를 더 강하게 만든다.",
          illustration: "assets/members/avatar-1.svg" },
        { name: "조채원", role: "원화, 동화, 채색, 스토리보드, 배경, 캐릭터 디자인",
          bio: "우여곡절을 거쳐 만들어가는 동안 많은 것을 배울 수 있었고, 함께해온 모든 분께 감사드립니다!",
          illustration: "assets/members/avatar-5.svg" },
        { name: "정민석", role: "원화, 동화, 채색, 스토리보드, 캐릭터 디자인",
          bio: "많이 미숙했지만 뜻깊은 제작이었습니다!",
          illustration: "assets/members/avatar-6.svg" }
      ] },
    { order: 4, teamName: "미정", title: "레나의 여행", genre: "2D 애니메이션", synopsis: "서로 다른 두 세계를 배경으로, 우연한 만남을 통해 이어지는 사람들의 기억과 감정을 담아낸 감성 판타지 작품. 다른 세계에서 온 소녀 레나와 커피를 수확하며 살아가는 청년 바리의 만남을 중심으로, 낯선 두 사람이 함께 시간을 보내며 서로에게 특별한 존재가 되어가는 과정. 작품 속 커피를 기억과 감정을 연결하는 매개체로 활용하여, 소중한 사람과의 관계와 미처 전하지 못했던 마음의 의미를 담아낸 작품.", runtime: "07:18", mediaType: "video", videoUrl: "7zEALosyLzI", thumbnail: "assets/posters/04.jpg",
      members: [
        { name: "이진우", role: "감독, 편집, 스토리보드 일부, 시나리오, 원화, 동화 일부",
          bio: "모자란 감독과 작업하느라 고생한 팀원분들에게 감사의 말씀 드리고 싶고, 진짜 저희 손으로 작품을 만들어냈다는 게 믿기지 않습니다.",
          illustration: "assets/members/avatar-4.svg" },
        { name: "곽상덕", role: "배경",
          bio: "부족한 점도 많았지만 팀원분들과 함께 작품을 완성할 수 있어서 좋았습니다. 함께해주신 팀원분들께 감사드립니다.",
          illustration: "assets/members/avatar-5.svg" },
        { name: "임정민", role: "스토리보드 일부, 원화 일부, 동화, 선화, 채색",
          bio: "졸업작품 작업은 저에게 이론을 넘어, 실제로 작업을 내 손으로 해본 가장 값진 시간이었습니다.",
          illustration: "assets/members/avatar-6.svg" }
      ] },
    { order: 5, teamName: "200%", title: "소리 없는 불꽃", genre: "웹툰", synopsis: "작품 -5 설명", runtime: "01:39", mediaType: "video+webtoon", videoUrl: "no3wjGTGP4A", thumbnail: "assets/posters/05.jpg",
      webtoonPrompt: "웹툰 감상하기", webtoonImages: null, webtoonCutCount: 8,
      members: makeMembers(5) },
    { order: 6, teamName: "먼지", title: "갑각", genre: "2D 애니메이션", synopsis: "작품 -6 설명", runtime: "06:06", mediaType: "video", videoUrl: "sub8wsunoPg", thumbnail: "assets/posters/06.jpg",
      members: makeMembers(6) },
    { order: 7, teamName: "달콤공방", title: "Instant World", genre: "2D 애니메이션", synopsis: "작품 -7 설명", runtime: "03:16", mediaType: "video", videoUrl: "skOjLSdg4KY", thumbnail: "assets/posters/07.jpg",
      members: makeMembers(7) },
    { order: 8, teamName: "ARCO", title: "인형의 메아리", genre: "2D 애니메이션", synopsis: "작품 -8 설명", runtime: "04:41", mediaType: "video", videoUrl: "H7GsvnBKVKk", thumbnail: "assets/posters/08.jpg",
      members: makeMembers(8) },
    { order: 9, teamName: "무르무르", title: "개복치의 죽음", genre: "3D 애니메이션", synopsis: "작품 -9 설명", runtime: "05:48", mediaType: "video", videoUrl: "LdncHR0kHaU", thumbnail: "assets/posters/09.jpg",
      members: makeMembers(9) },
    { order: 10, teamName: "Finale", title: "심해의 거성", genre: "2D 애니메이션", synopsis: "작품 -10 설명", runtime: "07:20", mediaType: "video", videoUrl: "QGioUjjWd_k", thumbnail: "assets/posters/10.jpg",
      members: makeMembers(10) },
    { order: 11, teamName: "약한친구들", title: "Endless", genre: "2D 애니메이션", synopsis: "작품 -11 설명", runtime: "07:05", mediaType: "video", videoUrl: "YE7VzlLtp-4", thumbnail: "assets/posters/11.jpg",
      members: makeMembers(11) }
  ]
};

/** 팀당 학생 5명(학생-1~5), 역할은 감독·작화·배경·편집·사운드. 아바타는 전체 인원 기준으로 6종을 이어서 순환 배정. */
function makeMembers(teamIndex) {
  const roles = ["감독", "작화", "배경", "편집", "사운드"];
  const avatarCount = 6;
  const startGlobalIndex = (teamIndex - 1) * 5;
  const members = [];
  for (let i = 0; i < 5; i++) {
    const studentNum = i + 1;
    const globalIndex = startGlobalIndex + i;
    const avatarNum = (globalIndex % avatarCount) + 1;
    members.push({
      name: `학생-${studentNum}`,
      role: roles[i],
      bio: `학생-${studentNum} 한마디`,
      illustration: `assets/members/avatar-${avatarNum}.svg`
    });
  }
  return members;
}
