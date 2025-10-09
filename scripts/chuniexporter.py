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

def export_trophies():
    trophies = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Trophy.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                conditions = root_elem.find("normCondition").find("conditions").find("ConditionSubData") or []

                trophy = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "explanation": root_elem.find("explainText").text,
                    "rarity": int(root_elem.find("rareType").text),
                    "unlockable": True if len(conditions) > 0 else False,
                }

                trophies.append(trophy)

    with open("chunitrophies.json", "w", encoding="utf-8") as f:
        json.dump(trophies, f, ensure_ascii=False, indent=4)

def export_music():
    music = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Music.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                music_levels = []
                for i, level_elem in enumerate(root_elem.find("fumens").findall("MusicFumenData")):
                    level = {
                        "level": int(level_elem.find("type").find("id").text),
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
                    "series": root_elem.find("worksName").find("str").text if "worksName" in [child.tag for child in root_elem] else "Original",
                    "seriesId": int(root_elem.find("worksName").find("id").text) if "worksName" in [child.tag for child in root_elem] else 0,
                    "genre": root_elem.find("genreNames").find("list").find("StringID").find("str").text,
                    "genreId": int(root_elem.find("genreNames").find("list").find("StringID").find("id").text),
                    "levels": music_levels,
                    "worldsEndDiff": int(root_elem.find("starDifType").text),
                    "worldsEndType": root_elem.find("worldsEndTagName").find("str").text,
                }

                music.append(music_entry)

    with open("chunimusic.json", "w", encoding="utf-8") as f:
        json.dump(music, f, ensure_ascii=False, indent=4)

def export_characters():
    character_list = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Chara.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                character = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "sortName": root_elem.find("sortName").text,
                    "series": root_elem.find("works").find("str").text if "works" in [child.tag for child in root_elem] else "Original",
                    "seriesId": int(root_elem.find("works").find("id").text) if "works" in [child.tag for child in root_elem] else 0,
                }
                character_list.append(character)

    with open("chunicharacters.json", "w", encoding="utf-8") as f:
        json.dump(character_list, f, ensure_ascii=False, indent=4)

def export_maps():
    maps = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Map.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                rewards = []

                for reward in root_elem.find("infos").findall("MapDataAreaInfo"):
                    reward_entry = {
                        "mapAreaId": int(reward.find("mapAreaName").find("id").text),
                        "rewardId": int(reward.find("rewardName").find("id").text),
                        "rewardName": reward.find("rewardName").find("str").text
                    }
                    rewards.append(reward_entry)

                map_entry = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "series": root_elem.find("worksName").find("str").text if "worksName" in [child.tag for child in root_elem] else "Original",
                    "seriesId": int(root_elem.find("worksName").find("id").text) if "worksName" in [child.tag for child in root_elem] else 0,
                    "category": root_elem.find("mapFilterID").find("data").text,
                    "rewards": rewards
                }

                maps.append(map_entry)

    with open("chunimaps.json", "w", encoding="utf-8") as f:
        json.dump(maps, f, ensure_ascii=False, indent=4)

def export_cmissions():
    missions = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "CMission.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                rewards = []

                for reward in root_elem.find("rounds").findall("CMissionDataRoundInfo"):
                    reward_entry = {
                        "rewardId": int(reward.find("rewardName").find("id").text),
                        "rewardName": reward.find("rewardName").find("str").text,
                        "points": int(reward.find("targetValue").text),
                    }
                    rewards.append(reward_entry)

                mission = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "characterId": int(root_elem.find("charaImageName").find("id").text),
                    "rewards": rewards
                }

                missions.append(mission)

    with open("chunicmissions.json", "w", encoding="utf-8") as f:
        json.dump(missions, f, ensure_ascii=False, indent=4)

def export_skills():
    skills = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Skill.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                skill = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "category": int(root_elem.find("category").find("id").text),
                }

                skills.append(skill)

    with open("chuniskills.json", "w", encoding="utf-8") as f:
        json.dump(skills, f, ensure_ascii=False, indent=4)

def export_classes():
    classes = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Course.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                songs = []
                for song in root_elem.find("infos").findall("CourseMusicDataInfo"):
                    song_entry = {
                        "musicId": int(song.find("selectMusic").find("musicName").find("id").text),
                        "musicName": song.find("selectMusic").find("musicName").find("str").text,
                        "level": int(song.find("selectMusic").find("musicDiff").find("id").text)
                    }
                    songs.append(song_entry)

                cls = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "difficulty": int(root_elem.find("difficulty").find("id").text),
                    "songs": songs
                }

                classes.append(cls)

    with open("chuniclasses.json", "w", encoding="utf-8") as f:
        json.dump(classes, f, ensure_ascii=False, indent=4)

def export_tickets():
    tickets = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "Ticket.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                ticket = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "description": root_elem.find("explainText").text
                }

                tickets.append(ticket)

    with open("chunitickets.json", "w", encoding="utf-8") as f:
        json.dump(tickets, f, ensure_ascii=False, indent=4)

def export_chatsymbols():
    symbols = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file == "SymbolChat.xml":
                file_path = os.path.join(root, file)
                tree = ET.parse(file_path)
                root_elem = tree.getroot()

                scenes = []

                for scene in root_elem.find("sceneDataList").findall("SymbolChatSceneData"):
                    scenes.append(int(scene.find("sceneID").text))

                symbol = {
                    "id": int(root_elem.find("name").find("id").text),
                    "name": root_elem.find("name").find("str").text,
                    "sortName": root_elem.find("sortName").text,
                    "description": root_elem.find("text").text,
                    "bubbleId": int(root_elem.find("balloonID").text),
                    "scenes": scenes
                }

                symbols.append(symbol)

    with open("chunichatsymbols.json", "w", encoding="utf-8") as f:
        json.dump(symbols, f, ensure_ascii=False, indent=4)

# export_login_bonus()
# export_events()
# export_trophies()
# export_music()
# export_characters()
# export_maps()
# export_cmissions()
# export_skills()
# export_classes()
# export_tickets()
export_chatsymbols()