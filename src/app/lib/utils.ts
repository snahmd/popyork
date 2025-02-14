export function ensureStartWith(stringToCheck: string, startsWith) {
   return  stringToCheck.startsWith(startsWith)  ?  stringToCheck : `${startsWith}${stringToCheck}`;
}