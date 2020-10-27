@echo off
echo Deleting test\tests\screenshots\input_04.png
del C:\src\qbs\test\tests\screenshots\input_04.png
echo Renaming C:\src\qbs\test\tests\screenshots\input_04_new.png
move C:\src\qbs\test\tests\screenshots\input_04_new.png C:\src\qbs\test\tests\screenshots\input_04.png