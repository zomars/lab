import React, { ReactElement } from 'react';
import { IconButton } from '@mui/material';

import {
  GitHub as GutHubIcon,
  LinkedIn as LinkedInIcon,
  Mail as MailIcon,
} from '@mui/icons-material';

import { cn } from '@bem-react/classname';
import { LighthouseIcon } from '../LighthouseIcon/LighthouseIcon';

const cnFooter = cn('Footer');

// this import doesn't really work for SSR build
// have same import in globals.scss
import './Footer.scss';

export const Footer = (): ReactElement => {
  return (
    <footer
      data-testid = { cnFooter() }
      className = { cnFooter() }
    >
      <div className = { cnFooter('Wrapper') }>
        <div className = { cnFooter('Item') }>
          <IconButton
            href = 'https://github.com/amalitsky/lab'
            component = 'a'
            aria-label = 'GitHub'
            data-testid = { cnFooter('Icon') }
          >
            <GutHubIcon/>
          </IconButton>
          <IconButton
            component = 'a'
            target = '_blank'
            aria-label = 'Lighthouse CI'
            rel = 'nofollow'
            href = 'https://lab-lhci.herokuapp.com/app/projects/amlab/dashboard?branch=main'
            data-testid = { cnFooter('Icon') }
          >
            <LighthouseIcon/>
          </IconButton>
          <IconButton
            target = '_blank'
            href = 'https://www.linkedin.com/in/amalitsky/'
            component = 'a'
            aria-label = 'LinkedIn'
            data-testid = { cnFooter('Icon') }
          >
            <LinkedInIcon/>
          </IconButton>
          <IconButton
            href = 'mailto:mail@amalitsky.com'
            component = 'a'
            aria-label = 'Mail'
            data-testid = { cnFooter('Icon') }
          >
            <MailIcon/>
          </IconButton>
        </div>

        <div
          data-testid = { cnFooter('JoyNote') }
          className = {
            cnFooter('Item', {
              muted: true,
              'joy-note': true,
            })
          }
        >
          { '\u2665' } Built with joy, Gatsby, React, TypeScript and GraphQL { '\u2665' }
        </div>

        <div
          className = { cnFooter('Item', { muted: true }) }
          data-testid = { cnFooter('Copyright') }
        >
          { ' \u00A9 ' }
          { new Date().getFullYear() }
        </div>
      </div>
    </footer>
  );
};
