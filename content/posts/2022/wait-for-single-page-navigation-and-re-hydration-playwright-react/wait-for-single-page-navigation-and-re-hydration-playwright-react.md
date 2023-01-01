---
title: 'How to Wait for Single Page Navigation and Re-hydration with Playwright and React Router'
date: 2022-07-28T10:00:00-07:00
updated: 2022-12-21T10:00:00-07:00
tags: ['tech', 'testing', 'react', 'playwright', 'frontend']
coverImage: './playwright-logo.png'
description: >-
  We evaluate page-specific element selectors approach and
  come up with the custom "UI is ready" router navigation event
  in attempt to skip element selectors altogether.
summary: >-
  We look into ways to write robust end-to-end tests involving
  navigation between pages in a single page application (pun intended).
  We evaluate page-specific element selectors approach and
  come up with the custom "UI is ready" router navigation event
  in attempt to skip element selectors altogether.
---

While testing this blog with the awesome [Playwright](https://playwright.dev/) I faced
the problem of tests failing in CI (_github actions_) environment.
After some trial-and-error and a debugging I figured that all tests failing
were initiating (or dependent on) partial application re-rendering or react rehydration.

Issued I had were caused by too eager search for the element on the navigation target page.
Which wasn't giving enough time for the target page to render and hydrate.

Failing tests were written about a year ago before playwright's
[locators](https://playwright.dev/docs/api/class-page#page-locator) were introduced.
They used [`ElementHandle.waitForSelector`](https://playwright.dev/docs/next/api/class-elementhandle#element-handle-query-selector)
instead.

Subsequent migration to `locators` resolved all navigation related issues I had.
This is newer and far superior API to get hold of elements on the page.
Please use it when you can.

That's why I redacted this article and left only custom _UI page render approach_
for cases when you want to be notified of the actual navigation and successful
target page render.

One example when custom navigation event might be useful is to wait for form elements
re-hydration.
Even though input elements could be present on the page right after page load -
event listeners might not be hooked up yet.
Interacting with those elements generally won't produce the expected result.

### React Router Location Change Event

<Note>

This blog uses React (Preact in fact) with [ReachRouter](https://github.com/reach/router)
and that's what I'll be working with in code snippets below.

Implementation details for other frameworks and routers will differ but
conceptual approach remains the same.

</Note>

Most single-page-applications use client-side router for seamless navigation
between application routes.
Such router navigations don't cause full page reload but update the view and
[browser's history](https://developer.mozilla.org/en-US/docs/Web/API/History_API).

Client side routers also provide methods to work with application route programmatically.
In particular, they are able to announce (or otherwise communicate) application route
change event via service method, react hook, or custom event.

Let's leverage the route change event to capture the successful single-page
application navigation without the need to wait for the particular page element to
appear or disappear.

For this React based website I'm using
[`useLocation`](https://reach.tech/router/api/useLocation) router hook wrapped in
[`useEffect`](https://reactjs.org/docs/hooks-effect.html) react hook.

The combo gives me a custom `useLocationChangeEvent` hook emitting specific
[CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
on `window` object whenever application route changes:

```typescript
import React, { useEffect } from 'react';
import { useLocation } from '@reach/router';

function useLocationChangeEvent(): void {
  const location = useLocation();

  useEffect(() => {
    if (window) {
      // custom event type provides location details as a payload
      const event = new CustomEvent('REACT_ROUTER_PAGE_CHANGE_EVENT', { detail: { location } });

      window.dispatchEvent(event);
    }
  }, [location]);
}

// hook needs to be imported and used by the page-level react component
```

<Note>
  <p>
    If there is more than one application navigation event provided by your router
    (i.e. _before_ navigation, _during_ and _after_ it has completed)
    pick the one which comes __after__ target page rendering has completed.
  </p>

  <p>
    For GatbyJs websites there is an
    [`onRouteUpdate` browser API hook](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#onRouteUpdate)
    you can leverage instead of the custom `useLocationChangeEvent` implementation.
  </p>
</Note>

Now we need to capture `REACT_ROUTER_PAGE_CHANGE_EVENT` event in the Playwright test.
Once captured we consider the application route changed and new page being ready
for testing.

To achieve it we will use
[`page.evaluate`](https://playwright.dev/docs/api/class-page#page-evaluate)
which allows us to wait for the `window` event in the _browser context_
and resolve a promise in our _test script environment_ once it had been captured.

In essence, we are making a bridge between react router `useLocation` hook and
promise we can `await` for in our test.

Here is the bridge implementation:
```typescript
function waitForSpaNavigation(): Promise<string> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const eventListener = (event: Event): void => {
      // very lax check for TSC (typescript compiler)
      if (event instanceof CustomEvent) {
        resolved = true;

        // promise with be resolved with the URL pathname
        resolve((event.detail as unknown as any).location.pathname);
      }
    };

    window.addEventListener(
      'REACT_ROUTER_PAGE_CHANGE_EVENT',
      eventListener,
      { once: true }, // this is (at most) one time use event handler
    );

    // cleanup in case of timeout or non-event
    setTimeout(() => {
      window.removeEventListener(
        'REACT_ROUTER_PAGE_CHANGE_EVENT',
        eventListener,
      );

      if (!resolved) {
        reject(Error('Expected SPA navigation timeout'));
      }
    }, 10000); // timeout value better match playwright's timeout
  });
}
```

`waitForSpaNavigation` returns a `Promise` which will be resolved with navigation target page
[pathname](https://reactrouter.com/docs/en/v6/getting-started/concepts#locations)
or rejected if navigation didn't happen within the timeframe provided.

Under the hood it is setting (at most) one time use `REACT_ROUTER_PAGE_CHANGE_EVENT` event
listener on `window`.
Which is emitted by `useLocationChangeEvent` hook we defined above.

It is important to execute `waitForSpaNavigation` page function _before_ clicking the link
or triggering navigation programmatically because otherwise `REACT_ROUTER_PAGE_CHANGE_EVENT`
might fire _before_ we get a chance to set up our listener.

<Note>

Please note that `waitForSpaNavigation` doesn't reference any variables out of
its own scope.
For instance, we could have event name or timeout value defined as outer
scope variables instead of hard-coding them into the function body.

This is intentional since `waitForSpaNavigation` is a _page function_ and is
executed in the _browser_ environment where it won't have access to any variables
defined in nodejs _testing_ environment.

There is a special way to pass variables into page functions, but that
would complicate our code even further without a merit.

If you are curious about this subject I recommend reading this
[Playwright docs guide](https://playwright.dev/docs/evaluating).

</Note>

Here is how we use our custom navigation event approach in the test:

```typescript
await page.goto('https://lab.amalitsky.com');

const carsPageLink = page.locator('[data-testid*=HeaderTabs-Tab_cars]');

const [urlPath] = await Promise.all([
  page.evaluate(waitForSpaNavigation),
  carsPageLink.click(),
]);

// now you can verify the succesfull navigation against the URL pathname
expect(urlPath).toMatchSnapshot();
```

Notice the `await Promise.all` wrapper for `click` _and_ navigation event subscription -
we _don't_ want to `await` for the `click` _before_ we set up the
`REACT_ROUTER_PAGE_CHANGE_EVENT` event listener.
Otherwise, we open ourselves to the potential race condition when navigation
event fires _before_ we get a chance to catch it.

When using `page.goto` along with the custom navigation event listener don't
forget to pass `{ waitUntil: 'commit' }` option:

```typescript
// await is ok here since 'waitUntil: commit' resolves too early for the page to load
// and react router to instantiate and trigger our custom event
await page.goto('https://example.com', { waitUntil: 'commit' });

// now we wait for our custom "UI State Ready" event
await page.evaluate(waitForSpaNavigation);
```

This last snippet is particularly useful for SSR pages with client side re-hydration.

### Conclusion

We figured that reliable multi-page Playwright tests in React/Vue/Angular application
can be achieved with the use of
[locators](https://playwright.dev/docs/api/class-page#page-locator) and
[web-first assertions](https://playwright.dev/docs/release-notes#-web-first-assertions)
or custom implementation of `waitForSpaNavigation` page function.

Thanks for reading this far!

As always, please [let me know](https://twitter.com/amalitsky) what you think or
go ahead and ask any questions via DM.
Cheers
