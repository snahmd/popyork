export function ensureStartWith(stringToCheck: string, startsWith: string): string {
   return  stringToCheck.startsWith(startsWith)  ?  stringToCheck : `${startsWith}${stringToCheck}`;
}