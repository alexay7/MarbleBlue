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

export_events()
