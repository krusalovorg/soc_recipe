import requests

while True:
    text = input("=> ")
    res = requests.post("http://127.0.0.1:8000/api/edit_password_confirm", json={
        "sshkey": "c894914cca9d2ff9dd8ebf678540d613b64c99d8782f9c65aecbe4f4490e9a22",
        "code":"60104",
        "new_password":"new_password"

    })
    if res.status_code == 200:
        print("==>", res.json())
    else:
        print("==>", res)

#найди рецепт с помидорами
