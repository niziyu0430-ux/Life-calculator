"""Regenerate local web fonts from official Noto CJK OTFs in work/font-source.
Requires fonttools and brotli. Keep LICENSE files alongside generated fonts.
"""
from pathlib import Path
from fontTools import subset
root=Path(__file__).resolve().parent.parent
text=''.join(p.read_text(encoding='utf-8-sig') for folder in ['app','lib'] for p in (root/folder).rglob('*.ts*'))
text+=''.join(chr(n) for n in range(32,127))+'年月日周小时分钟零一二三四五六七八九十—→←↑↓↗·…'
for name in ['sans-400','sans-500','serif-600']:
    options=subset.Options();options.flavor='woff2';options.layout_features=['*']
    font=subset.load_font(str(root/'work/font-source'/f'{name}.otf'),options)
    sub=subset.Subsetter(options=options);sub.populate(text=text);sub.subset(font)
    subset.save_font(font,str(root/'public/fonts'/f'{name}.woff2'),options)
    print(name,(root/'public/fonts'/f'{name}.woff2').stat().st_size)
