import os
import re
import sys

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'lord-of-mysteries')

def get_latest_chapter():
    files = os.listdir(CONTENT_DIR)
    nums = [int(m.group(1)) for f in files if (m := re.match(r'^chapter-(\d+)\.md$', f))]
    return max(nums) if nums else 0

def create_next_chapters(count=5):
    latest = get_latest_chapter()
    for i in range(1, count + 1):
        n = latest + i
        path = os.path.join(CONTENT_DIR, f'chapter-{n}.md')
        if os.path.exists(path):
            print(f'SKIP: chapter-{n}.md already exists')
            continue
        with open(path, 'w') as f:
            f.write(f'# Chapter {n}\n\n---\n\n\n\n---\n\n## New Words This Chapter\n\n| English | Korean | | Romanization | Type |\n|---------|--------|------|\n')
        print(f'CREATED: chapter-{n}.md')
if __name__ == '__main__':
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    create_next_chapters(count)
