const {
  PR_ID: prId,
  gh_action_name: ghActionName,
  TEST_PUBLIC: testPublic,
  LHCI_GITHUB_TOKEN: lhciGithubToken,
} = process.env;

let hostname = 'localhost';
let protocol = 'https';
let staticDistDir;

let uploadConfig = {
  target: 'lhci',
  serverBaseUrl: 'https://lab-lhci.herokuapp.com',
  githubToken: lhciGithubToken,
};

const fileSystemUploadConfig = {
  target: 'filesystem',
  outputDir: 'lhci-reports',
};

if (prId) {
  // github action run
  hostname = `pr${ prId }--amlab.netlify.app`;
} else if (ghActionName === 'master_update') {
  // master update (merge) run
  hostname = 'labs.amalitsky.com';
} else if (testPublic) {
  hostname = 'labs.amalitsky.com';
  uploadConfig = fileSystemUploadConfig;
} else {
  staticDistDir = 'public';
  protocol = 'http';
  uploadConfig = fileSystemUploadConfig;
}

const urlPrefix = `${ protocol }://${ hostname }`;

const urls = [
  '/',
  '/posts/2021/audi-s4-seats-into-gti/',
  '/posts/2021/optimize-github-actions-with-cache/',
];

const config = {
  ci: {
    collect: {
      url: urls.map(url => `${ urlPrefix }${ url }`),
      numberOfRuns: 2,
      staticDistDir,
      settings: {
        configPath: 'lighthouse.config.js',
      },
    },
    assert: {
      preset: 'lighthouse:no-pwa',
    },
    upload: uploadConfig,
  },
};

module.exports = config;
