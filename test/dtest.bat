@echo off
echo Deleting test\tests\screenshots\paint_03.png
del C:\src\qbs\test\tests\screenshots\paint_03.png
echo Renaming C:\src\qbs\test\tests\screenshots\paint_03_new.png
move C:\src\qbs\test\tests\screenshots\paint_03_new.png C:\src\qbs\test\tests\screenshots\paint_03.png