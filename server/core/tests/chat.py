import requests

while True:
    text = input("=> ")
    res = requests.post("http://127.0.0.1:8000/api/search", json={
        "sshkey": "85b2bcf271be2394c1bb7f99f6de4f2b04f1fa722c2290f9b741cf1f8cff505d",
        "search_text": text,
        "filter_text": [
            {"column": "callories", "value": 50, "type": "<"},
            ]

    })
    if res.status_code == 200:
        print("==>", res.json())
    else:
        print("==>", res)

#найди рецепт с помидорами
