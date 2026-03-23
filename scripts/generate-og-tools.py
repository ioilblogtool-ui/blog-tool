"""
generate-og-tools.py
13개 계산기 OG 이미지 생성 (1200×630 PNG)
실행: python scripts/generate-og-tools.py
"""

from PIL import Image, ImageDraw, ImageFont
import os, textwrap

# ── 도구 데이터 (generate-og.mjs와 동일) ──────────────────────────────────────
TOOLS = [
    {"slug": "salary",                    "title": "연봉 인상 계산기",             "description": "현재 연봉과 인상 시나리오별 월 실수령 변화를 비교하는 계산 페이지",                                      "eyebrow": "연봉·이직",     "stats": [("월 실수령", "341만"),    ("+5% 후", "358만")]},
    {"slug": "retirement",                "title": "퇴직금 계산기",                "description": "평균임금 기준 퇴직금과 세후 추정액을 계산하는 페이지",                                                    "eyebrow": "연봉·이직",     "stats": [("퇴직금 세전", "4,166만"), ("세후 추정", "약 3,950만")]},
    {"slug": "negotiation",               "title": "이직 계산기",                  "description": "현재 연봉과 목표 연봉의 세전 실수령 차이를 비교하는 페이지",                                              "eyebrow": "연봉·이직",     "stats": [("월 실수령 차이", "+52만"), ("인상률", "20%")]},
    {"slug": "parental-leave",            "title": "육아휴직 계산기",              "description": "육아휴직 급여와 복직 후 수입을 비교해 버퍼를 계산하는 페이지",                                            "eyebrow": "육아휴직·출산", "stats": [("가구 수령액", "월 200만+"), ("버퍼 기간", "12개월")]},
    {"slug": "household-income",          "title": "가구 소득 계산기",             "description": "가구 연 총소득, 월 체감, 실수령 추정, 평균·기준 중위소득 대비 위치를 계산하는 페이지",                     "eyebrow": "연봉·이직",     "stats": [("중위소득 대비", "138%"),  ("월 실수령", "약 560만")]},
    {"slug": "bonus-simulator",           "title": "대기업 성과급 시뮬레이터",     "description": "삼성전자, SK하이닉스, 현대자동차의 직급별 성과급과 2026~2028 총보상 시나리오를 비교하는 페이지",           "eyebrow": "성과급 비교",   "stats": [("삼성 총보상", "1.1억"),   ("하이닉스", "1.8억")]},
    {"slug": "samsung-bonus",             "title": "삼성전자 성과급 계산기",       "description": "개인·부부 모드로 삼성전자 OPI, TAI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",                      "eyebrow": "성과급 비교",   "stats": [("OPI+TAI", "3,600만"),    ("월 체감", "+300만")]},
    {"slug": "sk-hynix-bonus",            "title": "SK하이닉스 성과급 계산기",     "description": "개인·부부 모드로 SK하이닉스의 PS, PI, 복지 포함 총보상과 월 체감액을 계산하는 페이지",                    "eyebrow": "성과급 비교",   "stats": [("PS+PI", "6,000만"),      ("월 체감", "+500만")]},
    {"slug": "hyundai-bonus",             "title": "현대자동차 성과금 계산기",     "description": "개인·부부 모드로 현대자동차 성과금 패키지와 자사주 포함 총보상, 월 체감액을 계산하는 페이지",              "eyebrow": "성과급 비교",   "stats": [("성과금 총액", "2,800만"), ("월 체감", "+233만")]},
    {"slug": "birth-support-total",       "title": "출산~2세 총지원금 계산기",     "description": "첫만남이용권, 부모급여, 아동수당을 합쳐 아이 두 돌 전까지 받을 수 있는 총액을 계산하는 페이지",            "eyebrow": "육아휴직·출산", "stats": [("2세까지 총액", "약 2,100만"), ("월 평균", "87만")]},
    {"slug": "single-parental-leave-total","title":"한 명만 육아휴직 총수령액 계산기","description":"육아휴직 급여, 부모급여, 아동수당, 첫만남이용권을 합쳐 아이 두 돌까지 가구 총수령액을 계산하는 페이지",  "eyebrow": "육아휴직·출산", "stats": [("가구 총수령", "약 3,800만"), ("월 평균", "158만")]},
    {"slug": "parental-leave-pay",        "title": "육아휴직 급여 계산기",         "description": "월 통상임금 기준으로 일반 육아휴직 사용 시 월별 급여와 총액을 계산하는 페이지",                            "eyebrow": "육아휴직·출산", "stats": [("첫 3개월", "월 250만"),  ("4개월~", "월 150만")]},
    {"slug": "six-plus-six",              "title": "6+6 부모육아휴직제 계산기",    "description": "부모 모두 육아휴직을 쓸 때 특례 적용 여부와 일반 육아휴직 대비 차액을 비교하는 페이지",                    "eyebrow": "육아휴직·출산", "stats": [("특례 총액", "약 900만"),  ("일반 대비", "+300만")]},
]

# ── 카테고리 pill 색상 ────────────────────────────────────────────────────────
PILL_COLORS = {
    "연봉·이직":     {"bg": (15,  110, 86),  "text": (225, 245, 238)},
    "성과급 비교":   {"bg": (133, 79,  11),  "text": (250, 238, 218)},
    "육아휴직·출산": {"bg": (8,   80,  65),  "text": (159, 225, 203)},
    "기타":          {"bg": (68,  68,  65),  "text": (211, 209, 199)},
}

# ── 고정 색상 ─────────────────────────────────────────────────────────────────
BG         = (24,  24,  26)
WHITE      = (255, 255, 255)
GREEN_MID  = (29,  158, 117)
GREEN_DARK = (15,  110, 86)
MUTED      = (95,  94,  90)
CARD_BG    = (34,  34,  32)
STAT_VAL   = (29,  158, 117)
LINE       = (46,  46,  44)
DIM        = (68,  68,  66)

W, H = 1200, 630
FONT_PATH = "C:/Windows/Fonts/malgunbd.ttf"
OUT_DIR = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "public", "og", "tools"))

def font(size):
    return ImageFont.truetype(FONT_PATH, size)

def draw_circle_accent(img, cx, cy, r, color_rgb, alpha_frac):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse([cx - r, cy - r, cx + r, cy + r],
               fill=color_rgb + (int(255 * alpha_frac),))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

def wrap_text(text, draw, fnt, max_width):
    """텍스트를 max_width 내에 맞게 줄 분리"""
    words = list(text)  # 한글은 글자 단위로 분리
    # 실제로는 공백 단위로 분리
    words = text.split()
    lines, current = [], ""
    for word in words:
        test = current + ("" if not current else " ") + word
        w = draw.textlength(test, font=fnt)
        if w <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines

def generate(tool):
    img = Image.new("RGB", (W, H), BG)

    # 배경 accent 원
    img = draw_circle_accent(img, 1100, 0,   200, GREEN_DARK, 0.07)
    img = draw_circle_accent(img, 100,  630, 140, GREEN_MID,  0.05)
    draw = ImageDraw.Draw(img)

    # ── 로고 아이콘 (60, 52) ────────────────────────────────────────────────
    IX, IY, S, G = 60, 52, 14, 5
    # 좌상: 채움
    draw.rounded_rectangle([IX,     IY,     IX+S,     IY+S],     radius=3, fill=GREEN_MID)
    # 우상: 테두리
    draw.rounded_rectangle([IX+S+G, IY,     IX+S+G+S, IY+S],     radius=3, outline=GREEN_MID, width=2)
    # 좌하: 테두리
    draw.rounded_rectangle([IX,     IY+S+G, IX+S,     IY+S+G+S], radius=3, outline=GREEN_MID, width=2)
    # 우하: 채움 + 십자
    draw.rounded_rectangle([IX+S+G, IY+S+G, IX+S+G+S, IY+S+G+S], radius=3, fill=GREEN_DARK)
    cx = IX + S + G + S // 2
    cy = IY + S + G + S // 2
    draw.line([(cx-4, cy), (cx+4, cy)], fill=WHITE, width=2)
    draw.line([(cx, cy-4), (cx, cy+4)], fill=WHITE, width=2)

    # ── 로고 텍스트 ─────────────────────────────────────────────────────────
    TX = IX + S + G + S + 9
    draw.text((TX, IY - 2),  "비교계산소",    font=font(16), fill=WHITE)

    # ── 카테고리 Pill ────────────────────────────────────────────────────────
    cat    = tool["eyebrow"]
    colors = PILL_COLORS.get(cat, PILL_COLORS["기타"])
    pill_font = font(13)
    pill_w = int(draw.textlength(cat, font=pill_font)) + 28
    draw.rounded_rectangle([60, 155, 60 + pill_w, 185], radius=15, fill=colors["bg"])
    draw.text((60 + 14, 156), cat, font=pill_font, fill=colors["text"])

    # ── 제목 ─────────────────────────────────────────────────────────────────
    title_font = font(46)
    draw.text((60, 218), tool["title"], font=title_font, fill=WHITE)

    # ── 설명 (1~2줄 자동 줄바꿈) ────────────────────────────────────────────
    desc_font = font(18)
    desc_lines = wrap_text(tool["description"], draw, desc_font, 1060)
    for i, line in enumerate(desc_lines[:2]):
        draw.text((60, 292 + i * 28), line, font=desc_font, fill=MUTED)

    # ── 스탯 카드 ────────────────────────────────────────────────────────────
    label_font = font(11)
    val_font   = font(24)
    for i, (label, value) in enumerate(tool["stats"][:3]):
        x = 60 + i * 220
        draw.rounded_rectangle([x, 390, x + 200, 462], radius=8, fill=CARD_BG)
        draw.text((x + 12, 396), label, font=label_font, fill=MUTED)
        draw.text((x + 12, 416), value, font=val_font,   fill=STAT_VAL)

    # ── 구분선 ───────────────────────────────────────────────────────────────
    draw.line([(60, 498), (W - 60, 498)], fill=LINE, width=1)

    # ── 푸터 ─────────────────────────────────────────────────────────────────
    footer_font = font(14)
    draw.text((60, 516), "비교계산소 — 숫자로 더 잘 판단하세요", font=footer_font, fill=DIM)

    url_text = f"bigyocalc.com/tools/{tool['slug']}"
    url_w    = int(draw.textlength(url_text, font=font(13)))
    draw.text((W - 60 - url_w, 518), url_text, font=font(13), fill=DIM)

    # 저장
    os.makedirs(OUT_DIR, exist_ok=True)
    out_path = os.path.join(OUT_DIR, f"{tool['slug']}.png")
    img.save(out_path, "PNG", optimize=True)
    return out_path

if __name__ == "__main__":
    for tool in TOOLS:
        path = generate(tool)
        print(f"생성: {os.path.basename(path)}")
    print(f"\n완료 — {len(TOOLS)}개 PNG → {OUT_DIR}")
