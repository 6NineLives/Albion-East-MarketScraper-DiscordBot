import json
f = open("world.txt", "r")
# saved = {}
saved2 = {}

for x in f:
    inp = x.split(":")
    saved2[inp[0].strip()] = inp[1].strip()

print(saved2)
fo = open("../data/worlds_map.json", "w")
fo.write(json.dumps(saved2, indent=4))
fo.close()
