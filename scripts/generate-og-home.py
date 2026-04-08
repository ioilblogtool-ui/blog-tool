"""
generate-og-home.py
OG Home 이미지 생성 (1200×630 PNG)
실행: python scripts/generate-og-home.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── 출력 경로 ─────────────────────────────────────────────────────────────────
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "og", "og-home.png")
OUT_PATH = os.path.normpath(OUT_PATH)

# ── 색상 토큰 ─────────────────────────────────────────────────────────────────
BG          = "#18181A"
WHITE       = "#FFFFFF"
GREEN_MID   = "#1D9E75"
GREEN_DARK  = "#0F6E56"
MUTED       = "#5F5E5A"
LINE        = "#2E2E2C"
DIM         = "#444442"

W, H = 1200, 630

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

# ── 폰트 로드 헬퍼 ─────────────────────────────────────────────────────────────
FONT_PATH = "C:/Windows/Fonts/malgunbd.ttf"  # 맑은 고딕 볼드

def font(size):
    return ImageFont.truetype(FONT_PATH, size)

# ── 둥근 사각형 그리기 ─────────────────────────────────────────────────────────
def rounded_rect(draw, x, y, w, h, r, fill=None, outline=None, width=2):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=r,
                           fill=fill, outline=outline, width=width)

# ── 메인 ──────────────────────────────────────────────────────────────────────
img  = Image.new("RGB", (W, H), hex_to_rgb(BG))
draw = ImageDraw.Draw(img)

# ── 배경 accent 원 (우상단 / 좌하단) ─────────────────────────────────────────
def draw_circle_accent(draw, cx, cy, r, color, opacity_frac):
    """RGBA 레이어 합성으로 반투명 원 표현"""
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    col = hex_to_rgb(color) + (int(255 * opacity_frac),)
    od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col)
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))

draw_circle_accent(draw, 1100, 0,   200, GREEN_DARK, 0.07)
draw_circle_accent(draw, 100,  630, 140, GREEN_MID,  0.05)

# draw 객체를 다시 얻어야 함 (paste 이후)
draw = ImageDraw.Draw(img)

# ── 로고 아이콘 (좌상단, 60,52) ──────────────────────────────────────────────
ICON_X, ICON_Y = 60, 52
S = 13   # 사각 크기
G = 4    # 간격
LW = 1.5  # 테두리 두께

# 좌상: 채움
rounded_rect(draw, ICON_X,     ICON_Y,     S, S, 2, fill=hex_to_rgb(GREEN_MID))
# 우상: 테두리
rounded_rect(draw, ICON_X+S+G, ICON_Y,     S, S, 2, outline=hex_to_rgb(GREEN_MID), width=2)
# 좌하: 테두리
rounded_rect(draw, ICON_X,     ICON_Y+S+G, S, S, 2, outline=hex_to_rgb(GREEN_MID), width=2)
# 우하: 채움
rounded_rect(draw, ICON_X+S+G, ICON_Y+S+G, S, S, 2, fill=hex_to_rgb(GREEN_DARK))

# 우하 십자선
cx = ICON_X + S + G + S // 2
cy = ICON_Y + S + G + S // 2
draw.line([(cx - 4, cy), (cx + 4, cy)], fill=WHITE, width=2)
draw.line([(cx, cy - 4), (cx, cy + 4)], fill=WHITE, width=2)

# ── 로고 텍스트 ───────────────────────────────────────────────────────────────
LOGO_TEXT_X = ICON_X + S + G + S + 10  # 아이콘 오른쪽
draw.text((LOGO_TEXT_X, ICON_Y - 1),    "비교계산소",   font=font(20), fill=WHITE)
draw.text((LOGO_TEXT_X, ICON_Y + 24),   "bigyocalc.com", font=font(13), fill=hex_to_rgb(MUTED))

# ── Eyebrow ───────────────────────────────────────────────────────────────────
draw.text((60, 200), "숫자로 더 잘 판단하세요", font=font(16), fill=hex_to_rgb(GREEN_MID))

# ── 메인 타이틀 ───────────────────────────────────────────────────────────────
draw.text((60, 252), "세상의 궁금한 숫자,",    font=font(58), fill=WHITE)
draw.text((60, 322), "한 번에 비교 계산",       font=font(58), fill=WHITE)

# ── 서브텍스트 ────────────────────────────────────────────────────────────────
draw.text(
    (60, 400),
    "연봉 · 성과급 · 육아휴직 · 출산지원금을 빠르게 계산하고 비교합니다",
    font=font(20),
    fill=hex_to_rgb(MUTED),
)

# ── 구분선 ────────────────────────────────────────────────────────────────────
draw.line([(60, 502), (W - 60, 502)], fill=hex_to_rgb(LINE), width=1)

# ── 스탯 3개 ─────────────────────────────────────────────────────────────────
STATS = [
    ("13", "운영 중 계산기",     60),
    ("4",  "카테고리",          260),
    ("2",  "인터랙티브 리포트", 460),
]
for value, label, x in STATS:
    draw.text((x, 520), value, font=font(38), fill=WHITE)
    draw.text((x, 566), label, font=font(14), fill=hex_to_rgb(MUTED))

# ── 우측 하단 URL ─────────────────────────────────────────────────────────────
url_text = "bigyocalc.com"
url_font = font(14)
bbox = draw.textbbox((0, 0), url_text, font=url_font)
url_w = bbox[2] - bbox[0]
draw.text((W - 60 - url_w, 566), url_text, font=url_font, fill=hex_to_rgb(DIM))

# ── 저장 ─────────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
img.save(OUT_PATH, "PNG", optimize=True)
print(f"생성 완료: {OUT_PATH}")
print(f"크기: {img.size}")
