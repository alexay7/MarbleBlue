# Chuni
1. Run chuniexporter and add import the jsons manually to each mongodb collection.
2. Download avatarAccesories and add to public/chuni/avatar/ as webp files
3. Download character files 01 and 02 and add to public/chuni/char/ as webp files
4. Download stage files and add to public/chuni/stage/ as webp files
5. Download music files and add to public/chuni/jacket/ as webp files
5. Download nameplates files and add to public/chuni/plate/ as webp files
5. Download mapicons files and add to public/chuni/mapicon/ as webp files

# Geki
1. Run gekiexporter and add import the jsons manually to each mongodb collection.
<br>Recommendation: Load each opt folder into AssetStudioGUI.
2. Download UI_Jacket files and add to public/geki/jacket/ as webp files
3. Download UI_Card files and add to public/geki/card/ as webp files
4. Download UI_Card_Icon files and add to public/geki/cardicon/ as webp files
5. Download UI_Chapter_BT files and add to public/geki/chapter/ as webp files
6. Download UI_Attachment, UI_GachaTicket, UI_Item_Book, UI_Item_OpenFlower_Ticket, UI_RES files and add to public/geki/item/ as webp files
7. Download UI_UserPlate_Icon files and add to public/geki/plate/ as webp files
8. Download UI_StarTicket files and add to public/geki/starticket/ as webp files
# Mai
1. Run maiexporter and add import the jsons manually to each mongodb collection.
2. <br>Recommendation: Load each opt folder into AssetStudioGUI.
3. Download UI_Jacket files and add to public/mai/jacket/ as webp files
4. Download UI_Icon files and add to public/mai/icon/ as webp files
5. Download UI_Chara files and add to public/mai/chara/ as webp files
5. Download UI_Plate files and add to public/mai/plate/ as webp files
6. Download UI_Frame files and add to public/mai/frame/ as webp files
7. Download UI_Partner files and add to public/mai/sound/ as webp files

# Useful commands
`find . -type f -iname "*.dds" -exec sh -c 'magick "$1" -quality 100 "${1%.dds}.webp"' _ {} \;`<br>
`find . -type f -iname "*.dds" -delete`