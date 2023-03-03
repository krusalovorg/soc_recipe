import requests

while True:
    text = input("=> ")
    res = requests.get("http://127.0.0.1:8000/api/get_recomendations", json={
        "sshkey": "bef86ecb3a3ef086a065151d380ccc813aabd32856da4c3c88dfe7224f8e354e",
        "code":"60104",
        "new_password":"new_password",
        "tag":"test",
        "name":"test",
        "surname":"test",
        "email":"test@test.test",
        "password":"password"

    })
    if res.status_code == 200:
        print("==>", res.json())
    else:
        print("==>", res)

#найди рецепт с помидорами
