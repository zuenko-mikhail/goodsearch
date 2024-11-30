/**
 *  Склонение русских слов
 *  @param num число
 *  @param words массив слов (один, два, много)
 */
export function declension(num: number, words: string[]) {
    const cases = [2, 0, 1, 1, 1, 2];
    return words[(num % 100 > 4 && num % 100 < 20) ? 2 : cases[(num % 10 < 5) ? num % 10 : 5]];
}

/** Разделяет число по тысячам */
export function sepThous(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// export function discount(num: number): string {
//     return
// } 