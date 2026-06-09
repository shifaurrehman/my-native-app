const { withMainActivity } = require('@expo/config-plugins');

/**
 * Injects RNScreensFragmentFactory setup into MainActivity.kt.
 *
 * WHY this is needed:
 *   react-native-screens v4.x requires the app to set a custom FragmentFactory
 *   so it can restore screen fragments after process death. Without this, back
 *   stack restoration silently crashes on Android.
 *
 * WHY a plugin (not manual):
 *   react-native-screens ships NO Expo config plugin of its own (verified).
 *   This must be done via withMainActivity.
 *
 * Safety measures:
 *   1. Idempotency guard — exits immediately if already patched.
 *   2. Regex with capture group — preserves exact indentation.
 *   3. Anchored import injection — targets the specific ReactActivity import line.
 */
const withRNScreens = (config) => {
  return withMainActivity(config, (mod) => {
    let contents = mod.modResults.contents;

    // ── Idempotency guard ────────────────────────────────────────────────────
    // If already patched in a previous prebuild, do nothing.
    if (contents.includes('RNScreensFragmentFactory')) {
      return mod;
    }

    // ── Step 1: Inject import ────────────────────────────────────────────────
    // Target the ReactActivity import which is always present in Expo's template.
    const rnScreensImport =
      'import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory';

    contents = contents.replace(
      /^(import com\.facebook\.react\.ReactActivity)$/m,
      `$1\n${rnScreensImport}`
    );

    // ── Step 2: Inject fragmentFactory setup before super.onCreate ───────────
    // Regex capture group ($1) preserves the exact whitespace/indentation.
    contents = contents.replace(
      /(\s+)super\.onCreate\(savedInstanceState\)/,
      '$1supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()' +
      '\n$1super.onCreate(null)'
    );

    mod.modResults.contents = contents;
    return mod;
  });
};

module.exports = withRNScreens;
