---
title: Good Parts of AngularJs Framework
date: 2021-05-07T23:59:59-07:00
tags: [tech, angularjs, framework, UI]
description: >-
  List of software architecture patterns and coding approaches introduced and
  popularized in front-end community by AngularJs 1.x framework.
  Long life OOP!
summary: >-
  Reminiscing on coding approaches and application architecture patterns
  introduced and popularized by AngularJs 1.x framework in the front-end community.
  Framework itself is gone and dusted, but its legacy is very much alive.
---

Everyone knows _AngularJs_ (version 1.x) is
[done and dusted](https://trends.google.com/trends/explore?date=all&q=angularjs)!
Why write anything about it today, in 2021?

Well, the reason is pretty simple - history moves in spirals and things we've learned yesterday
shape today and tomorrow.

Knowledge of prior frameworks and related tooling comes "for free" if you've been in the industry
for long enough and used those them on a daily basis. However, if you are a newcomer - almost
certainly you won't have that _historical_ perspective.
Usually when starting our development careers we work with popular tools of today.
Unless, of course, you were unlucky enough to join the team supporting huge legacy codebase.

Absence of historical knowledge doesn't hurt in the short run does limit your growth rate in the
long run.

_Any framework as in itself can be seen as a coding pattern. Or, usually, quite a few of those._

Let's not forget that _AngularJs_ was the default framework of choice for
single-page applications for quite a few years:
[from 2014 to 2018](https://trends.google.com/trends/explore?date=all&q=angularjs,react).
Such applications (especially in the enterprise world) tend to hang around for a while after
they had been written and released. I believe even today **thousands** of UI engineers across
the world maintain and develop AngularJs apps. In fact, some of them could be working on
migrating those apps to newer frameworks right now - lets pause here for a second and wish
them luck!

LTS support for _AngularJs_ got extended till the end of 2021 due to
the Covid and even after that no one would stop you from forking the repo and applying bug-fixes
your team deems necessary.

In this post I want to list concepts/approaches which are introduced in _AngularJs_ and worked
really well for the huge and properly designed enterprise UI app over the span of seven years.
To me that sounds like a huge seal of approval (for the framework).

### Good parts of AngularJs framework
1. dependency injection
   - very basic but still modules (`.config` and `.run` phases), instantiation of factories
     and services
   - unit tests mocking mechanism
   - built-in dependency mocks
2. components(directives) approach
   - bindings (props) including callbacks
   - lifecycle hooks
   - transclusion (projection/`props.children`)
   - `require` for "protected" communication between components
   - separation of component logic from the template (with template live-loading support)
   - event bus
3. built-in forms library
   - two-way bindings
   - parsers, formatters, validators
   - getters and setters for `ng-model` values
   - creating objects on the fly when `a.b.c` is being passed as `ng-model` attribute value
4. digest loop (change detection) which in 95% of cases doesn't require developer to use any
   special syntax, particular data management approach or to rely on lifecycle hooks.
   - various tools to hook up to it when required (i.e. from other libraries, such as D3)
5. being an OOP oriented framework. I believe OOP concepts are more complex and, I dare to say,
   versatile in comparison to Functional programming concepts.
6. decent development documentation. Not ideal but good enough.

Want to add that definition of technological *good* was quite different in 2014 (and _AngularJS_
itself was designed much earlier than that). I.e. module system of _AngularJs_ is
definitely inferior to the one used today in Angular. And as far as I'm concerned that's
totally fine cause lessons learned from that version of DI are still very valuable and
for the most part do apply to the future generations of UI applications and frameworks.
