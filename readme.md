# `github-notification-observer`

Continually poll for notifications, emit when changed

# Install

`npm i github-notification-observer`

# Usage

```ts
import {githubNotifications} from 'github-notification-observer';

githubNotifications({token: '<Github personal access token>'})
  .pipe(...)
  .subscribe(
    (notifications) => console.log(notifications)
  );
```

Each item emitted is an array of [Github notifications](https://docs.github.com/en/rest/reference/activity#list-notifications-for-the-authenticated-user).

# API

`githubNotifications(args)` returns an observable of notifications, given a personal access token.

`args.token` Github personal access token.  
`args.all` **If true**, show notifications marked as read.  
`args.participating` **If true**, only shows notifications in which the user is directly participating or mentioned.  
`args.since` Only show notifications updated after the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: **YYYY-MM-DDTHH:MM:SSZ**.  
`args.before` Only show notifications updated before the given time. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: **YYYY-MM-DDTHH:MM:SSZ**.  
