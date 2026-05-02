"""
Genera los iconos PNG de la PWA.
Ejecutar una sola vez: python generar_iconos.py
Requiere: pip install Pillow
"""
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    import subprocess, sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont

def make_icon(size, filename):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Fondo circular navy
    margin = size // 12
    draw.ellipse([margin, margin, size - margin, size - margin],
                 fill=(15, 27, 53, 255))

    # Borde verde
    border = size // 22
    draw.ellipse([margin, margin, size - margin, size - margin],
                 outline=(74, 222, 128, 255), width=border)

    # Emoji pelota de fútbol (texto)
    emoji = "⚽"
    font_size = int(size * 0.45)
    try:
        font = ImageFont.truetype("seguiemj.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), emoji, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1]
    draw.text((x, y), emoji, font=font, embedded_color=True)

    img.save(filename, "PNG")
    print(f"Generado: {filename} ({size}x{size})")

make_icon(192, "icon-192.png")
make_icon(512, "icon-512.png")
print("Iconos listos!")
