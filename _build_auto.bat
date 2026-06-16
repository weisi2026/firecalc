@echo off
cd /d D:\Software\FreeAgent_text\sites\firecalc
call npm run build > build_output.txt 2>&1
echo BUILD_DONE >> build_output.txt