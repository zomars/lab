---
title: 'Efficient Code Review'
date: '2021-07-02T10:00:00.000-07:00'
tags: ['tech', 'devflow', 'workflow']
coverImage: './cover.png'
---

During my days at VMware I was reviewing multiple UI code _Pull Requests_
(also known as _Merge Requests_ or _Change Lists_) per day. Changes could have anything from
a small and isolated feature to high scale refactoring spread all over the code base.

Initially I didn't have any specific approach to the reviewing process and was simply going
_file by file, line by line_. However, as number of PRs coming my way grew I couldn't keep up
with them, and felt like the quality of my comments was degrading.

That made me stop and think if there is a better way. And I believe there is one (at least)
which I'd like to share here as well as the reasoning behind it.

### Fruits of the Code Review

Let's start with the basics - how does code review help the team?
I believe good code reviews help to:
- increase the code quality
- preserve code consistency by ensuring that adopted practices are followed
- increase familiarity with the codebase and more importantly share knowledge within the team
- notice recurring coding/logic patterns - something which can be optimized later on
- notice common pitfalls and documentation gaps causing them
- increase visibility of the work progress

Generally speaking to preserve code consistency we use a certain technical stack
(i.e. `React` and `Redux` and some UI kit) and various automated linters/formatters.
Unfortunately, that's not enough.
Not every naming convention can be enforced with `eslint` and no two React+Redux application
architectures are same.
Every app tends to have its own list of coding patterns and best practices which aren't
known to `eslint` or even senior developer which has recently joined your team.

Then every team member has his/her own area of expertise and code reviews facilitate the
knowledge spread. That raises the experience level of the whole team.
For example someone who knows _lodash_ library very well can easily spot
custom code snippets which could
be replaced with _lodash_ methods to make the code _dry_ and more readable.
Another member who has been on the team for a few years can share the knowledge
of the internal library with commonly used utilities to avoid reimplementation and code bloat.

And of course impact of bugs, typos and serious performance bottlenecks resolved before
code is merged can't be overestimated.

The list of code review benefits goes on and on, and it helps to focus on your personal strengths
while reviewing someone else's changes. Your unique experience and expertise might give the story
reviewed an unexpected but valuable twist.

Also, good code reviewing process is in fact a two-way road - it is supposed to be as
beneficial to the reviewer as it is to the author of changes.

### What Makes Code Review Efficient

To improve any process we need to come up with parameters we can (ideally) measure
and track over the time, to make sure we are ot the right track.

#### Efficiency Parameters

- _value_: things improved based on the review: typos, incomplete solutions, poor architecture,
  bugs, inefficient code blocks, conventions not followed, etc. *Disclaimer: things listed
  aren't equal in their value*
- concepts, approaches and patterns learned by all parties involved in the process
- *review pending* time. Obviously the shorter it is, the better.
- time (and effort) spent by the reviewer on reading, analyzing and commenting on the code as well
  time spent by the author on evaluating the feedback, commenting back or/and introducing changes
- quality of communication between the author and reviewer(s). Another way of saying that code
  review process should not induce any tension.
- number of review-update cycles (as well as time spent on them) before PR is merged
- number of *issues* opened in the tracker - not everything has to be fixed or improved right away

Maximizing _value_ of the review is a very complex and broad subject dependent on
the project, a feature under development, team and the reviewer.
Let's focus on the process instead: risks and common pitfalls of the naive line-by-line
code reviewing process.

#### Common Pitfalls

Let's face it - reviewing someone's code is not the easiest nor particular enjoyable activity. It
requires fairly deep understanding of the original intent, suggested implementation and at least
some idea on pieces involved and/or related to proposed changes. It also requires an inner strength
and certain skill to question someone else's solution and ask difficult questions without being
aggressive or negative. Very often you would see or, indeed, write an approving review highlighting
some syntactic issues and a few typos. It would look _real_  but unfortunately would not provide
a lot of _value_.

Another risk is to focus on implementation details instead of overall solution architecture.
For instance reviewing an authentication service implementation is useless when such a service
already exists in the codebase but PR author was not aware of it.
Another suboptimal approach example would be reviewing the code of UI components before
understanding the whole tree of components and components API (props/bindings).

Thorough implementation review without at least some understanding of the whole picture is
all but impossible and even useless in case if the solution architecture (design) has
to be significantly altered.

And of course the backbone of any review is communication. It could be comments on the code
review system web page, follow-up messages on slack or in-person meeting (which in fact is
preferred for complex cases). Regardless of the form, it is important to stay focused on the
task. You have to be ready to explain logic and thinking behind any of your comments.
Needless to say reviews are there not to exercise (or build) your authority and not every
decision has to be mutually agreed upon. It's ok to agree to disagree after you've exchanged
opinions and _understood_ positions of each other.

### Top-Down Review Process

As you might have guessed at this point, code review would better be performed in the
top-down fashion.
Once you understand the intent and limitations of the task you can to go over the list
of changed files to build the _bird-view_ mental map of the proposed solution.

#### Dependency Graph and Top Level Solution Architecture

![California State Strava HeatMap](./state.png "Courtesy of Strava")

First, we will be looking at file names, folder structure, file-level comment blocks, `import`,
`extend` and `implements` statements. We don't need to read the code of every file but might
search for public methods of services and component bindings/props.

For huge PRs it is usually easier to start with more abstract entities. We are
building the dependency graph in our head. To simplify it we can group some tightly related
nodes together, i.e. abstract class and it's implementations or parent component and it's child
components (if those aren't used anywhere else).

We will be answering following questions:
- Does this *tree* of components/classes/services make sense? How well does it align with existent
  trees and common design approaches?
- Do all the nodes appear to be justified (useful and reasonable)? I.e. if new service is used by
  one component (or another service) only - do we really need that service?
  *Maybe we do because next ticket of the same Epic will introduce another component relying on
  a new service being suggested.*
- Filenames and service/class/constants/component names - do they follow accepted
  conventions and how well do they communicate the functionality provided?
  _Often the clarity of naming and file-level
  comments is inversely proportional to the mental effort you spend on
  the first stage of the review._

#### Public API Surface and Low Level Architecture

![Northern California State Strava HeatMap](bay-area.png "Courtesy of Strava")

The next step is to look into *public APIs* and usage patterns of components and services.
Implementation of those doesn't matter just yet but method signatures and names do.
We will check from where and when these methods are getting called (and components rendered)
for better understanding of respective scenarios.

Here we are evaluating:
- Components tree: are components small enough but not _too small_?
- Components API
    - what exactly is being passed as props and if that is justified and concise enough
    - what is the callbacks/actions payload
- Services API: public methods signatures, if these have to be exposed as public, etc.
- How well is communication between components and services organized?
- Do we have pre-existent pieces which could have been modified and used instead of introducing
  new ones?
  _In order to follow single responsibility and DRY principles._
- Is test coverage present and sufficient? Especially for reusable services and components
  which generally require the highest test coverage.
- Does the proposed solution appear *complete* from user experience perspective?
  Examples of incomplete solutions I came across:
  - an object creation flow is implemented, but subsequent edits are not (even though available in UI)
  - a new user role type is added in one place (i.e. user role modal) but not in the
    UI authentication/authorization service (which is affected by the change)
- Folder and module/package structure - do all the pieces fall into places they belong?

Once the implementation graph and relations between nodes are clear we can
move on to review implementation details.

#### Implementation Details

![San Francisco Strava HeatMap](SF.png "Courtesy of Strava")

On the last and most laborious stage we will check for the proper usage of pre-existent
libraries, utilities and ES/TS language features. Basically we don't want to re-implement
`_.each` method or `Record` interface every time we need them.

For code changes coming from recent joinees it is extremely important to share the knowledge of
the codebase which they might not yet have - things like module-level
services, abstract classes, style mixins and variables, shared types, optimizations and build
procedures relevant for the functionality introduced.
Even if the external documentation does exist and is relevant (which doesn't
happen very often) initially it is hard to know what to look for.

We will verify code style conventions not covered by linters, such as the substance of
comments, variable namings, internationalization of readable strings as well as
test cases covered, proper clean up on components/service destroy, etc.

Common pitfalls I came across more than once:
- orphan CSS styles left after related components removal or refactoring
- orphan services and classes left after removing components and services which were using those
- files missing from the pull request, i.e. component styles or an html file
- random files accidentally added to the pull request

The main advantage of the top-down review approach is the fact that
we do the most impactful and scalable checks (a list of files is always
shorter than a list of lines changed) first. And by doing so reduce the
risk of wasting everyone's time and effort.

### Aspects not Covered (Taken as Granted)

We invented computers to simplify our lives.
Whatever can be automated needs to be automated.
In relation to code review we can automate builds, test runs, code linting,
various reports, etc.
All these help the author to make sure his/her code is fine before the review
and at same time significantly reduce the mental load of the reviewer.

As reviewers, we do not *have* to manually test the functionality delivered -
there should be a certain level of trust and professionalism in the team which
makes *it works* a safe assumption for every code change coming your way.
Said that more often than not automated UI builds do help to understand the
functionality and behavior suggested in the pull request (and sometimes catch a bug).

### Conclusion

Code reviews are complex and demanding, but the result is well worth the effort.
The above three-stage technique significantly reduced the time and effort I'm
spending on reviews and greatly improved my comments quality
(simultaneously reducing their quantity).
It feels simpler too hence now I tend to procrastinate less before jumping on to the next review.
