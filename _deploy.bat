@echo off
cd /d D:\Software\FreeAgent_text\sites\firecalc
call npx -y wrangler pages deploy dist --project-name=firecalc > D:\Software\FreeAgent_text\sites\firecalc\deploy_result.txt 2>&1
echo DONE >> D:\Software\FreeAgent_text\sites\firecalc\deploy_result.txt