---
title: 'Performance Budget on a Budget - Bundle Size Report'
date: 2022-04-05T10:00:00-07:00
tags: ['tech', 'devflow', 'workflow', 'performance', 'ci']
summary: >-
  Let's get hold of files loaded during the initial rendering of our UI application or website.
  We will design a node script to print a bundle size report with the list and sizes of
  those files grouped by type.
  By adding script to the CI pipeline we will be able to track bundle size
  changes on every build (or pull request).
  We will also briefly go through the definition of UI application performance and
  things which can be measured and improved to make it better.
published: false

---

**remote files**
**url we check**
**build cache**
**remote files**
**more files than just the initial load**
**yargs for script params**

Quite often performance of a single page application or regular website goes unnoticed
for a very long time.
Backlog with new features and bugs keeps getting longer and UI team growth often lags behind.
And then there is a support request or even a customer call for that
particular _heavy_ page or simply an unstable or slow internet connection.
Scrolling through the Chrome Dev Tools _Network_ tab on a shared customer's screen
could make the most experienced engineer blush.

Worse yet, tuning performance of a big and complex application which is live
(and sometimes doesn't have adequate test coverage) is a daunting proposition.
So, unsurprisingly, it's better to start early.

This is the first article of the _Performance Budget on a Budget_ series, and today we
will start with (arguably) the simplest approach there is.
We will be measuring the size of files loaded by the user on the first
application/website visit in a synchronous (affecting the page rendering) fashion.

## UI Performance? What's That?
But before we dig into details let's stop for a second and think what matters
the most in terms of application performance and how it can be measured and acted upon.

### First, We Need to Send It Over the Wire
Regardless of the UI framework and application architecture user has to get HTML and various
related resources from the server to his/her device - laptop or mobile phone.
Common sense tells us that less content you send over the wire faster the application will
be ready for use.
We have three major variables we can measure and, potentially, improve -
what we send, when and how.

### Then It Will be Processed on the (Unknown) User's Device
Once resources are loaded they have to be uncompressed, parsed, transpiled and rendered
before UI becomes fully operational (interactive).
Generally, less content you send less time browser needs to spend arranging it.
But even with a small snippet of a flawed javascript code you can "successfully"
block HTML rendering or full page interactivity for the considerable amount of time.

### Runtime Valley
Points mentioned above are especially important during the initial application (or website)
load, but they still apply even when application is up and running since we load more
resources going through website pages or application states.
We have to keep an eye on the memory consumption, garbage collection and
cancelling API calls which aren't relevant for the current application state.
Also, we better make sure that computation-heavy algorithms we use on the page
(usually found in data-heavy pages, i.e. charts) would clear at least some of
big-tech whiteboard interview sections and, more importantly,
work reasonably well on older end user devices.

## There is no Bandwidth to Waste
Enough of theory now, let's see what we can do with the minimal effort to get on the
_high application performance_ track.

Let's capture the list and size of files loaded by our website or application
initially, group them into categories (scripts, styles, html, etc.) and track
changes between builds by adding our node script into the CI pipeline.

Once implemented it will allow us to:
1. Be aware what the app/website bundle shape and size is just looking at the
   _bundle size_ report.
2. Prevent unintended size increases. For instance - when updating dependencies or
  modifying our bundler config file.
3. Get a motivation boost every time significant chunk of code is removed from the codebase.
  I.e. after third party dependency update or deprecated application functionality phase out.
  _PRs removing swaths of code are my personal favourites!_

### List of Files To Watch
We need to track _index.html_ itself, fonts, javascript and style files loaded
(and usually parsed) synchronously.
For javascript, that's all `script` tags without `async` or `defer` attribute.
And for CSS that's all not-inlined CSS files.

To get the exact list of files for your application or website check the
_Networks_ DevTools tab on the initial page load with _caching_ turned off.
Generally speaking, files loaded before the `load` event is fired are the ones to track.

**TODO: Networks tab screenshot with Load event highlighted**

Usually website and SPAs have `build` npm script which populates the `public` or `dist`
folder with a bunch of static HTML, JS and CSS files ready for deployment.

We will write a node script which goes through the _hardcoded_ list of files in
`dist` folder and prints (or saves to file) plain text or json report with
their respective sizes.

If _hardcoded list of files_ raised you eyebrows - good, since it should have! :)

Of course, we don't want to hardcode exact file names which usually include
_[content hashes](https://webpack.js.org/guides/caching/#output-filenames)_.
Instead, we will use _[glob patterns](https://github.com/isaacs/node-glob#usage)_
to hardcode our _naming patterns_.

_Naming pattern_ for crucial CSS and JS files used in production doesn't change
very often.
But when it does happen, we will have to update the list of our naming patterns
_manually_.

We could parse the _index.html_ file instead - to retrieve file names from `src`
attributes of `style` and `script` tags but that won't be very reliable nor simple.

**code snippet with file definitions**

### Groups and Sizes

Number of files we care about varies from project to project.
It might help to group files by type for the ease of tracking and analyzing.

Groups I am using for the script are _HTML_, _scripts_, _json_, _CSS_ and _fonts_.
Your project might be loading images or making API calls during the application
instantiation phase.
Feel free to adjust the list of groups and file name patterns for your needs.

**code snippet with groups added**

For every file matching one of our glob patterns script will read the actual file
size and assess it's size after _gzip_ compression.
While actual (uncompressed) file size is useful to track actual file content changes,
compressed size is more representative of the time required to download it.

### Bundle Size Report in Plain Text and JSON Formats

Printing the list of groups and files with their respective sizes in plain text
is a good start.
Even better if we can add into the CI pipeline and post as a comment on every
open pull request.
We can see the fingerprint (snapshot) of the build and track unexpected changes
i.e. when file gone missing or was added unintentionally.

**TODO: add report example**

But it will be fairly hard to track changes between two different builds
(_before_ and _after_ comparison).
Which is very useful to assess the impact of changes we might be working on.

Of course, we can run the script before starting any work and compare it with the report
created before we commit and push our changes.
That requires multiple manual steps however and demands a lot of mental focus.
Which increases the chance of human error or skipping the comparison altogether.

Instead, let's update our script with the ability to export JSON file with the
data captured while analyzing the build.
JSON export file will have the same information as we were printing
in plain text - list of groups, files and their respective content and gzipped sizes.

Now, the last thing to add is the ability to _import_ the _report-to-be-compared-with.json_
when analyzing production build files currently present on the file system.
Ultimately this will print the amount of KBs added or removed next to file size for any
file (and file group) affected.

**TODO: add report with comparison**

Our _bundle size report_ script now looks like this:
- go through the list of file groups with _glob_ naming patterns,
  find matching files and read their sizes from the filesystem
- compute compressed file sizes and totals for groups
- if path to a previous build snapshot was provided also compute file size changes
- print out the plain text report and export it into the json file

### Adding Bundle Size Report to CI Pipeline
_Bundle size report_ script can be added to the CI pipeline to post plain text
report as pull request comment with or without the previous build comparison.

Posting no-comparison report is straightforward - all we have to do is to run our
script after production build is done.

**TBD: Add info on GH actions and comments**

#### Stateful Approach with Remote Storage
Comparison of two builds is a little trickier - if you have a remote server
or another storage for bundle report json files - you could leverage that.

**TBD: rewrite this section**

We can use commit hash as a snapshot id and upload it every time our script runs
through CI pipeline. Then for every open pull request we look for the bundle size
snapshot on the remote server using the commit hash of the parent of our commit.
We would need to handle corner case when parent commit hash won't have a report
associated with it.
That would require some parsing of the commit history and continuous lookup till we find
the most relevant match.
And even then that match could be not the most recent one we actually should be using for
our comparison.
I.e. if the last UI related pull request got merged in without CI pipeline
running or the snapshot file upload failed, etc.

#### Stateless Approach with Running Two UI Builds
Instead, I suggest we go for an easier but slower approach.
On every PR we run the production build and _bundle size report_ twice -
first for the parent commit of our changes (that will be our _before changes_ datapoint).
Then we checkout back to the to top of the branch with our changes and run production
build and _bundle size report_ once again - now with providing our _before changes_ snapshot
for comparison.

That will give us current build snapshot with highlighted difference in file sizes introduced
solely by our changes.

If your production build script is fast and/or is using any kind of
[caching between different builds](/posts/2021/optimize-github-actions-with-cache/),
CI pipeline run time will not increase dramatically.
If that's not the case and incremental UI build are fairly slow, you might have to explore
the stateful option I outlined above.

### Next Steps
- approximate loading time
- reports storage with charts and history

### Conclusion
