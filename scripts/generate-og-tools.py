"""
generate-og-tools.py
계산기 + 리포트 OG 이미지 생성 (1200×630 PNG) — 2컬럼 레이아웃
실행: python scripts/generate-og-tools.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── 도구 데이터 ────────────────────────────────────────────────────────────────
TOOLS = [
    {"slug": "salary",                     "title": "연봉 인상 계산기",              "description": "현재 연봉과 인상 시나리오별 월 실수령 변화를 비교하는 계산 페이지",                                      "eyebrow": "연봉·이직",     "stats": [("월 실수령", "341만원"),    ("+5% 후", "358만원")]},
    {"slug": "retirement",                 "title": "퇴직금 계산기",                 "description": "평균임금 기준 퇴직금과 세후 추정액을 계산하는 페이지",                                                    "eyebrow": "연봉·이직",     "stats": [("퇴직금 세전", "4,166만원"), ("세후 추정", "약 3,950만원")]},
    {"slug": "negotiation",                "title": "이직 계산기",                   "description": "현재 연봉과 목표 연봉의 세전 실수령 차이를 비교하는 페이지",                                              "eyebrow": "연봉·이직",     "stats": [("월 실수령 차이", "+52만원"), ("인상률", "20%")]},
    {"slug": "parental-leave",             "title": "육아휴직 계산기",               "description": "육아휴직 급여와 복직 후 수입을 비교해 버퍼를 계산하는 페이지",                                            "eyebrow": "육아휴직·출산", "stats": [("가구 수령액", "월 200만+"), ("버퍼 기간", "12개월")]},
    {"slug": "household-income",           "title": "가구 소득 계산기",              "description": "가구 연 총소득, 월 체감, 실수령 추정, 평균·기준 중위소득 대비 위치를 계산하는 페이지",                     "eyebrow": "연봉·이직",     "stats": [("중위소득 대비", "138%"),   ("월 실수령", "약 560만원")]},
    {"slug": "bonus-simulator",            "title": "대기업 성과급 시뮬레이터",      "description": "삼성전자, SK하이닉스, 현대자동차의 직급별 성과급과 총보상 시나리오를 비교하는 페이지",                     "eyebrow": "성과급 비교",   "stats": [("삼성 총보상", "1.1억"),    ("하이닉스", "1.8억")]},
    {"slug": "samsung-bonus",              "title": "삼성전자 성과급 계산기",        "description": "개인·부부 모드로 삼성전자 OPI, TAI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",                      "eyebrow": "성과급 비교",   "stats": [("OPI+TAI", "3,600만원"),   ("월 체감", "+300만원")]},
    {"slug": "sk-hynix-bonus",             "title": "SK하이닉스 성과급 계산기",      "description": "개인·부부 모드로 SK하이닉스의 PS, PI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",                    "eyebrow": "성과급 비교",   "stats": [("PS+PI", "6,000만원"),     ("월 체감", "+500만원")]},
    {"slug": "hyundai-bonus",              "title": "현대자동차 성과급 계산기",      "description": "개인·부부 모드로 현대자동차 성과급 패키지와 자사주 포함 총보상, 월 체감액을 계산하는 페이지",              "eyebrow": "성과급 비교",   "stats": [("성과급 총액", "2,800만원"), ("월 체감", "+233만원")]},
    {"slug": "birth-support-total",        "title": "출산~2세 총지원금 계산기",      "description": "첫만남이용권, 부모급여, 아동수당을 합쳐 아이 두 돌 전까지 받을 수 있는 총액을 계산하는 페이지",            "eyebrow": "육아휴직·출산", "stats": [("2세까지 총액", "약 2,100만원"), ("월 평균", "87만원")]},
    {"slug": "single-parental-leave-total","title": "한 명만 육아휴직 총수령액",     "description": "육아휴직 급여, 부모급여, 아동수당, 첫만남이용권을 합쳐 두 돌까지 가구 총수령액을 계산하는 페이지",         "eyebrow": "육아휴직·출산", "stats": [("가구 총수령", "약 3,800만원"), ("월 평균", "158만원")]},
    {"slug": "parental-leave-pay",         "title": "육아휴직 급여 계산기",          "description": "월 통상임금 기준으로 일반 육아휴직 사용 시 월별 급여와 총액을 계산하는 페이지",                            "eyebrow": "육아휴직·출산", "stats": [("첫 3개월", "월 250만원"),  ("4개월~", "월 150만원")]},
    {"slug": "six-plus-six",               "title": "6+6 부모육아휴직제 계산기",     "description": "부모 모두 육아휴직을 쓸 때 특례 적용 여부와 일반 육아휴직 대비 차액을 비교하는 페이지",                    "eyebrow": "육아휴직·출산", "stats": [("특례 총액", "약 900만원"),  ("일반 대비", "+300만원")]},
    {"slug": "wedding-budget-calculator",  "title": "결혼 준비 예산 계산기",         "description": "지역·티어·하객 수·신혼여행 지역을 설정해 결혼 총예산을 계산하는 페이지",                                  "eyebrow": "결혼 예산",     "stats": [("평균 총예산", "약 4,400만원"), ("항목별 breakdown", "자동 계산")]},
    {"slug": "wedding-gift-break-even-calculator", "title": "결혼 축의금 손익분기점 계산기", "description": "예식홀 식대, 보증인원, 하객 수, 평균 축의금을 넣어 결혼식 손익을 계산하는 페이지",            "eyebrow": "결혼 예산",     "stats": [("식대 × 보증인원", "핵심 구조"), ("손익분기점", "자동 계산")]},
]

# ── 리포트 데이터 ──────────────────────────────────────────────────────────────
REPORTS = [
    {"slug": "it-salary-top10",           "title": "IT 업계 신입 초봉 TOP 10",      "description": "네이버·카카오·SK텔레콤·현대오토에버 등 주요 IT 기업 신입 연봉과 복리후생을 랭킹 카드로 비교하는 2026년 리포트",   "eyebrow": "연봉 리포트",   "stats": [("1위 연봉", "약 8,000만원"), ("비교 기업", "10개")]},
    {"slug": "new-employee-salary-2026",  "title": "2026 신입사원 초봉 비교",        "description": "IT·반도체·자동차·금융·공공 분야 주요 기업의 2026년 신입사원 초봉을 바 차트와 상세 카드로 비교하는 인터랙티브 리포트", "eyebrow": "연봉 리포트",   "stats": [("최고 초봉", "약 1.5억"),    ("비교 기업", "50개+")]},
    {"slug": "korea-rich-top10-assets",   "title": "한국 부자 TOP 10 자산 비교",    "description": "2026년 현재 최신 공개 기준으로 한국 상위 10명 자산과 서울 국평·그랜저 환산값을 함께 보는 인터랙티브 리포트",       "eyebrow": "자산 리포트",   "stats": [("1위 자산", "약 30조"),      ("국평 환산", "5만 채+")]},
    {"slug": "us-rich-top10-patterns",    "title": "미국 부자 TOP 10 성공 패턴",    "description": "자산·학력·업종·창업 배경·성향 태그를 선택해서 비교해보는 미국 억만장자 인터랙티브 리포트",                          "eyebrow": "자산 리포트",   "stats": [("1위 자산", "$200B+"),       ("분석 항목", "5가지")]},
    {"slug": "wedding-cost-2016-vs-2026", "title": "결혼비용 2016 vs 2026",          "description": "웨딩홀, 식대, 스드메, 신혼여행까지 10년 전과 지금의 평균 결혼비용을 항목별로 비교하는 리포트",                        "eyebrow": "결혼 리포트",   "stats": [("10년 상승률", "+78%"),      ("2026 평균", "4,413만원")]},
    {"slug": "seoul-84-apartment-prices", "title": "서울 국평 아파트 시세 비교",     "description": "강남·서초·송파·마포·성동·강동 대표 단지의 전용 84㎡ 가격과 체감 진입 장벽을 한 화면에서 비교하는 인터랙티브 리포트", "eyebrow": "부동산 리포트", "stats": [("평균 진입가", "20억+"),     ("비교 단지", "30개+")]},
    {"slug": "it-si-sm-salary-comparison-2026",        "title": "IT SI/SM 연봉 비교 2026",      "description": "IT 서비스·SI·SM 직군의 경력별 연봉 현황과 대기업·중견·스타트업 간 격차를 비교하는 2026년 리포트",             "eyebrow": "연봉 리포트",   "stats": [("경력 10년", "약 6,500만원"), ("기업 규모 격차", "2배+")]},
    {"slug": "new-employee-salary-2026",              "title": "신입사원 초봉 비교 2026",       "description": "주요 대기업·공공·금융 신입 연봉을 업종별로 비교하는 2026년 최신 리포트",                                       "eyebrow": "연봉 리포트",   "stats": [("최고 초봉", "약 1.5억"),    ("비교 기업", "50개+")]},
    {"slug": "insurance-salary-bonus-comparison-2026", "title": "보험업 연봉·성과급 비교 2026", "description": "생명·손해보험사 직군별 연봉과 성과급 지급 구조를 비교하는 2026년 리포트",                                       "eyebrow": "연봉 리포트",   "stats": [("평균 연봉", "약 7,000만원"), ("성과급 비율", "최대 300%")]},
    {"slug": "construction-salary-bonus-comparison-2026","title": "건설업 연봉·성과급 비교 2026","description": "대형 건설사 직군별 연봉과 성과급 지급 구조를 비교하는 2026년 리포트",                                         "eyebrow": "연봉 리포트",   "stats": [("평균 연봉", "약 6,500만원"), ("성과급", "최대 400%")]},
    {"slug": "lee-jaemyung-government-officials-assets-salary-2026", "title": "이재명 정부 고위공직자 자산·연봉", "description": "2026년 이재명 정부 장관급 고위공직자 재산 신고액과 연봉을 비교하는 리포트",               "eyebrow": "자산 리포트",   "stats": [("최고 재산", "수십억"),       ("평균 연봉", "약 1.5억")]},
]

# ── 카테고리 Pill 색상 ────────────────────────────────────────────────────────
PILL_COLORS = {
    "연봉·이직":     {"bg": (15,  110, 86),  "text": (200, 240, 225)},
    "성과급 비교":   {"bg": (133, 79,  11),  "text": (250, 238, 218)},
    "육아휴직·출산": {"bg": (8,   80,  65),  "text": (159, 225, 203)},
    "연봉 리포트":   {"bg": (20,  90,  140), "text": (200, 230, 255)},
    "자산 리포트":   {"bg": (80,  40,  120), "text": (230, 200, 255)},
    "결혼 예산":     {"bg": (130, 45,  60),  "text": (255, 210, 220)},
    "결혼 리포트":   {"bg": (110, 40,  70),  "text": (255, 205, 225)},
    "부동산 리포트": {"bg": (40,  80,  130), "text": (190, 220, 255)},
    "기타":          {"bg": (58,  58,  56),  "text": (200, 198, 190)},
}

# ── 색상 상수 ─────────────────────────────────────────────────────────────────
BG          = (24,  24,  26)
BG_RIGHT    = (28,  28,  30)
WHITE       = (255, 255, 255)
GREEN_MID   = (29,  158, 117)
GREEN_DARK  = (15,  110, 86)
MUTED       = (110, 108, 104)
CARD_BG     = (38,  38,  36)
CARD_BORDER = (52,  52,  50)
STAT_VAL    = (29,  158, 117)
LINE        = (46,  46,  44)
DIM         = (78,  78,  76)

W, H = 1200, 630

# 2컬럼 경계
LEFT_X1  = 60
LEFT_X2  = 700
RIGHT_X1 = 740
RIGHT_X2 = 1140

FONT_PATH = "C:/Windows/Fonts/malgunbd.ttf"
BASE_DIR       = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "public", "og"))
OUT_DIR_TOOLS   = os.path.join(BASE_DIR, "tools")
OUT_DIR_REPORTS = os.path.join(BASE_DIR, "reports")

def font(size):
    return ImageFont.truetype(FONT_PATH, size)

def wrap_text(text, draw, fnt, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = current + ("" if not current else " ") + word
        if draw.textlength(test, font=fnt) <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines

def draw_circle_accent(img, cx, cy, r, color_rgb, alpha_frac):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color_rgb + (int(255*alpha_frac),))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

def draw_logo(draw, ix=60, iy=54):
    S, G = 13, 4
    draw.rounded_rectangle([ix,     iy,     ix+S,     iy+S],     radius=3, fill=GREEN_MID)
    draw.rounded_rectangle([ix+S+G, iy,     ix+S+G+S, iy+S],     radius=3, outline=GREEN_MID, width=2)
    draw.rounded_rectangle([ix,     iy+S+G, ix+S,     iy+S+G+S], radius=3, outline=GREEN_MID, width=2)
    draw.rounded_rectangle([ix+S+G, iy+S+G, ix+S+G+S, iy+S+G+S], radius=3, fill=GREEN_DARK)
    cx = ix + S + G + S // 2
    cy = iy + S + G + S // 2
    draw.line([(cx-4, cy), (cx+4, cy)], fill=WHITE, width=2)
    draw.line([(cx, cy-4), (cx, cy+4)], fill=WHITE, width=2)
    tx = ix + S + G + S + 10
    draw.text((tx, iy), "비교계산소", font=font(18), fill=WHITE)

def generate(tool, out_dir, url_base):
    # ── 캔버스 ──────────────────────────────────────────────────────────────
    img = Image.new("RGB", (W, H), BG)
    img = draw_circle_accent(img, 1080, -40, 260, GREEN_DARK, 0.06)
    img = draw_circle_accent(img, 80,   660, 180, GREEN_MID,  0.04)
    draw = ImageDraw.Draw(img)

    # 우측 컬럼 배경
    draw.rectangle([RIGHT_X1 - 20, 0, W, H], fill=BG_RIGHT)
    # 컬럼 구분선
    draw.line([(RIGHT_X1 - 20, 80), (RIGHT_X1 - 20, 550)], fill=LINE, width=1)
    # 우측 도트 텍스처
    dot_color = (40, 40, 38)
    for dx in range(RIGHT_X1, RIGHT_X2, 28):
        for dy in range(60, 520, 28):
            draw.rectangle([dx, dy, dx+1, dy+1], fill=dot_color)

    # ── 로고 ────────────────────────────────────────────────────────────────
    draw_logo(draw, ix=LEFT_X1, iy=54)

    # ── 카테고리 Pill ────────────────────────────────────────────────────────
    cat    = tool["eyebrow"]
    colors = PILL_COLORS.get(cat, PILL_COLORS["기타"])
    pf     = font(13)
    pill_w = int(draw.textlength(cat, font=pf)) + 28
    PILL_Y = 120
    draw.rounded_rectangle([LEFT_X1, PILL_Y, LEFT_X1 + pill_w, PILL_Y + 28],
                            radius=14, fill=colors["bg"])
    draw.text((LEFT_X1 + 14, PILL_Y + 7), cat, font=pf, fill=colors["text"])

    # ── 제목 (최대 2줄) ──────────────────────────────────────────────────────
    tf      = font(44)
    t_lines = wrap_text(tool["title"], draw, tf, LEFT_X2 - LEFT_X1)
    TITLE_Y = 168
    LH      = 60
    for i, line in enumerate(t_lines[:2]):
        draw.text((LEFT_X1, TITLE_Y + i * LH), line, font=tf, fill=WHITE)
    title_bottom = TITLE_Y + min(len(t_lines), 2) * LH

    # ── 설명 (최대 2줄) ──────────────────────────────────────────────────────
    df      = font(17)
    d_lines = wrap_text(tool["description"], draw, df, LEFT_X2 - LEFT_X1)
    DESC_Y  = title_bottom + 18
    for i, line in enumerate(d_lines[:2]):
        draw.text((LEFT_X1, DESC_Y + i * 26), line, font=df, fill=MUTED)

    # ── 우측 스탯 카드 (세로 스택, 세로 중앙 정렬) ──────────────────────────
    stats     = tool["stats"][:2]
    card_h    = 150
    card_gap  = 20
    total_h   = len(stats) * card_h + (len(stats) - 1) * card_gap
    card_sy   = (H - total_h) // 2 - 10

    lf = font(13)
    vf = font(32)

    for i, (label, value) in enumerate(stats):
        cy = card_sy + i * (card_h + card_gap)
        draw.rounded_rectangle([RIGHT_X1, cy, RIGHT_X2, cy + card_h],
                                radius=12, fill=CARD_BG)
        draw.rounded_rectangle([RIGHT_X1, cy, RIGHT_X2, cy + card_h],
                                radius=12, outline=CARD_BORDER, width=1)
        # 좌측 accent 바
        draw.rounded_rectangle([RIGHT_X1, cy + 20, RIGHT_X1 + 3, cy + card_h - 20],
                                radius=2, fill=GREEN_MID)
        draw.text((RIGHT_X1 + 20, cy + 28), label, font=lf, fill=MUTED)
        draw.text((RIGHT_X1 + 20, cy + 52), value, font=vf, fill=STAT_VAL)

    # ── 하단 구분선 + 푸터 ──────────────────────────────────────────────────
    draw.line([(LEFT_X1, 554), (W - 60, 554)], fill=LINE, width=1)
    ff = font(14)
    draw.text((LEFT_X1, 570), "비교계산소 — 숫자로 더 잘 판단하세요", font=ff, fill=DIM)
    url_text = f"bigyocalc.com/{url_base}/{tool['slug']}"
    url_w    = int(draw.textlength(url_text, font=font(13)))
    draw.text((W - 60 - url_w, 572), url_text, font=font(13), fill=DIM)

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{tool['slug']}.png")
    img.save(out_path, "PNG", optimize=True)
    return out_path

if __name__ == "__main__":
    # 중복 슬러그 제거
    seen, unique_tools, unique_reports = set(), [], []
    for t in TOOLS:
        if t["slug"] not in seen:
            seen.add(t["slug"])
            unique_tools.append(t)
    for r in REPORTS:
        if r["slug"] not in seen:
            seen.add(r["slug"])
            unique_reports.append(r)

    count = 0
    for tool in unique_tools:
        path = generate(tool, OUT_DIR_TOOLS, "tools")
        print(f"생성(계산기): {os.path.basename(path)}")
        count += 1
    for report in unique_reports:
        path = generate(report, OUT_DIR_REPORTS, "reports")
        print(f"생성(리포트): {os.path.basename(path)}")
        count += 1
    print(f"\n완료: {count}개 PNG")
