# 전자출입명부 웹페이지

강남구청에서 의뢰받은 것으로, 전화로 인증을 하는 도중 DTMF의 잘못된 번호 입력 혹은 성공적으로 제출이 되지 않은 경우, 사용자에게 현재 이 페이지를 제공합니다.

전자 출입명부 웹페이지는 비정상적인 접근을 제어하기 위해 사용자의 번호 및 출입번호로 이루어진 aes 암호화 된 url을 사용합니다.

<br>

## 목차

1. 코드 수정 방법
2. 실행 방법

<br>

## 코드 수정 방법

프론트 : ejs 파일은 views 디렉토리에 생성되어 있음. 나머지는 public 디렉토리

백엔드 : express 라이브러리를 사용하고 있음.

<br>

## 실행 방법

수정코드 적용 : npm run-script build

상용: pm2 start npm --name "AccessListWeb" -- start

테스트: pm2 start npm --name "AccessListWebDEV" -- teststart

<br>

## 기타 명령어

실행중인 앱 리스트 : pm2 list

앱 중단 : pm2 stop AccessListWeb

앱 다시시작 : pm2 restart AccessListWeb
