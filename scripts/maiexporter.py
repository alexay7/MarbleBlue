import os
import json
import xml.etree.ElementTree as ET

cards = []
events = []

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

export_events()
export_cards()