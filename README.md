# 중국 역직구 실무교육 랜딩페이지

## 행사 날짜와 정보 수정

`event-config.js` 파일의 `date` 한 줄만 수정하면 페이지 전체의 날짜와 요일, D-day가 함께 바뀝니다.

```js
window.EVENT_CONFIG = {
  date: "2026-10-02",
  startTime: "14:00",
  endTime: "18:00",
};
```

예를 들어 다음 행사의 날짜가 2026년 10월 16일이면 `date: "2026-10-16"`으로만 바꾸면 됩니다. 시간도 변경될 경우 `startTime`과 `endTime`을 수정하세요.

장소는 공개하지 않고 `venueNotice`에 입력된 안내 문구만 표시됩니다.

## 로컬 확인

`index.html`을 브라우저에서 열거나 정적 웹서버로 `site` 폴더를 실행합니다.

Google Form과 YouTube 영상은 인터넷에 연결된 환경에서 표시됩니다.

## 신청 폼 연결

페이지의 자체 신청 폼은 기존 Google Form 응답으로 전송됩니다. Google Form에서 행사 일정 선택지를 변경하면 `event-config.js`의 `googleFormDateValue`도 동일한 문구로 수정해야 합니다.
