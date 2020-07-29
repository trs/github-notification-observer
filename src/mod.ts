import { timer, BehaviorSubject, Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { tap, switchMap, take, map, filter } from 'rxjs/operators';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { GithubNotifications } from './notification';

// @ts-ignore
global.fetch = fetch;
// @ts-ignore
global.AbortController = AbortController;

// Constants

const GITHUB_API_URL = 'https://api.github.com';

// Types

interface Parameters {
  token: string;
  all?: boolean;
  participating?: boolean;
  since?: string;
  before?: string;
}

// Helpers

const excludeNilValues = <T extends Record<string, any>>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)) as Partial<T>;

// Implementation

/**
 * Observe Github notifications. Will emit when there are new notifications.
 * @param token Github personal access token
 * @param all **If true**, show notifications marked as read.
 * @param participating **If true**, only shows notifications in which the user is directly participating or mentioned.
 * @param since Only show notifications updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: **YYYY-MM-DDTHH:MM:SSZ**.
 * @param before Only show notifications updated before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: **YYYY-MM-DDTHH:MM:SSZ**.
 */
export const githubNotifications = (args: Parameters): Observable<GithubNotifications> => {
  const intervalSubject = new BehaviorSubject<number>(0);

  const url = new URL('notifications', GITHUB_API_URL);
  typeof args.all === 'boolean' && url.searchParams.append('all', String(args.all));
  typeof args.participating === 'boolean' && url.searchParams.append('participating', String(args.participating));
  typeof args.since === 'string' && url.searchParams.append('since', args.since);
  typeof args.before === 'string' && url.searchParams.append('before', args.before);

  return intervalSubject.pipe(
    switchMap((delay) => timer(delay)),
    switchMap(() => fromFetch(url.href, {
      method: 'get',
      headers: excludeNilValues({
        'User-Agent': 'Github-Notificaion-Observer',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${args.token}`
      })
    })),
    switchMap(async (res) => {
      if ([4, 5].includes(Math.trunc(res.status / 100))) {
        setImmediate(() => intervalSubject.complete());

        try {
          const {message} = await res.json();
          throw new Error(message);
        } catch {
          throw new Error('Unknown');
        }
      }
      return res;
    }),
    tap((res) => {
      let delay = intervalSubject.getValue();
      delay = Number(res.headers.get('x-poll-interval') ?? 60) * 1000;

      intervalSubject.next(delay);
    }),
    filter((res) => res.status !== 304 /* Not Modified */),
    switchMap(async (res) => res.json())
  );
}
