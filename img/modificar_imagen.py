from PIL import Image

def recortar_y_redimensionar(ruta_entrada, ruta_salida, ancho_objetivo=320, alto_objetivo=160):
    try:
        with Image.open(ruta_entrada) as img:
            # Obtener dimensiones originales
            ancho_original, alto_original = img.size
            
            # Calcular proporción objetivo
            ratio_objetivo = ancho_objetivo / alto_objetivo  # 2:1
            
            # Calcular nueva región de recorte (centrada)
            if ancho_original / alto_original > ratio_objetivo:
                # Imagen más ancha → recortar lados
                nuevo_ancho = int(alto_original * ratio_objetivo)
                nuevo_alto = alto_original
                left = (ancho_original - nuevo_ancho) // 2
                top = 0
                right = left + nuevo_ancho
                bottom = nuevo_alto
            else:
                # Imagen más alta → recortar arriba y abajo
                nuevo_alto = int(ancho_original / ratio_objetivo)
                nuevo_ancho = ancho_original
                top = (alto_original - nuevo_alto) // 2
                left = 0
                bottom = top + nuevo_alto
                right = nuevo_ancho
            
            # Recortar y redimensionar
            img_cropped = img.crop((left, top, right, bottom))
            img_resized = img_cropped.resize((ancho_objetivo, alto_objetivo), Image.LANCZOS)
            
            # Guardar
            img_resized.save(ruta_salida, format="PNG", quality=95, optimize=True)
            print(f"✅ Imagen guardada en: {ruta_salida} ({ancho_objetivo}x{alto_objetivo})")
            print(f"   ➤ Recortada de {ancho_original}x{alto_original} a {nuevo_ancho}x{nuevo_alto}, luego redimensionada.")
    
    except Exception as e:
        print(f"❌ Error: {e}")

# --- CONFIGURA AQUÍ LAS RUTAS ---
ruta_original = "img/script.jpeg"
ruta_nueva = "img/script.png"

recortar_y_redimensionar(ruta_original, ruta_nueva)