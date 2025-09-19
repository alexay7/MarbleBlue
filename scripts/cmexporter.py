import os
import json
from datetime import datetime
import xml.etree.ElementTree as ET

chuni_gachas = []
chuni_cards = []

def export_chuni_gacha():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Gacha.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                if os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(file_path)))) != "CHU" and os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(file_path)))))) != "CHU":
                    continue

                gacha = {
                    "gachaId": int(root_elem.find("name").find("id").text),
                    "gachaName": root_elem.find("gachaName").text,
                    "type": int(root_elem.find("gachaType").text),
                    "kind": 0,
                    "isCeiling": int(root_elem.find("ceilingType").text),
                    "ceilingCnt": int(root_elem.find("ceilingNum").text),
                    "changeRateCnt":1,
                    "changeRateCnt2":1,
                    "startDate": datetime(2020,1,1).isoformat(),
                    "endDate": datetime(2099, 1, 1).isoformat(),
                    "noticeStartDate": datetime(2020,1,1).isoformat(),
                    "noticeEndDate": datetime(2099, 1, 1).isoformat(),
                    "cards":[]
                }

                for card_elem in root_elem.find("infos").findall("GachaCardDataInfo"):
                    card = {
                        "gachaId": gacha["gachaId"],
                        "cardId": int(card_elem.find("cardName").find("id").text),
                        "rarity":2,
                        "weight": int(card_elem.find("weight").text),
                        "isPickup": bool(int(card_elem.find("pickup").text))
                    }

                    gacha["cards"].append(card)

                chuni_gachas.append(gacha)

    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Card.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                # Check if parent parent folder is called CHU
                if os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(file_path)))) != "CHU" and os.path.basename(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(file_path)))))) != "CHU":
                    continue

                character_id = int(root_elem.find("chuniCharaName").find("id").text)

                # Search card in gachas and add the property characterId
                for gacha in chuni_gachas:
                    for card in gacha["cards"]:
                        if card["cardId"] == int(root_elem.find("name").find("id").text):
                            card["characterId"] = character_id
                            chuni_cards.append(card)

    with open("chunigachas.json", "w", encoding="utf-8") as f:
        json.dump(chuni_gachas, f, ensure_ascii=False, indent=4)

export_chuni_gacha()