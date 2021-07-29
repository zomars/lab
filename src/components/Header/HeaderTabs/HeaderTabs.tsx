import React, { ReactElement } from 'react';
import { snakeCase } from 'lodash';
import { cn } from '@bem-react/classname';
import { Tab, Tabs } from '@material-ui/core';

import { indexPageTag } from '../../../constants';
import { IPostContext } from '../../../react-contexts/posts.context';
import { getPostListUrlByTag } from '../../../services/urls.service';

import './HeaderTabs.scss';

interface ISection {
  name: string;
  path: string;
  testId: string;
  tag?: string;
}

const topSections = [
  {
    name: 'Tech',
    tag: 'tech',
  }, {
    name: 'Cars',
    tag: 'cars',
  }, {
    name: 'Sources',
    path: '/sources/',
  }, {
    name: 'About',
    path: '/about/',
  },
] as ISection[];

topSections.forEach((section: ISection) => {
  section.testId = snakeCase(section.name);

  const { tag } = section;

  if (tag) {
    section.path = getPostListUrlByTag(tag);
  }
});

const postUrlRegex = /^\/blog\/posts\/.+$/;

const cnHeaderTabs = cn('HeaderTabs');

/**
 * Return list of tabs. On small screens show active tab only.
 */
function getMenuTabs(
  selectedTabPath: string | false,
  activeTabOnly = false,
): ReactElement[] {
  const tabs = [];

  for (const section of topSections) {
    const { name, path, testId } = section;

    const isActive = path === selectedTabPath;

    if (activeTabOnly && !isActive) {
      continue;
    }

    const completeTestId = cnHeaderTabs('Tab', {
      active: isActive,
      [testId]: true,
    });

    tabs.push(
      <Tab
        data-testid = { completeTestId }
        className = { cnHeaderTabs('Tab') }
        key = { name }
        value = { path }
        label = { name }
      >
      </Tab>
    );
  }

  return tabs;
}

/**
 * Return selected/active tab path.
 *
 * There are three cases:
 *  - full and partial match
 *  - index page (tech posts, page 1)
 *  - match post page (when applicable) to the tag post list
 *
 * Return 'false' when there is no match.
 */
function getSelectedTabPath(
  activePath: string,
  postsContext: IPostContext,
): string | false {
  for (const section of topSections) {
    const { path } = section;

    if (activePath.startsWith(path)) {
      return path;
    }
  }

  if (activePath === '/') {
    return getPostListUrlByTag(indexPageTag);
  }

  if (postUrlRegex.test(activePath)) {
    const { postsPerTag } = postsContext;

    for (const section of topSections) {
      const { tag } = section;

      // if post belongs to more than one top-level tags
      // first match will get highlighted in the header
      if (tag && postsPerTag.has(tag)) {
        const postPaths =
          postsPerTag.get(tag)!
            .map(({ fields: { slug } }) => slug);

        if (postPaths.includes(activePath)) {
          return section.path;
        }
      }
    }
  }

  return false;
}

interface IHeaderTabsProps {
  activePath: string,
  postsContext: IPostContext,
  onTabSelection: (selectedPath: string) => void,
  activeTabOnly?: boolean,
  vertical?: boolean,
}

/**
 * Return list of tabs.
 * On small screens show active tab only.
 */
export function HeaderTabs(props: IHeaderTabsProps): ReactElement {
  const {
    activePath,
    activeTabOnly = false,
    postsContext,
    onTabSelection,
    vertical,
  } = props;

  const selectedTabPath = getSelectedTabPath(activePath, postsContext);

  return (
    <Tabs
      className = { cnHeaderTabs() }
      orientation = { vertical ? 'vertical' : 'horizontal' }
      value = { selectedTabPath }
      onChange = { (event, path) => onTabSelection(path) }
    >
      { getMenuTabs(selectedTabPath, activeTabOnly) }
    </Tabs>
  );
}
