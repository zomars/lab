---
title: 'Stuff AngularJs Got Right'
date: '2021-05-07T23:59:59.000Z'
tags: ['tech', 'anguarjs']
---

Everyone knows **AngularJs** is done and dusted! Why to write anything about it in 2021?

Well, the reason is quite simple - history moves in spirals and things we've learned yesterday
shape today and tomorrow.

Knowledge of prior frameworks and tools comes "for free" if you've been in the industry for
long enough and got a chance to get deeply involved with those tools. But if you are a newcomer -
you  almost certainly won't have that *historical* perspective. It won't hurt in the short run
but will come handy for the long-term development as an engineer.

Another reason is that AngularJs was the default framework of choice for
single-page applications for a few years
([2014 - 2018](https://trends.google.com/trends/explore?date=all&q=angularjs,react)).
Such applications (especially in the enterprise world) tend to hang around for a while after
they had been written and released. Even today thousands of UI engineers across the world
maintain and develop those apps or are currently migrating them to something else.

Worth mentioning that LTS support got extended till the end of 2021 and even after that no one
can stop you from forking the repo and applying bug-fixes you and your team deem necessary.

In this post I want only to list concepts/approaches which were introduced in AngularJs and worked
really well for the huge and properly designed enterprise UI application over the span of 7 years.

This could become a *Contents* section for future AngularJs related posts.

1. dependency injection
   - modules (`.config` and `.run`), instantiation of factories and services
   - tokens (string type only)
   - mocking support for dependencies
2. components approach (also called directives)
   - bindings (props)
   - separation of component logic from the template (with template live-loading support)
   - `require` for "protected" communication between components
   - lifecycle hooks
   - transclusion (projection)
3. embedded library to work with forms
   - parsers, formatters, validators
   - getters and setters for `ng-model` values
4. digest loop (change detection) which in 90% of cases doesn't require developer to use any
   special syntax, particular data management approach or to rely on lifecycle hooks.
   - various tools to hook up to it when required (i.e. from other libraries, such as D3)
5. being OOP oriented framework

It is important to note that definition of *right* was quite different in 2014. I.e. module
system of angularJs is definitely inferior to the one used today in Angular. And that's ok
cause lessons learned from that version of DI are still very valuable and (for the most part)
do apply to future generations of frontend DI.
