@echo off
echo Deleting test\tests\screenshots\print_01.png
del C:\src\qbs\test\tests\screenshots\print_01.png
echo Renaming C:\src\qbs\test\tests\screenshots\print_01_new.png
move C:\src\qbs\test\tests\screenshots\print_01_new.png C:\src\qbs\test\tests\screenshots\print_01.png