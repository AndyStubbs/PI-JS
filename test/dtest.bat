@echo off
echo Deleting test\tests\screenshots\onclick_01.png
del C:\src\qbs\test\tests\screenshots\onclick_01.png
echo Renaming C:\src\qbs\test\tests\screenshots\onclick_01_new.png
move C:\src\qbs\test\tests\screenshots\onclick_01_new.png C:\src\qbs\test\tests\screenshots\onclick_01.png