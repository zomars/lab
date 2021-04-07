set -e

[ -d "$PR_ID" ] && rm -rf "$PR_ID"

mkdir "$PR_ID"

cp -r public/* "$PR_ID"

scp -i ~/.ssh/mt_icode -r "$PR_ID" icode.ru@icode.ru:~/domains/staging.amalitsky.com/html/PR
