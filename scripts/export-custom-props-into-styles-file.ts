import { writeFile as fsWriteFile } from 'fs';
import { join } from 'path';

import {
  customCssPropsMap,
  TCssPropValue,
} from '../src/utils/create-custom-props-map-from-theme';

const path = join(__dirname, '../src/styles/theme-custom-props.css');

/**
 * Generate string content for CSS file with custom properties.
 */
function generateCssContent(propsMap: Map<string, TCssPropValue>): string {
  let res = ':root {\n  ';

  const propsLines = Array.from(
    propsMap.entries(),
  ).map(([key, value]: [string, TCssPropValue]): string => {
    return `--aml-${key}: ${value};`;
  });

  res += propsLines.join('\n  ');
  res += '\n}';

  return res;
}

/**
 * Save content to file.
 */
function writeCssFile(path: string, content: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    fsWriteFile(path, content, (err: Error|null) => {
      if (err) {
        reject(err);

        return;
      }

      resolve(true);
    });
  });
}

const content = generateCssContent(customCssPropsMap);

writeCssFile(path, content)
  .catch(
    (error: Error) => console.log(error)
  );
