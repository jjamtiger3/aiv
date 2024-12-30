# FrontEnd 서인석_AIV 과제

## 프로젝트 소개

#### AIV Frontend 과제용 프로젝트입니다.

## 프로젝트 구조
* components      재사용 가능한 컴포넌트
* pages           라우팅을 담당하는 페이지
* public          정적 파일 (이미지, 폰트 등)
* styled          components를 제외한 페이지의 스타일 파일
* common          공통으로 사용되는 파일 모음
* package.json    프로젝트 설정 및 의존성 정보
* README.md       프로젝트 개요 및 설명

## 구현한 코드의 최적화 방안
### components
### Table에 최적화를 적용
* 스크롤시 중복요청의 최소화를 위해 debouncing적용
* 원본데이터 / 표시용 데이터 분리
* 렌더링 속도를 최적화 하기 위해 react-virtuoso를 사용한 가상화 렌더링 기법 적용
### page.tsx
* 로딩시 필터링데이터를 요청 -> 컴포넌트와 요청부 분리
* 타입을 적용하여 column및 data의 유지보수성 안정성 향상
* style 분리를 통한 가독성 향상

## 기술 스택
* Next.js: React 기반의 SSR/SSG 지원 프레임워크
* TypeScript: 정적 타입 지원으로 안정성 확보
* Docker: 컨테이너화로 개발 및 배포 환경 일관성 유지
* Styled-components: 스타일 관리를 위한 CSS-in-JS 라이브러리

## 설치 및 실행방법
1. 프로젝트 clone
    git clone https://github.com/jjamtiger3/aiv
    cd project-name
2. 의존성 설치
    npm install
3. 개발 서버 실행
    npm run dev
4. 빌드 및 배포
    npm run build
    npm run start