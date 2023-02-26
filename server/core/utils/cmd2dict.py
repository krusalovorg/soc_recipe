import re

from fuzzywuzzy.fuzz import ratio
from utils.text2num import TextToNumber

text2num = TextToNumber()

blacktypes = ['whitelist', '_id', 'rang']

def parse_command(sentence: str, schema: dict, number=False) -> dict:
    if number:
        sentence = text2num.parse(sentence)

    result = {}
    sentence = re.sub(r"[^aA-zZ-аА-яЯ\s0-9]", "", sentence)

    whitelist = schema.get("whitelist")

    blacklist = []

    context = []
    include_context = False
    context_name = ""

    included_whitelist = False

    parse_keys = []

    for word in sentence.split(" "):
        for key, value in schema.items():
            if key == "rang":
                pass
            elif key == "_id":
                result[key] = value
            elif value == "context" or value == str:
                include_context = True
                context_name = key
            elif key == "whitelist":
                included_whitelist = True
                if "whitelist" not in parse_keys:
                    parse_keys.append("whitelist")
            elif isinstance(value, list):
                for item in value:
                    parsed_item = item.split("=")
                    if len(parsed_item) == 2 and (word == parsed_item[0] or ratio(parsed_item[0], word) > 97):
                        result[key] = parsed_item[1]
                        if word in context:
                            context.remove(word)
                        if item not in blacklist:
                            blacklist.append(item)
                        break
                    elif ratio(item, word) > 90:
                        result[key] = word
                        if word in context:
                            context.remove(word)
                        if item not in blacklist:
                            blacklist.append(item)
                        break
            elif value == int and word.isdigit():
                result[key] = int(word)
                if word in context:
                    context.remove(word)
            elif isinstance(value, str) and len(value.split("=")) == 2:
                print(value.split("="))
                if ratio(value.split("=")[0], word) > 80:
                    result[key] = value.split("=")[1]
                    if word in context:
                        context.remove(word)
            elif isinstance(value, str) and ratio(value, word) > 80:
                result[key] = value
                if word in context:
                    context.remove(word)
            elif word not in context:
                if isinstance(whitelist, list) and word not in whitelist and word not in blacklist:
                    context.append(word)

            if result.get(key) and key not in parse_keys:
                parse_keys.append(key)

            if key != "rang":
                if value not in blacklist:
                    blacklist.append(value)
                if word not in blacklist:
                    blacklist.append(word)
    if include_context:
        result[context_name] = context
    else:
        result['_context'] = context
    # parse_keys.append("_context")

    schema_check = []
    for key, value in list(schema.items()):
        if key not in blacktypes:
            schema_check.append(key)
    result_check = []
    for key in list(result.keys()):
        if key not in blacktypes and not key.startswith("_"):
            result_check.append(key)


    if include_context and isinstance(result.get(context_name), list) and len(result.get(context_name)) == 0:
        return False
    if len(result_check) < len(schema_check):
        return False

    for key in result_check:
        if key not in schema_check:
            return False

    # print(parse_keys, schema.items())

    # if len(parse_keys) < len(schema.items()):
    #     return False

    return result

def challenge_command(sentence: str, schema_list: [], number: bool = False) -> dict:
    results = False
    schema_list = sorted(schema_list, key=lambda d: d.get('rang') or 10, reverse=True)
    for schema in schema_list:
        res = parse_command(sentence, schema, number=number)
        if res:
            results = res
    return results


if __name__ == '__main__':
    sentence_video = "включи видео про майнкрафт на ютубе"
    schema_video = {"type": "ютуб", "act": ["найди", "включи"], "video": "context", "whitelist": ["видео","про","на"]}
    print(challenge_command(sentence_video, [schema_video]))


#by krusalovorg krusalovorg@gmail.com