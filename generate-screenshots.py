"""
Gera screenshots mockup do HQ Kids para App Store e Google Play.
iPhone 15 Pro Max: 1290x2796
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1290, 2796
ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
os.makedirs(ASSETS, exist_ok=True)

# Cores do app
BG = "#FFF9F0"
DARK = "#1F2937"
GRAY = "#6B7280"
BLUE = "#3B82F6"
PURPLE = "#A855F7"
GREEN = "#22C55E"
GOLD = "#FBBF24"
RED = "#EF4444"
PINK = "#F472B6"
NAVY = "#1a1147"

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def get_font(size):
    for path in [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/SFCompact.ttf",
        "/System/Library/Fonts/SFNS.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except:
            continue
    return ImageFont.load_default()

def new_screen(bg=BG):
    img = Image.new("RGB", (W, H), hex_to_rgb(bg))
    return img, ImageDraw.Draw(img)

def draw_status_bar(draw):
    f = get_font(32)
    draw.text((60, 30), "9:41", fill=hex_to_rgb(DARK), font=f)
    # Battery/signal indicators (simplified)
    draw.rounded_rectangle([W-180, 32, W-60, 56], radius=6, fill=hex_to_rgb(DARK))

def draw_card(draw, x, y, w, h, radius=32, fill="#FFFFFF", border_left=None, border_color=None):
    draw.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=hex_to_rgb(fill))
    if border_left and border_color:
        draw.rounded_rectangle([x, y, x+8, y+h], radius=4, fill=hex_to_rgb(border_color))

def draw_badge(draw, x, y, text, bg_color, text_color="#FFFFFF"):
    f = get_font(28)
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    pad = 20
    draw.rounded_rectangle([x, y, x+tw+pad*2, y+52], radius=26, fill=hex_to_rgb(bg_color))
    draw.text((x+pad, y+10), text, fill=hex_to_rgb(text_color), font=f)

def draw_circle_icon(draw, cx, cy, r, bg, emoji_text, emoji_size=48):
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=hex_to_rgb(bg))
    f = get_font(emoji_size)
    draw.text((cx, cy), emoji_text, fill=hex_to_rgb("#FFFFFF"), font=f, anchor="mm")

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SCREENSHOT 1: Tela de boas-vindas
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def screen_welcome():
    img, draw = new_screen(NAVY)

    # Título grande
    f_title = get_font(96)
    f_sub = get_font(44)
    f_desc = get_font(36)

    # Escudo (reusa o icon)
    try:
        icon = Image.open(os.path.join(os.path.dirname(__file__), "assets", "icon.png"))
        icon = icon.resize((400, 400), Image.LANCZOS)
        img.paste(icon, (W//2 - 200, 500), icon if icon.mode == 'RGBA' else None)
    except:
        draw_circle_icon(draw, W//2, 700, 180, "#FFD700", "HQ", 120)

    draw.text((W//2, 1050), "HQ Kids", fill=hex_to_rgb("#FFFFFF"), font=f_title, anchor="mm")
    draw.text((W//2, 1140), "Tarefas em Família", fill=hex_to_rgb(GOLD), font=f_sub, anchor="mm")

    draw.text((W//2, 1350), "Transforme a rotina dos seus", fill=hex_to_rgb("#CCCCCC"), font=f_desc, anchor="mm")
    draw.text((W//2, 1400), "filhos em uma aventura!", fill=hex_to_rgb("#CCCCCC"), font=f_desc, anchor="mm")

    # Botões
    draw.rounded_rectangle([120, 1600, W-120, 1720], radius=30, fill=hex_to_rgb(BLUE))
    draw.text((W//2, 1660), "Entrar como Pai/Mãe", fill=hex_to_rgb("#FFFFFF"), font=f_sub, anchor="mm")

    draw.rounded_rectangle([120, 1780, W-120, 1900], radius=30, fill=hex_to_rgb(GREEN))
    draw.text((W//2, 1840), "Entrar como Filho(a)", fill=hex_to_rgb("#FFFFFF"), font=f_sub, anchor="mm")

    # Features
    features = [
        ("Missões diárias com verificação por foto", GREEN),
        ("Sistema de XP, níveis e ranking", BLUE),
        ("Recompensas reais por moedas virtuais", GOLD),
    ]
    f_feat = get_font(32)
    y = 2100
    for text, color in features:
        draw.ellipse([180, y-4, 210, y+26], fill=hex_to_rgb(color))
        draw.text((240, y), text, fill=hex_to_rgb("#AAAAAA"), font=f_feat)
        y += 70

    return img

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SCREENSHOT 2: Dashboard do Pai
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def screen_parent_dashboard():
    img, draw = new_screen()
    draw_status_bar(draw)

    f_title = get_font(56)
    f_sub = get_font(32)
    f_name = get_font(40)
    f_stat = get_font(30)
    f_btn = get_font(34)

    draw.text((60, 130), "Dashboard Pai", fill=hex_to_rgb(DARK), font=f_title)
    draw.text((60, 200), "12 tarefas criadas", fill=hex_to_rgb(GRAY), font=f_sub)

    # Child cards
    children = [
        ("Otávio", BLUE, "O", 13, 450, 85, 7, "Explorador"),
        ("Nicolle", PURPLE, "N", 11, 320, 62, 5, "Aventureira"),
        ("Angelina", PINK, "A", 5, 120, 28, 3, "Iniciante"),
    ]

    y = 320
    for name, color, initial, age, xp, coins, streak, level in children:
        draw_card(draw, 50, y, W-100, 200, border_left=True, border_color=color)
        # Avatar
        draw.ellipse([90, y+30, 170, y+110], fill=hex_to_rgb(color))
        draw.text((130, y+70), initial, fill=hex_to_rgb("#FFFFFF"), font=f_name, anchor="mm")
        # Name + level
        draw.text((200, y+40), name, fill=hex_to_rgb(DARK), font=f_name)
        draw.text((200, y+90), f"Nível — {level}", fill=hex_to_rgb(GRAY), font=f_sub)
        # Stats
        draw.text((200, y+145), f"⭐ {xp} XP", fill=hex_to_rgb(GREEN), font=f_stat)
        draw.text((420, y+145), f"🪙 {coins}", fill=hex_to_rgb(GOLD), font=f_stat)
        draw.text((580, y+145), f"🔥 {streak} dias", fill=hex_to_rgb(RED), font=f_stat)
        y += 230

    # Action buttons
    btn_y = y + 30
    btn_w = (W - 140) // 2
    draw.rounded_rectangle([50, btn_y, 50+btn_w, btn_y+110], radius=24, fill=hex_to_rgb(BLUE))
    draw.text((50+btn_w//2, btn_y+55), "+ Nova Tarefa", fill=hex_to_rgb("#FFFFFF"), font=f_btn, anchor="mm")

    draw.rounded_rectangle([70+btn_w, btn_y, 70+btn_w*2, btn_y+110], radius=24, fill=hex_to_rgb(PURPLE))
    draw.text((70+btn_w+btn_w//2, btn_y+55), "+ Recompensa", fill=hex_to_rgb("#FFFFFF"), font=f_btn, anchor="mm")

    # Menu items
    menu_y = btn_y + 160
    menu_items = [
        ("Gerenciar Filhos", GREEN),
        ("Ver Todas as Tarefas", BLUE),
        ("Ver Recompensas", PURPLE),
        ("Histórico de Fotos", GRAY),
        ("Trocar PIN", GOLD),
    ]
    for text, color in menu_items:
        draw_card(draw, 50, menu_y, W-100, 100)
        draw.text((100, menu_y+32), text, fill=hex_to_rgb(color), font=f_btn)
        draw.text((W-120, menu_y+32), ">", fill=hex_to_rgb(color), font=f_btn)
        menu_y += 120

    return img

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SCREENSHOT 3: Dashboard da Criança (Otávio)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def screen_child_dashboard():
    img, draw = new_screen()
    draw_status_bar(draw)

    f_greet = get_font(52)
    f_sub = get_font(32)
    f_task = get_font(36)
    f_section = get_font(38)
    f_stat = get_font(28)

    # Header
    draw.text((60, 130), "Olá, Otávio! 🦸‍♂️", fill=hex_to_rgb(DARK), font=f_greet)

    # XP Bar
    draw.text((60, 210), "Nível 4 — Explorador", fill=hex_to_rgb(GRAY), font=f_sub)
    draw.rounded_rectangle([60, 260, W-60, 300], radius=20, fill=hex_to_rgb("#E5E7EB"))
    draw.rounded_rectangle([60, 260, 60 + int((W-120)*0.65), 300], radius=20, fill=hex_to_rgb(BLUE))
    draw.text((W-60, 270), "450/700 XP", fill=hex_to_rgb(GRAY), font=f_stat, anchor="rt")

    # Stats row
    stats_y = 340
    draw_badge(draw, 60, stats_y, "🪙 85 moedas", GOLD, DARK)
    draw_badge(draw, 360, stats_y, "🔥 7 dias", RED)

    # Section: Casa
    sec_y = 440
    draw.text((60, sec_y), "🏠  Casa", fill=hex_to_rgb(DARK), font=f_section)
    sec_y += 60
    tasks_casa = ["Arrumar a cama", "Escovar os dentes", "Guardar brinquedos"]
    for t in tasks_casa:
        draw_card(draw, 50, sec_y, W-100, 100)
        draw.ellipse([90, sec_y+22, 146, sec_y+78], fill=hex_to_rgb(f"{BLUE}20"))
        draw.text((170, sec_y+35), t, fill=hex_to_rgb(DARK), font=f_task)
        draw.text((W-140, sec_y+35), "+10 XP", fill=hex_to_rgb(GREEN), font=f_stat)
        sec_y += 120

    # Section: Escola
    draw.text((60, sec_y + 10), "📚  Escola", fill=hex_to_rgb(DARK), font=f_section)
    sec_y += 70
    tasks_escola = ["Fazer lição de casa", "Ler 15 minutos"]
    for t in tasks_escola:
        draw_card(draw, 50, sec_y, W-100, 100)
        draw.ellipse([90, sec_y+22, 146, sec_y+78], fill=hex_to_rgb(f"{GREEN}20"))
        draw.text((170, sec_y+35), t, fill=hex_to_rgb(DARK), font=f_task)
        draw.text((W-140, sec_y+35), "+20 XP", fill=hex_to_rgb(GREEN), font=f_stat)
        sec_y += 120

    # Section: Desafios
    draw.text((60, sec_y + 10), "⚡  Desafios", fill=hex_to_rgb(DARK), font=f_section)
    sec_y += 70
    draw_card(draw, 50, sec_y, W-100, 100)
    draw.ellipse([90, sec_y+22, 146, sec_y+78], fill=hex_to_rgb(f"{GOLD}20"))
    draw.text((170, sec_y+35), "Ajudar a cozinhar", fill=hex_to_rgb(DARK), font=f_task)
    draw.text((W-140, sec_y+35), "+30 XP", fill=hex_to_rgb(GREEN), font=f_stat)

    # Bottom nav hints
    nav_y = H - 200
    draw.rounded_rectangle([50, nav_y, 420, nav_y+100], radius=20, fill=hex_to_rgb("#F3F4F6"))
    draw.text((235, nav_y+50), "🏆 Ranking", fill=hex_to_rgb(GRAY), font=f_task, anchor="mm")

    draw.rounded_rectangle([460, nav_y, 830, nav_y+100], radius=20, fill=hex_to_rgb("#F3F4F6"))
    draw.text((645, nav_y+50), "🎁 Loja", fill=hex_to_rgb(GRAY), font=f_task, anchor="mm")

    return img

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SCREENSHOT 4: Verificação de Tarefa (foto)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def screen_task_verify():
    img, draw = new_screen()
    draw_status_bar(draw)

    f_title = get_font(52)
    f_sub = get_font(36)
    f_btn = get_font(40)
    f_stat = get_font(32)
    f_feed = get_font(34)

    draw.text((60, 130), "←", fill=hex_to_rgb(GRAY), font=f_title)

    # Task icon
    draw.ellipse([W//2-100, 280, W//2+100, 480], fill=hex_to_rgb(f"#3B82F620"))
    draw.text((W//2, 380), "🛏️", fill=hex_to_rgb(BLUE), font=get_font(100), anchor="mm")

    draw.text((W//2, 540), "Arrumar a cama", fill=hex_to_rgb(DARK), font=f_title, anchor="mm")

    # Rewards
    draw.text((W//2 - 120, 610), "⭐ 10 XP", fill=hex_to_rgb(GREEN), font=f_sub)
    draw.text((W//2 + 40, 610), "🪙 5", fill=hex_to_rgb(GOLD), font=f_sub)

    # Photo area (simulated photo)
    photo_y = 720
    draw.rounded_rectangle([80, photo_y, W-80, photo_y+500], radius=30, fill=hex_to_rgb("#E8E0D4"))
    draw.text((W//2, photo_y+200), "📷", font=get_font(120), anchor="mm", fill=hex_to_rgb("#B0A090"))
    draw.text((W//2, photo_y+350), "Foto da cama arrumada", fill=hex_to_rgb("#8B7D6B"), font=f_stat, anchor="mm")

    # Retake button
    draw.rounded_rectangle([W-280, photo_y+20, W-100, photo_y+80], radius=16, fill=(0,0,0,128))
    draw.text((W-190, photo_y+50), "Refazer", fill=hex_to_rgb("#FFFFFF"), font=f_stat, anchor="mm")

    # Feedback approved
    feed_y = photo_y + 540
    draw.rounded_rectangle([80, feed_y, W-80, feed_y+140], radius=20, fill=hex_to_rgb("#F0FDF4"))
    draw.text((W//2, feed_y+40), "✅ Cama arrumada corretamente!", fill=hex_to_rgb(GREEN), font=f_feed, anchor="mm")
    draw.text((W//2, feed_y+90), "Lençol esticado e travesseiro no lugar.", fill=hex_to_rgb(GRAY), font=f_stat, anchor="mm")

    # Submit button
    btn_y = feed_y + 180
    draw.rounded_rectangle([80, btn_y, W-80, btn_y+110], radius=24, fill=hex_to_rgb(BLUE))
    draw.text((W//2, btn_y+55), "✅ Missão Completa!", fill=hex_to_rgb("#FFFFFF"), font=f_btn, anchor="mm")

    return img

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SCREENSHOT 5: Ranking + Loja
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
def screen_ranking():
    img, draw = new_screen()
    draw_status_bar(draw)

    f_title = get_font(52)
    f_name = get_font(44)
    f_sub = get_font(32)
    f_stat = get_font(34)

    draw.text((60, 130), "←", fill=hex_to_rgb(GRAY), font=f_title)
    draw.text((W//2, 140), "🏆 Ranking Familiar", fill=hex_to_rgb(DARK), font=f_title, anchor="mm")

    # Ranking cards
    ranking = [
        ("🥇", "Otávio", BLUE, "O", 450, 7),
        ("🥈", "Nicolle", PURPLE, "N", 320, 5),
        ("🥉", "Angelina", PINK, "A", 120, 3),
    ]

    y = 280
    for medal, name, color, initial, xp, streak in ranking:
        draw_card(draw, 50, y, W-100, 200)
        # Medal
        draw.text((100, y+60), medal, font=get_font(72), anchor="mm")
        # Avatar
        draw.ellipse([160, y+40, 240, y+120], fill=hex_to_rgb(color))
        draw.text((200, y+80), initial, fill=hex_to_rgb("#FFFFFF"), font=f_name, anchor="mm")
        # Name
        draw.text((270, y+50), name, fill=hex_to_rgb(DARK), font=f_name)
        draw.text((270, y+105), f"⭐ {xp} XP   🔥 {streak} dias", fill=hex_to_rgb(GRAY), font=f_sub)
        # XP bar
        max_xp = 500
        bar_w = W - 380
        draw.rounded_rectangle([270, y+150, 270+bar_w, y+175], radius=12, fill=hex_to_rgb("#E5E7EB"))
        draw.rounded_rectangle([270, y+150, 270+int(bar_w*(xp/max_xp)), y+175], radius=12, fill=hex_to_rgb(color))
        y += 230

    # Divider
    draw.text((W//2, y+40), "— — —", fill=hex_to_rgb("#D1D5DB"), font=f_sub, anchor="mm")

    # Store preview
    y += 100
    draw.text((W//2, y), "🎁 Loja de Recompensas", fill=hex_to_rgb(DARK), font=f_title, anchor="mm")
    y += 70

    rewards = [
        ("🎮", "1h de videogame", 20),
        ("🎬", "Assistir filme", 30),
        ("🍦", "Sorvete", 15),
        ("🍕", "Escolher o jantar", 25),
        ("🌳", "Passeio no parque", 35),
    ]
    for emoji, name, cost in rewards:
        draw_card(draw, 50, y, W-100, 100)
        draw.text((100, y+50), emoji, font=get_font(44), anchor="mm")
        draw.text((160, y+35), name, fill=hex_to_rgb(DARK), font=f_stat)
        draw.text((W-140, y+35), f"🪙 {cost}", fill=hex_to_rgb(GOLD), font=f_stat)
        y += 120

    return img


if __name__ == "__main__":
    print("Gerando screenshots...")

    screens = [
        ("01_welcome.png", screen_welcome),
        ("02_parent_dashboard.png", screen_parent_dashboard),
        ("03_child_dashboard.png", screen_child_dashboard),
        ("04_task_verify.png", screen_task_verify),
        ("05_ranking_store.png", screen_ranking),
    ]

    for filename, func in screens:
        img = func()
        img.save(os.path.join(ASSETS, filename), quality=95)
        print(f"  {filename}")

    print(f"\nDone! {len(screens)} screenshots em ./screenshots/")
