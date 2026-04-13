"""
Gera icon (1024x1024), splash-icon (200x200), adaptive-icon (1024x1024), favicon (48x48)
para o HQ Kids app.

Design: Escudo de super-herói com "HQ" no centro, cores vibrantes pra kids.
"""
from PIL import Image, ImageDraw, ImageFont
import math
import os

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets")

def draw_shield(draw, cx, cy, size, fill, outline, outline_w=8):
    """Desenha escudo estilo super-herói"""
    top = cy - size
    bottom = cy + size * 0.85
    left = cx - size * 0.82
    right = cx + size * 0.82
    mid_y = cy + size * 0.15

    # Pontos do escudo (formato de badge/shield)
    points = []
    steps = 40
    # Topo: arco suave
    for i in range(steps + 1):
        t = i / steps
        x = left + (right - left) * t
        y = top + size * 0.08 * math.sin(math.pi * t)
        points.append((x, y))
    # Lado direito descendo
    for i in range(1, steps + 1):
        t = i / steps
        x = right - (right - cx) * (t ** 0.6)
        y = mid_y + (bottom - mid_y) * t
        points.append((x, y))
    # Lado esquerdo subindo
    for i in range(1, steps):
        t = 1 - i / steps
        x = left + (cx - left) * (1 - t ** 0.6)
        y = mid_y + (bottom - mid_y) * t
        points.append((x, y))

    draw.polygon(points, fill=fill, outline=outline, width=outline_w)
    return points


def draw_star(draw, cx, cy, r_outer, r_inner, points_n, fill, rotation=-90):
    """Desenha estrela"""
    pts = []
    for i in range(points_n * 2):
        angle = math.radians(rotation + i * 180 / points_n)
        r = r_outer if i % 2 == 0 else r_inner
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(pts, fill=fill)


def generate_icon(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2

    # Background: rounded rect gradiente simulado
    # Camada 1: fundo roxo/azul escuro
    pad = 40
    r = 180
    draw.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill="#1a1147")

    # Camada 2: gradiente radial simulado com círculos
    for i in range(20, 0, -1):
        alpha = int(30 + i * 3)
        radius = int(size * 0.3 * i / 20)
        color = (100, 50, 200, alpha)
        draw.ellipse([cx - radius, cy - radius - 50, cx + radius, cy + radius - 50], fill=color)

    # Escudo principal
    shield_size = int(size * 0.34)
    draw_shield(draw, cx, cy - 10, shield_size,
                fill="#FFD700", outline="#FF8C00", outline_w=12)

    # Escudo interno (menor, vermelho)
    inner_size = int(shield_size * 0.72)
    draw_shield(draw, cx, cy - 10, inner_size,
                fill="#FF3B30", outline="#CC2200", outline_w=6)

    # Texto "HQ" no centro
    font_size = int(size * 0.22)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/SFCompact.ttf", font_size)
        except:
            font = ImageFont.load_default()

    # Sombra
    draw.text((cx + 4, cy - 30 + 4), "HQ", fill="#00000066", font=font, anchor="mm")
    # Texto branco
    draw.text((cx, cy - 30), "HQ", fill="#FFFFFF", font=font, anchor="mm")

    # "KIDS" embaixo
    kids_size = int(size * 0.085)
    try:
        font_kids = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", kids_size)
    except:
        font_kids = ImageFont.load_default()
    draw.text((cx, cy + shield_size * 0.42), "KIDS", fill="#FFD700", font=font_kids, anchor="mm")

    # Estrelas decorativas
    star_positions = [
        (cx - size * 0.32, cy - size * 0.30, 28),
        (cx + size * 0.34, cy - size * 0.28, 22),
        (cx - size * 0.28, cy + size * 0.32, 20),
        (cx + size * 0.30, cy + size * 0.30, 24),
        (cx - size * 0.38, cy + size * 0.05, 16),
        (cx + size * 0.40, cy - size * 0.05, 18),
    ]
    for sx, sy, sr in star_positions:
        draw_star(draw, sx, sy, sr, sr * 0.4, 5, "#FFD700")

    # Brilhos pequenos (pontos brancos)
    sparkles = [
        (cx - size * 0.22, cy - size * 0.35, 8),
        (cx + size * 0.25, cy - size * 0.38, 6),
        (cx - size * 0.35, cy - size * 0.15, 5),
        (cx + size * 0.38, cy + size * 0.15, 7),
    ]
    for sx, sy, sr in sparkles:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill="#FFFFFFCC")

    return img


def generate_splash(size=200):
    """Splash icon menor — só o escudo com HQ"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2

    shield_size = int(size * 0.38)
    draw_shield(draw, cx, cy, shield_size, fill="#FFD700", outline="#FF8C00", outline_w=4)

    inner_size = int(shield_size * 0.72)
    draw_shield(draw, cx, cy, inner_size, fill="#FF3B30", outline="#CC2200", outline_w=2)

    font_size = int(size * 0.28)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        font = ImageFont.load_default()
    draw.text((cx, cy - 5), "HQ", fill="#FFFFFF", font=font, anchor="mm")

    return img


if __name__ == "__main__":
    print("Gerando assets...")

    icon = generate_icon(1024)
    icon.save(os.path.join(ASSETS, "icon.png"))
    print("  icon.png (1024x1024)")

    adaptive = generate_icon(1024)
    adaptive.save(os.path.join(ASSETS, "adaptive-icon.png"))
    print("  adaptive-icon.png (1024x1024)")

    splash = generate_splash(200)
    splash.save(os.path.join(ASSETS, "splash-icon.png"))
    print("  splash-icon.png (200x200)")

    favicon = generate_icon(1024)
    favicon = favicon.resize((48, 48), Image.LANCZOS)
    favicon.save(os.path.join(ASSETS, "favicon.png"))
    print("  favicon.png (48x48)")

    print("Done!")
