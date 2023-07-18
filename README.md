



### package.json

"scripts": {"build": "webpack --mode development --watch",}
<br>

***

프로젝트를 빌드하기 위해 webpack을 실행하고, 개발 모드(--mode development)에서 파일 변경을 감지하면 자동으로 빌드(--watch)하라는 명령어입니다.

여기서 사용된 옵션 설명:

--mode development: webpack을 개발 모드로 실행하겠다는 옵션입니다. 개발 모드에서는 빌드된 파일이 압축되지 않고 가독성이 좋은 코드가 생성됩니다.
--watch: webpack을 감시 모드로 실행하겠다는 옵션입니다. 이 옵션을 사용하면 파일이 변경될 때마다 자동으로 빌드가 실행됩니다.
이 스크립트를 실행하면, webpack이 개발 모드로 실행되며, 프로젝트 내의 소스 파일들을 모니터링하면서 변경이 감지되면 해당 파일들을 다시 빌드합니다. 이렇게 개발 중에 코드를 수정하고 저장할 때마다 자동으로 빌드하여 최신 버전의 빌드 파일을 유지할 수 있습니다.

npm run build 또는 yarn build 명령을 통해 해당 스크립트를 실행할 수 있습니다.

***

### webpack

파일명은 webpack.config.js로 설정하여 관리할 수 있다.

- mode: 웹팩의 실행 모드를 설정한다. 
<br>
개발 버전인 'development'와 운영 버전인 'production'을 지정한다.
<br>
Webpack v4+부터는 'production' 모드로 번들링 할 경우 기본으로 압축을 해준다.
<br>
주석과 공백 등을 제거해주는데, console.log()는 제거하지 않는다.
TerserWebpackPlugin을 통해 해결할 수 있다.
- entry: 시작점 경로를 지정한다.
<br>
위의 예시에선 index.js를 기준으로 의존적인 모듈들을 전부 찾아내고 결과물을 생성한다.
- output: 번들링 결과물을 위치할 경로다.
<br>
Node.js의 path 모듈로 './dist' 절대경로를 반환한다. (output.path는 절대경로를 사용한다)
<br>
- filename: 결과물의 이름을 설정한다. 
<br>시작점의 키(key)가 main이므로 main.js 파일이 생성된다.

### bable-loader , CSS-loader 및 플러그인

기본적으로 Webpack은 JavaScript 및 JSON 파일만 해석 가능합니다. 하지만 로더(loaders)를 사용하면 Webpack이 다른 포멧의 파일을 처리하고, 이를 앱에서 사용할 수 있는 모듈로 변환 할 수 있습니다.

https://yamoo9.gitbook.io/webpack/webpack/webpack-loaders

---

로더(Loader)는 특정 타입의 모듈을 변환(transform)하는 데 사용되지만, 플러그인(Plugin)은 번들 최적화(minimize), 에셋(assets) 관리 및 환경(environment) 변수 주입(injection)과 같은 광범위한 작업을 수행하는데 사용됩니다.
플러그인을 사용하려면 require() 함수를 사용해 설치된 플러그인이 불러온 후, plugins배열에 추가해야 합니다 . 대부분의 플러그인은 옵션을 통해 사용자 정의 할 수 있습니다. 목적에 따라 플러그인을 여러 번 사용할 수 있으므로 new 연산자를 사용해 플러그인 인스턴스를 만들어야 합니다 .

https://yamoo9.gitbook.io/webpack/webpack/webpack-plugins

