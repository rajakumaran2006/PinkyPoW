import os
from PIL import Image, ImageChops, ImageDraw

def make_favicon():
    img_path = 'public/logo-white.png'
    img = Image.open(img_path).convert('RGB')
    
    # 1. Find bounding box of non-white content
    bg = Image.new('RGB', img.size, (255, 255, 255))
    diff = ImageChops.difference(img, bg)
    bbox = diff.getbbox()
    if not bbox:
        bbox = (0, 0, img.size[0], img.size[1])
        
    cropped = img.crop(bbox)
    
    # 2. Make it a square by padding with white
    w, h = cropped.size
    max_dim = max(w, h)
    
    # Create a square white image
    square_logo = Image.new('RGB', (max_dim, max_dim), (255, 255, 255))
    # Paste the cropped image in the center
    offset = ((max_dim - w) // 2, (max_dim - h) // 2)
    square_logo.paste(cropped, offset)
    
    # 3. Create a circular favicon (e.g. 512x512)
    fav_size = 512
    # Create final transparent image
    favicon = Image.new('RGBA', (fav_size, fav_size), (0, 0, 0, 0))
    
    # Draw a white circle at the center with a nice border or just pure circle
    # Let's make it a nice white circle
    draw = ImageDraw.Draw(favicon)
    draw.ellipse((0, 0, fav_size, fav_size), fill=(255, 255, 255, 255))
    
    # Resize the square logo to fit inside the circle with some padding
    # Let's say we want 15% padding on each side, so the logo takes up 70% of the favicon size
    logo_size = int(fav_size * 0.70)
    resized_logo = square_logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Create a mask for the resized logo to handle any white edges, or we can just paste it directly
    # Paste resized logo into the center of the circular favicon
    logo_offset = ((fav_size - logo_size) // 2, (fav_size - logo_size) // 2)
    
    # Let's mask the resized logo if it has any non-white parts, but since it's on a white circular background, we can just paste it.
    # To be safe, we can use a circular mask for the whole image to ensure the corners are perfectly rounded/transparent.
    favicon.paste(resized_logo, logo_offset)
    
    # Apply final circular mask to the entire favicon to ensure clean round edges
    mask = Image.new('L', (fav_size, fav_size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, fav_size, fav_size), fill=255)
    
    final_favicon = Image.new('RGBA', (fav_size, fav_size), (0, 0, 0, 0))
    final_favicon.paste(favicon, (0, 0), mask=mask)
    
    # Save as PNG
    os.makedirs('public', exist_ok=True)
    final_favicon.save('public/favicon.png', 'PNG')
    print("Favicon created at public/favicon.png")

if __name__ == '__main__':
    make_favicon()
