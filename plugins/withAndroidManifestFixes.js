const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Applies two AndroidManifest.xml fixes that cannot be expressed in app.json:
 *
 * Fix 1 — android:enableOnBackInvokedCallback="false"
 *   Disables Android 13+ predictive back gesture at the app level.
 *   app.json has no field for this; a manifest mod is the correct approach.
 *
 * Fix 2 — .auth.LoginActivity and .auth.SignupActivity
 *   These are REAL native Kotlin/Jetpack Compose activities (LoginActivity.kt,
 *   SignupActivity.kt) living in android/app/src/main/java/.../auth/.
 *   They must be declared in AndroidManifest or the app will crash on launch.
 *   Note: <activity> elements correctly belong inside <application> per the
 *   Android spec — this is the right XML structure.
 *
 * Safety measures:
 *   1. Idempotency — each fix checks before applying.
 *   2. Defensive null checks on the activity array.
 *   3. No string manipulation — uses the parsed XML object tree.
 */
const withAndroidManifestFixes = (config) => {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application[0];

    // ── Fix 1: disable predictive back gesture ───────────────────────────────
    // Idempotent: setting the same value twice is harmless.
    application.$['android:enableOnBackInvokedCallback'] = 'false';

    // ── Fix 2: declare native auth activities ────────────────────────────────
    // <activity> elements belong inside <application> — this is Android spec.
    if (!application.activity) {
      application.activity = [];
    }

    const activities = application.activity;
    const requiredActivities = ['.auth.LoginActivity', '.auth.SignupActivity'];

    requiredActivities.forEach((shortName) => {
      // Idempotency: skip if already declared (handles re-running prebuild)
      const alreadyDeclared = activities.some(
        (a) => a.$['android:name'] === shortName
      );
      if (!alreadyDeclared) {
        activities.push({ $: { 'android:name': shortName } });
      }
    });

    return mod;
  });
};

module.exports = withAndroidManifestFixes;
