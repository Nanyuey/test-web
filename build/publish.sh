if [[ $1 = "ding" ]]
then
  packgeBranch='fq-gift-d-online'
  packgeParameter='fq-gift-d-online'
  localName='tomato-activity-prod-d-web'
  publishMethod='prod'
elif [[ $1 = "test-ding" ]]
then
  packgeBranch='fq-gift-d-test'
  packgeParameter='fq-gift-d-test'
  localName='tomato-activity-test-d-web'
  publishMethod='test'
elif [[ $1 = "n" ]]
then
  packgeBranch='fq-gift-n-online'
  packgeParameter='fq-gift-n-online'
  localName='tomato-activity-prod-n-web'
  publishMethod='prod'
elif [[ $1 = "test" ]]
then
  packgeBranch='fq-gift-n-test'
  packgeParameter='fq-gift-n-test'
  localName='tomato-activity-test-n-web'
  publishMethod='test'
fi

if [[ $1 != "n" ]] && [[ $1 != "ding" ]] && [[ $1 != "test-ding" ]] && [[ $1 != "test" ]]
then
  echo -e "\033[31m发布参数错误，未能找到发布版本\033[0m"
  exit
fi
echo -e "\033[32m发布类型：$1\033[0m"

packgeUrl='git@git2.superboss.cc:fanqier/ding-fq-web-dist.git'
# userAuthTokenLine=$(cat ./build/publish-token.json |grep -E '\"userAuthToken\"\s*:\s*\"[0-9a-z\.\-]+' -o)
# userAuthToken=${userAuthTokenLine##*\"}
userAuthToken="878ed1c4-6447-442d-b1c5-ff1685bb01ce"

publishCode=$2
echo -e "\033[32m发布码：$publishCode\033[0m"

versionLine=$(cat package.json |grep -E '\"version\"\s*:\s*\"[0-9\.\-]+' -o)
packgeVersion=eiqnaf-${versionLine##*\"}
echo -e "\033[32m版本号：$packgeVersion\033[0m"

echo -e "\033[32m上传文件\033[0m"
zip -r dist/package.zip ./dist/*
curl -X POST --url http://sync.superboss.cc/api/add_version_file.json  -H 'cache-control: no-cache' -H 'content-type: multipart/form-data' --form publishCode=$publishCode --form packgeBranch=$packgeBranch --form packgeParameter=$packgeParameter --form localName=$localName --form packgeVersion=$packgeVersion --form userAuthToken=$userAuthToken --form packgeUrl=$packgeUrl  --form uploadFile=@dist/package.zip > dist/body.json 
cat dist/body.json
remotePackageVersion=`cat dist/body.json |grep remotePackageVersion | awk -F '\"' '{print $10}'`

echo -e "\033[32m\n\nremotePackageVersion $remotePackageVersion\033[0m"
if [ -z "$remotePackageVersion" ]
then
  echo -e "\033[31m没有文件码...中断job\033[0m"
  rm dist/package.zip
  exit
fi

echo -e "\033[32m开始发布\033[0m"
curl -X POST --url http://sync.superboss.cc/api/publish_version_html.json  -H 'cache-control: no-cache' -F publishCode=$publishCode -F method=$publishMethod -F version=$packgeVersion -F localName=$localName -F remotePackageVersion=$remotePackageVersion -F userAuthToken=$userAuthToken > dist/body.json
cat dist/body.json
echo -e "\033[32m发布结束\033[0m"

