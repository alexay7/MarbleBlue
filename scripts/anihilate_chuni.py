import pymongo

CARD_ID="3144402542"

client = pymongo.MongoClient("mongodb://10.0.0.150:27017/")

db = client["MarbleBlue"]

acts = db["chu3useractivities"]
chars = db["chu3usercharacters"]
cmissionsprog = db["chu3usercmissionprogresses"]
cmissions = db["chu3usercmissions"]
courses = db["chu3usercourses"]
datas = db["chu3userdatas"]
gachas = db["chu3usergachas"]
options = db["chu3usergameoptions"]
items = db["chu3useritems"]
loginbonuses = db["chu3userloginbonus"]
mapareas = db["chu3usermapareas"]
miscs = db["chu3usermiscs"]
musicdetails = db["chu3usermusicdetails"]
netbattledatas = db["chu3usernetbattledatas"]
netbattlelogs = db["chu3usernetbattlelogs"]
playlogs = db["chu3userplaylogs"]
regions = db["chu3userregions"]
userteams = db["chu3userteams"]
ucs = db["chu3userucs"]

print("Deleting user data for CARD_ID:", CARD_ID)
acts.delete_many({"cardId": CARD_ID})
chars.delete_many({"cardId": CARD_ID})
cmissionsprog.delete_many({"cardId": CARD_ID})
cmissions.delete_many({"cardId": CARD_ID})
courses.delete_many({"cardId": CARD_ID})
datas.delete_many({"cardId": CARD_ID})
gachas.delete_many({"cardId": CARD_ID})
options.delete_many({"cardId": CARD_ID})
items.delete_many({"cardId": CARD_ID})
loginbonuses.delete_many({"cardId": CARD_ID})
mapareas.delete_many({"cardId": CARD_ID})
miscs.delete_many({"cardId": CARD_ID})
musicdetails.delete_many({"cardId": CARD_ID})
netbattledatas.delete_many({"cardId": CARD_ID})
netbattlelogs.delete_many({"cardId": CARD_ID})
playlogs.delete_many({"cardId": CARD_ID})
regions.delete_many({"cardId": CARD_ID})
userteams.delete_many({"cardId": CARD_ID})
ucs.delete_many({"cardId": CARD_ID})