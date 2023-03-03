## Github Oath-in-front

此项目可以帮助构建一个使用Github登陆的后端Vercel APP。

## Install
将此仓库上传至Vercel，设置环境变量`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`为自己申请的Github Oath App对应token即可。

## Usage

``` typescript
const REDIRECT_URL = `https://{your.vercel.app}/api/oath/redirect?origin=${window.origin}`
const opener = open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo&redirect_uri=${REDIRECT_URL}`, 'login',)
        return new Promise<void>((res) => {
            window.addEventListener('message', (msg) => {
                if (msg.data.accessToken) {
                    console.log('loginsuccess')
                    opener?.close()
                    // 即可获取可用的token
                    localStorage.setItem(TOKEN_STORAGE_NAME, msg.data.accessToken)
                    res()
                }
            })
        })
```
