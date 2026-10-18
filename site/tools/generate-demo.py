"""Create the fixture-based illustrative demo and social images.

Requires Pillow and ffmpeg (FFMPEG_BINARY or imageio_ffmpeg). This is an
illustration, never evidence of a native IntelliJ UI run.
"""
from pathlib import Path
import os
import subprocess
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
ASSETS.mkdir(exist_ok=True)
FONT_DIR = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"

def font(size, bold=False):
    path = FONT_DIR / ("arialbd.ttf" if bold else "arial.ttf")
    if path.exists():
        return ImageFont.truetype(str(path), size)
    return ImageFont.truetype("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf", size)

F12, F16, F19, F24, F31, F43, F64 = [font(n, n in (24, 31, 43, 64)) for n in (12, 16, 19, 24, 31, 43, 64)]
FM = font(23)
BG = "#0b1020"
WHITE = "#f4f7ff"
MUTED = "#b8c7df"
PURPLE = "#b8a2ff"
CYAN = "#5fe4da"
GREEN = "#81e6b8"
ORANGE = "#ffbd76"

def text(draw, pos, value, face=F19, color=WHITE):
    draw.text(pos, value, font=face, fill=color)

def card(draw, rect, fill="#16223b", stroke="#455676", radius=18):
    draw.rounded_rectangle(rect, radius=radius, fill=fill, outline=stroke, width=2)

def base_frame(second):
    im = Image.new("RGB", (1280, 720), BG)
    d = ImageDraw.Draw(im)
    d.ellipse((770, -330, 1540, 430), fill="#14244c")
    d.rectangle((0, 0, 1280, 64), fill="#101a2e")
    d.ellipse((31, 25, 43, 37), fill="#ff858e")
    d.ellipse((52, 25, 64, 37), fill="#ffca78")
    d.ellipse((73, 25, 85, 37), fill="#77dfb3")
    text(d, (110, 21), "POSTMAN MIGRATION ASSISTANT  /  CRUD FIXTURE ILLUSTRATION", F16, MUTED)
    d.rounded_rectangle((31, 673, 1249, 680), radius=4, fill="#2c3853")
    d.rounded_rectangle((31, 673, 31 + int(1218 * min(second / 18, 1)), 680), radius=4, fill=CYAN)
    text(d, (32, 689), "Illustrated from a test fixture; not an IntelliJ screen recording", F12, "#95a5bf")
    return im, d

def code_line(draw, x, y, prefix, value, color=WHITE):
    text(draw, (x, y), prefix, FM, CYAN)
    text(draw, (x + 42, y), value, FM, color)

def frame(second):
    im, d = base_frame(second)
    if second < 4:
        text(d, (55, 108), "01 / INPUT", F19, CYAN)
        text(d, (55, 145), "CRUD collection v2.1", F43)
        text(d, (58, 210), "Four requests with values shared between steps.", F19, MUTED)
        card(d, (55, 275, 610, 625))
        text(d, (82, 299), "crud.postman_collection.json", F19, PURPLE)
        for idx, (method, name, path) in enumerate([
            ("POST", "Login", "/login"),
            ("POST", "Create", "/customers"),
            ("GET", "Read", "/customers/{{customerId}}"),
            ("DELETE", "Cleanup", "/customers/{{customerId}}")
        ]):
            y = 351 + idx * 59
            text(d, (83, y), method, F19, ORANGE)
            text(d, (205, y), name, F19)
            text(d, (318, y), path, F16, MUTED)
        card(d, (647, 275, 1225, 625), fill="#1c2543")
        text(d, (680, 305), "Postman source", F24, PURPLE)
        code_line(d, 681, 370, "→", 'pm.collectionVariables.set("token", ...)')
        code_line(d, 681, 418, "→", 'pm.variables.set("customerId", ...)')
        text(d, (680, 524), "The source collection stays unchanged", F19, MUTED)
    elif second < 8:
        text(d, (55, 108), "02 / ANALYZE", F19, CYAN)
        text(d, (55, 145), "See the dependencies", F43)
        text(d, (58, 210), "Token and customerId determine the run order.", F19, MUTED)
        names = ["Login", "Create", "Read", "Cleanup"]
        for idx, name in enumerate(names):
            x = 54 + idx * 305
            card(d, (x, 350, x + 272, 477), fill="#1a2842", stroke="#5c6c9b")
            text(d, (x + 24, 376), f"0{idx+1}", F19, CYAN)
            text(d, (x + 24, 414), name, F31)
            if idx < 3:
                text(d, (x + 278, 391), "→", F31, PURPLE)
        card(d, (253, 520, 1030, 588), fill="#233a49", stroke="#427c7d")
        text(d, (284, 538), "token  →  Create     ·     customerId  →  Read / Cleanup", F19, CYAN)
    elif second < 13:
        text(d, (55, 108), "03 / EXPORT", F19, CYAN)
        text(d, (55, 145), "Review the output", F43)
        text(d, (58, 210), "This dependent sequence is exported to scenario.http.", F19, MUTED)
        card(d, (55, 280, 756, 625), fill="#101b30")
        text(d, (85, 306), "scenario.http", F24, PURPLE)
        text(d, (85, 366), "### Login", FM, MUTED)
        text(d, (85, 405), "POST {{pma_base_url}}/login", FM, WHITE)
        text(d, (85, 448), 'pm.collectionVariables.set("token", ...)', FM, CYAN)
        text(d, (85, 507), "### Create", FM, MUTED)
        text(d, (85, 547), "Authorization: Bearer {{pma_token}}", FM, ORANGE)
        for idx, label in enumerate(["environment", "compat.js", "migration report"]):
            y = 316 + idx * 102
            card(d, (792, y, 1224, y + 76), fill="#1c2e47")
            text(d, (818, y + 19), label, F19)
    else:
        text(d, (55, 108), "04 / VERIFY", F19, CYAN)
        text(d, (55, 145), "Run from Login. Verify.", F43)
        text(d, (58, 210), "Static conversion does not replace testing against the target API.", F19, MUTED)
        card(d, (55, 285, 1225, 625), fill="#14213a")
        for idx, (name, detail) in enumerate([
            ("Login", "Produces token"),
            ("Create", "Uses token; produces customerId"),
            ("Read", "Uses token + customerId"),
            ("Cleanup", "Removes fixture data")
        ]):
            y = 313 + idx * 74
            d.ellipse((88, y + 7, 112, y + 31), fill=GREEN)
            text(d, (132, y), name, F24)
            text(d, (465, y + 4), detail, F19, MUTED)
        text(d, (55, 637), "Verify runtime behavior in IntelliJ HTTP Client before using a real service.", F16, ORANGE)
    return im

poster = frame(10)
poster.save(ASSETS / "demo-poster.png", optimize=True)
og = Image.new("RGB", (1200, 630), "#0b1020")
od = ImageDraw.Draw(og)
od.ellipse((650, -260, 1450, 520), fill="#273462")
od.rounded_rectangle((65, 62, 1135, 568), radius=36, fill="#17243c", outline="#796bc0", width=3)
text(od, (105, 108), "POSTMAN MIGRATION ASSISTANT", F24, CYAN)
text(od, (105, 205), "From collections", F64)
text(od, (105, 285), "to IntelliJ HTTP Client", F43, PURPLE)
text(od, (105, 433), "Analyze  →  Export  →  Verify", F31, WHITE)
text(od, (105, 516), "Freemium 1.0 · Offline import · Clear reports", F19, MUTED)
og.save(ASSETS / "og-card.png", optimize=True)

binary = os.environ.get("FFMPEG_BINARY")
if not binary:
    try:
        import imageio_ffmpeg
        binary = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError as exc:
        raise SystemExit("Set FFMPEG_BINARY or install imageio-ffmpeg") from exc
cmd = [binary, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-pix_fmt", "rgb24",
       "-s", "1280x720", "-r", "10", "-i", "-", "-an", "-c:v", "libx264",
       "-preset", "veryfast", "-crf", "25", "-pix_fmt", "yuv420p", "-movflags",
       "+faststart", str(ASSETS / "import-demo.mp4")]
process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
try:
    for n in range(180):
        process.stdin.write(frame(n / 10).tobytes())
finally:
    process.stdin.close()
error = process.stderr.read()
if process.wait() != 0:
    raise SystemExit(error.decode(errors="replace"))
print("Generated demo-poster.png, og-card.png, import-demo.mp4")
