"""
generate-og-sample.py
OG 이미지 신규 디자인 샘플 2종 생성 (1200×630 PNG)
실행: python scripts/generate-og-sample.py
출력: public/og/sample-tool.png / public/og/sample-report.png
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── 샘플 데이터 ───────────────────────────────────────────────────────────────
SAMPLE_TOOL = {
    "slug":        "salary",
    "title":       "연봉 인상 계산기",
    "description": "현재 연봉과 인상 시나리오별 월 실수령 변화를 비교하는 계산 페이지",
    "eyebrow":     "연봉·이직",
    "stats": [("월 실수령", "341만원"), ("+5% 후", "358만원")],
}

SAMPLE_REPORT = {
    "slug":        "new-employee-salary-2026",
    "title":       "2026 신입사원 초봉 비교",
    "description": "IT·반도체·자동차·금융·공공 분야 주요 기업의 2026년 신입사원 초봉을 바 차트와 상세 카드로 비교하는 인터랙티브 리포트",
    "eyebrow":     "연봉 리포트",
    "stats": [("최고 초봉", "약 1.5억"), ("비교 기업", "50개+")],
}

# ── 색상 ─────────────────────────────────────────────────────────────────────
BG          = (24,  24,  26)
BG_RIGHT    = (28,  28,  30)        # 우측 컬럼 살짝 다른 톤
WHITE       = (255, 255, 255)
GREEN_MID   = (29,  158, 117)
GREEN_DARK  = (15,  110, 86)
MUTED       = (110, 108, 104)
CARD_BG     = (38,  38,  36)
CARD_BORDER = (52,  52,  50)
STAT_VAL    = (29,  158, 117)
LINE        = (46,  46,  44)
DIM         = (78,  78,  76)

PILL_COLORS = {
    "연봉·이직":     {"bg": (15, 110, 86),  "text": (200, 240, 225)},
    "성과급 비교":   {"bg": (133, 79, 11),  "text": (250, 238, 218)},
    "육아휴직·출산": {"bg": (8,  80,  65),  "text": (159, 225, 203)},
    "연봉 리포트":   {"bg": (20, 90,  140), "text": (200, 230, 255)},
    "자산 리포트":   {"bg": (80, 40,  120), "text": (230, 200, 255)},
    "결혼 예산":     {"bg": (130, 45, 60),  "text": (255, 210, 220)},
    "기타":          {"bg": (58, 58,  56),  "text": (200, 198, 190)},
}

W, H = 1200, 630

# 컬럼 경계
LEFT_X1  = 60
LEFT_X2  = 700   # 좌측 컬럼 끝
RIGHT_X1 = 740   # 우측 컬럼 시작
RIGHT_X2 = 1140  # 우측 컬럼 끝

FONT_PATH = "C:/Windows/Fonts/malgunbd.ttf"

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
    # 좌상: 채움
    draw.rounded_rectangle([ix,     iy,     ix+S,     iy+S],     radius=3, fill=GREEN_MID)
    # 우상: 테두리
    draw.rounded_rectangle([ix+S+G, iy,     ix+S+G+S, iy+S],     radius=3, outline=GREEN_MID, width=2)
    # 좌하: 테두리
    draw.rounded_rectangle([ix,     iy+S+G, ix+S,     iy+S+G+S], radius=3, outline=GREEN_MID, width=2)
    # 우하: 채움 + 십자
    draw.rounded_rectangle([ix+S+G, iy+S+G, ix+S+G+S, iy+S+G+S], radius=3, fill=GREEN_DARK)
    cx = ix + S + G + S // 2
    cy = iy + S + G + S // 2
    draw.line([(cx-4, cy), (cx+4, cy)], fill=WHITE, width=2)
    draw.line([(cx, cy-4), (cx, cy+4)], fill=WHITE, width=2)
    tx = ix + S + G + S + 10
    draw.text((tx, iy), "비교계산소", font=font(18), fill=WHITE)

def generate_sample(tool, out_path):
    # ── 기반 캔버스 ────────────────────────────────────────────────────────────
    img = Image.new("RGB", (W, H), BG)

    # 배경 accent 원 (우상단 + 좌하단)
    img = draw_circle_accent(img, 1080, -40, 260, GREEN_DARK, 0.06)
    img = draw_circle_accent(img, 80,   660, 180, GREEN_MID,  0.04)

    draw = ImageDraw.Draw(img)

    # ── 우측 컬럼 배경 (살짝 다른 톤으로 구역 구분) ─────────────────────────
    draw.rectangle([RIGHT_X1 - 20, 0, W, H], fill=BG_RIGHT)

    # 좌우 컬럼 사이 수직 구분선 (미세하게)
    draw.line([(RIGHT_X1 - 20, 80), (RIGHT_X1 - 20, 550)], fill=LINE, width=1)

    # ── 배경에 미세한 도트 그리드 (우측 컬럼 데드존 해소) ───────────────────
    dot_color = (40, 40, 38)
    for dx in range(RIGHT_X1, RIGHT_X2, 28):
        for dy in range(60, 520, 28):
            draw.rectangle([dx, dy, dx+1, dy+1], fill=dot_color)

    # ── 로고 (좌측 상단) ────────────────────────────────────────────────────
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

    # ── 설명 텍스트 (최대 2줄) ──────────────────────────────────────────────
    df      = font(17)
    d_lines = wrap_text(tool["description"], draw, df, LEFT_X2 - LEFT_X1)
    DESC_Y  = title_bottom + 18
    for i, line in enumerate(d_lines[:2]):
        draw.text((LEFT_X1, DESC_Y + i * 26), line, font=df, fill=MUTED)

    # ── 우측 스탯 카드 (세로 스택) ──────────────────────────────────────────
    stats      = tool["stats"][:2]
    card_x1    = RIGHT_X1
    card_x2    = RIGHT_X2
    card_w     = card_x2 - card_x1       # 400px
    card_h     = 150
    card_gap   = 20
    total_h    = len(stats) * card_h + (len(stats) - 1) * card_gap
    card_start = (H - total_h) // 2 - 10  # 세로 중앙 정렬 (약간 위)

    lf = font(13)   # 라벨 폰트
    vf = font(32)   # 값 폰트

    for i, (label, value) in enumerate(stats):
        cy = card_start + i * (card_h + card_gap)
        # 카드 배경
        draw.rounded_rectangle(
            [card_x1, cy, card_x2, cy + card_h],
            radius=12, fill=CARD_BG
        )
        # 카드 테두리
        draw.rounded_rectangle(
            [card_x1, cy, card_x2, cy + card_h],
            radius=12, outline=CARD_BORDER, width=1
        )
        # 좌측 강조 바
        draw.rounded_rectangle(
            [card_x1, cy + 20, card_x1 + 3, cy + card_h - 20],
            radius=2, fill=GREEN_MID
        )
        # 라벨
        draw.text((card_x1 + 20, cy + 28), label, font=lf, fill=MUTED)
        # 값
        draw.text((card_x1 + 20, cy + 52), value, font=vf, fill=STAT_VAL)

    # ── 하단 구분선 ─────────────────────────────────────────────────────────
    draw.line([(LEFT_X1, 554), (W - 60, 554)], fill=LINE, width=1)

    # ── 푸터 ────────────────────────────────────────────────────────────────
    ff   = font(14)
    draw.text((LEFT_X1, 570), "비교계산소 — 숫자로 더 잘 판단하세요", font=ff, fill=DIM)

    slug     = tool["slug"]
    url_base = "tools" if "calculator" in slug or slug in [
        "salary","retirement","negotiation","parental-leave",
        "household-income","bonus-simulator","samsung-bonus",
        "sk-hynix-bonus","hyundai-bonus","birth-support-total",
        "single-parental-leave-total","parental-leave-pay",
        "six-plus-six","wedding-gift-break-even-calculator",
        "wedding-budget-calculator",
    ] else "reports"
    url_text = f"bigyocalc.com/{url_base}/{slug}"
    url_w    = int(draw.textlength(url_text, font=font(13)))
    draw.text((W - 60 - url_w, 572), url_text, font=font(13), fill=DIM)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    img.save(out_path, "PNG", optimize=True)
    print(f"생성: {out_path}")

if __name__ == "__main__":
    BASE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "public", "og"))
    generate_sample(SAMPLE_TOOL,   os.path.join(BASE, "sample-tool.png"))
    generate_sample(SAMPLE_REPORT, os.path.join(BASE, "sample-report.png"))
    print("\n샘플 2종 완료 → public/og/sample-tool.png / sample-report.png")
