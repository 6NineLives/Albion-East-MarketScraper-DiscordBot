import json
f = open("items.txt", "r")
# saved = {}
saved = []
saved_name = []
saved2 = {}

level_array = ['Beginner', 'Novice', 'Journeyman', 'Adept', 'Expert', 'Master', 'Grandmaster', 'Elder']
level_array2 = ['Beginner\'s', 'Novice\'s', 'Journeyman\'s', 'Adept\'s', 'Expert\'s', 'Master\'s', 'Grandmaster\'s', 'Elder\'s']
level_resources = ['WOOD', 'ORE', 'HIDE', 'FIBER', 'ROCK', 'PLANKS', 'STONEBLOCK', 'METALBAR', 'LEATHER', 'CLOTH']
level_resources_name = ['Wood', 'Ore', 'Hide', 'Fiber', 'Stone', 'Plank', 'Stoneblock', 'Bar', 'Leather', 'Cloth']
level_enchant = ['Uncommon', 'Rare', 'Exceptional', 'Pristine']

for x in f:
    inp = x.split(":")
    if len(inp) == 3:
        y = inp[2].strip()
        
        for z in level_array:
            if z in inp[2].strip():
                y = inp[2].strip().removeprefix(z).strip() + " " + str(level_array.index(z) + 1) + "."

        for z in level_array2:
            if z in inp[2].strip():
                y = inp[2].strip().removeprefix(z).strip() + " " + str(level_array2.index(z) + 1) + "."

        for z in level_resources:
            if z in inp[1].strip() and len(inp[1].strip()) == len(z) + 3:
                y = level_resources_name[level_resources.index(z)] + " " + inp[1].strip().split('_')[0][1] + "."
        if 'The Hand of Khor' in inp[2].strip():
            y = 'Greataxe 8.'

        if y in saved_name or any(c for c in level_enchant if c in y): continue
        saved.append({"name": y, "value": inp[1].strip()})
        saved2[inp[1].strip()] = y
        saved_name.append(y)
        
fo = open("../data/items_map.json", "w")
fo.write(json.dumps(saved2, indent=4))
fo.close()

fo = open("../data/items.json", "w")
fo.write(json.dumps(saved, indent=4))
fo.close()