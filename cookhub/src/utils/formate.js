export function formateName(str) {
    if (str != null)
        return str[0].toUpperCase() + str.slice(1)
    return 'загрузка'
}