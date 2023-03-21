import requests

while True:
    text = input("=> ")
    res = requests.post("http://127.0.0.1:8000/api/add_like", json={
        "sshkey": "035b0a8fc851fda21b3b42919ed55178a753d075e055c3d294f0a908360fcc5f",
        "recipe_id":"1",

    })
    if res.status_code == 200:
        print("==>", res.json())
    else:
        print("==>", res)

#найди рецепт с помидорами
