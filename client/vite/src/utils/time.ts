export function ago(d: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (seconds < 30) {
    return "à l'instant";
  }
  if (seconds < 60) {
    return `il y a ${seconds} secondes`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `il y a ${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `il y a ${hours} heures`;
  }
  const days = Math.floor(hours / 24);
  return `il y a ${days} jours`;
}
