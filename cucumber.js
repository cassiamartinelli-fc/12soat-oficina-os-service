module.exports = {
  default: {
    require: ['features/steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    paths: ['features/**/*.feature'],
    format: ['progress-bar', 'html:coverage/cucumber-report.html'],
  },
};
