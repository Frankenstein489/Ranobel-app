import os
import re
import sys

BASE_CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'content')

def get_latest_chapter(content_dir):
    if not os.path.exists(content_dir):
        print(f'ERROR: Folder not found -> {content_dir}')
        print('Make sure you have:')
        print('  1. Created the folder under content/')
        print('  2. Registered the novel in novels.config.ts')
        sys.exit(1)
    files = os.listdir(content_dir)
    nums = [int(m.group(1)) for f in files if (m := re.match(r'^chapter-(\d+)\.md$', f))]
    return max(nums) if nums else 0

def create_next_chapters(novel_id, count=5):
    content_dir = os.path.join(BASE_CONTENT_DIR, novel_id)
    latest = get_latest_chapter(content_dir)

    print(f'Novel   : {novel_id}')
    if latest > 0:
        print(f'Latest  : chapter-{latest}.md')
    else:
        print('Latest  : No chapters yet — starting from chapter-1.md')
    print(f'Creating: {count} new chapter(s)')
    print()

    for i in range(1, count + 1):
        n = latest + i
        path = os.path.join(content_dir, f'chapter-{n}.md')
        if os.path.exists(path):
            print(f'SKIP   : chapter-{n}.md already exists')
            continue
        with open(path, 'w') as f:
            f.write(
                f'# Chapter {n}\n\n'
                f'---\n\n'
                f'\n\n'
                f'---\n\n'
                f'## New Words This Chapter\n\n'
                f'| English | Korean | Romanization | Type |\n'
                f'|---------|--------|--------------|------|\n'
            )
        print(f'CREATED: chapter-{n}.md')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python scripts/create_chapters.py <novel-id> [count]')
        print()
        print('Examples:')
        print('  python scripts/create_chapters.py lord-of-mysteries')
        print('  python scripts/create_chapters.py lord-of-mysteries 10')
        print('  python3 scripts/create_chapters.py slime')
        sys.exit(1)

    novel_id = sys.argv[1]
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    create_next_chapters(novel_id, count)
