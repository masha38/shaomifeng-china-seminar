(function () {
  const config = window.EVENT_CONFIG;

  if (!config) {
    console.error("행사 설정을 불러오지 못했습니다.");
    return;
  }

  const eventDate = new Date(`${config.date}T00:00:00+09:00`);
  const [year, month, day] = config.date.split("-").map(Number);
  const weekdayKo = new Intl.DateTimeFormat("ko-KR", {
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(eventDate);
  const weekdayEn = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  })
    .format(eventDate)
    .toUpperCase();

  const event = {
    ...config,
    isoDate: `${config.date}T${config.startTime}:00+09:00`,
    dateLabel: `${year}년 ${month}월 ${day}일 ${weekdayKo}`,
    dateShort: `${month}월 ${day}일`,
    dateNumeric: config.date.replaceAll("-", "."),
    dayLabel: weekdayEn,
    time: `${config.startTime}–${config.endTime}`,
    ctaLabel: `${month}월 ${day}일 세미나 신청하기`,
  };

  const eventEnd = new Date(`${config.date}T${config.endTime}:00+09:00`);
  const registrationClosed = new Date() > eventEnd;

  document.querySelectorAll("[data-event]").forEach((element) => {
    const key = element.dataset.event;

    if (key === "dday") {
      const eventStart = new Date(event.isoDate);
      const now = new Date();
      const remaining = Math.ceil((eventStart - now) / 86400000);

      if (registrationClosed) {
        element.textContent = "마감";
      } else if (remaining > 0) {
        element.textContent = `D-${remaining}`;
      } else if (remaining === 0) {
        element.textContent = "D-DAY";
      } else {
        element.textContent = event.capacity;
      }
      return;
    }

    if (event[key]) {
      element.textContent = event[key];
    }
  });

  const applicationForm = document.querySelector("#seminar-application-form");
  const submitTarget = document.querySelector(".submit-target");
  const successMessage = document.querySelector(".form-success");
  const closedMessage = document.querySelector(".form-closed");
  let formWasSubmitted = false;

  if (applicationForm) {
    applicationForm.action = event.googleFormAction;
    const eventDateField = applicationForm.querySelector("[data-google-date]");
    if (eventDateField) eventDateField.value = event.googleFormDateValue;

    if (registrationClosed) {
      applicationForm.hidden = true;
      if (closedMessage) closedMessage.hidden = false;
      document.querySelectorAll("[data-registration-cta]").forEach((cta) => {
        cta.textContent = "이번 교육 접수 마감";
        cta.classList.add("registration-closed");
      });
    }

    applicationForm.addEventListener("submit", (submissionEvent) => {
      if (registrationClosed) {
        submissionEvent.preventDefault();
        return;
      }
      const errorMessage = applicationForm.querySelector(".form-error");

      if (!applicationForm.checkValidity()) {
        submissionEvent.preventDefault();
        applicationForm.classList.add("was-validated");
        if (errorMessage) errorMessage.hidden = false;
        applicationForm.querySelector(":invalid")?.focus();
        return;
      }

      formWasSubmitted = true;
      if (errorMessage) errorMessage.hidden = true;
      const submitButton = applicationForm.querySelector(".form-submit");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.querySelector("span").textContent = "신청서를 전송하고 있습니다";
      }
    });
  }

  submitTarget?.addEventListener("load", () => {
    if (!formWasSubmitted || !applicationForm || !successMessage) return;
    applicationForm.hidden = true;
    successMessage.hidden = false;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "중국 역직구 실무교육",
    description: "중국 역직구 판매를 준비하는 브랜드와 셀러를 위한 오프라인 실무교육입니다. 중국 채널 입점부터 현지 판매·CS, 왕홍 라이브, 통관·물류까지 실제 운영 구조를 안내합니다.",
    image: ["https://shaomifeng-china-seminar.krasiba100.chatgpt.site/assets/og-china-seminar.png"],
    startDate: event.isoDate,
    endDate: `${config.date}T${config.endTime}:00+09:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: registrationClosed
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: config.venueNotice,
    },
    organizer: {
      "@type": "Organization",
      name: "샤오미펑",
      url: "https://shaomifeng-china-seminar.krasiba100.chatgpt.site/",
    },
    offers: {
      "@type": "Offer",
      price: config.price,
      priceCurrency: "KRW",
      availability: registrationClosed
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url: "https://shaomifeng-china-seminar.krasiba100.chatgpt.site/#apply",
    },
  };
  const structuredDataScript = document.querySelector("#event-structured-data");
  if (structuredDataScript) structuredDataScript.textContent = JSON.stringify(structuredData);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
})();
