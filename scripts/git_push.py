import os
import re
import subprocess
import sys

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'lord-of-mysteries')


def get_latest_chapter():
    files = os.listdir(CONTENT_DIR)
    nums = [int(m.group(1)) for f in files if (m := re.match(r'^chapter-(\d+)\.md$', f))]
    return max(nums) if nums else 0

def run(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.stdout:
        print(result.stdout.strip())
    if result.stderr:
        print(result.stderr.strip())
    if result.returncode != 0:
        sys.exit(result.returncode)

latest = get_latest_chapter()

if len(sys.argv) > 1 and sys.argv[1].strip():
    message = sys.argv[1]
else:
    if latest > 0:
        message = f"uploaded chapter upto {latest}"
    else:
        message = "initial repository update"

run('git add .')
run(f'git commit -m "{message}"')
run('git push origin main')