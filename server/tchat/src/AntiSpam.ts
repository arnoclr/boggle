export class AntiSpam {
  public static readonly MAX_REQUESTS_PER_SECOND = 3;
  private requests: Map<string, number> = new Map();

  public userHasSendTooManyRequests(userToken: string) {
    const now = Date.now();
    const lastRequest = this.requests.get(userToken);
    this.requests.set(userToken, now);
    if (lastRequest) {
      if (now - lastRequest < 1000 / AntiSpam.MAX_REQUESTS_PER_SECOND) {
        return true;
      }
    }
    return false;
  }
}
