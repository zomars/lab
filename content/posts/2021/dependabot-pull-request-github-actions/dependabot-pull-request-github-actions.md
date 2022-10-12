---
title: 'Github Actions for Dependabot PRs'
date: '2021-12-07T10:10:00.000Z'
tags: ['tech', 'github', 'github actions', 'CI', 'automation', 'devflow']
coverImage: './weekend.jpg'
description: >-
  Learn how to extend Pull Request Update GitHub Actions workflow
  with steps (or additional workflows) specific for Dependabot pull requests (i.e. extra labels).
summary: >-
  Let's learn how to extend existent Pull Request Update GitHub Actions workflow
  with steps specific for Dependabot pull requests (i.e. labels).
  We will add two jobs to the existent pull_request workflow and
  experiment with separate "before" and "after" workflow_run event workflows.
  Fortunately, after the recent GitHub actions update we don't need to use a separate
  pull_request_target event workflow as a workaround.
---

In this post I want to explore and walk through options we have to get Dependabot PRs
checked and verified with GitHub actions.

### Context

Setting up [GitHub Dependabot](https://github.blog/2020-06-01-keep-all-your-packages-up-to-date-with-dependabot/)
for the repository was one of the best workflow decisions I ever made.
Return on the modest investment of setting it up is huge.
I don't have to worry about updating dependencies ever again.
Unless, of course, it is a major version update requiring application code changes.

Setting up GitHub actions for Dependabot PRs **was** quite a chore until github
[allowed elevated permissions for the github token and introduced _Dependabot secrets_](https://github.blog/changelog/2021-10-06-github-actions-workflows-triggered-by-dependabot-prs-will-respect-permissions-key-in-workflows/)
 working just like _Action secrets_.

Previously we would have to use `pull_request_target` event workflow as
a workaround for the security sandbox in which all Dependabot PR actions run.
We had to maintain a modified copy of the regular `pull_request` workflow and use some
[discouraged workarounds](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
to gain access to the github token and action secrets.
Fortunately now that is a thing of the past.

Today we can use our regular `pull_request` event workflow with
additional jobs specific for Dependabot PRs. Another thing you need to do is to copy
relevant secrets from action secrets to dependabot secrets.

### Additional jobs

For instance I wanted to add _Ready to merge_ label for every Dependabot PR passing
CI checks.
This allows me to merge them wo looking into code changes or checking the long list of
checks passed. _Yes, there is also an
[auto-merge option](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/automating-dependabot-with-github-actions#enable-auto-merge-on-a-pull-request)
for the brave._

CI checks are performed by the
[original `pull_request` event workflow](https://github.com/amalitsky/lab/blob/master/.github/workflows/pull_request.yml)
and we can simply add another job _to the end of the queue_:

```yaml fileName=dependabot_pr_before.yml
add_label:
  name: Add label
  runs-on: ubuntu-latest

  # use your last CI check step here
  needs: e2e-test

  # sender.login is needed for runs re-triggered from GitHub UI
  if: github.actor == 'dependabot[bot]' || github.event.sender.login == 'dependabot[bot]'

  steps:
    - uses: actions-ecosystem/action-add-labels@v1.1.0
      name: Add label
      with:
        github_token: ${{ github.token }}
        number: ${{ github.event.number }}
        labels: ready to merge
```

Since open PR can be rebased or otherwise updated we better add one more
job to remove potentially stale _Ready to merge_ label before running other jobs.

```yaml fileName=dependabot_pr_after.yml
# have this job run early in the workflow
remove_label:
  name: Remove label
  runs-on: ubuntu-latest

  if: |
    (github.actor == 'dependabot[bot]' || github.event.sender.login == 'dependabot[bot]') &&
    contains(github.event.pull_request.labels.*.name, 'ready to merge')

  steps:
    - uses: actions-ecosystem/action-remove-labels@v1.1.1
      name: Remove label
      with:
        github_token: ${{ github.token }}
        number: ${{ github.event.number }}
        labels: ready to merge
```

### Additional `workflow_run` workflows

Alternatively we can add two more separate _workflows_, triggered via `workflow_run`
of the original `pull_request` workflow.

```yaml
name: Dependabot PR - Before & After

on:
  workflow_dispatch:
  workflow_run:
    # "PR Update" is name of the main CI checks workflow
    workflows: ["PR Update"]
    types:
      - requested
      - completed
```

This allows us to keep CI checks logic separate from Dependabot specific stuff but
does make the setup a little more verbose and complicated.

_Dependabot PR After_ workflow will get triggered on the regular `pull_request` workflow
completion.

It performs two checks - if the the `pull_request` workflow was triggered by the
Dependabot PR and if it had completed successfully.
When both conditions are met it adds _Ready to merge_ label to the Dependabot PR.

_Dependabot PR Before_ runs before the main `pull_request` workflow and removes
potentially stale _Ready to merge_ label from the PR.

Here you can check the code of
[before](https://github.com/amalitsky/lab/blob/master/.github/workflows/depbot_pr_before.yml)
and
[after](https://github.com/amalitsky/lab/blob/master/.github/workflows/depbot_pr_after.yml)
workflows I'm using.

### Conclusion
Setting up CI checks for Dependabot PRs have never been easier.
Nowadays we have two options: additional jobs for the main workflow or separate
workflows running on `workflow_run` event.

Fist one is very straightforward while second one allows to have better separation of concerns.

### References
- GitHub docs:
  [Automating Dependabot with GitHub Actions](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/automating-dependabot-with-github-actions)
- GitHub blog:
  [Use cases for `pull_request_target` event and related security practices](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
- Note on why it used to be so painful in the past:
  [Workflows triggered by Dependabot PRs will run with read-only permissions](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/)
