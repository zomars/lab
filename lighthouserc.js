const {
  pr_id: prId,
  gh_action_name: ghActionName,
  TEST_PUBLIC: testPublic,
  LHCI_GITHUB_TOKEN: lhciGithubToken,
} = process.env;


// s{DELIMITER}{SEARCH_REGEX}{DELIMITER}{REPLACEMENT}{DELIMITER}{SEARCH_REGEX_FLAGS}
const urlReplacementPatterns = [
  's|:[0-9]{3,5}/|:PORT/|',
  // let's treat PR build URLs the same way as public
  's|^https://(lab\.amalitsky\.com|pr-?\\d+--amlab\.netlify\.app)/|lab.amalitsky.com/|',// eslint-disable-line
];

const lhciHostname = 'https://lab-lhci.herokuapp.com';

let hostname = 'localhost';
let protocol = 'https';
let staticDistDir;

let uploadConfig = {
  target: 'lhci',
  serverBaseUrl: lhciHostname,
  githubToken: lhciGithubToken,
  urlReplacementPatterns,
};

const fileSystemUploadConfig = {
  target: 'filesystem',
  outputDir: 'lhci-reports',
};

if (prId) {
  // github action run
  hostname = `pr-${ prId }--amlab.netlify.app`;
} else if (ghActionName === 'main_branch_update') {
  // master update (merge) run
  hostname = 'lab.amalitsky.com';
  // since there is no GH PR page for master_merge run
  delete uploadConfig.githubToken;
} else if (testPublic) {
  hostname = 'lab.amalitsky.com';
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
      numberOfRuns: 5,
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
