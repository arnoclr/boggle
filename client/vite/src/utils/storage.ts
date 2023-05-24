export function getList(listname: string): any[] {
  const list = localStorage.getItem(listname);
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
}

export function addInList(listname: string, item: any) {
  const list = getList(listname);
  list.push(item);
  localStorage.setItem(listname, JSON.stringify(list));
}
