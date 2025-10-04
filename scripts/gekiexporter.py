import datetime
import os
import json
import xml.etree.ElementTree as ET

chapters = []
events = []

def export_events():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Event.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                # If the events are not related to a chapter just add them directly
                if root_elem.find("Event").find("ChapterName") is None:
                    event = {
                        "eventId": int(root_elem.find("Name").find("id").text),
                        "eventName": root_elem.find("Name").find("str").text,
                        "eventType": root_elem.find("EventType").text,
                        "active": True
                    }
                    events.append(event)
                else:
                    chapter_id = root_elem.find("Event").find("ChapterName").find("id").text
                    chapter_name = root_elem.find("Event").find("ChapterName").find("str").text

                    event = {
                        "eventId": int(root_elem.find("Name").find("id").text),
                        "eventName": root_elem.find("Name").find("str").text,
                        "eventType": root_elem.find("EventType").text,
                        "active": True,
                        "chapterId": int(chapter_id),
                        "chapterName": chapter_name
                    }

                    if event["eventType"] in ["AcceptRankingEvent","AcceptTechChallengeEvent"]:
                        event["active"] = False

                    if event["eventType"] == "TechChallengeEvent":
                        event["songs"] = []

                    events.append(event)

    with open("gekievents.json", "w", encoding="utf-8") as f:
        json.dump(events, f, ensure_ascii=False, indent=4)

def export_chapters():
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Chapter.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                musics = []

                for music_elem in root_elem.find("MusicList").findall("ChapterMusic"):
                    music = {
                        "musicId": int(music_elem.find("MusicName").find("id").text),
                        "musicName": music_elem.find("MusicName").find("str").text
                    }
                    musics.append(music)

                shop_items = []

                for item_elem in root_elem.find("PurchaseItemList").findall("PurchaseItem"):
                    item = {
                        "itemId": int(item_elem.find("ItemName").find("id").text),
                        "itemName": item_elem.find("ItemName").find("str").text,
                        "itemType": item_elem.find("ItemType").text
                    }
                    shop_items.append(item)

                chapter = {
                    "chapterId": int(root_elem.find("Name").find("id").text),
                    "chapterName": root_elem.find("Name").find("str").text,
                    "musics": musics,
                    "shopItems": shop_items,
                }

                # if the chapter is already present, keep the one with the most shop items
                existing_chapter = next((c for c in chapters if c['chapterId'] == chapter['chapterId']), None)
                if existing_chapter:
                    if len(chapter['shopItems']) > len(existing_chapter['shopItems']):
                        chapters.remove(existing_chapter)
                        chapters.append(chapter)
                else:
                    chapters.append(chapter)

    with open("gekichapters.json", "w", encoding="utf-8") as f:
        json.dump(chapters, f, ensure_ascii=False, indent=4)

def export_music():
    music_list = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Music.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                music_levels = []
                for i, level_elem in enumerate(root_elem.find("FumenData").findall("FumenData")):
                    level = {
                        "level": i,
                        "difficulty": float(level_elem.find("FumenConstIntegerPart").text+"."+level_elem.find("FumenConstFractionalPart").text),
                    }
                    music_levels.append(level)

                #     If the song is already in the list, and the difficulty of the last level is bigger than 0, replace this last level
                if any(m['musicId'] == int(root_elem.find("Name").find("id").text) for m in music_list):
                    existing_music = next(m for m in music_list if m['musicId'] == int(root_elem.find("Name").find("id").text))
                    if music_levels[-1]['difficulty'] > 0:
                        existing_music['levels'][-1] = music_levels[-1]

                music = {
                    "musicId": int(root_elem.find("Name").find("id").text),
                    "musicName": root_elem.find("Name").find("str").text,
                    "sortName": root_elem.find("NameForSort").text,
                    "artistName": root_elem.find("ArtistName").find("str").text,
                    "artistId": int(root_elem.find("ArtistName").find("id").text),
                    "series": root_elem.find("MusicSourceName").find("str").text,
                    "seriesId": int(root_elem.find("MusicSourceName").find("id").text),
                    "genre": root_elem.find("Genre").find("str").text,
                    "genreId": int(root_elem.find("Genre").find("id").text),
                    "levels": music_levels,
                    "boss":{
                        "cardId": int(root_elem.find("BossCard").find("id").text),
                        "cardName": root_elem.find("BossCard").find("str").text,
                        "level": int(root_elem.find("BossLevel").text),
                        "attr": root_elem.find("WaveAttribute").find("AttributeType").text,
                    },
                    "releaseDate": datetime.datetime.strptime(root_elem.find("ReleaseVersion").text, "%Y-%m-%dT%H:%M:%S").date().isoformat(),
                }
                music_list.append(music)

    with open("gekimusic.json", "w", encoding="utf-8") as f:
        json.dump(music_list, f, ensure_ascii=False, indent=4)

def export_cards():
    card_list = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Card.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                attackLevels = []
                for level_elem in root_elem.find("LevelParam").findall("int"):
                    attackLevels.append(int(level_elem.text))

                skills = [root_elem.find("SkillID").find("str").text, root_elem.find("ChoKaikaSkillID").find("str").text]

                card = {
                    "cardId": int(root_elem.find("Name").find("id").text),
                    "cardName": root_elem.find("Name").find("str").text,
                    "rarity": root_elem.find("Rarity").text,
                    "attribute": root_elem.find("Attribute").text,
                    "characterId": int(root_elem.find("CharaID").find("id").text),
                    "characterName": root_elem.find("CharaID").find("str").text,
                    "seriesId": int(root_elem.find("School").find("id").text),
                    "seriesName": root_elem.find("School").find("str").text,
                    "attackLevels": attackLevels,
                    "skills": skills
                }
                card_list.append(card)

    with open("gekicards.json", "w", encoding="utf-8") as f:
        json.dump(card_list, f, ensure_ascii=False, indent=4)

def export_trophies():
    trophy_list = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Trophy.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                trophy = {
                    "trophyId": int(root_elem.find("Name").find("id").text),
                    "trophyName": root_elem.find("Name").find("str").text,
                    "description": root_elem.find("Description").text,
                    "rarity": root_elem.find("TrophyRarityType").text,
                }
                trophy_list.append(trophy)

    with open("gekitrophies.json", "w", encoding="utf-8") as f:
        json.dump(trophy_list, f, ensure_ascii=False, indent=4)

def export_dailybonus():
    daily_bonus_list = []
    reward_list = []

    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Reward.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                reward = {
                    "rewardId": int(root_elem.find("Name").find("id").text),
                    "rewardType": root_elem.find("RewardItem").find("ItemType").text,
                    "itemId": int(root_elem.find("RewardItem").find("ItemName").find("id").text)
                }
                reward_list.append(reward)

    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "DailyBonus.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                items = []
                for item_elem in root_elem.find("ItemList").findall("DailyBonusItem"):
                    found_reward = next((r for r in reward_list if r['rewardId'] == int(item_elem.find("RewardName").find("id").text)), None)
                    item = {
                        "rewardId": int(item_elem.find("RewardName").find("id").text),
                        "itemName": item_elem.find("RewardName").find("str").text,
                        "itemId": found_reward["itemId"] if found_reward else None,
                        "quantity": int(item_elem.find("ItemNum").text),
                        "rarity": item_elem.find("IsSpecial").text,
                        "type": found_reward["rewardType"] if found_reward else "Unknown"
                    }
                    items.append(item)

                bonus = {
                    "bonusId": int(root_elem.find("Name").find("id").text),
                    "bonusName": root_elem.find("Name").find("str").text,
                    "items": items
                }
                daily_bonus_list.append(bonus)

    with open("gekidailybonus.json", "w", encoding="utf-8") as f:
        json.dump(daily_bonus_list, f, ensure_ascii=False, indent=4)

export_music()
export_events()
export_chapters()
export_cards()
export_trophies()
export_dailybonus()