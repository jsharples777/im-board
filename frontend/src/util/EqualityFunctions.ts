export type equalityFunction = (item1:any, item2:any) => boolean;

export function isSame(item1:any, item2:any):boolean {
  return (item1.id === item2.id);
}
