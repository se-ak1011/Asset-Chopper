const fs = require('fs');
const path = require('path');

const MARKER = '# AssetChopper: disable fmt consteval for newer Xcode clang';

function patchPodfile(contents) {
  if (contents.includes(MARKER)) {
    return contents;
  }

  const snippet = `\n    ${MARKER}\n    installer.pods_project.targets.each do |target|\n      next unless target.name == 'fmt'\n\n      target.build_configurations.each do |config|\n        defs = config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']\n        defs = [defs] unless defs.is_a?(Array)\n        defs << 'FMT_USE_CONSTEVAL=0' unless defs.include?('FMT_USE_CONSTEVAL=0')\n        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] = defs\n      end\n    end\n`;

  const reactNativePostInstall = /(^\s*react_native_post_install\([\s\S]*?\n\s*\))/m;
  if (reactNativePostInstall.test(contents)) {
    return contents.replace(reactNativePostInstall, `$1${snippet}`);
  }

  const postInstallEnd = /(post_install do \|installer\|[\s\S]*?\n)(\s*end\n)/m;
  if (postInstallEnd.test(contents)) {
    return contents.replace(postInstallEnd, `$1${snippet}$2`);
  }

  return `${contents}\npost_install do |installer|${snippet}end\n`;
}

module.exports = function withFmtConsteval(config) {
  const { withDangerousMod } = require('@expo/config-plugins');
  return withDangerousMod(config, [
    'ios',
    async config => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      const original = fs.readFileSync(podfilePath, 'utf8');
      const patched = patchPodfile(original);
      if (patched !== original) {
        fs.writeFileSync(podfilePath, patched);
      }
      return config;
    },
  ]);
};

module.exports.patchPodfile = patchPodfile;
