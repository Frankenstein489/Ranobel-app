#!/usr/bin/env python3
"""
build-apk.py

Rebuilds the Android APK for Ranobel after code/content changes.

Usage:
    python scripts/build-apk.py               # debug build (default)
    python scripts/build-apk.py --release      # release/signed build
    python scripts/build-apk.py --install-deps # run "npm install" first (use after pulling new packages)

What it does, in order:
    1. (optional) npm install
    2. npm run build          -> regenerates the static Next.js export
    3. npx cap sync android   -> copies the fresh build into the Android project
    4. gradlew assembleDebug (or assembleRelease)

Stops immediately and prints the error if any step fails.
Works on Windows, macOS, and Linux — paths are resolved relative to this
script's location, so the project can live anywhere on disk.
"""

import argparse
import subprocess
import sys
from pathlib import Path

# scripts/build-apk.py -> project root is one directory up
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ANDROID_DIR = PROJECT_ROOT / "android"
IS_WINDOWS = sys.platform.startswith("win")
GRADLEW = "gradlew.bat" if IS_WINDOWS else "./gradlew"


def run(cmd, cwd):
    """Run a command, streaming output live. Exit the script if it fails."""
    print(f"\n{'=' * 60}")
    print(f"Running: {cmd}")
    print(f"In:      {cwd}")
    print(f"{'=' * 60}\n")

    result = subprocess.run(cmd, cwd=cwd, shell=True)

    if result.returncode != 0:
        print(f"\n❌ Step failed: {cmd}")
        print("Fix the error above, then re-run this script.")
        sys.exit(result.returncode)


def main():
    parser = argparse.ArgumentParser(description="Rebuild the Ranobel APK.")
    parser.add_argument(
        "--release",
        action="store_true",
        help="Build a signed release APK instead of a debug APK.",
    )
    parser.add_argument(
        "--install-deps",
        action="store_true",
        help="Run 'npm install' first (use after adding/updating packages).",
    )
    args = parser.parse_args()

    if not PROJECT_ROOT.exists():
        print(f"❌ Project folder not found: {PROJECT_ROOT}")
        sys.exit(1)

    if not ANDROID_DIR.exists():
        print(f"❌ Android project not found at: {ANDROID_DIR}")
        print("Run 'npx cap add android' from the project root first.")
        sys.exit(1)

    if args.install_deps:
        run("npm install", cwd=PROJECT_ROOT)

    run("npm run build", cwd=PROJECT_ROOT)
    run("npx cap sync android", cwd=PROJECT_ROOT)

    if not IS_WINDOWS:
        run("chmod +x gradlew", cwd=ANDROID_DIR)

    gradle_task = "assembleRelease" if args.release else "assembleDebug"
    run(f"{GRADLEW} {gradle_task}", cwd=ANDROID_DIR)

    build_type = "release" if args.release else "debug"
    apk_path = (
        ANDROID_DIR
        / "app"
        / "build"
        / "outputs"
        / "apk"
        / build_type
        / f"app-{build_type}.apk"
    )

    print("\n✅ Build complete!")
    print(f"APK location: {apk_path}")
    print("\nInstall it on your phone with:")
    print(f'  adb install "{apk_path}"')
    print("(or copy the file to your phone and tap it, with 'Install unknown apps' allowed)")


if __name__ == "__main__":
    main()
