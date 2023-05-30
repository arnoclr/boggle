function areSame(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getList(listname: string): any[] {
  const list = localStorage.getItem(listname);
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
}

export function addInList<T>(listname: string, item: T) {
  const list = getList(listname);
  list.push(item);
  localStorage.setItem(listname, JSON.stringify(list));
}

export function addInListIfNotPresent<T>(listname: string, item: T) {
  const list = getList(listname);
  if (!list.some((i) => areSame(i, item))) {
    list.push(item);
  }
  localStorage.setItem(listname, JSON.stringify(list));
}

export function removeFromList<T>(listname: string, item: T) {
  const list = getList(listname);
  const newList = list.filter((i) => !areSame(i, item));
  localStorage.setItem(listname, JSON.stringify(newList));
}
