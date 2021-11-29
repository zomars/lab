import React, {
  ReactElement,
  SyntheticEvent,
  useContext,
} from 'react';

import { snakeCase } from 'lodash';
import { cn } from '@bem-react/classname';
import { Tab, Tabs } from '@mui/material';

import { indexPageTag } from '../../../constants';
import { IPostContext, postsContext } from '../../../react-contexts/posts.context';
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

const postUrlRegex = /^\/posts\/.+$/;

const cnHeaderTabs = cn('HeaderTabs');

/**
 * Return list of tabs. On small screens show active tab only.
 */
function getMenuTabs(
  selectedTabPath: string | false,
  activeTabOnly = false,
  onChange: (event: SyntheticEvent, path: string) => void,
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

    // need this hack to support nested pages
    // so that the corresponding header tab which is active
    // takes user to the root of category on click
    // https://github.com/mui-org/material-ui/blob/0da2f4a39e1821d76c93ae198d440e5082b10f78/packages/mui-material/src/Tab/Tab.js#L167-L175
    const onClick = (event: SyntheticEvent): void => {
      if (isActive) {
        onChange(event, path);
      }
    };

    tabs.push(
      <Tab
        data-testid = { completeTestId }
        className = { cnHeaderTabs('Tab') }
        key = { name }
        value = { path }
        label = { name }
        onClick = { onClick }
      />
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
  posts: IPostContext,
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
    const { postsPerTag } = posts;

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
    onTabSelection,
    vertical,
  } = props;

  const posts = useContext(postsContext);

  const selectedTabPath = getSelectedTabPath(activePath, posts);

  // see comment about regarding onClick passed to getMenuTabs
  function onChange(event: SyntheticEvent, path: string): void {
    onTabSelection(path);
  }

  return (
    <Tabs
      className = { cnHeaderTabs() }
      orientation = { vertical ? 'vertical' : 'horizontal' }
      value = { selectedTabPath }
      onChange = { onChange } // regular 'change' support
      indicatorColor = 'secondary'
      textColor = 'inherit'
    >
      { getMenuTabs(selectedTabPath, activeTabOnly, onChange) }
    </Tabs>
  );
}
