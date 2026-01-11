from PIL import Image
import os

ruta = "img/script.jpeg"
def ver_info_imagen(ruta):
    if not os.path.exists(ruta):
        print(f"❌ La imagen '{ruta}' no existe.")
        return
    
    try:
        with Image.open(ruta) as img:
            ancho, alto = img.size
            formato = img.format
            modo = img.mode
            print(f"✅ Imagen: {ruta}")
            print(f"   ➤ Ancho: {ancho}px")
            print(f"   ➤ Alto: {alto}px")
            print(f"   ➤ Formato: {formato}")
            print(f"   ➤ Modo de color: {modo}")
            print("-" * 40)
    except Exception as e:
        print(f"❌ Error al leer la imagen: {e}")

# --- CONFIGURA AQUÍ LA RUTA DE TU IMAGEN ---
ruta_imagen = "img/script.jpeg"  # ⚠️ Cambia esto por la ruta real de tu imagen

ver_info_imagen(ruta_imagen)