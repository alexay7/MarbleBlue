import os
import json
import xml.etree.ElementTree as ET

cards = []
events = []

ROOT_DIR = "."

def export_events():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Event.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                event = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "type": 0,
                    "enable": True
                }

                # Check if event is in array by the id
                if any(e['id'] == event['id'] for e in events):
                    continue

                events.append(event)


    with open("maievents.json", "w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=4)

def export_cards():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Card.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                card = {
                    "cardId": int(root_elem.find("name").find("id").text),
                    "cardName": root_elem.find("name").find("str").text,
                }

                # check if present in array
                if any(c['cardId'] == card['cardId'] for c in cards):
                    continue

                cards.append(card)

    with open("maicards.json", "w", encoding="utf-8") as f:
        json.dump(cards, f, ensure_ascii=False, indent=4)

def export_trophies():
    trophies = []
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file == "Title.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                explanation = root_elem.find("normText").text

                unlockable = False

                if "RANK" in explanation or "FULL COMBO" in explanation or "ALL PERFECT" in explanation or "FULL SYNC" in explanation or "到達" in explanation or "距離" in explanation or "達成" in explanation or "プレイ" in explanation or "で選ぶよ" in explanation or "はじめから所持" in explanation or "抜けた" in explanation or "オトモダチ" in explanation or "ログイン" in explanation or "制覇" in explanation or "制覇" in explanation or "覚醒" in explanation or "トラックスキップ発動" in explanation or "MISS" in explanation or "サークルフェスタ" in explanation:
                    unlockable = True

                trophy = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "explanation": explanation,
                    "rarity": root_elem.find("rareType").text,
                    "unlockable": unlockable
                }

                trophies.append(trophy)

    with open("maitrophies.json", "w", encoding="utf-8") as f:
        json.dump(trophies, f, ensure_ascii=False, indent=4)

def export_music():
    music = []
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file == "Music.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                music_levels = []
                for i, level_elem in enumerate(root_elem.find("notesData").findall("Notes")):
                    level = {
                        "level": int(level_elem.find("file").find("path").text.split("_")[1].replace(".ma2","")),
                        "difficulty": float(level_elem.find("level").text+"."+level_elem.find("levelDecimal").text),
                    }
                    music_levels.append(level)

                #     If the song is already in the list, merge the levels
                existing_music = next((m for m in music if m["id"] == int(root_elem.find("name").find("id").text)), None)
                if existing_music:
                    # No duplicates
                    existing_levels = existing_music["levels"]
                    for lvl in music_levels:
                        if lvl not in existing_levels:
                            existing_levels.append(lvl)
                    existing_levels.sort(key=lambda x: x["level"])
                    existing_music["levels"] = existing_levels
                    continue

                music_entry = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "sortName": root_elem.find("sortName").text,
                    "artistId": int(root_elem.find("artistName").find("id").text),
                    "artist": root_elem.find("artistName").find("str").text,
                    "genre": root_elem.find("genreName").find("str").text,
                    "genreId": int(root_elem.find("genreName").find("id").text),
                    "levels": music_levels,
                    "utageType": root_elem.find("utageKanjiName").text if root_elem.find("utageKanjiName") is not None else "",
                }

                music.append(music_entry)

    with open("maimusic.json", "w", encoding="utf-8") as f:
        json.dump(music, f, ensure_ascii=False, indent=4)

def export_login_bonus():
    login_bonuses = []
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file == "LoginBonus.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                bonustype = root_elem.find("BonusType").text

                login_bonus = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "type": bonustype
                }

                if bonustype== "MusicNew":
                    login_bonus["rewardId"] = int(root_elem.find("MusicId").find("id").text)
                    login_bonus["rewardName"] = root_elem.find("MusicId").find("str").text
                elif bonustype == "Partner":
                    login_bonus["rewardId"] = int(root_elem.find("PartnerId").find("id").text)
                    login_bonus["rewardName"] = root_elem.find("PartnerId").find("str").text
                elif bonustype == "Icon":
                    login_bonus["rewardId"] = int(root_elem.find("IconId").find("id").text)
                    login_bonus["rewardName"] = root_elem.find("IconId").find("str").text
                elif bonustype == "Plate":
                    login_bonus["rewardId"] = int(root_elem.find("PlateId").find("id").text)
                    login_bonus["rewardName"] = root_elem.find("PlateId").find("str").text
                elif bonustype == "Frame":
                    login_bonus["rewardId"] = int(root_elem.find("FrameId").find("id").text)
                    login_bonus["rewardName"] = root_elem.find("FrameId").find("str").text

                login_bonuses.append(login_bonus)

    with open("mailoginbonuses.json", "w", encoding="utf-8") as f:
        json.dump(login_bonuses, f, ensure_ascii=False, indent=4)

def export_shop_items():
    items = []
    for root, dirs, files in os.walk(ROOT_DIR):
        for file in files:
            if file == "ShopItem.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                imagePath = ""
                item_type = root_elem.find("shopItemCategoryName").find("str").text

                if item_type == "チケット":
                    imagePath = "/ticket/" + str(root_elem.find("itemId").text).zfill(6)
                elif item_type == "パートナー":
                    imagePath = "/sound/UI_Partner_" + str(root_elem.find("itemId").text).zfill(6)
                elif item_type == "つあーメンバー":
                    imagePath = "/chara/UI_Chara_" + str(root_elem.find("itemId").text).zfill(6)
                elif item_type == "ネームプレート":
                    imagePath = "/plate/UI_Plate_" + str(root_elem.find("itemId").text).zfill(6)
                elif item_type == "フレーム":
                    imagePath = "/frame/UI_Frame_" + str(root_elem.find("itemId").text).zfill(6)
                elif item_type == "プレゼント":
                    imagePath = "/ticket/intimate_" + str(root_elem.find("itemId").text)[-1]

                item = {
                    "itemId": int(root_elem.find("itemId").text),
                    "itemType": item_type,
                    "price": int(root_elem.find("itemCost").text),
                    "imagePath": imagePath,
                    "itemName": root_elem.find("name").find("str").text,
                    "quantity": int(root_elem.find("exchangeNum").text),
                }

                items.append(item)

    with open("maiitems.json", "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=4)

export_events()
export_cards()
export_trophies()
export_music()
export_login_bonus()
export_shop_items()