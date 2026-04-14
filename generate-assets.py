"""
HQ Kids App Icon — Premium, clean, Apple-style.
Fundo escuro com "HQ" em neon green bold. Minimal e marcante.
"""
from PIL import Image, ImageDraw, ImageFont
import os

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")

NEON = (57, 255, 20)       # #39FF14
DARK = (15, 12, 41)        # #0F0C29
WHITE = (255, 255, 255)


def get_font(size, bold=True):
    paths = [
        "/System/Library/Fonts/SFCompactRounded.ttf",
        "/System/Library/Fonts/SF-Pro-Rounded-Bold.otf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except:
            continue
    return ImageFont.load_default()


def generate_icon(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background: rounded square dark
    pad = int(size * 0.02)
    r = int(size * 0.22)
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=DARK)

    # Subtle radial glow behind text
    cx, cy = size // 2, size // 2
    for i in range(40, 0, -1):
        radius = int(size * 0.25 * i / 40)
        alpha = int(8 + i * 0.5)
        glow_color = (57, 255, 20, alpha)
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=glow_color)

    # "HQ" large bold centered
    font_hq = get_font(int(size * 0.42))
    draw.text((cx, cy - int(size * 0.06)), "HQ", fill=NEON, font=font_hq, anchor="mm")

    # "KIDS" smaller below
    font_kids = get_font(int(size * 0.11))
    draw.text((cx, cy + int(size * 0.22)), "KIDS", fill=(255, 255, 255, 180), font=font_kids, anchor="mm")

    # Thin neon green line separator
    line_y = cy + int(size * 0.12)
    line_w = int(size * 0.3)
    draw.rounded_rectangle(
        [cx - line_w, line_y, cx + line_w, line_y + 3],
        radius=2, fill=(57, 255, 20, 100)
    )

    # Small star accents
    star_positions = [
        (int(size * 0.18), int(size * 0.18), 6),
        (int(size * 0.82), int(size * 0.18), 5),
        (int(size * 0.15), int(size * 0.82), 4),
        (int(size * 0.85), int(size * 0.82), 5),
    ]
    for sx, sy, sr in star_positions:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(57, 255, 20, 60))

    return img


def generate_splash(size=200):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = size // 2, size // 2

    # Neon green circle
    r = int(size * 0.38)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=NEON)

    # "HQ" white bold
    font = get_font(int(size * 0.32))
    draw.text((cx, cy), "HQ", fill=WHITE, font=font, anchor="mm")

    return img


if __name__ == "__main__":
    print("Gerando assets v2...")

    icon = generate_icon(1024)
    icon.save(os.path.join(ASSETS, "icon.png"))
    print("  icon.png (1024x1024)")

    adaptive = generate_icon(1024)
    adaptive.save(os.path.join(ASSETS, "adaptive-icon.png"))
    print("  adaptive-icon.png (1024x1024)")

    splash = generate_splash(200)
    splash.save(os.path.join(ASSETS, "splash-icon.png"))
    print("  splash-icon.png (200x200)")

    favicon = generate_icon(1024).resize((48, 48), Image.LANCZOS)
    favicon.save(os.path.join(ASSETS, "favicon.png"))
    print("  favicon.png (48x48)")

    print("Done!")
