
if [ "$1" = "ding" ]
then
  bra="fq-gift-d-online"
elif [ $1 = "n" ]
then
  bra="fq-gift-n-online"
elif [ $1 = "test" ]
then
  bra="fq-gift-n-test"
else
  bra="fq-gift-d-test"
fi

target="../ding-fq-web-dist/dist"

#获取最新打包文件
echo "开始获取最新打包文件..."
cd ../ding-fq-web-dist/
git checkout $bra
git pull origin $bra
cd ../ding-fq-gift/

# echo "打包完成！开始同步..."
rm -rf $target
mkdir $target
cp -rf dist/* "$target/"
echo "同步结束！开始push..."
cd ../ding-fq-web-dist/
git checkout $bra
git pull origin $bra
git add .
git commit -m "build $bra"
git push origin $bra
cd ../ding-fq-web/
echo "push结束"