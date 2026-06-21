import os
import re

replacements = [
    # Hex color replacements (case-insensitive)
    (re.compile(r'#FAF6EA', re.IGNORECASE), '#FFF5F7'),
    (re.compile(r'#F5C451', re.IGNORECASE), '#ec4899'),
    (re.compile(r'#ECE9DF', re.IGNORECASE), '#FCE7F3'),
    (re.compile(r'#EFECE3', re.IGNORECASE), '#FDF2F8'),
    (re.compile(r'#FAF9F5', re.IGNORECASE), '#FFF5F7'),
    (re.compile(r'#7A6218', re.IGNORECASE), '#be185d'),
    (re.compile(r'#FAF4D8', re.IGNORECASE), '#FCE7F3'),
    
    # Tailwind classes replacements
    (re.compile(r'bg-amber-500'), 'bg-[#ec4899]'),
    (re.compile(r'bg-amber-600'), 'bg-pink-600'),
    (re.compile(r'text-amber-100'), 'text-pink-100'),
    (re.compile(r'text-amber-200'), 'text-pink-200'),
    (re.compile(r'text-amber-400'), 'text-pink-400'),
    (re.compile(r'text-amber-500'), 'text-pink-500'),
    (re.compile(r'text-amber-600'), 'text-pink-600'),
    (re.compile(r'text-amber-800'), 'text-pink-800'),
    (re.compile(r'border-amber-400'), 'border-pink-400'),
    (re.compile(r'border-amber-200'), 'border-pink-200'),
    (re.compile(r'bg-amber-100'), 'bg-pink-100'),
    (re.compile(r'hover:bg-amber-50'), 'hover:bg-pink-50'),
    (re.compile(r'to-amber-600'), 'to-pink-700'),
    (re.compile(r'from-amber-500'), 'from-[#ec4899]'),
    (re.compile(r'text-yellow-500'), 'text-pink-500'),
    (re.compile(r'text-yellow-600'), 'text-pink-600'),
    (re.compile(r'bg-yellow-500'), 'bg-[#ec4899]'),
    (re.compile(r'bg-yellow-600'), 'bg-pink-600'),
    (re.compile(r'yellow-500'), 'pink-500'),
]

directories = [
    '/Users/raja/Desktop/ClientProjects/Hackathons/PinkyPoW/app',
    '/Users/raja/Desktop/ClientProjects/Hackathons/PinkyPoW/components'
]

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                for pattern, replacement in replacements:
                    content = pattern.sub(replacement, content)
                
                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated: {filepath}")
