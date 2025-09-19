import os
import json
import xml.etree.ElementTree as ET

events = []
presets = []
bonuses = []

def export_events():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Event.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                event = {
                    "id": int(root_elem.find("name").find("id").text),
                    "type": int(root_elem.find("substances").find("type").text),
                    "name": root_elem.find("name").find("str").text,
                    "enabled": True
                }

                events.append(event)

    with open("chunievents.json", "w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=4)

def export_login_bonus():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "LoginBonusPreset.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                preset = {
                    "presetId": int(root_elem.find("name").find("id").text),
                    "presetName": root_elem.find("name").find("str").text,
                    "bonuses": []
                }

                for bonus in root_elem.find("infos").findall("LoginBonusDataInfo"):
                    bonus = {
                        "bonusId": int(bonus.find("loginBonusName").find("id").text),
                        "bonusName": bonus.find("loginBonusName").find("str").text
                    }
                    preset["bonuses"].append(bonus)

                presets.append(preset)

    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "LoginBonus.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                bonus = {
                    "loginBonusId": int(root_elem.find("name").find("id").text),
                    "loginBonusName": root_elem.find("name").find("str").text,
                    "presentId": int(root_elem.find("present").find("id").text),
                    "presentName": root_elem.find("present").find("str").text,
                    "itemNum": int(root_elem.find("itemNum").text),
                    "needLoginDayCount": int(root_elem.find("needLoginDayCount").text),
                    "loginBonusCategoryType": int(root_elem.find("loginBonusCategoryType").text),
                }

                for preset in presets:
                    for b in preset["bonuses"]:
                        if b["bonusId"] == bonus["loginBonusId"]:
                            bonus["presetId"] = preset["presetId"]
                            bonus["presetName"] = preset["presetName"]
                            break

                bonuses.append(bonus)

    with open("chuniloginbonuses.json", "w", encoding="utf-8") as f:
        json.dump(bonuses, f, ensure_ascii=False, indent=4)

export_login_bonus()
# export_events()