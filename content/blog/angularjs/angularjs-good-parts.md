---
title: 'AngularJs: Good Parts (good for 2010)'
date: '2021-05-07T23:59:59.000Z'
tags: ['tech', 'anguarjs']
---

Everyone knows **AngularJs** is done and dusted! Why to write anything about it today, in 2021?

Well, the reason is simple - history moves in spirals and things we've learned yesterday
shape today and tomorrow.

Knowledge of prior frameworks and tools comes "for free" if you've been in the industry for
long enough and used those tools on daily basis. However, if you are a newcomer - you almost
certainly don't have that _historical_ perspective. Usually when starting
our development careers we work with popular tools of today (unless of course you were unlucky
enough to join the team supporting huge legacy codebase).

Absence of historical knowledge doesn't really hurt in the short run but having that perspective
helps immensely in developing the career and technical vision.

_Any framework as in itself can be seen as a coding pattern. Or, more realistically,
plenty of those._

Another reason is that AngularJs was the default framework of choice for
single-page applications for quite a few years
([2014 - 2018](https://trends.google.com/trends/explore?date=all&q=angularjs,react)).
Those applications (especially in the enterprise world) tend to hang around for a while after
they had been written and released. I believe even today thousands of UI engineers across
the world maintain and develop AngularJs apps. Some of them are must be working on migrating those
to newer frameworks - lets pause here for a second and wish them luck!

It is worth mentioning that LTS support for AngularJs got extended till the end of 2021 due to
the Covid and even after that no one can stop you from forking the repo and applying bug-fixes
you and your team deem necessary.

In this post I want to list concepts/approaches which were introduced in AngularJs and worked
really well for the huge and properly designed enterprise UI application over the span of 7 years.
To me that sounds like a seal of approval.

### Good parts of AngularJs framework
1. dependency injection
   - modules (`.config` and `.run` phases), instantiation of factories and services
   - dependency mocking out of the box
2. components approach (also called directives)
   - bindings (props)
   - lifecycle hooks
   - transclusion (projection)
   - `require` for "protected" communication between components
   - separation of component logic from the template (with template live-loading support)
3. embedded library to work with forms
   - parsers, formatters, validators
   - getters and setters for `ng-model` values
   - creating objects on the fly when `a.b.c` is being passed as `ng-model` attribute value
4. digest loop (change detection) which in 90% of cases doesn't require developer to use any
   special syntax, particular data management approach or to rely on lifecycle hooks.
   - various tools to hook up to it when required (i.e. from other libraries, such as D3)
5. being OOP oriented framework
6. good documentation for developers

It is important to note that definition of *right* was quite different in 2014 (and framework
itself was designed and developed much earlier than that). I.e. module system of angularJs is definitely
inferior to the one used today in Angular. And as far as I'm concerned that's totally fine cause
lessons learned from that version of DI are still very valuable and (for the most part)
do apply to future generations of UI app architecture.
