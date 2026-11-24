# Fotos de producto

Los alimentos de marca (Hacendado, Bimbo, Gallo…) pueden tener foto real del envase.

## Convenio de nombres

`public/products/<slug>.<ext>` · extensiones probadas en orden: `webp`, `png`, `jpg`, `jpeg`

El `slug` es el campo `image` de cada alimento en `src/data/foods.ts` y coincide con su `id`,
así que **no cambia** si editas el nombre visible: las fotos que pongas siguen sirviendo.

Si no existe ningún archivo, la interfaz cae al emoji del alimento (nunca se rompe nada).

Ejemplos:

| Alimento | Archivo |
|---|---|
| Cereales rellenos de leche (Hacendado) | `cereales-rellenos-leche.webp` |
| Tableta chocolate con leche | `choco-leche.webp` |
| Tortitas de arroz | `tortitas-arroz.webp` |
| Muesli Crunchy Chocolate Negro (Mildea) | `lidl-muesli-crunchy-choco-negro.webp` |
| Chocolate negro 85 % cacao (Moser Roth) | `aldi-choco-85.webp` |
| Copos de avena integral (Consum) | `consum-avena-integral.webp` |
| Atún en tomate (Alcampo) | `alcampo-atun-tomate.webp` |

Hoy hay **70 alimentos** con `image` definida y sin foto: 5 de Mercadona/Hacendado, 14 de Lidl,
10 de ALDI, 18 de Consum, 7 de Alcampo y 16 genéricos de varias cadenas. El nombre que falta en
cada tarjeta es exactamente el archivo que hay que subir.

## Dónde se ven

- **Miniatura** en las listas de "Añadir alimento" (resultados y tanda pendiente) y en el catálogo "Explorar".
- **Desplegable**: al seleccionar un alimento aparece la tarjeta *Foto del producto* con imagen, marca, tamaño de envase y Nutri-Score. Toca la imagen para ampliarla y verificar que es el producto correcto.
- **Ficha** `/alimento/:id`: la imagen ocupa el hero de la cabecera.

## Consejos

- Recorta solo el envase sobre fondo blanco o transparente; los contenedores usan `object-contain` con fondo blanco.
- ~600 px de ancho es suficiente; mantén el mismo ratio en todos para que la lista se vea ordenada.
- Para dar foto a un alimento nuevo, ponle `image: 'su-slug'` en `src/data/foods.ts` y sube el archivo.
